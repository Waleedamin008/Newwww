/**
 * High-Resolution Certificate of Sacred Prayers & Honor Generator
 * Draws a regal, luxury certificate onto canvas and triggers PNG download
 */
import sealImageUrl from '../components/images (2)-Photoroom.png';

export async function downloadPresidentialCertificate() {
  const canvas = document.createElement('canvas');
  const width = 1400;
  const height = 950;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Load custom seal image
  const sealImg = new Image();
  sealImg.src = sealImageUrl;
  await new Promise((resolve) => {
    sealImg.onload = resolve;
    sealImg.onerror = resolve; // fallback if image fails to load
  });

  // 1. Soft Ivory Parchment Background with subtle gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.7, '#FFFBF7');
  bgGrad.addColorStop(1, '#F6EFE9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Luxury Double Border (Rose-Gold & Champagne Gold)
  ctx.save();
  // Outer border
  ctx.strokeStyle = '#D4737E';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Ornate inner thin border
  ctx.strokeStyle = '#C59B42';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Corner decorative flourishes
  const corners = [
    [48, 48],
    [width - 48, 48],
    [48, height - 48],
    [width - 48, height - 48]
  ];
  ctx.fillStyle = '#C59B42';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3. Royal Crown / Emblem at top
  ctx.font = '54px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👑', width / 2, 130);

  // 4. Header: CERTIFICATE OF SACRED PRAYERS & BLESSINGS
  ctx.font = 'bold 22px "Cinzel", Georgia, serif';
  ctx.fillStyle = '#C59B42';
  ctx.letterSpacing = '4px';
  ctx.fillText('CERTIFICATE OF SACRED PRAYERS & HONOR', width / 2, 185);

  // Sub-header
  ctx.font = 'italic 18px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#746660';
  ctx.fillText('Presented on this Auspicious Birthday Celebration to', width / 2, 230);

  // 5. Honoree Name: REEBA AAMIR
  ctx.font = 'bold 56px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#D4737E';
  ctx.fillText('Reeba Aamir', width / 2, 310);

  // Title: (Madam President)
  ctx.font = 'bold 26px "Cinzel", Georgia, serif';
  ctx.fillStyle = '#C59B42';
  ctx.fillText('(Madam President)', width / 2, 360);

  // Divider line with diamond
  ctx.strokeStyle = '#E4D6CB';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 395);
  ctx.lineTo(width / 2 + 250, 395);
  ctx.stroke();

  ctx.fillStyle = '#D4737E';
  ctx.beginPath();
  ctx.arc(width / 2, 395, 4, 0, Math.PI * 2);
  ctx.fill();

  // 6. Citation / Tribute Body Text
  ctx.font = '20px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#3E332E';
  ctx.textAlign = 'center';

  const lines = [
    'In recognition of your exceptional grace, dignified leadership, and pure compassionate heart.',
    'May Almighty Allah bestow upon you radiant health, peace of mind, unyielding success,',
    'and divine barakah across every chapter of your inspiring journey.'
  ];

  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, 455 + index * 38);
  });

  // Featured sacred quotation
  ctx.font = 'italic 21px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#B45763';
  ctx.fillText(
    '“A leader who turns compassion into action, inspiring countless souls with poise & purpose.”',
    width / 2,
    600
  );

  // 7. Custom Seal Image on left
  const sealX = 260;
  const sealY = 740;
  ctx.save();

  if (sealImg.complete && sealImg.naturalWidth > 0) {
    const sealSize = 110;
    ctx.drawImage(sealImg, sealX - sealSize / 2, sealY - sealSize / 2, sealSize, sealSize);
  } else {
    // Fallback if image not ready
    ctx.beginPath();
    ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(197, 155, 66, 0.12)';
    ctx.fill();
    ctx.strokeStyle = '#C59B42';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  ctx.restore();

  // 8. Signatures & Date on right
  const sigX = width - 300;
  const sigY = 745;

  ctx.font = '16px "Playfair Display", serif';
  ctx.fillStyle = '#746660';
  ctx.fillText('With Eternal Respect & Duas', sigX, sigY - 25);

  ctx.strokeStyle = '#C59B42';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigX - 120, sigY);
  ctx.lineTo(sigX + 120, sigY);
  ctx.stroke();

  ctx.font = 'bold 15px "Cinzel", sans-serif';
  ctx.fillStyle = '#D4737E';
  ctx.fillText('', sigX, sigY + 25);

  ctx.font = '14px "Playfair Display", serif';
  ctx.fillStyle = '#9C8E87';
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  ctx.fillText(`Celebrated with Honor • ${today}`, width / 2, 850);

  // 9. Trigger instant mobile/desktop download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'Reeba_Aamir_Presidential_Certificate_of_Prayers.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    console.error('Download error:', err);
  }
}
