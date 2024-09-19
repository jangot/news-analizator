const axios = require('axios');
const { JSDOM } = require('jsdom');

module.exports = {
    loadPostByLink: async (link) => {
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
}
