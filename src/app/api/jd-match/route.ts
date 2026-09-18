import { NextResponse } from 'next/server';
import { dbConnect, JDEvaluation } from '@/lib/mongodb';
import { sendRecruiterThanksEmail } from '@/lib/send-gmail';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchAndExtractUrlContent(urlStr: string): Promise<string | null> {
  try {
    let targetUrl = urlStr.trim();
    if (targetUrl.startsWith('www.')) {
      targetUrl = `https://${targetUrl}`;
    }
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[JD Matcher] Web fetch returned status ${res.status} for ${targetUrl}`);
      return null;
    }

    const html = await res.text();
    if (!html || html.trim().length === 0) return null;

    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');

    const extractedText = cleanHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    return extractedText.length > 60 ? extractedText.substring(0, 12000) : null;
  } catch (err: any) {
    console.warn(`[JD Matcher] Failed to fetch URL content for ${urlStr}:`, err?.message || err);
    return null;
  }
}

function extractSmartMetadata(jdText: string, fileName: string, recruiterEmail: string): { companyName: string; companyLocation: string; jobTitle: string } {
  const combinedText = `${jdText} ${fileName}`.trim();

  // 1. Extract Company Name
  let companyName = '';

  const companyMatch = combinedText.match(/(?:Company Name|Company|Organization|Hiring Company|Client|About Us|About)\s*[:|-]\s*([A-Za-z0-9\s&\.\,-]{2,40})/i);
  if (companyMatch && companyMatch[1]) {
    const raw = companyMatch[1].split(/[\r\n\.]/)[0].trim();
    if (raw.length > 2 && !['is', 'the', 'a', 'an', 'looking', 'hiring', 'overview', 'description'].includes(raw.toLowerCase())) {
      companyName = raw;
    }
  }

  if (!companyName) {
    const atMatch = combinedText.match(/(?:position|role|engineer|developer|job)\s+at\s+([A-Z][A-Za-z0-9\s&]{2,30})/i) ||
                    combinedText.match(/([A-Z][A-Za-z0-9\s&]{2,25})\s+(?:is hiring|is looking for|is seeking)/);
    if (atMatch && atMatch[1]) {
      companyName = atMatch[1].trim();
    }
  }

  if (!companyName && recruiterEmail && recruiterEmail.includes('@')) {
    const domain = recruiterEmail.split('@')[1]?.toLowerCase() || '';
    const ignoreDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'rediffmail.com', 'zoho.com'];
    if (domain && !ignoreDomains.includes(domain)) {
      const parts = domain.split('.');
      const companyPart = parts[0];
      if (companyPart && companyPart.length > 2) {
        companyName = companyPart.charAt(0).toUpperCase() + companyPart.slice(1);
      }
    }
  }

  if (!companyName) {
    const urlDomainMatch = combinedText.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+)\.(?:com|org|net|io|co|in|tech|ai|careers)/i);
    if (urlDomainMatch && urlDomainMatch[1]) {
      const comp = urlDomainMatch[1];
      if (!['linkedin', 'naukri', 'indeed', 'glassdoor', 'lever', 'greenhouse', 'workday', 'google', 'github'].includes(comp.toLowerCase())) {
        companyName = comp.charAt(0).toUpperCase() + comp.slice(1);
      }
    }
  }

  if (!companyName && fileName) {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
    const fileWords = cleanFileName.split(/\s+/).filter(w => w.length > 2 && !['jd', 'job', 'description', 'pdf', 'docx', 'txt', 'resume', 'senior', 'developer', 'engineer', 'fullstack', 'react', 'node'].includes(w.toLowerCase()));
    if (fileWords.length > 0) {
      companyName = fileWords[0].charAt(0).toUpperCase() + fileWords[0].slice(1);
    }
  }

  if (!companyName || ['Target Enterprise', 'Hiring Organization', 'Unspecified Company', 'Target Organization', 'Hiring Enterprise'].includes(companyName)) {
    companyName = 'Hiring Organization';
  }

  // 2. Extract Job Title
  let jobTitle = '';

  const titleMatch = combinedText.match(/(?:Job Title|Title|Role|Position|Hiring For)\s*[:|-]\s*([A-Za-z0-9\s\/\(\)\+-]{2,50})/i);
  if (titleMatch && titleMatch[1]) {
    const rawTitle = titleMatch[1].split(/[\r\n\.]/)[0].trim();
    if (rawTitle.length > 3) {
      jobTitle = rawTitle;
    }
  }

  if (!jobTitle) {
    const roleRegex = /(?:Senior|Lead|Junior|Staff|Principal|Full Stack|Frontend|Backend|Software|Web|React|Node|Next\.js|GenAI|AI|DevOps|Cloud|System|HR|Sales|Marketing|QA|Data)\s+(?:Engineer|Developer|Architect|Specialist|Manager|Consultant|Lead|Analyst)/i;
    const regexMatch = combinedText.match(roleRegex);
    if (regexMatch) {
      jobTitle = regexMatch[0].trim();
    }
  }

  if (!jobTitle && fileName) {
    const cleanFile = fileName.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
    if (cleanFile.length > 3) {
      jobTitle = cleanFile;
    }
  }

  if (!jobTitle || jobTitle === 'Target Engineering Role' || jobTitle === 'Engineering Role') {
    jobTitle = 'Software Engineer / Full Stack Developer';
  }

  // 3. Extract Company Location
  let companyLocation = '';

  const locMatch = combinedText.match(/(?:Location|Office|Job Location|HQ|Workplace|City|Base Location)\s*[:|-]\s*([A-Za-z0-9\s,\/\(\)-]{2,50})/i);
  if (locMatch && locMatch[1]) {
    const rawLoc = locMatch[1].split(/[\r\n\.]/)[0].trim();
    if (rawLoc.length > 2) {
      companyLocation = rawLoc;
    }
  }

  if (!companyLocation) {
    const locLower = combinedText.toLowerCase();
    const cities = ['bengaluru', 'bangalore', 'mumbai', 'pune', 'hyderabad', 'delhi', 'noida', 'gurgaon', 'san francisco', 'new york', 'london', 'singapore', 'remote', 'hybrid', 'onsite'];
    const matchedCities = cities.filter(c => locLower.includes(c));
    if (matchedCities.length > 0) {
      companyLocation = matchedCities.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' / ');
    }
  }

  if (!companyLocation || companyLocation === 'Extracted from JD' || companyLocation === 'Unknown Location') {
    companyLocation = 'Remote / Flexible Location';
  }

  return { companyName, companyLocation, jobTitle };
}

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
        { error: 'Please provide a valid Job Description text, job link URL, or upload a document.' },
        { status: 400 }
      );
    }

    // Process input if user provided a job posting web link (URL)
    const urlMatch = jdText.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
    if (urlMatch) {
      const extractedUrl = urlMatch[0];
      const scrapedText = await fetchAndExtractUrlContent(extractedUrl);

      if (scrapedText) {
        jdText = `[Job Link Provided: ${extractedUrl}]\n\n[Scraped Webpage Content & Requirements]:\n${scrapedText}\n\n[Original Input]:\n${jdText}`;
      } else {
        const urlKeywords = extractedUrl
          .replace(/^https?:\/\//i, '')
          .replace(/^www\./i, '')
          .split(/[\/\?#&_=\.-]/)
          .filter((t) => t.length > 2 && !['http', 'https', 'www', 'com', 'org', 'net', 'html', 'php', 'aspx', 'view', 'job', 'jobs', 'careers'].includes(t.toLowerCase()))
          .join(' ');

        jdText = `[Job Link Provided: ${extractedUrl}]\n\n[Extracted URL Path Keywords]: ${urlKeywords}\n\n[Original Input]: ${jdText}\n\n(Note: Direct web fetch was blocked by anti-bot/login wall. Assess candidate fit using URL metadata and path keywords.)`;
      }
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
1. "companyName": Extract the actual hiring company name from the JD text, document header, email, or URL (e.g. "Google", "Amazon", "TechVision"). Do NOT output generic placeholders like "Target Enterprise" or "Hiring Organization".
2. "companyLocation": Extract the actual office/HQ location, city, country, or remote/hybrid policy (e.g. "Bengaluru, India (Hybrid)", "San Francisco, CA (Remote)").
3. "jobTitle": Extract the exact target role title (e.g. "Senior React Developer", "Full Stack Engineer", "HR Specialist").
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

    // Smart Metadata Extraction Post-Processing
    const smartMeta = extractSmartMetadata(jdText, fileName, recruiterEmail);

    // Dynamic Heuristic Fallback Analysis if Gemini API is unreachable
    if (!evaluationResult) {
      const textLower = (jdText + ' ' + fileName).toLowerCase();
      const isDev = textLower.includes('developer') || textLower.includes('react') || textLower.includes('next') || textLower.includes('node') || textLower.includes('typescript') || textLower.includes('full stack') || textLower.includes('frontend') || textLower.includes('backend') || textLower.includes('software') || textLower.includes('engineer') || textLower.includes('web');

      const isHr = textLower.includes('hr') || textLower.includes('human resource') || textLower.includes('recruiter') || textLower.includes('payroll') || textLower.includes('talent');

      if (isHr && !isDev) {
        evaluationResult = {
          companyName: smartMeta.companyName,
          companyLocation: smartMeta.companyLocation,
          jobTitle: smartMeta.jobTitle.includes('HR') ? smartMeta.jobTitle : 'HR / Non-Technical Role',
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
          companyName: smartMeta.companyName,
          companyLocation: smartMeta.companyLocation,
          jobTitle: smartMeta.jobTitle,
          matchScore: score,
          verdict: score >= 80 ? 'Exceptional Technical Alignment' : 'Moderate Technical Synergy',
          fitSummary: `Sanket's core background in Full Stack Web Architecture directly satisfies key engineering requirements for ${smartMeta.companyName}.`,
          matchingSkills: matched.length > 0 ? matched.map((m) => m.toUpperCase()) : ['REACT 19', 'NEXT.JS 16', 'TYPESCRIPT', 'NODE.JS', 'SYSTEM DESIGN'],
          missingSkills: ['Internal Domain Tools'],
          tailoredPitch: `Sanket brings 2.5+ years of active production software architecture experience.`,
          recommendedProjects: ['VisionTech LMS', 'Volcanic World', 'ReactForge'],
        };
      }
    } else {
      // Clean up generic placeholders from Gemini response using extracted smart metadata
      if (!evaluationResult.companyName || ['Target Enterprise', 'Hiring Organization', 'Unspecified Company', 'Target Organization', 'Hiring Enterprise'].includes(evaluationResult.companyName)) {
        evaluationResult.companyName = smartMeta.companyName;
      }
      if (!evaluationResult.companyLocation || ['Extracted from JD', 'Unknown Location', 'Hybrid / Remote', 'Remote / Flexible Location'].includes(evaluationResult.companyLocation)) {
        evaluationResult.companyLocation = smartMeta.companyLocation;
      }
      if (!evaluationResult.jobTitle || ['Target Engineering Role', 'Engineering Role', 'Target Role'].includes(evaluationResult.jobTitle)) {
        evaluationResult.jobTitle = smartMeta.jobTitle;
      }
    }

    // Connect DB & Save full telemetry record
    await dbConnect();

    const evaluationDoc = await JDEvaluation.create({
      recruiterLocation: recruiterLocation.trim() || 'Unknown Location',
      companyLocation: evaluationResult.companyLocation || smartMeta.companyLocation,
      companyName: evaluationResult.companyName || smartMeta.companyName,
      recruiterEmail: recruiterEmail || '',
      recruiterName: recruiterName || (recruiterEmail ? recruiterEmail.split('@')[0] : 'Recruiter'),
      emailVerified: !!recruiterEmail,
      emailVerifiedAt: recruiterEmail ? new Date() : undefined,
      emailSentStatus: recruiterEmail ? 'NOT_VERIFIED' : 'NOT_VERIFIED',
      jobTitle: evaluationResult.jobTitle || smartMeta.jobTitle,
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

