//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract TrustedCaller {
    address private owner;
    // Listing all trustedCallers
    address[] public trustedCallers;

    // Modifier for easier checking if user is admin
    mapping(address => bool) public isTrustedCaller;

    // Modifier restricting access to only owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // Constructor to set initial trustedCallers during deployment
    constructor(address _trustedCaller) {
        owner = _trustedCaller;
        isTrustedCaller[_trustedCaller] = true;
        trustedCallers.push(_trustedCaller);
    }

    function addTrustedCaller(address _trustedCaller)
        external
        onlyOwner
    {
        // Can't add 0x address as an caller
        require(
            _trustedCaller != address(0x0),
            "Trusted caller must be != than 0x0 address"
        );
        // Can't add existing caller
        require(!isTrustedCaller[_trustedCaller], "Caller already exists.");
        // Add caller to array of trustedCallers
        trustedCallers.push(_trustedCaller);
        // Set mapping
        isTrustedCaller[_trustedCaller] = true;
    }

    function removeTrustedCaller(address _callerAddress) external onlyOwner {
        // Caller has to exist
        require(isTrustedCaller[_callerAddress]);
        require(
            trustedCallers.length > 1,
            "Can not remove all trustedCallers since contract becomes unusable."
        );
        uint256 i;

        while (trustedCallers[i] != _callerAddress) {
            if (i == trustedCallers.length) {
                revert("Passed caller address does not exist");
            }
            i++;
        }

        // Copy the last caller position to the current index
        trustedCallers[i] = trustedCallers[trustedCallers.length - 1];

        isTrustedCaller[_callerAddress] = false;

        // Remove the last caller, since it's double present
        trustedCallers.pop();
    }

    // Fetch all trustedCallers
    function getAlltrustedCallers() external view returns (address[] memory) {
        return trustedCallers;
    }

    function getowner() public view returns(address){
        return owner;
    }


}
