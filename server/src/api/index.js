const express = require('express');

const eth = require('./eth');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏',
	});
});

router.use('/eth', eth);

module.exports = router;
