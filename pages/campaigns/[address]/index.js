import React from 'react';
import Link from 'next/link'; 
import Layout from '../../../components/Layout';
import ContributeForm from '../../../components/ContributeForm';
import campaign from '../../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';

export const getServerSideProps = async context => {
    const currentCampaign = campaign(context.query.address);
    const summary = await currentCampaign.methods.getSummary().call();
    
    return { props: {
        campaignAddress: context.query.address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
     } };
}

const Campaign = props => {
    const {
        campaignAddress,
        minimumContribution,
        balance,
        requestsCount,
        approversCount,
        manager
    } = props;

    const renderDetails = () => {
        const details = [
            {
                header: manager,
                description: 'The manager created this campaign and can create requests to withdraw money.',
                meta: 'Address of Manager',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                description: 'You must contribute at least so much Wei to become a contributor.',
                meta: 'Minimum Contribution' 
            },
            {
                header: requestsCount,
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
                meta: 'Number of Requests' 
            },
            {
                header: approversCount,
                description: 'Number of people who have already donated to this campaign.',
                meta: 'Number of Approvers' 
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                description: 'The balance is how much money this campaign has left to spend.',
                meta: 'Campaign Balance (ether)' 
            },
        ];

        return <Card.Group items={details} /> 
    };

    return (
        <Layout>
            <div>
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Column width={10}>
                        {renderDetails()}
                        <Link href={`/campaigns/${campaignAddress}/requests}`}>
                            <a>
                                <Button primary>
                                    View Requests
                                </Button>
                            </a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={campaignAddress}/>
                    </Grid.Column>
                </Grid>
            </div>
        </Layout>
    )
}

export default Campaign;