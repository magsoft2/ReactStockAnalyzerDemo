import React, {PureComponent} from "react";
import {Helmet} from 'react-helmet';


import "./index.styl";


export class PortfolioManagementPage extends PureComponent {
    static contextTypes: {
    };

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }
    
                     
    render = () => {

        return (
            <div>
                
                <Helmet>
                    <title>Demo portfolio management app</title>
                </Helmet>

                <div>PortfolioManagement page</div>
                


            </div>
        )
    }
}
