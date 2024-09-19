const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const config = require('../configuration');
const { loadPostByLink } = require('../services/post-loader');

const router = express.Router();

/* GET users listing. */
router.get('/:date', async (req, res, next) => {
  // const date = req.params.date;20240918
  const { data } = await axios.get(`${config.riaUrl}/${req.params.date}/index.xml`);

  const parser = new XMLParser();
  const result = parser.parse(data);
  const post = await loadPostByLink(result.rss.channel.item[0].link);

  const items = [];
  for (let i = 0; i < result.rss.channel.item.length; i++) {
    const news = result.rss.channel.item[i];

    const text = await loadPostByLink(news.link);
    console.log(news.title, 'loaded');
    items.push({
      title: news.title,
      link: news.link,
      text,
    });

    if (i === 4) break;
  }

  res.render('news', { title: 'RIA', items });
});

module.exports = router;
