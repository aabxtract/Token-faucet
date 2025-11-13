import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  hardhat,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Web3 Token Faucet',
  // Your WalletConnect Project ID. Get one at https://cloud.walletconnect.com/
  projectId: '00000000000000000000000000000000',
  chains: [hardhat],
  ssr: true,
});
