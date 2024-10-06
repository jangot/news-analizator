const { OpenAI } = require('openai');

const {  News } = require('../models');
const config = require('../configuration');
const {runScript} = require('../services/run-script');

const openai = new OpenAI({ apiKey: config.openApi.key});

const LIMIT = 2200;

async function getKeywords(title, body) {
    const text = `${title}\n\n${body}`;
    const content = `
    Выдели ключевые слова из текста новости и верни эти ключевые слова одной строкой через запятую, без твоих комментариев,
    Мне нужно максимум 20 самых важных ключевых слова.
    вот эта новость:
    \n\n${text}
    `;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
                role: 'user',
                content,
            },
        ],
    });

    return completion.choices[0].message.content;
}

runScript(async () => {
    for (let i = 0; i < LIMIT; i++) {
        const news = await News.findOne({
            where: { keywords: null },
            order: [['date', 'ASC']],
        });
        if (!news) {
            console.log('No any news without keywords');
            return;
        }
        news.keywords = await getKeywords(news.title, news.body);
        console.log(i, '--------------------');
        console.log(news.title)
        console.log(news.keywords);
        await news.save();
    }
}, 'Keywords');
