import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import BlockResults from '../views/BlockResults.vue';
import Transaction from '../views/Transaction.vue';
import BlockDifference from '../views/BlockDifference.vue';
import BlockFromTo from '../views/BlockFromTo.vue';

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
		path: '/block/difference/:diff',
		name: 'Block Difference',
		component: BlockDifference
	},
	{
		path: '/block/:id',
		name: 'Block Results',
		component: BlockResults
	},
	{
		path: '/block/distance/:from/:to',
		name: 'Block From To',
		component: BlockFromTo
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
