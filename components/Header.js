import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

const Header = props => {

    return (
        <Menu style={styles}>
            <Menu.Item
                name='KickStarter'
            >
                KickStarter
            </Menu.Item>
            <Menu.Menu position='right'>
                <Menu.Item name='Campaigns'>
                    Campaigns
                </Menu.Item>
                <Menu.Item 
                    name="Add"
                    onClick={() => {}}
                >
                    <Icon name='add' />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};

const styles = {
    marginTop: '10px',
}

export default Header;