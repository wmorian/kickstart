const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({
            data: compiledFactory.evm.bytecode.object
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('campaign', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.getManager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribite money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '101'
        });

        const isContributer = await campaign.methods.isApprover(accounts[1]).call();
        assert(isContributer);
    });

    it('requires a minimun contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '5'
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('buy batteries', '101', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        const request = campaign.methods.requests(0).call();
        assert('buy batteries', request.description);
    });

    it('process request', async () => {

        const creator = accounts[0];
        const contributer = accounts[1];
        const recipient = accounts[2];

        let previousBalance = await web3.eth.getBalance(recipient);
        previousBalance = web3.utils.fromWei(previousBalance, 'ether');
        previousBalance = parseFloat(previousBalance);

        await campaign.methods.contribute().send({
            from: contributer,
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('buy batteries', web3.utils.toWei('5', 'ether'), recipient)
            .send({
                from: creator,
                gas: '1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: contributer,
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: creator,
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(recipient);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > previousBalance);
    });
});