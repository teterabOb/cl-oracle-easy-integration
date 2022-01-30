// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract WETH is ERC20Pausable {
    constructor() ERC20("Wrapped Ether", "WETH") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}