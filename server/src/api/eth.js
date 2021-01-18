const express = require('express');
const Web3 = require('web3');
const { EVM } = require("evm");

const router = express.Router();
const web3 = new Web3(process.env.INFURA_SECRET);

/**
 * Gets the asked block and returns its information
 * as well as its transactions. Also calculates the
 * occasion of a transaction being a contract.
 */
router.get('/block/:block', async (req, res) => {
	const block = await web3.eth.getBlock(req.params.block)

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
		return res.json({ block, blockTransactions })
	})
});

/**
 * Gets blocks that user wants to get info and contracts
 */
router.get('/block/diff/:diff', async (req, res) => {
	let blocks = []
	let blockTransactions = []
	let blockNumber = await web3.eth.getBlockNumber()

	const allBlocks = new Promise(async function (reject, resolve) {
		for (let i = 0; i < req.params.diff; i++) {
			let block = await web3.eth.getBlock(blockNumber - i)

			block.transactions.forEach(async transaction => {
				let transactionFromBlock = await web3.eth.getTransaction(transaction)

				if (transactionFromBlock.to !== null) {
					let code = await web3.eth.getCode(transactionFromBlock.to)

					if (code !== "0x")
						transactionFromBlock.isContract = 1
				}

				blockTransactions.push(transactionFromBlock)
			});

			blocks.push(block)
		}

		if (blocks.length === req.params.diff)
			resolve("done")
		else
			reject()
	})

	allBlocks.then(() => {
		return res.json({ blocks, blockTransactions })
	})
})

/**
 * Gets current block count
 */
router.get('/blockCount', async (req, res) => {
	const blockCount = await web3.eth.getBlockNumber()

	return res.json(blockCount)
})

/**
 * Gets a transaction by its hash. If it is a contract
 * returns the bytecode as well.
 */
router.get('/transaction/:id/', async (req, res) => {
	let transaction = await web3.eth.getTransaction(req.params.id)
	const code = await web3.eth.getCode(transaction.to)

	if (code !== "0x")
		transaction.isContract = 1

	return res.json({ transaction, code })
})


/**
 * Decompiles the contract and returns its code and events
 */
router.get('/transaction/:id/decompile', async (req, res) => {
	const code = await web3.eth.getCode(req.params.id)

	if (code !== "0x") {
		const evm = new EVM(code)
		const functions = evm.getFunctions()
		const events = evm.getEvents()
		const decompiled = evm.decompile()

		return res.json({ functions, events, decompiled })
	} else {
		return res.json({ message: "Not a contract" })
	}

})

module.exports = router;
