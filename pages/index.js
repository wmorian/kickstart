import React, { Component, useEffect } from 'react';
import factory from '../ethereum/factory';

function CampaignIndex() {

    useEffect(() => {
        async function getDeployedCampaigns() {
            const campaigns = await factory.methods.getDeployedCampaigns().call();
            console.log(campaigns);
        };

        getDeployedCampaigns();
    }, []);

    return <div>Campaigns index!</div>
};

export default CampaignIndex;