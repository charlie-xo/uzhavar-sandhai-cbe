/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Intha thadava kandippa sariyana URL-a serthachu
        hostname: 'rrdjteiybprajmnmdxho.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product_images/**',
      },
    ],
  },
};

export default nextConfig;
