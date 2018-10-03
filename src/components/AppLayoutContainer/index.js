import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {
    Header,
    Footer
} from '../';
import './index.styl';
import { LoaderComponent } from 'components';


class AppLayoutContainer extends PureComponent {

    static propTypes = {
    	lang: PropTypes.string,
    	children: PropTypes.node,
    	location: PropTypes.object,
    	params: PropTypes.object,
    	router: PropTypes.object
    };


    render = () => {

    	return (
    		<div className="AppContainer" >

    			<Header />

                <LoaderComponent />

    			<main className="AppContainer-content">
    				{
    					this.props.children
    				}
    			</main>

    			<Footer />


    		</div>
    	);
    }
}

export default AppLayoutContainer;
