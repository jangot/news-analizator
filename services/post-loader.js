const axios = require('axios');
const { JSDOM } = require('jsdom');
const moment = require('moment');
const crypto = require('crypto');

const { News } = require('../models');
const config = require('../configuration');

function getHash(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}


// https://ria.ru/services/20240902/more.html?id=0&date=20240902T23:59:59
async function loadArchiveByDay(date) {
    const { data } = await axios.get(`${config.riaUrl}/${date}`);

    const dom = new JSDOM(data);
    const document = dom.window.document;

    const elements = document.querySelectorAll('.list-item__content .list-item__title');
    const linksList = [];
    elements.forEach((el) => {
        linksList.push(el.href);
    });
    return linksList;
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
        res.push(el.innerHTML);
    });

    const date = document.querySelector('.article__info-date a').innerHTML;
    console.log('-----------', date)
    console.log(moment(date, 'HH:mm DD.MM.YYYY').toDate())
    return {
        body: res.join('\n').replace(/<\/?[^>]+(>|$)/g, ""),
        date: moment(date, 'HH:mm DD.MM.YYYY').toDate()
    };
}

async function loadPosts(postsList) {
    for (let i = 0; i < postsList.length; i++) {
        const post = postsList[i];

        console.log('post.link', post.link);
        const { body, date } = await loadPostByLink(post.link);

        await News.create({
            id: getHash(post.link),
            title: post.title,
            link: post.link,
            date,
            body,
        });
    }
}

module.exports = {
    loadPosts,
    loadPostByLink,
    loadArchiveByDay,
    loadDayPortion,
}


