// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FounderGenome
 * @dev Stores founder genome hashes on-chain
 * Each founder can register a bytes32 hash representing their genome
 */
contract FounderGenome {
    mapping(address => bytes32) public genome;
    
    event GenomeRegistered(address indexed user, bytes32 hash);
    
    /**
     * @dev Register a genome hash for the caller
     * @param genomeHash The keccak256 hash of the founder's genome JSON
     */
    function register(bytes32 genomeHash) external {
        genome[msg.sender] = genomeHash;
        emit GenomeRegistered(msg.sender, genomeHash);
    }
    
    /**
     * @dev Get the genome hash for a user
     * @param user The address to query
     * @return The genome hash (bytes32)
     */
    function getGenome(address user) external view returns (bytes32) {
        return genome[user];
    }
}

