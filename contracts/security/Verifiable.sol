// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./interfaces/IVerifiable.sol";

/**
 * @dev Implementation of the `IVerifiable` interface.
 *
 * Through this contract, users can submit unknown but verifiable privacy information.
 *
 * Each information has the following two states
 * 1. Unknown: there is only the hash information on the chain.
 *
 * 2. Verified: The user needs to submit key and privacy content and pass keccak256 authentication to change its status
 *
 * Note that the user's privacy information cannot be set to 0
 */
contract Verifiable is IVerifiable {
    mapping(uint256 => uint256[2]) private proofToContent;

    /**
     * @dev Open the card with proof and content
     */
    function setProof(
        uint256 proof,
        uint256 key,
        uint256 content
    ) public {
        bool validate = validateProof(proof, key, content);
        require(validate, "wrong proof or content");
        proofToContent[proof] = [key, content];
        emit ContentVerified(proof, key, content);
    }

    /**
     * @dev get the card from contract
     *
     * Returns the proof and conttent.
     *
     * Note if the card is not opened,returns should be zero
     */
    function viewContent(uint256 proof)
        public
        view
        returns (uint256, uint256)
    {
        return (proofToContent[proof][0], proofToContent[proof][1]);
    }

    function validateProof(
        uint256 card,
        uint256 proof,
        uint256 content
    ) public pure returns (bool) {
        return (card == uint256(keccak256(abi.encodePacked(proof, content))));
    }
}
