// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    IERC20 public immutable token;
    uint256 public claimAmount;
    mapping(address => bool) public hasClaimed;

    modifier notClaimed() {
        require(!hasClaimed[msg.sender], "You have already claimed your tokens.");
        _;
    }

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        token = IERC20(tokenAddress);
        claimAmount = 10 * 10**18; // 10 tokens
    }

    function claim() public notClaimed {
        require(token.balanceOf(address(this)) >= claimAmount, "Not enough tokens in the faucet.");
        
        hasClaimed[msg.sender] = true;
        bool sent = token.transfer(msg.sender, claimAmount);
        require(sent, "Token transfer failed.");
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw.");
        bool sent = token.transfer(owner(), balance);
        require(sent, "Withdraw failed.");
    }

    function setClaimAmount(uint256 newAmount) public onlyOwner {
        claimAmount = newAmount;
    }
}
