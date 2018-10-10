import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';


import './index.styl';
import {GLobalMessageComponent, GlobalProgressComponent} from 'components';


export class Footer extends PureComponent {

    render = () => {

    	return (
    		<div className="footer">
    			<div className="footer_item"><a href='https://github.com/magsoft2/ReactStockAnalyzerDemo'>Gitub sources</a></div>
    			<div className="footer_item">2018</div>
    			<div className="footer_item"><Link to={'/about'}>About</Link></div>
                <div className="footer_item footer_item_fixed_90_width footer_item footer_item--white-color"><GlobalProgressComponent/></div>
                <div className="footer_item footer_item_fixed_250_width footer_item--white-color"><GLobalMessageComponent/></div>
    		</div>
    	);
    }
}

export default Footer;