import {API} from './components/api/apiHelper.js'
import Manylingo from './components/manylingo.js';
import OrderPlacementForm, { OrderPlacementThanks } from './components/orderplacement.js';
import RegistrationForm from './components/registration.js'
import LoginForm from './components/login.js'
import Account from './components/account.js'
import ViewOrder from './components/viewOrder.js'
import Profile from './components/profile.js'
import Header from './components/header.js'
import ViewStore from './stores/ViewStore';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'director';

if (module.hot) {
	module.hot.accept();
}

const initialState = window.initialState || {};

// var todoStore = TodoStore.fromJS(initialState.todos || []);
var viewStore = new ViewStore();

// todoStore.subscribeServerToStore();
var router = Router({
	'/': function () {
		ReactDOM.render(
			<Manylingo viewStore={viewStore} />,
			document.getElementById('manylingo')
		);
	},
	'/login': function () { ReactDOM.render(<LoginForm viewStore={viewStore} />, document.getElementById('manylingo')); },
	'/account': function () { ReactDOM.render(<Account viewStore={viewStore} />, document.getElementById('manylingo')); },
	'/sign-out': function () {  
		API.removeAuth()
		router.setRoute("/login");
	},
	'/orders/view/:orderID': function (orderID) { 
		ReactDOM.render(<ViewOrder orderID={orderID} viewStore={viewStore} />, document.getElementById('manylingo')); 
	},
	'/profile': function () { ReactDOM.render(<Profile viewStore={viewStore} />, document.getElementById('manylingo')); },
	'/register': function () { ReactDOM.render(<RegistrationForm viewStore={viewStore} />, document.getElementById('manylingo')); },
	'/place-order': function () { ReactDOM.render(<OrderPlacementForm viewStore={viewStore} />, document.getElementById('manylingo')); },
	'/place-order-thanks': function () { ReactDOM.render(<OrderPlacementThanks />, document.getElementById('manylingo')); },
});
router.init('/');

ReactDOM.render(
	<Header viewStore={viewStore} />,
	document.getElementById('manylingo-header')
);

export { router };