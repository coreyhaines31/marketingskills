/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: "export",          // enables `next build` → static HTML in /out
  trailingSlash: true,       // required for static hosting (Vercel, Netlify, S3)
  images: { unoptimized: true },
};
