pragma solidity ^0.4.23;
contract EvidenceSystem {
    struct Evidence {
        string information;
        uint timestamp ; 
    }
    mapping(address => Evidence[]) private evidences;

    function storeEvidence(string _information) public {
        evidences[msg.sender].push(Evidence({
            information: _information,
            timestamp: now
        }));
    }
    function getEvidenceLength() public view returns(uint) {
        return evidences[msg.sender].length;
    }
    function getEvidence(uint _index) public view returns (string, uint){
        if(evidences[msg.sender].length < _index + 1) {
            return ("", 0);
        }
        return (evidences[msg.sender][_index].information, evidences[msg.sender][_index].timestamp);    
    }
}
