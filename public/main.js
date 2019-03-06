import "@babel/polyfill";

import Vue from 'vue';
import VueRouter from 'vue-router';
import BigNumber from 'bignumber.js';

import App from './App.vue';

import DaiPeg from './views/DaiPeg.vue';

Vue.use(VueRouter);

const routes = [
	{ path: '/Off-the-peg', component: DaiPeg }
];

const router = new VueRouter({
	mode: 'history',
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
	el: '#app'
});
