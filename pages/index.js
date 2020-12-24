import React from 'react';
import { CardGroup, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';
import Link from 'next/link';

export const getServerSideProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { props: { campaigns } };
}

function CampaignIndex(props) {
    const {
        campaigns
    } = props;

    const renderCampaigns = () => {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link href={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>),
                fluid: true
            };
        });

        return <CardGroup items={items} /> 
    }

    return (
        <Layout>
            <h3>Open Campaigns</h3>
            <Link href='/campaigns/new'>
                <a className='item'>
                    <Button 
                        content='Create Campaign' 
                        icon='add'
                        labelPosition='left' 
                        floated="right"
                        primary
                    />
                </a>
            </Link>
            {renderCampaigns()}
        </Layout>
    );
};

export default CampaignIndex;