import React, { useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import campaign from '../ethereum/campaign';

const RequestRow = props => {
    const {
        id,
        request,
        address,
        approversCount
    } = props;

    const [isApproving, setIsApproving] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const readyToFinalize = request.approvalCount > (approversCount / 2);

    const onApprove = async () => {
        setIsApproving(true);
        const currentCampaign = campaign(address);
        const accounts = await web3.eth.getAccounts();
        try {
            await currentCampaign.methods.approveRequest(id).send({
                from: accounts[0]
            });    
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsApproving(false);
        }
    }

    const onFinalize = async () => {
        setIsFinalizing(true);
        const currentCampaign = campaign(address);
        const accounts = await web3.eth.getAccounts();
        try {
            await currentCampaign.methods.finalizeRequest(id).send({
                from: accounts[0]
            });    
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsFinalizing(false);
        }
    }

    return (
        <Table.Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{request.description}</Table.Cell>
            <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
            <Table.Cell>{request.recipient}</Table.Cell>
            <Table.Cell>{request.approvalCount + " / " + approversCount}</Table.Cell>
            <Table.Cell>
                <Button
                    disabled={request.complete}
                    color='green' 
                    basic 
                    onClick={onApprove}
                    loading={isApproving}
                >
                    Approve
                </Button>
            </Table.Cell>
            <Table.Cell>
                <Button
                    disabled={!readyToFinalize || request.complete}
                    color='teal' 
                    basic 
                    onClick={() => onFinalize(id)}
                    loading={isFinalizing}
                >
                    Finalize
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};

export default RequestRow;