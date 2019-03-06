import React from 'react';

import { Nav } from '../../components';
import CONFIG from 'config';

import './index.styl';


export class Header extends React.Component {

    render = () => {

    	return (
    		<header className="header">
    			<div className="header__logo"><img src={(CONFIG.publicPath && CONFIG.publicPath !== '/' ? CONFIG.publicPath : '' ) + '/images/logo.jpg'}></img></div>
    			<div className="header__menu-container">              
    				<div className="header__caption">Demo React Stock Analyser</div>  
    				<Nav />
    			</div>
    		</header>
    	);
    }
}

export default Header;
