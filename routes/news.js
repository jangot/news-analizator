const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const config = require('../configuration');
const { loadPosts } = require('../services/post-loader');
const {getPostsByDay} = require('../services/post-retriever');

const router = express.Router();

// 20240901
router.get('/scan/:date', async (req, res, next) => {
  console.log(req.params.date)
  const { data } = await axios.get(`${config.riaUrl}/${req.params.date}/index.xml`);

  const parser = new XMLParser();
  const result = parser.parse(data);

  await loadPosts(result.rss.channel.item);

  res.send('success');
});

router.get('/has/:month/:day', async (req, res) => {
  const { month, day } = req.params;
  const posts = await getPostsByDay(day, month);
  res.send({ posts });
});



module.exports = router;
