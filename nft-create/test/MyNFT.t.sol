// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MyNFT} from "../src/MyNFT.sol";

contract MyNFTTest is Test {
    MyNFT public nft;
    address owner = address(0x1);
    address user = address(0x2);

    function setUp() public {
        // 把接下来部署合约的 msg.sender 设置为 owner
        vm.startPrank(owner);
        nft = new MyNFT();
        vm.stopPrank();
    }

    function testMintByOwner() public {
        // owner 铸造NFT给 user
        vm.prank(owner);
        uint256 tokenId = nft.mint(user, "ipfs://example-uri");

        assertEq(tokenId, 0); // 第一个铸造的 NFT 的 tokenId 应该是 0
        assertEq(nft.ownerOf(tokenId), user);
        assertEq(nft.tokenURI(tokenId), "ipfs://example-uri");
    }

    function testOnlyOwnerCanMint() public {
        // 非 owner 尝试铸造 NFT 应该失败
        vm.prank(user);
        vm.expectRevert(); // 预期下一条交易会失败
        nft.mint(user, "ipfs://example-uri");
    }

    function textNextTokenIdIncreases() public {
        vm.prank(owner);
        nft.mint(user, "ipfs://example-uri-1");

        vm.prank(owner);
        nft.mint(user, "ipfs://example-uri-2");

        assertEq(nft.nextTokenId(), 2); // 已铸造两个NFT，nextTokenId 应该是2
    }
}
