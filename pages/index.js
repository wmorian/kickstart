import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { CardGroup, Button, Menu } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';

export const getServerSideProps = async () => {
    const campaign = await factory.methods.getDeployedCampaigns().call();

    return { props: { campaign } };
}

function CampaignIndex(props) {
    const {
        campaign
    } = props;


    const renderCampaigns = () => {
        const items = campaign.map(address => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true
            };
        });

        return <CardGroup items={items} /> 
    }

    return (
        <Layout>
            <div>
                <h3>Open Campaigns</h3>
                <Button 
                    content='Create Campaign' 
                    icon='add'
                    labelPosition='left' 
                    floated="right"
                    primary  
                />
                {renderCampaigns()}
            </div>
        </Layout>
    );
};

export default CampaignIndex;