import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

// https://dashboard.reown.com/
const PROJECT_ID = 'YOUR_PROJECT_ID'

export const wagmiConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: PROJECT_ID,
  // 使用 主网 和 sepolia测试网 举例，其他网比如 polygon, optimism, arbitrum 可以按需添加
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
