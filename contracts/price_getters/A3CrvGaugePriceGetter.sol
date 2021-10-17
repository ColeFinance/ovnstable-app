// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../price_getters/AbstractPriceGetter.sol";
import "../price_getters/A3CrvPriceGetter.sol";
import "../interfaces/IConnector.sol";
import "../connectors/curve/interfaces/iCurvePool.sol";
import "../OwnableExt.sol";

contract A3CrvGaugePriceGetter is AbstractPriceGetter, OwnableExt {
    A3CrvPriceGetter a3CrvPriceGetter;

    function setA3CrvPriceGetter(address _a3CrvPriceGetter) public onlyOwner {
        require(_a3CrvPriceGetter != address(0), "Zero address not allowed");
        a3CrvPriceGetter = A3CrvPriceGetter(_a3CrvPriceGetter);
    }

    function getUsdcBuyPrice() external view override returns (uint256) {
        // a3CrvGauge is 1:1 to a3Crv
        return a3CrvPriceGetter.getUsdcBuyPrice();
    }

    function getUsdcSellPrice() external view override returns (uint256) {
        // a3CrvGauge is 1:1 to a3Crv
        return a3CrvPriceGetter.getUsdcSellPrice();
    }
}