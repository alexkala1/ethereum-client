import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import BlockResults from '../views/BlockResults.vue';
import Transaction from '../views/Transaction.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/transaction/:id',
		name: 'Transaction',
		component: Transaction
	},
	{
		path: '/block/:id',
		name: 'Block Results',
		component: BlockResults
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
