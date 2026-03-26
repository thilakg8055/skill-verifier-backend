const { ethers } = require("ethers");

// connect to local hardhat blockchain
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// use account #0 private key (from your terminal)
const signer = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
);

// contract details
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const abi = [
    "function addVerifiedSkill(string memory name, string memory user) public",
    "function getSkills() public view returns (tuple(string name, string user, bool verified)[])"
];

const contract = new ethers.Contract(contractAddress, abi, signer);

async function addSkillToBlockchain(name, user) {
    const tx = await contract.addVerifiedSkill(name, user);
    await tx.wait();
    console.log("✅ Stored on blockchain");
}
//GET
async function getSkillsFromBlockchain() {
    const skills = await contract.getSkills();
    return skills;
}

// ✅ EXPORT BOTH
module.exports = {
    addSkillToBlockchain,
    getSkillsFromBlockchain
};
