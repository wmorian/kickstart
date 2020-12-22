import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import Link from 'next/link';

const Header = props => {

    return (
        <Menu style={styles}>
            <Link href="/">
                <a className='item'>KickStarter</a>
            </Link>
            <Menu.Menu position='right'>
                <Link href="/">
                    <a className='item'>Campaigns</a>
                </Link>
                <Link href="/campaigns/new">
                    <a className='item'> <Icon name='add' /></a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};

const styles = {
    marginTop: '10px',
}

export default Header;