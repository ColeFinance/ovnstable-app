const {deployProxy} = require("@overnight-contracts/common/utils/deployProxy");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {save} = deployments;

    await deployProxy('StrategyIzumi', deployments, save);
};

module.exports.tags = ['base', 'StrategyIzumi'];
