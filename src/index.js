import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';


import AppLayoutContainer from './components/AppLayoutContainer';
import {
    StockAnalysisPage,
    PortfolioManagementPage,
    AboutPage,
    NotFoundPage
} from './pages';


import CONFIG from 'config';

import {store} from 'root';

render(
    ( <Provider store={ store }>
        <Router basename={ CONFIG.publicPath }>
            <Switch>
                <AppLayoutContainer>
                    <Switch>
                        <Route path="/" exact={ true } component={ StockAnalysisPage } />
                        <Route path="/portfolio" component={ PortfolioManagementPage } />
                        <Route path="/about" component={ AboutPage } />
                        <Route path="*" component={ NotFoundPage } />
                    </Switch>
                </AppLayoutContainer>
            </Switch>
        </Router>
    </Provider> ),
    document.getElementById( 'app' )
);