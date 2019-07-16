pragma solidity ^0.5.0;
//引入SafeMath库
import "./SafeMath.sol";

contract Voting {
    //把safeMath关联到uint里面
    using SafeMath for uint;
    //每个人获得的投票数量
    mapping (bytes32 => uint) public votesReceived;
    //每个账户只能投一次票
    mapping (address => bool) private addrRecorded;

    bytes32[] public candidateList;

    constructor(bytes32[] memory candidateNames) public {
        candidateList = candidateNames;
    }

    //返回每一个人所有的投票数
    function totalVotesFor(bytes32 candidate) view public returns (uint) {
        require(validCandidate(candidate), "No valid");

        return votesReceived[candidate];
    }

    function voteForCandidate(bytes32 candidate) payable public {
        require(validCandidate(candidate), "No valid");
        require(!addrRecorded[msg.sender], "address have voted");
        addrRecorded[msg.sender] = true;
        uint amount = msg.value / 0.01 ether;
        // votesReceived[candidate] += amount;
        votesReceived[candidate] = votesReceived[candidate].add(amount);
    }

    function validCandidate(bytes32 candidate) view public returns (bool) {
        for(uint i = 0; i < candidateList.length; i++){
            if(candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}
