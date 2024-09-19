const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const config = require('../configuration');

const router = express.Router();

/* GET users listing. */
router.get('/:date', async (req, res, next) => {
  // const date = req.params.date;20240918
  const { data } = await axios.get(`${config.riaUrl}/${req.params.date}/index.xml`);

  const parser = new XMLParser();
  const result = parser.parse(data);

  res.render('news', { title: 'RIA', items: result.rss.channel.item });
});

module.exports = router;
