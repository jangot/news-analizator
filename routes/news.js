const express = require('express');

const config = require('../configuration');
const { loadPosts, loadDayPortion } = require('../services/post-loader');
const { getPostsByDay } = require('../services/post-retriever');

const router = express.Router();

// 20240901
router.get('/scan/:date', async (req, res, next) => {
  let url = `${config.riaUrl}/services/${req.params.date}/more.html?id=0&date=${req.params.date}T235959`;

  let result = [];
  while (url) {
    console.log(url);
    let { links, nextUrl } = await loadDayPortion(url);
    result = [
        ...result,
        ...links,
    ];
    url = nextUrl ? `${config.riaUrl}${nextUrl}` : null;

    await loadPosts(links);
    console.log('next')
  }

  console.log('done')

  res.send('success');
});

router.get('/has/:month/:day', async (req, res) => {
  const { month, day } = req.params;
  const posts = await getPostsByDay(day, month);
  res.send({ posts });
});



module.exports = router;
