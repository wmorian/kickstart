import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { route } from 'next/dist/next-server/server/router';

export const getServerSideProps = async context => {

    return { props: {
        address: context.query.address
    }};
}

const RequestNew = props => {
    const {
        address
    } = props;

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');

    const onSubmit = async event => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');
        const currentCampaign = campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            await currentCampaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] });
            router.push(`/campaigns/${address}/requests`);
        } catch (error) {
            setErrorMessage(error.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <Link href={`/campaigns/${address}/requests`}>
                <a>Back</a>
            </Link>
            <h3>Create New Request</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage}>

                <Form.Field>    
                    <label>Description</label>
                    <Input 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </Form.Field>
                
                <Form.Field>
                    <label>Value</label>
                    <Input 
                        label='ether' 
                        labelPosition='right' 
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </Form.Field>
                
                <Form.Field>    
                    <label>Recipient</label>
                    <Input 
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                    />
                </Form.Field>
                
                <Message error header="Oops!" content={errorMessage} />
                <Button primary loading={loading}>Create!</Button>
            
            </Form>
        </Layout>
    )
};

export default RequestNew;