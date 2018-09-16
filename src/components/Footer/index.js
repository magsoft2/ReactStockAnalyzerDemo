import React, {PureComponent} from "react";
import {Link} from "react-router-dom";


import "./index.styl";


export class Footer extends PureComponent {

    render = () => {

        return (
            <div className="footer">
                <div className="footer_item"><a href='https://github.com/magsoft2/ReactStockAnalyzerDemo'>Sources</a></div>
                <div className="footer_item">2018</div>
                <div className="footer_item"><Link to={'/about'}>About</Link></div>
            </div>
        );
    }
}

export default Footer;