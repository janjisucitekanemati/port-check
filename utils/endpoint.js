
let encodedUrls = {
    createAuthUri: "aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vaWRlbnRpdHl0b29sa2l0L3YzL3JlbHlpbmdwYXJ0eS9jcmVhdGVBdXRoVXJpP2tleT1BSXphU3lDWDM1cWFOckVTSU5MZkE0cXdmcVBRYjZjTkhuRXpBTXM=",
    verifyPassword: "aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vaWRlbnRpdHl0b29sa2l0L3YzL3JlbHlpbmdwYXJ0eS92ZXJpZnlQYXNzd29yZD9rZXk9QUl6YVN5Q1gzNXFhTnJFU0lOTGZBNHF3ZnFQUWI2Y05IbkV6QU1z",
    getAccountInfo: "aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vaWRlbnRpdHl0b29sa2l0L3YzL3JlbHlpbmdwYXJ0eS9nZXRBY2NvdW50SW5mbz9rZXk9QUl6YVN5Q1gzNXFhTnJFU0lOTGZBNHF3ZnFQUWI2Y05IbkV6QU1z",
    refreshToken: "aHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGVhcGlzLmNvbS92MS90b2tlbj9rZXk9QUl6YVN5Q1gzNXFhTnJFU0lOTGZBNHF3ZnFQUWI2Y05IbkV6QU1z",
    basePackagePortal: "aHR0cHM6Ly9wcm9kLnBwLWFwcC1hcGkuY29tL3YxL2dyYXBocWw=",
}


module.exports = {
    createAuthUri: () => Buffer.from(encodedUrls.createAuthUri, "base64").toString('utf8'),
    verifyPassword: () => Buffer.from(encodedUrls.verifyPassword, "base64").toString('utf8'),
    getAccountInfo: () => Buffer.from(encodedUrls.getAccountInfo, "base64").toString('utf8'),
    refreshToken: () => Buffer.from(encodedUrls.refreshToken, "base64").toString('utf8'),
    basePackagePortal: () => Buffer.from(encodedUrls.basePackagePortal, "base64").toString('utf8'),
    transactions: (wallet) => `https://api.viewblock.io/zilliqa/addresses/${wallet}/txs?page=1&network=mainnet&type=token&specific=zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2`
}