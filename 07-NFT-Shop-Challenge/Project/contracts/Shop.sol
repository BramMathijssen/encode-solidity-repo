// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Shop {
    uint256 public purchaseRatio;
    uint256 public mintPrice;
    address public paymentToken;
    address public collection;

    constructor(
        uint256 _purchaseRatio,
        uint256 _mintPrice,
        address _paymentToken,
        address _collection
    ) {
        purchaseRatio = _purchaseRatio;
        mintPrice = _mintPrice;
        paymentToken = _paymentToken;
        collection = _collection;
    }
}
