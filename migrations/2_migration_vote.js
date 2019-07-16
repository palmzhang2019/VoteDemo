const Voting = artifacts.require("Voting");
const SafeMath = artifacts.require("SafeMath");

function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return '0x' + hex;
}

module.exports = function(deployer) {
    deployer.deploy(SafeMath);
    //将safemath链接到voting
    deployer.link(SafeMath, Voting);
    deployer.deploy(Voting, [convertToHex("Palm"), convertToHex("Jack"), convertToHex("Penny")]);
};
