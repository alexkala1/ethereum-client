const express = require('express');
const Web3 = require('web3');

const router = express.Router();
const web3 = new Web3(process.env.INFURA_SECRET);

router.get('/:block', async (req, res) => {
	const block = await web3.eth.getBlock(req.params.block)

	let blockTransactions = []
	let blockTransactionHashes = block.transactions


	let promises = blockTransactionHashes.map(transaction => {
		return web3.eth.getTransaction(transaction).then(transaction => {
			blockTransactions.push(transaction)
		})
	});

	Promise.all(promises).then(() => {
		return res.json(blockTransactions)
	})
});

module.exports = router;
