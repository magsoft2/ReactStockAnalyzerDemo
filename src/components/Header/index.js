import React from "react";

import { Nav } from "../../components";

import "./index.styl";


export class Header extends React.Component {

    render = () => {

        return (
            <header className="header">
                <div className="header_logo"><img src='/images/logo.jpg'></img></div>
                <div className="header_menu_container">              
                    <div className="header_caption">Demo React Stock Analyser</div>  
                    <Nav />
                </div>
            </header>
        );
    }
}

export default Header;
