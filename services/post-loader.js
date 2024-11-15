const axios = require('axios');
const { JSDOM } = require('jsdom');
const moment = require('moment');
const crypto = require('crypto');

const { News } = require('../models');

function getHash(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}

function cleanString(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "").replace(/^[^\.]+РИА Новости\.\s*/i, "");
}

async function loadDayPortion(url) {
    const { data } = await axios.get(url);
    const dom = new JSDOM(data);
    const document = dom.window.document;

    const nextUrl = document.querySelector('.list-items-loaded').getAttribute('data-next-url');
    const elements = document.querySelectorAll('.list-item__title');

    const links = [];
    elements.forEach((el) => {
        links.push({
            link: el.href,
            title: el.innerHTML
        });
    });
    return { links, nextUrl };
}

async function loadPostByLink (link) {
    const { data } = await axios.get(link);

    const dom = new JSDOM(data);
    const document = dom.window.document;
    const elements = document.querySelectorAll('.article__text');

    const res = [];
    elements.forEach((el) => {
        res.push(cleanString(el.innerHTML));
    });

    if (res.length === 0) {
        return {};
    }
    try {
        const a = document.querySelector('.article__info-date a');

        return {
            body: res.join('\n'),
            date: moment(a.innerHTML, 'HH:mm DD.MM.YYYY').toDate()
        };
    } catch (error) {
        console.error(error);
        throw new Error(`Loading news error: ${link}`);
    }

}

async function loadOnePost(post, loadingData) {
    const id = getHash(post.link);

    const exists = await News.findOne({ where: { id } });

    if (exists) {
        console.log('post was loaded', post.link, id);
        return;
    }

    console.log('Will load post', post.link, id)
    const { body, date } = await loadPostByLink(post.link, loadingData);
    if (!body) {
        console.log('Post was not loaded', post.link, id);
        return;
    }
    await News.create({
        id,
        title: cleanString(post.title),
        link: post.link,
        date,
        body,
    });
}

async function loadPosts(postsList) {
    const promises = postsList.map((post) => loadOnePost(post));

    return Promise.all(promises);
}

module.exports = {
    loadPosts,
    loadDayPortion,
}


