# Web3 Token Faucet

This is a Next.js dApp that serves as a faucet for an ERC20 token on a local Hardhat network. Users can connect their wallet and claim a fixed amount of tokens.

This project was built with Next.js, Hardhat, Wagmi, and RainbowKit.

## Features

- **Connect Wallet**: Using RainbowKit for a seamless wallet connection experience.
- **Claim Tokens**: One-click token claim from a smart contract.
- **Display User Info**: Shows connected address and token balance.
- **Single-Claim Prevention**: The smart contract ensures each address can only claim tokens once.
- **Local Development**: Runs on a local Hardhat node.

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A browser with a wallet extension like [MetaMask](https://metamask.io/).

### 1. Installation

First, clone the repository and install the dependencies:

```bash
# If you don't have the project yet
# git clone <repository-url>
# cd <project-directory>

npm install
```

### 2. Configure MetaMask

You'll need to add the Hardhat network to MetaMask and import an account.

1.  **Add Hardhat Network:**
    *   Network Name: `Hardhat`
    *   New RPC URL: `http://127.0.0.1:8545`
    *   Chain ID: `1337`
    *   Currency Symbol: `ETH`

2.  **Import an Account:**
    Hardhat provides a list of accounts with private keys when you start the node. Copy one of the private keys and import it into MetaMask (`Import account` option).

### 3. Run the Local Blockchain

Open a new terminal window and start the local Hardhat node:

```bash
npx hardhat node
```

This will start a local Ethereum blockchain. Keep this terminal window running.

### 4. Deploy Smart Contracts

Open another terminal window to deploy the smart contracts to your local Hardhat network.

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This script will:
1.  Deploy the `CommunityToken` (ERC20) contract.
2.  Deploy the `Faucet` contract.
3.  Fund the `Faucet` with tokens.
4.  Create/update `src/lib/contractInfo.json` with the deployed contract addresses and ABIs for the frontend to use.

### 5. Run the Frontend Application

Finally, start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser. You should now be able to connect your wallet (make sure it's on the Hardhat network) and claim your tokens!
