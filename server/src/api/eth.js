const express = require('express');
const Web3 = require('web3');

const router = express.Router();
const web3 = new Web3(process.env.INFURA_SECRET);

router.get('/block/:block', async (req, res) => {
	const block = await web3.eth.getBlock(req.params.block)

	let blockTransactions = []
	let blockTransactionCodes = []
	let blockTransactionHashes = block.transactions


	let transactions = blockTransactionHashes.map(transaction => {
		return web3.eth.getTransaction(transaction).then(async transaction => {
			let transactionTo = await web3.eth.getCode(transaction.to)
			blockTransactionCodes.push(transactionTo)
		
			blockTransactions.push(transaction)
		})
	});

	Promise.all(transactions).then(() => {
		return res.json({ blockTransactions, blockTransactionCodes })
	})
});

router.get('/transaction/:id/decompile', async (req, res) => {
	const code = await web3.eth.getCode(req.params.id)

	const decompiled = await web3.eth.abi.decodeParameter('string', code)

	return res.json(decompiled)
})

router.get('/contract/:id', async (req, res) => {
	let contract = await new web3.eth.Contract([], req.params.id)

	return res.json(contract)
})

module.exports = router;
