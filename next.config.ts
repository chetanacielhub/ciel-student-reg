import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    useTypeScriptCli: true,
    proxyClientMaxBodySize: 2147483648,
    serverActions: {
      bodySizeLimit: "2gb",
    },
  },
};

export default nextConfig;
