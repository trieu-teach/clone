import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'gpo2vlbdpf.ufs.sh',
              port: '',
              pathname: '/f/**',
          },
      ],
  },
}
export default nextConfig;
