import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import momentTz from "moment-timezone";
import {connect} from "react-redux";
import "ress";

import {NODE_ENV} from "../constants";
import CONFIG from 'config';

import {
    Header,
    Nav,
    Footer
} from "../components";
import "./AppContainer.styl";


class AppContainer extends PureComponent {
    // getChildContext = () => {
        // return {
            // location: this.props.location,
            // params: this.props.params,
            // router: this.props.router,
            // //lang: DEFAULT_LANG, //??? TODO: localize it
        // };
    // };

    static propTypes = {
        lang: PropTypes.string,
        children: PropTypes.node,
        location: PropTypes.object,
        params: PropTypes.object,
        router: PropTypes.object,
    };

    componentDidMount() {
        const {dispatch} = this.props;
    }


    render = () => {
        const {token} = this.props;

        return (
            <div className="AppContainer" >

                <Header />

                <Nav />

                <main className="AppContainer-content">
                    {
                        this.props.children
                    }
                </main>

                <Footer />


            </div>
        )
    }
}

// connect issue with childContextTypes
// https://github.com/reactjs/react-redux/issues/573
//AppContainer.WrappedComponent.childContextTypes = {
    // location: PropTypes.object,
    // params: PropTypes.object,
    // router: PropTypes.object,
    // lang: PropTypes.string,
//};

export default AppContainer;
