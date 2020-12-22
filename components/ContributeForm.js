import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import campaign from '../ethereum/campaign';

const ContributeForm = props => {
    const {
        address
    } = props;

    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        const currentCampaign = campaign(address);
        setErrorMessage("");
        try {
            const accounts = await web3.eth.getAccounts();
            await currentCampaign.methods.contribute()
                .send({ 
                    from: accounts[0], 
                    value: web3.utils.toWei(value, 'ether') 
                });   
        } catch (error) {
            setErrorMessage(error.message);
        }
        setLoading(false);
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input 
                    label='ether' 
                    labelPosition='right' 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </Form.Field>

            <Message error header="Oops!" content={errorMessage} />
            <Button 
                primary 
                loading={loading}
            >
                Contribute!
            </Button>
        </Form>
    )
};

export default ContributeForm;