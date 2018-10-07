import React, {PureComponent} from 'react';

import './index.styl';


export class AboutPage extends PureComponent {

    constructor(props) {
        super(props);

    }
    
                     
    render = () => {

    	return (
    		<div className='about-page'>
                <div className='about-page_container'>
    			    <div>Demo React Stock Analyser is a sample project for stock analysis and portfolio management. 
                        <br/>Application is built with React, Redux, Redux-sage.
                    </div>
                    <br/>
                    <div>Source code: <a href='https://github.com/magsoft2/ReactStockAnalyzerDemo'>github</a></div>
                    <br/><span>Financial data for the Russian financial markets data is taken from Moscow Exchange <a href='https://iss.moex.com/iss/reference/'>http api</a></span>
                    <br/>
                    <br/>
                    <div>Used libraries:
                        <ul>
                            <li><a href='https://rrag.github.io/react-stockcharts/'>React Stockcharts</a>  for drawing time series data.</li>
                            <li><a href='https://www.highcharts.com/'>Highcharts</a> time series data. Free use for no-commercial-uses</li>
                            <li><a href='https://github.com/moroshko/react-autosuggest/'>React autosuggest</a> as autosuggest component.</li>
                            <li><a href='https://github.com/react-tools/react-table/'>react-table</a> table component.</li>
                            <li><a href='https://github.com/reactjs/react-tabs/'>react-tabs</a> tab control.</li>
                        </ul>
                    </div>
                </div>

    		</div>
    	);
    }
}
