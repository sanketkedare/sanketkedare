import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  const imagePath = join(process.cwd(), 'public/image.png');
  const imageBuffer = readFileSync(imagePath);
  const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16, // Half of 32 to make it a perfect circle
          overflow: 'hidden',
        }}
      >
        <img 
          src={base64Image} 
          width={32} 
          height={32} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    ),
    { ...size }
  );
}
