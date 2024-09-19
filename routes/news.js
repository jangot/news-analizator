const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const moment = require('moment');

const config = require('../configuration');
const { loadPostByLink, loadPosts } = require('../services/post-loader');

const router = express.Router();

/* GET users listing. */
router.get('/:date', async (req, res, next) => {
  const { data } = await axios.get(`${config.riaUrl}/${req.params.date}/index.xml`);

  const parser = new XMLParser();
  const result = parser.parse(data);

  const items = [];
  for (let i = 0; i < result.rss.channel.item.length; i++) {
    const news = result.rss.channel.item[i];

    const body = await loadPostByLink(news.link);
    console.log(news.title, 'loaded');

    const date = moment(news.pubDate);
    console.log(date.toDate(), news.pubDate)
    items.push({
      title: news.title,
      link: news.link,
      date: news.pubDate,
      body,
    });

    if (i === 4) break;
  }

  res.render('news', { title: 'RIA', items });
});

router.get('/new/:date', async (req, res, next) => {
  const { data } = await axios.get(`${config.riaUrl}/${req.params.date}/index.xml`);

  const parser = new XMLParser();
  const result = parser.parse(data);

  await loadPosts(result.rss.channel.item);

  res.send('success');
});

module.exports = router;
