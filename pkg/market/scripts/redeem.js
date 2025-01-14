const { verify } = require("@overnight-contracts/common/utils/verify-utils");
const {getContract, initWallet, getPrice} = require("@overnight-contracts/common/utils/script-utils");
const {toUSDC, fromUSDC} = require("@overnight-contracts/common/utils/decimals");

async function main() {

    let wallet = await initWallet();

    let usdPlus = await getContract('UsdPlusToken', 'polygon');

    let exchanger = await getContract('HedgeExchangerUsdPlusWmatic', 'polygon_dev');
    let rebase = await getContract('RebaseTokenUsdPlusWmatic', 'polygon_dev');

    console.log("Rebase: " + fromUSDC(await rebase.balanceOf(wallet.address)))
    console.log("usdPlus: " + fromUSDC(await usdPlus.balanceOf(wallet.address)))


    let balance = await rebase.balanceOf(wallet.address);
    await (await rebase.approve(exchanger.address, balance, await getPrice())).wait();
    await (await exchanger.redeem(balance, await getPrice())).wait();

    console.log("Rebase: " + fromUSDC(await rebase.balanceOf(wallet.address)))
    console.log("usdPlus: " + fromUSDC(await usdPlus.balanceOf(wallet.address)))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
