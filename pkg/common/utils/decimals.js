const BN = require('bn.js');

module.exports = {

    toE18: (value) => new BN(value).mul(new BN(10).pow(new BN(18))).toString(),
    fromE18: (value) => new BN(value.toString()).divRound(new BN(10).pow(new BN(18))).toString(),

    toE6: (value) => value * 10 ** 6,
    fromE6: (value) => value / 10 ** 6,

    toUSDC: (value) => value * 10 ** 6,
    fromUSDC: (value) => value / 10 ** 6,

    toOvn: (value) => value * 10 ** 6,
    fromOvn: (value) => value / 10 ** 6,

    toOvnGov: (value) => value * 10 ** 18,
    fromOvnGov: (value) => value / 10 ** 18

}
