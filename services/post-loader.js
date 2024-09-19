const axios = require('axios');
const { JSDOM } = require('jsdom');
const moment = require('moment');
const crypto = require('crypto');

const { News } = require('../models');

function getHash(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}

async function loadPostByLink (link) {
    const { data } = await axios.get(link);

    const dom = new JSDOM(data);
    const document = dom.window.document;
    const elements = document.querySelectorAll('.article__text');

    const res = [];
    elements.forEach((el) => {
        res.push(el.innerHTML);
    });

    return res.join('\n').replace(/<\/?[^>]+(>|$)/g, "");
}

async function loadPosts(postsList) {
    for (let i = 0; i < postsList.length; i++) {
        const post = postsList[i];

        const body = await loadPostByLink(post.link);

        await News.create({
            id: getHash(post.guid),
            title: post.title,
            link: post.link,
            date: moment(post.pubDate).toDate(),
            body,
        });
    }
}

module.exports = {
    loadPosts,
    loadPostByLink,
}


