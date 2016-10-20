import Manylingo from './components/manylingo.js';
import OrderPlacementForm, {OrderPlacementThanks} from './components/orderplacement.js';
import ViewStore from './stores/ViewStore';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'director';

if (module.hot) {
  module.hot.accept();
}

const initialState = window.initialState || {};

// var todoStore = TodoStore.fromJS(initialState.todos || []);
var viewStore = new ViewStore();

// todoStore.subscribeServerToStore();
var router = Router({
	'/': function () {
		console.log("test");
		ReactDOM.render(
			<Manylingo viewStore={viewStore}/>,
			document.getElementById('manylingo')
		);
	},
	'/login': function () {
		console.log("login");
	},
	'/place-order': function () {
		ReactDOM.render(
			<OrderPlacementForm viewStore={viewStore}/>,
			document.getElementById('manylingo')
		);
	},
	'/place-order-thanks': function () {
		ReactDOM.render(
			<OrderPlacementThanks />,
			document.getElementById('manylingo')
		);
	},
});
router.init('/');
export {router};