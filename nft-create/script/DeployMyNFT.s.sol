//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MyNFT} from "../src/MyNFT.sol";
import {console2} from "forge-std/console2.sol";

contract DeployMyNFT is Script {
    function run() external {
        // 从环境变量中获取部署者的私钥
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 开始广播交易
        vm.startBroadcast(deployerPrivateKey);

        // 部署 MyNFT 合约
        MyNFT nft = new MyNFT();

        // 停止广播交易
        vm.stopBroadcast();

        // 输出部署的合约地址
        console2.log("MyNFT deployed at:", address(nft));
        // 输出部署者地址
        console2.log("Deployer address", vm.addr(deployerPrivateKey));
    }
}
