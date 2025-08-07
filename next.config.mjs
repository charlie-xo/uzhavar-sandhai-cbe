/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rdjteyborajprnmmdxho.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product_images/**',
      },
    ],
  },
};

export default nextConfig;
