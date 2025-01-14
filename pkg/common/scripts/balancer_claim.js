const hre = require("hardhat");
const fs = require("fs");
const {fromE18, fromUSDC} = require("../utils/decimals");
const assets = JSON.parse(fs.readFileSync('./polygon_assets.json'));
const {getClaimedParams, ClaimedParams} = require("../utils/claimRewardsBalancer");
const ethers = hre.ethers;

let StrategyBalancer = JSON.parse(fs.readFileSync('./deployments/localhost/StrategyBalancer.json'));

async function main() {

    let strategyBalancer = await ethers.getContractAt(StrategyBalancer.abi, StrategyBalancer.address);

    let chanId = '137';
    let week = '90';
    let tokenAddressBal = '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3';
    let tokenAddressTUsd = '0x2e1ad108ff1d8c782fcbbb89aad783ac49586756';

    // get params for bal
    let claimedParamsBal = await getClaimedParams(chanId, week, tokenAddressBal, strategyBalancer.address);
    console.log(claimedParamsBal);

    // get params for wMatic
    let claimedParamsWMatic = new ClaimedParams('0x0000000000000000000000000000000000000000', 0, 0, []);
    console.log(claimedParamsWMatic);

    // get params for tUsd
    let claimedParamsTUsd = await getClaimedParams(chanId, week, tokenAddressTUsd, strategyBalancer.address);
    console.log(claimedParamsTUsd);

    // verify claim
//     await strategyBalancer.verifyClaim(
//         claimedParamsBal.distributor, claimedParamsWMatic.distributor, claimedParamsTUsd.distributor,
//         claimedParamsBal.distributionId, claimedParamsWMatic.distributionId, claimedParamsTUsd.distributionId,
//         claimedParamsBal.claimedBalance, claimedParamsWMatic.claimedBalance, claimedParamsTUsd.claimedBalance,
//         claimedParamsBal.merkleProof, claimedParamsWMatic.merkleProof, claimedParamsTUsd.merkleProof);

    // claim
//     await strategyBalancer._claimRewardsBalancer();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

