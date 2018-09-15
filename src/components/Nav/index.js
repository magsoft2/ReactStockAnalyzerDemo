import React from "react";
import classnames from "classnames";

import CONFIG from 'config';

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
				title:'Home'
            },
            {
				href:'/test/',
				title:'Test'
			}
		];
	
        return (
            <nav className="Nav">
                <div className="Nav-wrapper">
                    <div className="Nav-links">
                        {mainMenu.map((link, key) => {
                            const classNames = classnames("Nav-link");
                                return <a href={link.href} key={key} className={classNames}>{link.title}</a>;
                        })}
                    </div>
                </div>
            </nav>
        )
    }
}

export default Nav;
