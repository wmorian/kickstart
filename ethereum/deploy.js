const Web3 = require('web3');
const path = require('path');
const fs = require('fs-extra');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const compiledFactory = require('./build/CampaignFactory.json');

const mnPath = path.resolve(__dirname, 'metamask.mnemonic');
const mnemonic = fs.readFileSync(mnPath).toString();;
let provider = new HDWalletProvider(mnemonic, 'https://kovan.infura.io/v3/9efadf446dec4a3eb7f4abf082216faa')
const web3 = new Web3(provider);

(async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account:', accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0] });

    console.log('Contract deployed to:', result.options.address);
})();

provider.engine.stop();