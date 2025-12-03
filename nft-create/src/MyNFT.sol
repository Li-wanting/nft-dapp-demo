// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {
    ERC721URIStorage
} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // 合约名称和符号
    constructor() ERC721("MyNFT", "M_NFT") Ownable(msg.sender) {}

    /// @notice 只有 owner(合约所有者) 可以铸造新的NFT
    /// @param to 接收NFT的地址
    /// @param uri 对应 NFT 的 metadata URI（通常是 IPFS 链接）
    /// @return tokenId 新铸造的 NFT 的 tokenId
    function mint(
        address to,
        string memory uri
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }
}
