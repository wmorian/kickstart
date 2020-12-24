import React from 'react';
import Layout from '../../../../components/Layout';
import Link from 'next/link';
import { Button, Table } from 'semantic-ui-react';
import campaign from '../../../../ethereum/campaign';
import RequestRow from '../../../../components/RequestRow';

export const getServerSideProps = async context => {

    const currentCampaign = campaign(context.query.address);
    const requestCount = await currentCampaign.methods.getRequestCount().call();

    // const requests = await Promise.all(
    //     Array(requestCount)
    //         .fill()
    //         .map((element, index) => {return index})
    // );

    const requests = [];
    for (let index = 0; index < requestCount; index++) {
        const request = await currentCampaign.methods.requests(index).call();
        requests.push(
            {
                isActive: request['isActive'],
                description: request['description'],
                value: request['value'],
                recipient: request['recipient'],
                complete: request['complete'],
                approvalCount: request['approvalCount']
            });
    }

    return { 
        props: { 
            address: context.query.address,
            requests: requests,
            requestCount: requestCount
        }
    };
}

const RequestsList = props => {
    const {
        address,
        requests,
        requestCount
    } = props;

    const renderRequests = () => {
        requests.map((req, i) => {
            return (
                <RequestRow 
                    key={i}
                    request={req}
                    address={address}
                />
            )
        })
    };

    return (
        <Layout>
            <h3>Requests</h3>
            <Link href={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary>
                        Add Request
                    </Button>
                </a>
            </Link>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {/* {renderRequests()} */}
                </Table.Body>
            </Table>
        </Layout>
    )
}

export default RequestsList;