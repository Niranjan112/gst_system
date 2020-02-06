const Gst = artifacts.require("Gst");
module.exports = function(deployer) {
  deployer.deploy(Gst);
};