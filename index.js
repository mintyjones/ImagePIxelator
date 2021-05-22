const avgSolidColor = document.getElementById('avgSolidColor');
const avgAlphaColor = document.getElementById('avgAlphaColor');
const avgSolidWeighted = document.getElementById('avgSolidWeighted');

const avgSolidColorCode = document.getElementById('avgSolidColorCode');
const avgAlphaColorCode = document.getElementById('avgAlphaColorCode');
const avgSolidWeightedCOde = document.getElementById('avgSolidWeightedCode');

const brush = document.getElementById('brush');
const image = document.getElementById('image');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = image.width;
const height = image.height;

const BRUSH_SIZE = brush.offsetWidth;
const BRUSH_CENTER = BRUSH_SIZE / 2;
const MIN_X = image.offsetLeft + 10;
const MAX_X = MIN_X + width - BRUSH_SIZE;
const MIN_Y = image.offsetTop + 10;
const MAX_Y = MIN_Y + height - BRUSH_SIZE;

canvas.width = width;
canvas.height = height;

context.drawImage(image, 0, 0, width, height);

function sampleColor(clientX, clientY) {
  const brushX = Math.max(Math.min(clientX - BRUSH_CENTER, MAX_X), MIN_X);
  const brushY = Math.max(Math.min(clientY - BRUSH_CENTER, MAX_Y), MIN_Y);

  const imageX = brushX - MIN_X;
  const imageY = brushY - MIN_Y;
 
  let R = 0;
  let G = 0;
  let B = 0;
  let A = 0;
  let wR = 0;
  let wG = 0;
  let wB = 0;
  let wTotal = 0;

  const data = context.getImageData(imageX, imageY, BRUSH_SIZE, BRUSH_SIZE).data;
  
  console.log(data)

  const components = data.length;
  console.log(components)
  
  for (let i = 0; i < components; i += 4) {
    // A single pixel (R, G, B, A) will take 4 positions in the array:
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Update components for solid color and alpha averages:
    R += r;
    G += g;
    B += b;
    A += a;
    
    // Update components for alpha-weighted average:
    const w = a / 255;
    wR += r * w;
    wG += g * w;
    wB += b * w;
    wTotal += w;
  }
  
  const pixelsPerChannel = components / 4;
  
 // The | operator is used here to perform an integer division:

  R = R / pixelsPerChannel | 0;
  G = G / pixelsPerChannel | 0;
  B = B / pixelsPerChannel | 0;
  wR = wR / wTotal | 0;
  wG = wG / wTotal | 0;
  wB = wB / wTotal | 0;

  // The alpha channel need to be in the [0, 1] range:

  A = A / pixelsPerChannel / 255;
  

  console.log(`rgb(${ R }, ${ G }, ${ B })`)

  // Update UI:
  
  requestAnimationFrame(() => {
    brush.style.transform = `translate(${ brushX }px, ${ brushY }px)`;

    avgSolidColorCode.innerText = avgSolidColor.style.background
      = `rgb(${ R }, ${ G }, ${ B })`;

    avgAlphaColorCode.innerText = avgAlphaColor.style.background
      = `rgba(${ R }, ${ G }, ${ B }, ${ A.toFixed(2) })`;

    avgSolidWeightedCode.innerText = avgSolidWeighted.style.background
      = `rgb(${ wR }, ${ wG }, ${ wB })`;
  });
}

document.onmousemove = (e) => sampleColor(e.clientX, e.clientY);
  
sampleColor(MIN_X, MIN_Y);