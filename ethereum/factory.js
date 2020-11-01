import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, '0xf577cC7D1842ac08DA0278DA0DAAD84026DF3b67');

export default instance;