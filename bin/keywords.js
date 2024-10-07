const { OpenAI } = require('openai');

const {  News } = require('../models');
const config = require('../configuration');
const {runScript} = require('../services/run-script');

const openai = new OpenAI({ apiKey: config.openApi.key});

const LIMIT = 5000;
const offset = Number(process.argv[2] || 0);
console.log('offset', offset);


async function getKeywordsList(newsArray) {
    // Создаем контент запроса с уникальными идентификаторами для каждой новости
    const content = newsArray.map(({ title, body }, index) =>
        `Новость ID${index + 1}:\n${title}\n\n${body}`
    ).join('\n\n---\n\n');

    const requestContent = `
    Выдели ключевые слова из текста новостей и верни их в формате:
    Новость ID1: ключевые слова,
    Новость ID2: ключевые слова,
    и так далее.
    Мне нужно максимум 20 самых важных ключевых слова для каждой новости.
    Вот эти новости:
    \n\n${content}
    `;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
                role: 'user',
                content: requestContent,
            },
        ],
    });

    // Обработка ответа
    const responseContent = completion.choices[0].message.content;

    // Разделение ответа на строки по новостям
    const keywordLines = responseContent.split('\n').filter(line => line.trim() !== '');
    const keywords = {};

    // Извлечение ключевых слов для каждой новости
    keywordLines.forEach(line => {
        const [newsLabel, keywordsString] = line.split(':');
        if (newsLabel && keywordsString) {
            keywords[newsLabel.trim()] = keywordsString.trim().split(',').map(k => k.trim());
        }
    });

    return keywords; // Возвращаем объект с ключевыми словами для каждой новости
}

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
    const requestParams = {
        where: { keywords: null },
        order: [['date', 'DESC']],
        offset
    }

    let news = await News.findOne(requestParams);

    while (news) {
        news.keywords = await getKeywords(news.title, news.body);
        console.log('');
        console.log('[TITLE]', news.title)
        console.log('[KEYWORDS]', news.keywords);
        await news.save();

        news = await News.findOne(requestParams);
    }
}, 'Keywords');
