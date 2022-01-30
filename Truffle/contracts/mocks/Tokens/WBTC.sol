// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract WBTC is ERC20Pausable {
    constructor() ERC20("Wrapped BTC", "WBTC") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}