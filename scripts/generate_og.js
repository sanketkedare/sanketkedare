const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createThumbnails() {
  const publicDir = path.resolve(__dirname, '../public');
  const appDir = path.resolve(__dirname, '../src/app');

  const logoPath = path.join(publicDir, 'image.png');

  let logoBase64 = '';
  if (fs.existsSync(logoPath)) {
    logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
  }

  // 1200x630 OG Image SVG with ICON ONLY (No photo)
  const svg1200 = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradients -->
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050511"/>
        <stop offset="50%" stop-color="#090920"/>
        <stop offset="100%" stop-color="#050511"/>
      </linearGradient>

      <linearGradient id="cyan-indigo" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4"/>
        <stop offset="50%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>

      <linearGradient id="title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>

      <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>

      <linearGradient id="card-border" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(34, 211, 238, 0.45)"/>
        <stop offset="50%" stop-color="rgba(99, 102, 241, 0.25)"/>
        <stop offset="100%" stop-color="rgba(168, 85, 247, 0.45)"/>
      </linearGradient>

      <linearGradient id="icon-border" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="50%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>

      <radialGradient id="glow-cyan" cx="15%" cy="25%" r="45%">
        <stop offset="0%" stop-color="rgba(6, 182, 212, 0.25)"/>
        <stop offset="100%" stop-color="rgba(6, 182, 212, 0)"/>
      </radialGradient>

      <radialGradient id="glow-purple" cx="85%" cy="65%" r="50%">
        <stop offset="0%" stop-color="rgba(168, 85, 247, 0.22)"/>
        <stop offset="100%" stop-color="rgba(168, 85, 247, 0)"/>
      </radialGradient>

      <!-- Pattern for subtle tech grid -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.035)" stroke-width="1"/>
      </pattern>

      <!-- Clip path for rounded icon -->
      <clipPath id="icon-clip">
        <rect x="800" y="165" width="280" height="280" rx="40" ry="40"/>
      </clipPath>
    </defs>

    <!-- Base Background -->
    <rect width="1200" height="630" fill="url(#bg-grad)"/>
    <rect width="1200" height="630" fill="url(#grid)"/>

    <!-- Ambient Glowing Orbs -->
    <rect width="1200" height="630" fill="url(#glow-cyan)"/>
    <rect width="1200" height="630" fill="url(#glow-purple)"/>

    <!-- Decorative Top Edge Line -->
    <rect x="0" y="0" width="1200" height="4" fill="url(#cyan-indigo)"/>

    <!-- Main Outer Glass Card -->
    <rect x="60" y="60" width="1080" height="510" rx="28" fill="rgba(15, 23, 42, 0.45)" stroke="url(#card-border)" stroke-width="1.5"/>

    <!-- Left Content Area -->
    <!-- Top Badge (Brand / Domain) -->
    <g transform="translate(105, 105)">
      <rect width="215" height="38" rx="19" fill="rgba(6, 182, 212, 0.12)" stroke="rgba(34, 211, 238, 0.35)" stroke-width="1"/>
      <circle cx="20" cy="19" r="5" fill="#22d3ee"/>
      <text x="36" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="13" font-weight="800" fill="#38bdf8" letter-spacing="1.5">SANKETKEDARE.COM</text>
    </g>

    <!-- Name Heading -->
    <text x="105" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">
      Sanket Kedare
    </text>

    <!-- Primary Title: Full Stack Developer -->
    <text x="105" y="275" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="40" font-weight="800" fill="url(#accent-grad)" letter-spacing="-0.5">
      Full Stack Developer
    </text>

    <!-- Subtitle: GenAI and System Design -->
    <g transform="translate(105, 310)">
      <rect width="365" height="44" rx="12" fill="rgba(99, 102, 241, 0.18)" stroke="rgba(129, 140, 248, 0.4)" stroke-width="1.2"/>
      <text x="22" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="20" font-weight="700" fill="#c7d2fe" letter-spacing="0.5">
        ⚡ GenAI and System Design
      </text>
    </g>

    <!-- Description / Value Statement -->
    <text x="105" y="405" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" font-size="18" font-weight="500" fill="#94a3b8">
      Building scalable enterprise systems, modern web platforms &amp; intelligent AI workflows.
    </text>

    <!-- Tech Stack Pills -->
    <g transform="translate(105, 455)">
      <!-- Next.js 16 -->
      <g transform="translate(0, 0)">
        <rect width="105" height="34" rx="8" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
        <text x="52.5" y="22" font-family="monospace" font-size="13" font-weight="700" fill="#e2e8f0" text-anchor="middle">Next.js 16</text>
      </g>
      <!-- React 19 -->
      <g transform="translate(115, 0)">
        <rect width="95" height="34" rx="8" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
        <text x="47.5" y="22" font-family="monospace" font-size="13" font-weight="700" fill="#e2e8f0" text-anchor="middle">React 19</text>
      </g>
      <!-- TypeScript -->
      <g transform="translate(220, 0)">
        <rect width="115" height="34" rx="8" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
        <text x="57.5" y="22" font-family="monospace" font-size="13" font-weight="700" fill="#e2e8f0" text-anchor="middle">TypeScript</text>
      </g>
      <!-- Node.js -->
      <g transform="translate(345, 0)">
        <rect width="90" height="34" rx="8" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
        <text x="45" y="22" font-family="monospace" font-size="13" font-weight="700" fill="#e2e8f0" text-anchor="middle">Node.js</text>
      </g>
      <!-- Cloud & MERN -->
      <g transform="translate(445, 0)">
        <rect width="130" height="34" rx="8" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
        <text x="65" y="22" font-family="monospace" font-size="13" font-weight="700" fill="#e2e8f0" text-anchor="middle">Cloud &amp; MERN</text>
      </g>
    </g>

    <!-- Right Side: Official Brand ICON Container (No Photo) -->
    <g>
      <!-- Outer Glow Box -->
      <rect x="796" y="161" width="288" height="288" rx="44" ry="44" fill="none" stroke="url(#icon-border)" stroke-width="2.5" opacity="0.9"/>
      
      <!-- Icon Container Background -->
      <rect x="800" y="165" width="280" height="280" rx="40" ry="40" fill="#050511"/>
      
      <!-- Embedded Brand Logo Image -->
      ${logoBase64 ? `
        <g clip-path="url(#icon-clip)">
          <image href="${logoBase64}" x="800" y="165" width="280" height="280" preserveAspectRatio="xMidYMid meet"/>
        </g>
      ` : `
        <text x="940" y="325" font-family="monospace" font-size="56" font-weight="900" fill="#22d3ee" text-anchor="middle">&lt; SK /&gt;</text>
      `}

      <!-- Overlay Status Pill on Icon -->
      <g transform="translate(860, 475)">
        <rect width="160" height="32" rx="16" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(34, 211, 238, 0.6)" stroke-width="1.2"/>
        <circle cx="18" cy="16" r="4.5" fill="#22c55e"/>
        <text x="32" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="0.8">AVAILABLE</text>
      </g>
    </g>

  </svg>
  `;

  // 600x600 Square OG SVG with ICON ONLY (No photo)
  const svgSquare = `
  <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-grad-sq" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050511"/>
        <stop offset="50%" stop-color="#090920"/>
        <stop offset="100%" stop-color="#050511"/>
      </linearGradient>
      <linearGradient id="cyan-indigo-sq" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4"/>
        <stop offset="50%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
      <linearGradient id="accent-grad-sq" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>
      <linearGradient id="icon-border-sq" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#22d3ee"/>
        <stop offset="50%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
      <radialGradient id="glow-cyan-sq" cx="50%" cy="25%" r="60%">
        <stop offset="0%" stop-color="rgba(6, 182, 212, 0.28)"/>
        <stop offset="100%" stop-color="rgba(6, 182, 212, 0)"/>
      </radialGradient>
      <clipPath id="icon-clip-sq">
        <rect x="210" y="70" width="180" height="180" rx="30" ry="30"/>
      </clipPath>
    </defs>

    <rect width="600" height="600" fill="url(#bg-grad-sq)"/>
    <rect width="600" height="600" fill="url(#glow-cyan-sq)"/>
    <rect x="0" y="0" width="600" height="5" fill="url(#cyan-indigo-sq)"/>

    <rect x="25" y="25" width="550" height="550" rx="26" fill="rgba(15, 23, 42, 0.5)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5"/>

    <!-- Icon Box -->
    <rect x="207" y="67" width="186" height="186" rx="33" ry="33" fill="none" stroke="url(#icon-border-sq)" stroke-width="2.5"/>
    <rect x="210" y="70" width="180" height="180" rx="30" ry="30" fill="#050511"/>
    ${logoBase64 ? `
      <g clip-path="url(#icon-clip-sq)">
        <image href="${logoBase64}" x="210" y="70" width="180" height="180" preserveAspectRatio="xMidYMid meet"/>
      </g>
    ` : `
      <text x="300" y="175" font-family="monospace" font-size="44" font-weight="900" fill="#22d3ee" text-anchor="middle">&lt; SK /&gt;</text>
    `}

    <g transform="translate(230, 268)">
      <rect width="140" height="28" rx="14" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(34, 211, 238, 0.6)" stroke-width="1.2"/>
      <circle cx="16" cy="14" r="4" fill="#22c55e"/>
      <text x="30" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#ffffff" letter-spacing="0.8">AVAILABLE</text>
    </g>

    <text x="300" y="338" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">
      Sanket Kedare
    </text>

    <text x="300" y="378" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="url(#accent-grad-sq)" text-anchor="middle">
      Full Stack Developer
    </text>

    <g transform="translate(140, 403)">
      <rect width="320" height="36" rx="10" fill="rgba(99, 102, 241, 0.18)" stroke="rgba(129, 140, 248, 0.35)" stroke-width="1"/>
      <text x="160" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#c7d2fe" text-anchor="middle">
        ⚡ GenAI and System Design
      </text>
    </g>

    <text x="300" y="478" font-family="monospace" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle">
      Next.js 16 • React 19 • Node.js • Cloud
    </text>

    <g transform="translate(200, 508)">
      <rect width="200" height="32" rx="16" fill="rgba(6, 182, 212, 0.12)" stroke="rgba(34, 211, 238, 0.35)" stroke-width="1"/>
      <text x="100" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="1">SANKETKEDARE.COM</text>
    </g>
  </svg>
  `;

  // Render 1200x630 PNG
  const png1200Buffer = await sharp(Buffer.from(svg1200))
    .png({ quality: 100 })
    .toBuffer();

  // Render 1200x630 JPG
  const jpg1200Buffer = await sharp(Buffer.from(svg1200))
    .jpeg({ quality: 95 })
    .toBuffer();

  // Render Square PNG
  const pngSquareBuffer = await sharp(Buffer.from(svgSquare))
    .png({ quality: 100 })
    .toBuffer();

  // Write files
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), png1200Buffer);
  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), jpg1200Buffer);
  fs.writeFileSync(path.join(publicDir, 'og-square.png'), pngSquareBuffer);
  fs.writeFileSync(path.join(appDir, 'opengraph-image.png'), png1200Buffer);
  fs.writeFileSync(path.join(appDir, 'twitter-image.png'), png1200Buffer);

  console.log('Successfully generated all OG images with ICON ONLY (Full Stack Developer & GenAI / System Design)!');
}

createThumbnails().catch(console.error);
