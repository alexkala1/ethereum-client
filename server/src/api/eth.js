const express = require('express');
const Web3 = require('web3');

const router = express.Router();
const web3 = new Web3(process.env.INFURA_SECRET);

router.get('/block/:block', async (req, res) => {
	const block = await web3.eth.getBlock(req.params.block)

	let codeArray = []
	let blockTransactions = []
	let blockTransactionHashes = block.transactions

	let transactions = blockTransactionHashes.map(transaction => {
		return web3.eth.getTransaction(transaction).then(async transaction => {
			let code = await web3.eth.getCode(transaction.to)
			if (code !== "0x")
				transaction.isContract = 1

			blockTransactions.push(transaction)
		})
	});


	Promise.all(transactions).then(() => {
		return res.json(blockTransactions)
	})
});

router.get('/transaction/:id/', async (req, res) => {
	let transaction = await web3.eth.getTransaction(req.params.id)
	const code = await web3.eth.getCode(transaction.to)

	if (code !== "0x")
		transaction.isContract = 1

	return res.json(transaction)
})

router.get('/transaction/:id/decompile', async (req, res) => {
	let transaction = await web3.eth.getTransaction(req.params.id)


	const input = transaction.input
	const code = await web3.eth.getCode(transaction.to)


	return res.json({ code, input })
})

router.get('/contract/:id', async (req, res) => {
	let contract = await new web3.eth.Contract([], req.params.id)

	return res.json(contract)
})

module.exports = router;
