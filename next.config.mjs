/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {},
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/pdr-course", destination: "/training", permanent: true },
      { source: "/auto-hail-repair", destination: "/estimate", permanent: true },
      { source: "/paintless-dent", destination: "/estimate", permanent: true },
    ];
  },
};

export default nextConfig;
