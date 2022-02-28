// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakePUSDGToken is ERC20 {
    address immutable public admin;
    address public minter;
    address public burner;

    constructor() public ERC20("FakePUSDG", "FakePUSDG") {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyAdminOrMinter() {
        require(msg.sender == admin || msg.sender == minter,
            "Not admin or minter");
        _;
    }

    modifier onlyAdminOrBurner() {
        require(msg.sender == admin || msg.sender == burner,
            "Not admin or burner");
        _;
    }

    function setMinter(address _minter) public onlyAdmin {
        minter = _minter;
    }

    function setBurner(address _burner) public onlyAdmin {
        burner = _burner;
    }

    // Allow admin / minter to mint the token
    function mint(address account, uint amount) public onlyAdminOrMinter returns (bool){
        _mint(account, amount);
        return true;
    }

    // Allow admin / minter to burn the token
    function burn(address account, uint amount) public onlyAdminOrBurner returns (bool){
        _burn(account, amount);
        return true;
    }
}