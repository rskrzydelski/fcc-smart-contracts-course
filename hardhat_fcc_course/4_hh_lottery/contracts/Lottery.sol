// SPDX-License-Identifier: Apchache-2.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFCoordinatorV2.sol";
import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";

error Lottery__NotEnoughEntered();
error Lottery__TransferFailed();
error Lottery__NotOpen();
error Lottery__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 loterryState);

/**
 * @title A sample Lottery Contract
 * @author RS
 * @notice Lottery
 * @dev This implements Chainlink VEF v2 and Chainlink Keepers
 */
contract Lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* type declarations */
    enum LotteryState {
        OPEN,
        CALCULATING
    } // under the hood: uint256 0 = OPEN, 1 = CALCULATING

    /* immutable and constants */
    uint256 private immutable i_entranceFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    /* stage/store varibales */
    address payable[] private s_players;

    // lottery variables
    address private s_recentWinner;
    LotteryState private s_lotteryState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Events */
    event LotteryEvent(address indexed player);
    event RequestRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2, 
        uint256 entranceFee, 
        bytes32 gasLane, 
        uint64 subscriptionId, 
        uint32 callbackGasLimit,
        uint256 interval
        ) VRFConsumerBaseV2(vrfCoordinatorV2) { 
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterLottery() public payable {
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughEntered();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__NotOpen();
        }

        s_players.push(payable(msg.sender));
        // Emit an event when we update a dynamic awway or mapping
        emit LotteryEvent(msg.sender);
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_lotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Lottery__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /**
     * @dev This is the function that the Chainlink Keeper nodes call
     * they look for the `upkeepNeeded` to return true.
     * The following should be true in order to return true:
     * 1. Our time interval should have passed
     * 2. The lottery should have at least 1 player, and have some ETH
     * 3. Our subscription is funded with LINK
     * 4. The lottery should be in an "open" state
     */
    function checkUpkeep(
        bytes memory /* checkData */
        ) 
        public override 
        returns (bool upkeepNeeded, bytes memory /* perform data */ ) {
      bool isOpen = (LotteryState.OPEN == s_lotteryState);
      bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
      bool hasPlayers = (s_players.length > 0);
      bool hasBalance = address(this).balance > 0;
      upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    // external is a little bit chiper than public functions
    function performUpkeep(bytes calldata /* performData */ ) external override {
        // request the random number
        // once we get it, do something with it
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Lottery__UpkeepNotNeeded(
                address(this).balance, 
                s_players.length, 
                uint256(s_lotteryState)
                );
        }

        s_lotteryState = LotteryState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, 
            i_subscriptionId, 
            REQUEST_CONFIRMATIONS, 
            i_callbackGasLimit, 
            NUM_WORDS
        );
        emit RequestRaffleWinner(requestId);
    }

    /* getters */
    function getEntranceFee() public view returns (uint256){
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address){
        return s_players[index];
    }

    function getRecentWinner() public view returns(address) {
        return s_recentWinner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns(uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() public view returns(uint256) {
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns(uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns(uint256) {
        return i_interval;
    }
}

// eneter the lottery (paying some amount)
// pick a random winner (verifiably random)
// winner to be selected every X minutes -> completly automate
// chainlink oracle -> randomness, automated execution (chainlink keepers)
