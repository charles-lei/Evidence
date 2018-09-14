var EvidenceSystem = artifacts.require("./EvidenceSystem.sol");

module.exports = function(deployer) {
  deployer.deploy(EvidenceSystem);
};
