// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from "./Token.sol";

contract Lottery is Ownable {
    bool public betsOpen;
    uint256 public closingTime;

    function openBets(uint256 _closingTime) public onlyOwner {
        // require that the closing date is in the future
        require(
            _closingTime >= block.timestamp,
            "The closing time should be in the future"
        );
        betsOpen = true;
        closingTime = _closingTime;

    }

    modifier whenBetsClosed() {
        require(!betsOpen,)
    }
}
