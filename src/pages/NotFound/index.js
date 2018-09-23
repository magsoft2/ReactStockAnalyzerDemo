import React from 'react';
import {Header} from '../../components/Header/index';
import {Footer} from '../../components/Footer/index';
import './index.styl';
import {Link} from 'react-router-dom';

export const NotFoundPage = () => {
	return (
		<main className="AppContainer-content">
			<div className="nf-page" style={{textAlign:'center'}}>
				<h1>404</h1>
				<p>Страница не найдена</p>
				<br/>
				<Link to={'/'}>На главную</Link>
			</div>
		</main>
	);
};
