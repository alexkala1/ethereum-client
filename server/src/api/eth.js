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
	let block = await web3.eth.getBlock(req.params.block, true)

	let transactions = await Promise.all(block.transactions.map(async transaction => {
		if (transaction.to !== null) {
			let code = await web3.eth.getCode(transaction.to)

			if (code !== "0x")
				transaction.isContract = 1
		}

		return await transaction
	}))

	delete block.transactions

	return res.json({ block, transactions })
});

/**
 * Gets blocks that user wants to get info and contracts
 */
router.get('/block/diff/:diff', async (req, res) => {
	let blocks = []
	let transactions = []
	let blockNumber = await web3.eth.getBlockNumber()

	for (let i = 0; i < req.params.diff; i++) {
		let block = await web3.eth.getBlock(blockNumber - i, true)

		block.transactions.forEach(async transaction => {
			if (transaction.to !== null) {
				let code = await web3.eth.getCode(transaction.to)

				if (code !== "0x")
					transaction.isContract = 1
			}

			transactions.push(transaction)

		})
		delete block.transactions

		blocks.push(block)
	}

	return res.json({ blocks, transactions })
})

/**
 * Get transactions from a block to a block
 */
router.get('/block/distance/:from/:to', async (req, res) => {
	let blocks = []
	let transactions = []
	const diff = req.params.from - req.params.to

	try {
		for (let i = 0; i < diff; i++) {
			let block = await web3.eth.getBlock(req.params.from - i, true)

			block.transactions.forEach(async transaction => {
				if (transaction.to !== null) {
					let code = await web3.eth.getCode(transaction.to)

					if (code !== "0x")
						transaction.isContract = 1
				}

				transactions.push(transaction)

			})
			delete block.transactions

			blocks.push(block)
		}
	} catch (error) {
		throw new Error(error)
	}

	return res.json({ blocks, transactions })
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
