const express = require('express');

const emojis = require('./emojis');
const eth = require('./eth');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏',
	});
});

router.use('/emojis', emojis);
router.use('/eth', eth);

module.exports = router;
