import Web3 from 'web3';

let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://kovan.infura.io/v3/9efadf446dec4a3eb7f4abf082216faa'
    );
    web3 = new Web3(provider);
}

export default web3;