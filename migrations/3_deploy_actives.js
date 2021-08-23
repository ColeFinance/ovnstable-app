const Mark2Market = artifacts.require("./Mark2Market.sol");
const USDCtest = artifacts.require("./tests/USDCtest.sol");
const aUSDCtest = artifacts.require("./tests/aUSDCtest.sol");
const ActivesList = artifacts.require("./registres/ActivesList.sol");
const ConnectorAAVE = artifacts.require("./connectors/ConnectorAAVE.sol");
const ConnectorCurve = artifacts.require("./connectors/ConnectorCurve.sol");
var USDC, aUSDC, DAI, CurvepoolPrice, CurvepoolStake
module.exports = async function(deployer) {

const chainID = await web3.eth.net.getId();

activesListdepl = ActivesList.networks
const actList = await ActivesList.deployed();// at(ActivesList.networks[chainID]['address']);
const m2m = await Mark2Market.deployed();// at(Mark2Market.networks[chainID]['address']);

if (chainID == '80001') {
    // https://docs.aave.com/developers/deployed-contracts/matic-polygon-market
    USDC = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
    aUSDC = "0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9";

  } else if (chainID == 137) {
    USDC = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
    aUSDC = "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F"
    DAI = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"
    aDAI = "0x27F8D03b3a2196956ED754baDc28D73be8830A6e"
    CurvepoolPrice = "0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36"
    CurvepoolStake = "0xDeBF20617708857ebe4F679508E7b7863a8A8EeE"
  }
  else {
    USDC = USDCtest.networks[chainID]['address'];
    aUSDC = aUSDCtest.networks[chainID]['address'];

  }

  const connectorAv = ConnectorAAVE.networks[chainID]['address'];
  //await actList.actAdd(aUSDC, connectorAv,connectorAv, "2500", "9500", "10000000000000000000");
  await actList.actAdd(USDC, connectorAv,connectorAv, connectorAv, "500", "1000", "0");
  await actList.actAdd(aUSDC, connectorAv,connectorAv, connectorAv, "2500", "9500", "0");
  await actList.actAdd(DAI, connectorAv,connectorAv, connectorAv, "500", "1000", "0");
  await actList.actAdd(aDAI, connectorAv,connectorAv, connectorAv, "2500", "9500", "0");
  await actList.actAdd(USDC, aUSDC, connectorAv, connectorAv, connectorAv, "2500", "9500", "10000000000000000000");

  const connectorCv = ConnectorCurve.networks[chainID]['address'];
  //await actList.actAdd(DAI, connectorCv,CurvepoolPrice, CurvepoolStake, "2500", "9500",  "20000000000000000000");
  //await m2m.tstPrice ("1");
  const actives = await m2m.activesPrices ();
  console.log (actives);

}
