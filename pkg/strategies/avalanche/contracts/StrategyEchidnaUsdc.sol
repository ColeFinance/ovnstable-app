// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./core/Strategy.sol";
import "./connectors/traderjoe/interfaces/IJoeRouter02.sol";
import "./connectors/echidna/interfaces/IBooster.sol";
import "./connectors/echidna/interfaces/IRewardPool.sol";
import "./connectors/platypus/interfaces/IAsset.sol";
import "./libraries/OvnMath.sol";
import "./libraries/TraderJoeLibrary.sol";


contract StrategyEchidnaUsdc is Strategy {
    using OvnMath for uint256;

    IERC20 public usdcToken;
    IERC20 public wAvaxToken;
    IERC20 public ptpToken;
    IAsset public platypusLPUsdc;

    IJoeRouter02 public traderJoeRouter;
    IBooster public booster;
    IRewardPool public rewardPool;
    uint256 public pid;


    // --- events

    event StrategyUpdatedTokens(address usdcToken, address wAvaxToken, address ptpToken, address platypusLPUsdc);

    event StrategyUpdatedParams(address traderJoeRouter, address booster, address rewardPool, uint256 pid);


    // ---  constructor

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __Strategy_init();
    }


    // --- Setters

    function setTokens(
        address _usdcToken,
        address _wAvaxToken,
        address _ptpToken,
        address _platypusLPUsdc
    ) external onlyAdmin {

        require(_usdcToken != address(0), "Zero address not allowed");
        require(_wAvaxToken != address(0), "Zero address not allowed");
        require(_ptpToken != address(0), "Zero address not allowed");
        require(_platypusLPUsdc != address(0), "Zero address not allowed");

        usdcToken = IERC20(_usdcToken);
        wAvaxToken = IERC20(_wAvaxToken);
        ptpToken = IERC20(_ptpToken);
        platypusLPUsdc = IAsset(_platypusLPUsdc);

        emit StrategyUpdatedTokens(_usdcToken, _wAvaxToken, _ptpToken, _platypusLPUsdc);
    }

    function setParams(
        address _traderJoeRouter,
        address _booster,
        address _rewardPool,
        uint256 _pid
    ) external onlyAdmin {

        require(_traderJoeRouter != address(0), "Zero address not allowed");
        require(_booster != address(0), "Zero address not allowed");
        require(_rewardPool != address(0), "Zero address not allowed");

        traderJoeRouter = IJoeRouter02(_traderJoeRouter);
        booster = IBooster(_booster);
        rewardPool = IRewardPool(_rewardPool);
        pid = _pid;

        emit StrategyUpdatedParams(_traderJoeRouter, _booster, _rewardPool, _pid);
    }


    // --- logic

    function _stake(
        address _asset,
        uint256 _amount
    ) internal override {

        require(_asset == address(usdcToken), "Some token not compatible");

        uint256 stakeAmount = usdcToken.balanceOf(address(this));
        usdcToken.approve(address(booster), stakeAmount);
        booster.deposit(pid, stakeAmount, true, block.timestamp);
    }

    function _unstake(
        address _asset,
        uint256 _amount,
        address _beneficiary
    ) internal override returns (uint256) {

        require(_asset == address(usdcToken), "Some token not compatible");

        uint256 liability = platypusLPUsdc.liability();
        uint256 totalSupply = platypusLPUsdc.totalSupply();
        uint256 unstakeLPBalance = _amount * totalSupply / liability;

        booster.withdraw(pid, unstakeLPBalance.addBasisPoints(4), false, unstakeLPBalance);

        return usdcToken.balanceOf(address(this));
    }

    function _unstakeFull(
        address _asset,
        address _beneficiary
    ) internal override returns (uint256) {

        require(_asset == address(usdcToken), "Some token not compatible");

        uint256 userLPBalance = rewardPool.balanceOf(address(this));
        if (userLPBalance == 0) {
            return usdcToken.balanceOf(address(this));
        }

        booster.withdraw(pid, userLPBalance, false, userLPBalance.subBasisPoints(4));

        return usdcToken.balanceOf(address(this));
    }

    function netAssetValue() external view override returns (uint256) {
        return _totalValue();
    }

    function liquidationValue() external view override returns (uint256) {
        return _totalValue();
    }

    function _totalValue() internal view returns (uint256) {
        uint256 userLPBalance = rewardPool.balanceOf(address(this));
        uint256 liability = platypusLPUsdc.liability();
        uint256 totalSupply = platypusLPUsdc.totalSupply();
        return userLPBalance * liability / totalSupply;
    }

    function _claimRewards(address _beneficiary) internal override returns (uint256) {

        uint256 userLPBalance = rewardPool.balanceOf(address(this));
        if (userLPBalance == 0) {
            return 0;
        }

        //claim rewards
        uint256[] memory pids = new uint256[](1);
        pids[0] = pid;
        booster.multiClaim(pids, address(this));

        // sell rewards
        uint256 totalUsdc;

        uint256 ptpBalance = ptpToken.balanceOf(address(this));
        if (ptpBalance > 0) {
            uint256 amountOutMin = TraderJoeLibrary.getAmountsOut(
                traderJoeRouter,
                address(ptpToken),
                address(wAvaxToken),
                address(usdcToken),
                ptpBalance
            );

            if (amountOutMin > 0) {
                uint256 ptpUsdc = TraderJoeLibrary.swapExactTokensForTokens(
                    traderJoeRouter,
                    address(ptpToken),
                    address(wAvaxToken),
                    address(usdcToken),
                    ptpBalance,
                    amountOutMin.subBasisPoints(4),
                    address(this)
                );
                totalUsdc += ptpUsdc;
            }
        }

        usdcToken.transfer(_beneficiary, usdcToken.balanceOf(address(this)));

        return totalUsdc;
    }

}
