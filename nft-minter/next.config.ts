import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config, { isServer }) {
    // 忽略 thread-stream/test 文件
    if (!isServer) {
      config.module.rules.push({
        test: /node_modules[\\/]thread-stream[\\/]test/,
        loader: "ignore-loader",
      });
    }
    return config;
  },
};

export default nextConfig;
