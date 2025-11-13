require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "./src/lib/artifacts",
  },
};
