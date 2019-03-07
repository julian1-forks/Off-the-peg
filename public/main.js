import "@babel/polyfill";

import Vue from 'vue';
import VueRouter from 'vue-router';
import BigNumber from 'bignumber.js';

import App from './App.vue';

import DaiPeg from './views/DaiPeg.vue';

Vue.use(VueRouter);

const routes = [
	{ path: '/:quote/:base', component: DaiPeg }
];

const router = new VueRouter({
	base: '/Off-the-peg/',
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
	el: '#app'
});
