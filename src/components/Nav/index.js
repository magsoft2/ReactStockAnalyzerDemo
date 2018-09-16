import React from "react";
import classnames from "classnames";
import {NavLink} from "react-router-dom";

import "./index.styl";


export class Nav extends React.Component {
    static defaultProps = {
        activeIndex: 0,
    };

    constructor(...args) {
        super(...args);
    }


    render = () => {

		const mainMenu = [
			{
				href:'/',
				title:'Stock analysis'
            },
            {
				href:'/portfolio/',
				title:'Portfolio'
            },
            {
				href:'/about/',
				title:'About'
			}
		];
	
        return (
            <nav className="Nav">
                <div className="Nav-wrapper">
                    <div className="Nav-links">
                        {mainMenu.map((link, key) => {
                            const classNames = classnames("Nav-link");
                                return (<NavLink exact={key == 0} to={link.href} key={key} className={classNames}>{link.title}</NavLink>);
                        })}
                    </div>
                </div>
            </nav>
        )
    }
}

export default Nav;
