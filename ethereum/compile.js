const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);


const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const input = {
    language: "Solidity",
    sources: {
        "Campaign.sol": {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = solc.compile(JSON.stringify(input));
const contracts = JSON.parse(output).contracts['Campaign.sol'];
for (let contract in contracts) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        contracts[contract]
    );
}
