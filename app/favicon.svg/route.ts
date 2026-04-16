export const dynamic = "force-static";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7170ff"/>
      <stop offset="100%" stop-color="#5e6ad2"/>
    </linearGradient>
  </defs>
  <rect width="24" height="24" rx="5" fill="#08090a"/>
  <circle cx="12" cy="12" r="7" stroke="url(#g)" stroke-width="1.5" fill="none"/>
  <path d="M12 5v14M5 12h14" stroke="url(#g)" stroke-width="1" stroke-opacity="0.55"/>
  <circle cx="12" cy="12" r="2.2" fill="url(#g)"/>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=604800, immutable" },
  });
}
