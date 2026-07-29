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
