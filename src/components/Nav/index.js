import React from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import './index.styl';

const mainMenu = [
    {
        href: '/',
        title: 'Stock analysis'
    },
    {
        href: '/portfolio/',
        title: 'Portfolio'
    },
    {
        href: '/about/',
        title: 'About'
    }
];


export class Nav extends React.Component {
    static defaultProps = {
        activeIndex: 0,
    };

    constructor ( ...args ) {
        super( ...args );
    }


    render = () => {
        return (
            <nav className="nav">
                <div className="nav__wrapper">
                    <div className="nav-links">
                        { mainMenu.map( ( link, key ) => {
                            const classNames = classnames( 'nav__link' );
                            return ( <NavLink exact={ key == 0 } to={ link.href } key={ key } className={ classNames }>{ link.title }</NavLink> );
                        } ) }
                    </div>
                </div>
            </nav>
        );
    }
}

export default Nav;
