import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, '0x1375c588295E72A4a7F4d1d5294D3DA7C3B80cBB'); //'0xf577cC7D1842ac08DA0278DA0DAAD84026DF3b67');

export default instance;