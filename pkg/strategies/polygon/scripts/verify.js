const {verify } = require("@overnight-contracts/common/utils/verify-utils");

async function main() {

    let items = ["StrategyAave", "StrategyArrakis", "StrategyDodoUsdc",  "StrategyMeshSwapUsdc", "StrategyMeshSwapUsdcUsdt", "StrategyTetuUsdc"];
    await verify(items);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
