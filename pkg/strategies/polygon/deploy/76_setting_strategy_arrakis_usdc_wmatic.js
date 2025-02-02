const { ethers } = require("hardhat");

let {POLYGON} = require('@overnight-contracts/common/utils/assets');
let {core} = require('@overnight-contracts/common/utils/core');

let arrakisRewards = "0x9941C03D31BC8B3aA26E363f7DD908725e1a21bb"; // WMATIC/USDC
let arrakisVault = "0x4520c823E3a84ddFd3F99CDd01b2f8Bf5372A82a"; // WMATIC/USDC
let oracleChainlinkMatic = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"; // Chainlink: MATIC/USD Price Feed
let eModeCategoryId = 0;
let liquidationThreshold = 850;
let healthFactor = 1500;
let usdcTokenInversion = 1;
let balancingDelta = 10;
let interestRateMode = 2;
let referralCode = 0;


module.exports = async () => {

    const strategy = await ethers.getContract("StrategyArrakisWmatic");

    await (await strategy.setTokens(POLYGON.usdc, POLYGON.wMatic, POLYGON.wMatic, POLYGON.amUsdc)).wait();
    await (await strategy.setParams(
        POLYGON.arrakisRouter,
        arrakisRewards,
        arrakisVault,
        POLYGON.balancerVault,
        POLYGON.balancerPoolIdWmaticUsdcWethBal,
        POLYGON.balancerPoolIdWmaticUsdcWethBal,
        usdcTokenInversion)).wait();
    await (await strategy.setAaveParams(
            POLYGON.aaveProvider,
            POLYGON.oracleChainlinkUsdc,
            oracleChainlinkMatic,
            eModeCategoryId,
            liquidationThreshold,
            healthFactor,
            balancingDelta,
            interestRateMode,
            referralCode)).wait();
    await (await strategy.setPortfolioManager(core.pm)).wait();

    console.log('StrategyArrakisWmatic setting done');
};

module.exports.tags = ['setting', 'StrategyArrakisWmaticSetting'];
