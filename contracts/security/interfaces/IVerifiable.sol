// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IVerifiable {
    /**
     * @dev Emitted when `proof` been proved by `key` and `content`
     */
    event ContentVerified(
        uint256 indexed proof,
        uint256 indexed key,
        uint256 indexed content
    );

    /**
     * @dev validate the proof with key and content
     */
    function setProof(
        uint256 proof,
        uint256 key,
        uint256 content
    ) public;

    /**
     * @dev validate the proof with key and content
     */
    function validateProof(
        uint256 proof,
        uint256 key,
        uint256 content
    ) public returns (bool);

    /**
     * @dev get the content from contract
     *
     * Returns the key and conttent.
     *
     * Note if the card is not opened,returns should be zero
     */
    function viewContent(uint256 proof)
        public
        view
        returns (uint256, uint256);
}
