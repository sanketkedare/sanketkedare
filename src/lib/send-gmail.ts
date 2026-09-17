import tls from 'node:tls';
import fs from 'node:fs';
import path from 'node:path';

interface SendEmailParams {
  name: string;
  email: string;
  message: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sendGmailInquiry({ name, email, message }: SendEmailParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const gmailUser = process.env.GMAIL_USER || 'sanketkedare200@gmail.com';
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'bjep ykao xviv zrlm').replace(/\s+/g, '');

    const client = tls.connect(465, 'smtp.gmail.com', {
      rejectUnauthorized: true,
    });

    let step = 0;
    let buffer = '';

    const send = (cmd: string) => {
      client.write(cmd + '\r\n');
    };

    client.on('error', (err) => {
      reject(err);
    });

    client.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line) continue;
        const statusCode = parseInt(line.substring(0, 3), 10);

        if (step === 0 && statusCode === 220) {
          step = 1;
          send('EHLO localhost');
        } else if (step === 1 && statusCode === 250) {
          step = 2;
          send('AUTH LOGIN');
        } else if (step === 2 && statusCode === 334) {
          step = 3;
          send(Buffer.from(gmailUser).toString('base64'));
        } else if (step === 3 && statusCode === 334) {
          step = 4;
          send(Buffer.from(gmailPass).toString('base64'));
        } else if (step === 4 && statusCode === 235) {
          step = 5;
          send(`MAIL FROM:<${gmailUser}>`);
        } else if (step === 5 && statusCode === 250) {
          step = 6;
          send(`RCPT TO:<${gmailUser}>`);
        } else if (step === 6 && statusCode === 250) {
          step = 7;
          send('DATA');
        } else if (step === 7 && statusCode === 354) {
          step = 8;
          const relatedBoundary = `----=_NextPart_Related_${Date.now().toString(16)}`;
          const altBoundary = `----=_NextPart_Alt_${Date.now().toString(16)}`;
          const emailSubject = `📩 New Inquiry from ${name} | Portfolio`;
          const safeName = escapeHtml(name);
          const safeEmail = escapeHtml(email);
          const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');
          const initialLetter = (name.trim().charAt(0) || 'U').toUpperCase();

          // Prepare inline logo attachment from public/image.png
          let logoImageHtml = '';
          let logoMimeAttachment = '';
          const logoPath = path.join(process.cwd(), 'public', 'image.png');

          if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const base64Logo = logoBuffer.toString('base64');
            const formattedBase64 = base64Logo.match(/.{1,76}/g)?.join('\r\n') || base64Logo;
            
            logoImageHtml = `
              <div style="margin-bottom: 16px;">
                <img src="cid:portfolio_logo" alt="Sanket Kedare Logo" style="height: 52px; width: auto; max-width: 200px; display: block; border: 0; border-radius: 8px;" />
              </div>
            `;

            logoMimeAttachment = [
              `--${relatedBoundary}`,
              `Content-Type: image/png; name="image.png"`,
              `Content-Transfer-Encoding: base64`,
              `Content-ID: <portfolio_logo>`,
              `Content-Disposition: inline; filename="image.png"`,
              ``,
              formattedBase64,
            ].join('\r\n');
          } else {
            logoImageHtml = `
              <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; margin-bottom: 16px;">
                <span style="font-family: monospace; font-size: 20px; font-weight: 800;">
                  <span style="color: #0891b2;">&lt;</span>
                  <span style="color: #0f172a; margin: 0 3px;">SK</span>
                  <span style="color: #9333ea;">/&gt;</span>
                </span>
              </div>
            `;
          }

          const plainTextBody = `
NEW PORTFOLIO INQUIRY
=====================
Name: ${name}
Email: ${email}

Message:
${message}
          `.trim();

          const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #0891b2 0%, #2563eb 50%, #9333ea 100%);"></td>
          </tr>

          <!-- Header Section with Official Portfolio Logo -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle;">
                    ${logoImageHtml}
                    <div>
                      <span style="display: inline-block; background-color: #ecfeff; color: #0891b2; border: 1px solid #cff4fc; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">
                        Portfolio Inquiry
                      </span>
                    </div>
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 12px 0 0 0; letter-spacing: -0.5px;">
                      New Message Received
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Card -->
          <tr>
            <td style="padding: 24px 36px 16px 36px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0;">
                <tr>
                  <td width="50" style="vertical-align: middle;">
                    <div style="width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #0891b2, #2563eb); color: #ffffff; font-size: 20px; font-weight: 800; line-height: 46px; text-align: center; text-transform: uppercase; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.25);">
                      ${initialLetter}
                    </div>
                  </td>
                  <td style="padding-left: 16px; vertical-align: middle;">
                    <div style="color: #0f172a; font-size: 16px; font-weight: 700;">
                      ${safeName}
                    </div>
                    <div style="margin-top: 4px;">
                      <a href="mailto:${safeEmail}" style="color: #0284c7; text-decoration: none; font-size: 14px; font-weight: 600;">
                        ${safeEmail}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Content Box -->
          <tr>
            <td style="padding: 8px 36px 28px 36px;">
              <div style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">
                Message Content
              </div>
              <div style="background-color: #f8fafc; border-left: 4px solid #0891b2; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 4px 14px 14px 4px; padding: 22px; color: #1e293b; font-size: 15px; line-height: 1.7; word-break: break-word;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Reply Call-To-Action Button -->
          <tr>
            <td style="padding: 0 36px 36px 36px; text-align: center;">
              <a href="mailto:${safeEmail}?subject=Re:%20Portfolio%20Inquiry" style="display: inline-block; background: linear-gradient(135deg, #0891b2, #2563eb); color: #ffffff; font-size: 13px; font-weight: 800; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(8, 145, 178, 0.3); text-transform: uppercase; letter-spacing: 1px;">
                Reply to ${safeName} &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5; font-weight: 500;">
                Sent automatically from <strong style="color: #0f172a;">Sanket Kedare Portfolio</strong> contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `.trim();

          const emailHeaders = [
            `From: "${name} via Portfolio" <${gmailUser}>`,
            `To: <${gmailUser}>`,
            `Reply-To: ${email}`,
            `Subject: ${emailSubject}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/related; boundary="${relatedBoundary}"`,
            ``,
            `--${relatedBoundary}`,
            `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
            ``,
            `--${altBoundary}`,
            `Content-Type: text/plain; charset=utf-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            plainTextBody,
            ``,
            `--${altBoundary}`,
            `Content-Type: text/html; charset=utf-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            htmlBody,
            ``,
            `--${altBoundary}--`,
            ``,
            logoMimeAttachment,
            ``,
            `--${relatedBoundary}--`,
            `.`,
          ].join('\r\n');

          send(emailHeaders);
        } else if (step === 8 && statusCode === 250) {
          step = 9;
          send('QUIT');
          client.end();
          resolve();
        } else if (statusCode >= 400) {
          client.end();
          reject(new Error(`SMTP Error ${statusCode}: ${line}`));
        }
      }
    });
  });
}

export interface SendReplyParams {
  toEmail: string;
  toName: string;
  subject?: string;
  replyMessage: string;
  originalMessage?: string;
}

export function sendGmailReply({
  toEmail,
  toName,
  subject,
  replyMessage,
  originalMessage,
}: SendReplyParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const gmailUser = process.env.GMAIL_USER || 'sanketkedare200@gmail.com';
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'bjep ykao xviv zrlm').replace(/\s+/g, '');

    const client = tls.connect(465, 'smtp.gmail.com', {
      rejectUnauthorized: true,
    });

    let step = 0;
    let buffer = '';

    const send = (cmd: string) => {
      client.write(cmd + '\r\n');
    };

    client.on('error', (err) => {
      reject(err);
    });

    client.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line) continue;
        const statusCode = parseInt(line.substring(0, 3), 10);

        if (step === 0 && statusCode === 220) {
          step = 1;
          send('EHLO localhost');
        } else if (step === 1 && statusCode === 250) {
          step = 2;
          send('AUTH LOGIN');
        } else if (step === 2 && statusCode === 334) {
          step = 3;
          send(Buffer.from(gmailUser).toString('base64'));
        } else if (step === 3 && statusCode === 334) {
          step = 4;
          send(Buffer.from(gmailPass).toString('base64'));
        } else if (step === 4 && statusCode === 235) {
          step = 5;
          send(`MAIL FROM:<${gmailUser}>`);
        } else if (step === 5 && statusCode === 250) {
          step = 6;
          send(`RCPT TO:<${toEmail}>`);
        } else if (step === 6 && statusCode === 250) {
          step = 7;
          send('DATA');
        } else if (step === 7 && statusCode === 354) {
          step = 8;
          const altBoundary = `----=_NextPart_Alt_${Date.now().toString(16)}`;
          const emailSubject = subject || `Re: Your message to Sanket Kedare`;
          const safeToName = escapeHtml(toName);
          const safeReply = escapeHtml(replyMessage).replace(/\n/g, '<br/>');
          const safeOriginal = originalMessage ? escapeHtml(originalMessage).replace(/\n/g, '<br/>') : '';

          const plainTextBody = `Hi ${toName},\n\n${replyMessage}\n\n---\nBest regards,\nSanket Kedare\nFull Stack Developer & Software Architect\nhttps://sanketkedare.com\n\n${originalMessage ? `Original Message:\n> ${originalMessage.replace(/\n/g, '\n> ')}` : ''}`;

          const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(emailSubject)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050511; color: #e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050511; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #0a0a1e; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0891b2, #2563eb); padding: 24px 32px;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Sanket Kedare</h1>
              <p style="color: rgba(255, 255, 255, 0.85); font-size: 12px; margin: 4px 0 0 0; font-family: monospace;">Full Stack Developer &amp; Software Architect</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Hi <strong>${safeToName}</strong>,</p>
              <div style="color: #f1f5f9; font-size: 15px; line-height: 1.7; margin-bottom: 28px; white-space: pre-wrap;">${safeReply}</div>
              
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; margin-top: 24px;">
                <p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px 0; font-weight: 600;">Warm regards,</p>
                <p style="color: #38bdf8; font-size: 14px; font-weight: 700; margin: 0;">Sanket Kedare</p>
                <p style="color: #64748b; font-size: 12px; margin: 2px 0 0 0;">Portfolio: <a href="https://sanketkedare.com" style="color: #38bdf8; text-decoration: none;">sanketkedare.com</a></p>
              </div>

              ${safeOriginal ? `
              <div style="margin-top: 28px; padding: 16px; background-color: rgba(255, 255, 255, 0.03); border-left: 3px solid #0891b2; border-radius: 6px;">
                <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: 700;">Previous Message:</p>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">${safeOriginal}</p>
              </div>
              ` : ''}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.02); border-top: 1px solid rgba(255, 255, 255, 0.05); padding: 16px 32px; text-align: center;">
              <p style="color: #475569; font-size: 11px; margin: 0;">Sent directly from Sanket Kedare's Admin Portal</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `.trim();

          const emailHeaders = [
            `From: "Sanket Kedare" <${gmailUser}>`,
            `To: "${toName}" <${toEmail}>`,
            `Reply-To: ${gmailUser}`,
            `Subject: ${emailSubject}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
            ``,
            `--${altBoundary}`,
            `Content-Type: text/plain; charset=utf-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            plainTextBody,
            ``,
            `--${altBoundary}`,
            `Content-Type: text/html; charset=utf-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            htmlBody,
            ``,
            `--${altBoundary}--`,
            `.`,
          ].join('\r\n');

          send(emailHeaders);
        } else if (step === 8 && statusCode === 250) {
          step = 9;
          send('QUIT');
          client.end();
          resolve();
        } else if (statusCode >= 400) {
          client.end();
          reject(new Error(`SMTP Error ${statusCode}: ${line}`));
        }
      }
    });
  });
}

export interface SendRecruiterThanksParams {
  recruiterEmail: string;
  recruiterName?: string;
  companyName: string;
  companyLocation?: string;
  jobTitle: string;
  matchScore: number;
  verdict: string;
  fitSummary: string;
  matchingSkills: string[];
  missingSkills: string[];
  tailoredPitch: string;
  recommendedProjects?: string[];
}

export function sendRecruiterThanksEmail(params: SendRecruiterThanksParams): Promise<{ subject: string; html: string; text: string }> {
  return new Promise((resolve, reject) => {
    const gmailUser = process.env.GMAIL_USER || 'sanketkedare200@gmail.com';
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'bjep ykao xviv zrlm').replace(/\s+/g, '');

    const {
      recruiterEmail,
      recruiterName = 'Recruiter',
      companyName,
      jobTitle,
      matchScore,
      verdict,
    } = params;

    const client = tls.connect(465, 'smtp.gmail.com', {
      rejectUnauthorized: true,
    });

    let step = 0;
    let buffer = '';

    const send = (cmd: string) => {
      client.write(cmd + '\r\n');
    };

    client.on('error', (err) => {
      reject(err);
    });

    client.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line) continue;
        const statusCode = parseInt(line.substring(0, 3), 10);

        if (step === 0 && statusCode === 220) {
          step = 1;
          send('EHLO localhost');
        } else if (step === 1 && statusCode === 250) {
          step = 2;
          send('AUTH LOGIN');
        } else if (step === 2 && statusCode === 334) {
          step = 3;
          send(Buffer.from(gmailUser).toString('base64'));
        } else if (step === 3 && statusCode === 334) {
          step = 4;
          send(Buffer.from(gmailPass).toString('base64'));
        } else if (step === 4 && statusCode === 235) {
          step = 5;
          send(`MAIL FROM:<${gmailUser}>`);
        } else if (step === 5 && statusCode === 250) {
          step = 6;
          send(`RCPT TO:<${recruiterEmail}>`);
        } else if (step === 6 && statusCode === 250) {
          step = 7;
          send(`RCPT TO:<${gmailUser}>`);
        } else if (step === 7 && statusCode === 250) {
          step = 8;
          send('DATA');
        } else if (step === 8 && statusCode === 354) {
          step = 9;
          const relatedBoundary = `----=_NextPart_Related_${Date.now().toString(16)}`;
          const altBoundary = `----=_NextPart_Alt_${Date.now().toString(16)}`;
          const emailSubject = `Thank you for reviewing my portfolio, ${recruiterName}! | Sanket Kedare`;
          const safeName = escapeHtml(recruiterName);
          const safeCompany = escapeHtml(companyName || 'your organization');
          const safeTitle = escapeHtml(jobTitle || 'Software Role');

          // Prepare inline logo attachment from public/image.png
          let logoImageHtml = '';
          let logoMimeAttachment = '';
          const logoPath = path.join(process.cwd(), 'public', 'image.png');

          if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const base64Logo = logoBuffer.toString('base64');
            const formattedBase64 = base64Logo.match(/.{1,76}/g)?.join('\r\n') || base64Logo;
            
            logoImageHtml = `
              <div style="margin-bottom: 16px;">
                <img src="cid:portfolio_logo" alt="Sanket Kedare Logo" style="height: 48px; width: auto; max-width: 180px; display: block; border: 0;" />
              </div>
            `;

            logoMimeAttachment = [
              `--${relatedBoundary}`,
              `Content-Type: image/png; name="image.png"`,
              `Content-Transfer-Encoding: base64`,
              `Content-ID: <portfolio_logo>`,
              `Content-Disposition: inline; filename="image.png"`,
              ``,
              formattedBase64,
            ].join('\r\n');
          }

          const isMatchingRole = matchScore >= 50 && !verdict.toLowerCase().includes('mismatch');

          const plainTextBody = isMatchingRole ? `
Dear ${recruiterName},

Thank you for visiting my portfolio and evaluating candidate alignment for the ${jobTitle} position at ${companyName}.

I am excited about how my background as a Full Stack Software Engineer & Architect aligns with this position. If you would like to discuss this role further, review additional live architecture projects, or schedule a conversation, please feel free to reach out to me directly:

• Email: sanketkedare200@gmail.com
• Mobile: +91 8624851910
• Portfolio: https://www.sanketkedare.com

Thank you once again, and I look forward to connecting with you!

Warm regards,
Sanket Kedare
Full Stack Developer & Software Architect
https://www.sanketkedare.com
          `.trim() : `
Dear ${recruiterName},

Thank you for visiting my portfolio and evaluating candidate alignment for the ${jobTitle} position at ${companyName}.

While this specific position does not directly align with my primary specialization as a Full Stack Software Engineer & Architect (React 19, Next.js 16, Node.js, Systems & GenAI), I sincerely appreciate your time and consideration.

If your organization has upcoming software engineering, full-stack web development, or GenAI architecture roles in the future, I would be delighted to connect!

Direct Contact Information:
• Email: sanketkedare200@gmail.com
• Mobile: +91 8624851910
• Portfolio: https://www.sanketkedare.com

Thank you once again, and I wish you all the best with your recruitment search!

Warm regards,
Sanket Kedare
Full Stack Developer & Software Architect
https://www.sanketkedare.com
          `.trim();

          const messageContentHtml = isMatchingRole ? `
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 18px 0;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 18px 0;">
                Thank you for visiting my portfolio and evaluating candidate alignment for the <strong>${safeTitle}</strong> role at <strong>${safeCompany}</strong>.
              </p>
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                I sincerely appreciate your time and consideration. I'm excited about how my experience in Full Stack Software Engineering &amp; Architecture aligns with this position. If you'd like to discuss this opportunity further, inspect my live software projects, or schedule a call, please feel free to reach out directly anytime.
              </p>
          ` : `
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 18px 0;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 18px 0;">
                Thank you for visiting my portfolio and using the AI Matcher to evaluate candidate alignment for the <strong>${safeTitle}</strong> role at <strong>${safeCompany}</strong>.
              </p>
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 18px 0;">
                While this specific role does not directly align with my core specialization as a <strong>Full Stack Software Engineer &amp; Architect (React 19, Next.js 16, Node.js, Systems &amp; GenAI)</strong>, I sincerely appreciate your time and consideration.
              </p>
              <p style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                If your organization has upcoming software engineering, full-stack, or GenAI development opportunities in the future, I would be delighted to connect!
              </p>
          `;

          const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Reviewing My Portfolio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);">
          
          <!-- Gradient Top Accent Bar -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #0891b2 0%, #2563eb 50%, #9333ea 100%);"></td>
          </tr>

          <!-- Header Section with Official Logo -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    ${logoImageHtml}
                    <span style="display: inline-block; background-color: #ecfeff; color: #0891b2; border: 1px solid #cff4fc; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">
                      Thank You Note
                    </span>
                    <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 12px 0 0 0; letter-spacing: -0.5px;">
                      Thank You, ${safeName}!
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px 36px;">
              ${messageContentHtml}

              <!-- Direct Contact Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td>
                    <div style="color: #0f172a; font-size: 14px; font-weight: 700; margin-bottom: 8px;">
                      Direct Contact Information:
                    </div>
                    <div style="color: #475569; font-size: 13px; line-height: 1.8;">
                      • <strong>Email:</strong> <a href="mailto:sanketkedare200@gmail.com" style="color: #0284c7; text-decoration: none; font-weight: 600;">sanketkedare200@gmail.com</a><br/>
                      • <strong>Phone:</strong> +91 8624851910<br/>
                      • <strong>Portfolio:</strong> <a href="https://www.sanketkedare.com" style="color: #0284c7; text-decoration: none; font-weight: 600;">www.sanketkedare.com</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://www.sanketkedare.com/#contact" style="display: inline-block; background: linear-gradient(135deg, #0891b2, #2563eb); color: #ffffff; font-size: 13px; font-weight: 800; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(8, 145, 178, 0.25); text-transform: uppercase; letter-spacing: 1px;">
                  Connect with Sanket &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5; font-weight: 500;">
                Sent automatically via <strong style="color: #0f172a;">Sanket Kedare Portfolio</strong>.<br/>
                Sanket Kedare &bull; Full Stack Developer &amp; Software Architect
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `.trim();

          const emailHeaders = [
            `From: "Sanket Kedare (Portfolio AI)" <${gmailUser}>`,
            `To: "${safeName}" <${recruiterEmail}>`,
            `Cc: <${gmailUser}>`,
            `Reply-To: ${gmailUser}`,
            `Subject: ${emailSubject}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/related; boundary="${relatedBoundary}"`,
            ``,
            `--${relatedBoundary}`,
            `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
            ``,
            `--${altBoundary}`,
            `Content-Type: text/plain; charset=utf-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            plainTextBody,
            ``,
            `--${altBoundary}`,
            `Content-Type: text/html; charset=utf-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            htmlBody,
            ``,
            `--${altBoundary}--`,
            ``,
            logoMimeAttachment,
            ``,
            `--${relatedBoundary}--`,
            `.`,
          ].join('\r\n');

          (client as any)._sentInfo = { subject: emailSubject, html: htmlBody, text: plainTextBody };
          send(emailHeaders);
        } else if (step === 9 && statusCode === 250) {
          step = 10;
          send('QUIT');
          client.end();
          resolve((client as any)._sentInfo || { subject: '', html: '', text: '' });
        } else if (statusCode >= 400) {
          client.end();
          reject(new Error(`SMTP Error ${statusCode}: ${line}`));
        }
      }
    });
  });
}
