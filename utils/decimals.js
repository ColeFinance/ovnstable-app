

module.exports = {
    toUSDC: (value) => value * 10 ** 6,
    fromUSDC: (value) => value / 10 ** 6,

    toOvn: (value) => value * 10 ** 6,
    fromOvn: (value) => value / 10 ** 6,

    toAmUSDC: (value) => value * 10 ** 6,
    fromAmUSDC: (value) => value / 10 ** 6,

    toWmatic: (value) => value * 10 ** 18,
    fromWmatic: (value) => value / 10 ** 18,

    toCRV: (value) => value * 10 ** 18,
    fromCRV: (value) => value / 10 ** 18,

    toAm3CRV: (value) => value * 10 ** 18,
    froAm3CRV: (value) => value / 10 ** 18,
}