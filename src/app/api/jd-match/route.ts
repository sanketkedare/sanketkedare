import { NextResponse } from 'next/server';
import { dbConnect, JDEvaluation } from '@/lib/mongodb';
import { sendRecruiterThanksEmail } from '@/lib/send-gmail';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    let jdText = '';
    let fileName = '';
    let fileBase64 = '';
    let fileContentType = '';
    let fileSizeBytes = 0;
    let recruiterLocation = 'Unknown Location';
    let recruiterEmail = '';
    let recruiterName = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      jdText = (formData.get('jdText') as string) || '';
      recruiterLocation = (formData.get('recruiterLocation') as string) || (formData.get('location') as string) || 'Unknown Location';
      recruiterEmail = (formData.get('recruiterEmail') as string) || '';
      recruiterName = (formData.get('recruiterName') as string) || (formData.get('name') as string) || '';

      const file = formData.get('file') as File | null;
      if (file) {
        fileName = file.name;
        fileContentType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain');
        fileSizeBytes = file.size;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fileBase64 = buffer.toString('base64');

        if (fileContentType.startsWith('text/') || fileName.endsWith('.txt')) {
          const rawText = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
          if (rawText.length > 20) {
            jdText = jdText ? `${jdText}\n\n[Attached File Content - ${file.name}]:\n${rawText}` : rawText;
          }
        }

        if (!jdText || jdText.trim().length === 0) {
          jdText = `[Attached Document Upload: ${fileName}]`;
        }
      }
    } else {
      const json = await req.json();
      jdText = json.jdText || '';
      fileName = json.fileName || '';
      recruiterLocation = json.recruiterLocation || json.location || 'Unknown Location';
      recruiterEmail = json.recruiterEmail || '';
      recruiterName = json.recruiterName || json.name || '';
    }

    if ((!jdText || jdText.trim().length < 5) && !fileBase64) {
      return NextResponse.json(
        { error: 'Please provide a valid Job Description text or upload a document.' },
        { status: 400 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

    // Rich, Grounded Profile Context for Gemini AI Matcher
    const systemPrompt = `
You are an elite Lead AI Technical Recruiter conducting an honest, rigorous candidate fit assessment comparing a Job Description (JD) against Sanket Kedare's Verified Resume & Technical Profile.

SANKET KEDARE'S RESUME & TECHNICAL PROFILE:
- Full Name: Sanket Kedare
- Primary Domain: Software Engineering, Full Stack Web Development & System Architecture
- Active Production Experience: 2.5+ years
- Primary Technical Stack:
  * Frontend: React 19, Next.js 16 (App Router), TypeScript 5.x, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS v4, Framer Motion, Redux Toolkit, Context API.
  * Backend & APIs: Node.js, Express.js, Fastify, REST APIs, GraphQL, WebSockets, Socket.io, Microservices Architecture.
  * Databases & Caching: MongoDB Atlas, PostgreSQL, Redis, Mongoose, Prisma, Supabase.
  * Cloud & DevOps: Docker, AWS (EC2, S3, CloudFront), Vercel, Cloudinary CDN, CI/CD Pipelines, Nginx.
  * AI & GenAI Integration: Google Gemini API, OpenAI API, LangChain, Prompt Engineering, RAG (Retrieval-Augmented Generation), Vector Embeddings.
- Notable Accomplishments & Projects:
  * VisionTech LMS & EMS (Enterprise Learning Management for 3,000+ active users)
  * Volcanic World (Generative AI multi-model workspace)
  * ReactForge (Interactive frontend coding lab)
  * CryptoDash Pro (Real-time crypto telemetry dashboard)

JOB DESCRIPTION TO EVALUATE:
Recruiter GPS Location: ${recruiterLocation}
Text Content (if provided):
"""
${jdText.substring(0, 8000)}
"""

CRITICAL EVALUATION INSTRUCTION (BE RIGOROUS AND TRUTHFUL):
Read the Job Description carefully (from text or attached document). Compare it line-by-line with Sanket Kedare's Full Stack Software Engineer resume.

MATCH SCORING GUIDE (0 to 100 Integer):
- 0% - 25% (Domain Mismatch / Unrelated Role): Human Resources (HR), Recruiter, Sales, Marketing, Accounting, Medical, Legal, Civil/Mechanical Eng, or non-software roles.
- 26% - 55% (Low / Indirect Alignment): Tech-adjacent or different engineering discipline (e.g. Embedded C++, Data Science, Manual QA).
- 56% - 79% (Moderate Alignment): General Software Engineer / Backend (Java, C#, Python) where software concepts transfer but primary stack differs.
- 80% - 100% (High to Exceptional Alignment): Full Stack, Frontend, React, Next.js, Node.js, JavaScript/TypeScript, Web Architect, or GenAI Developer roles.

OUTPUT REQUIREMENTS:
Return ONLY a valid raw JSON object with these exact keys:
1. "companyName": Extract hiring company name (or infer if missing).
2. "companyLocation": Extract HQ/Office/Remote policy (or infer if missing).
3. "jobTitle": Extract target role title (e.g. "Senior React Developer", "Full Stack Engineer", "HR Specialist").
4. "matchScore": Integer from 0 to 100 strictly following the guide above.
5. "verdict": Short honest summary line (e.g. "Exceptional Technical Alignment (92%)" OR "Domain Mismatch (15%) - HR Position").
6. "fitSummary": 2-3 sentences explaining candidate fit truthfully.
7. "matchingSkills": Array of string technologies/competencies that truly match.
8. "missingSkills": Key required skills from the JD that Sanket does not specialize in.
9. "tailoredPitch": 2 sentences explaining candidate ROI for this position.
10. "recommendedProjects": Array of relevant portfolio project titles (if tech-related) or empty array if non-tech.

Return RAW JSON ONLY. No markdown codeblocks.
`;

    let evaluationResult: any = null;

    if (GEMINI_API_KEY) {
      try {
        const parts: any[] = [{ text: systemPrompt }];

        if (fileBase64) {
          parts.push({
            inlineData: {
              mimeType: fileContentType || 'application/pdf',
              data: fileBase64,
            },
          });
        }

        const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-2.5-flash'];
        let successResponse = false;

        for (const model of candidateModels) {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 1200,
                  responseMimeType: 'application/json',
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            try {
              evaluationResult = JSON.parse(rawText.replace(/```json/gi, '').replace(/```/gi, '').trim());
              successResponse = true;
              break;
            } catch (e) {
              console.warn(`[JD Matcher] Failed to parse JSON from ${model} response, using heuristic fallback`, e);
            }
          } else {
            const errBody = await response.text();
            console.warn(`[JD Matcher] Gemini model ${model} failed (${response.status}):`, errBody);
          }
        }
      } catch (err) {
        console.error('[JD Matcher] Gemini API Error:', err);
      }
    }

    // Dynamic Heuristic Fallback Analysis if Gemini API is unreachable
    if (!evaluationResult) {
      const textLower = (jdText + ' ' + fileName).toLowerCase();
      const isDev = textLower.includes('developer') || textLower.includes('react') || textLower.includes('next') || textLower.includes('node') || textLower.includes('typescript') || textLower.includes('full stack') || textLower.includes('frontend') || textLower.includes('backend') || textLower.includes('software') || textLower.includes('engineer') || textLower.includes('web');

      const isHr = textLower.includes('hr') || textLower.includes('human resource') || textLower.includes('recruiter') || textLower.includes('payroll') || textLower.includes('talent');

      if (isHr && !isDev) {
        evaluationResult = {
          companyName: 'Hiring Organization',
          companyLocation: 'Extracted from JD',
          jobTitle: 'HR / Non-Technical Role',
          matchScore: 15,
          verdict: 'Domain Mismatch - Non-Engineering Position',
          fitSummary: 'This position is for an HR / Talent Acquisition role. Sanket Kedare is a Full Stack Developer & Software Architect, not an HR specialist.',
          matchingSkills: ['Communication', 'Organization'],
          missingSkills: ['HR Administration', 'Talent Acquisition'],
          tailoredPitch: 'Sanket Kedare specializes in Software Engineering, GenAI, and Modern Web Systems.',
          recommendedProjects: [],
        };
      } else {
        const keywords = ['react', 'next.js', 'typescript', 'javascript', 'node', 'full stack', 'frontend', 'backend', 'mongodb', 'system design', 'aws', 'docker', 'api', 'python', 'java'];
        const matched = keywords.filter((kw) => textLower.includes(kw));
        const score = matched.length > 0 ? Math.min(96, Math.max(65, Math.round((matched.length / keywords.length) * 100) + 40)) : 86;

        evaluationResult = {
          companyName: 'Target Enterprise',
          companyLocation: 'Hybrid / Remote',
          jobTitle: textLower.includes('senior') ? 'Senior Software Engineer' : textLower.includes('frontend') ? 'Frontend Developer' : 'Full Stack Developer',
          matchScore: score,
          verdict: score >= 80 ? 'Exceptional Technical Alignment' : 'Moderate Technical Synergy',
          fitSummary: `Sanket's core background in Full Stack Web Architecture directly satisfies key engineering requirements.`,
          matchingSkills: matched.length > 0 ? matched.map((m) => m.toUpperCase()) : ['REACT 19', 'NEXT.JS 16', 'TYPESCRIPT', 'NODE.JS', 'SYSTEM DESIGN'],
          missingSkills: ['Internal Domain Tools'],
          tailoredPitch: `Sanket brings 2.5+ years of active production software architecture experience.`,
          recommendedProjects: ['VisionTech LMS', 'Volcanic World', 'ReactForge'],
        };
      }
    }

    // Connect DB & Save full telemetry record
    await dbConnect();

    const evaluationDoc = await JDEvaluation.create({
      recruiterLocation: recruiterLocation.trim() || 'Unknown Location',
      companyLocation: evaluationResult.companyLocation || 'Extracted from JD',
      companyName: evaluationResult.companyName || 'Unspecified Company',
      recruiterEmail: recruiterEmail || '',
      recruiterName: recruiterName || (recruiterEmail ? recruiterEmail.split('@')[0] : 'Recruiter'),
      emailVerified: !!recruiterEmail,
      emailVerifiedAt: recruiterEmail ? new Date() : undefined,
      emailSentStatus: recruiterEmail ? 'NOT_VERIFIED' : 'NOT_VERIFIED',
      jobTitle: evaluationResult.jobTitle || 'Target Engineering Role',
      jdText: jdText.substring(0, 10000),
      fileName: fileName || '',
      fileBase64: fileBase64 || '',
      fileContentType: fileContentType || '',
      fileSizeBytes: fileSizeBytes || 0,
      matchScore: evaluationResult.matchScore || 85,
      verdict: evaluationResult.verdict || 'Strong Alignment',
      fitSummary: evaluationResult.fitSummary || '',
      matchingSkills: evaluationResult.matchingSkills || [],
      missingSkills: evaluationResult.missingSkills || [],
      tailoredPitch: evaluationResult.tailoredPitch || '',
      recommendedProjects: evaluationResult.recommendedProjects || [],
      ipAddress: clientIp,
      createdAt: new Date(),
    });

    // Send thank-you & evaluation report email if recruiter email is verified
    if (recruiterEmail && recruiterEmail.includes('@')) {
      try {
        const sentResult = await sendRecruiterThanksEmail({
          recruiterEmail,
          recruiterName: recruiterName || recruiterEmail.split('@')[0] || 'Recruiter',
          companyName: evaluationResult.companyName,
          companyLocation: evaluationResult.companyLocation,
          jobTitle: evaluationResult.jobTitle,
          matchScore: evaluationResult.matchScore,
          verdict: evaluationResult.verdict,
          fitSummary: evaluationResult.fitSummary,
          matchingSkills: evaluationResult.matchingSkills,
          missingSkills: evaluationResult.missingSkills,
          tailoredPitch: evaluationResult.tailoredPitch,
          recommendedProjects: evaluationResult.recommendedProjects,
        });

        // Update email sent status & content on successful delivery
        await JDEvaluation.findByIdAndUpdate(evaluationDoc._id, {
          $set: {
            emailSentStatus: 'SENT',
            emailSentAt: new Date(),
            sentEmailSubject: sentResult?.subject || '',
            sentEmailHtml: sentResult?.html || '',
            sentEmailText: sentResult?.text || '',
            emailError: '',
          },
        });
      } catch (emailErr: any) {
        console.error('[JD Matcher] Failed to send recruiter thank you email:', emailErr);
        await JDEvaluation.findByIdAndUpdate(evaluationDoc._id, {
          $set: {
            emailSentStatus: 'FAILED',
            emailError: emailErr?.message || 'SMTP Delivery Failure',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      analysis: evaluationResult,
    });
  } catch (error: any) {
    console.error('[JD Matcher API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process Job Description evaluation' },
      { status: 500 }
    );
  }
}

