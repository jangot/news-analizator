const { OpenAI } = require('openai');

const {  News } = require('../models');
const config = require('../configuration');
const {runScript} = require('../services/run-script');

const openai = new OpenAI({ apiKey: config.openApi.key});

runScript(async () => {
    const one = await News.findOne({ where: {} });

    if (!one) {
        throw new Error('No news');
    }

    const text = `${one.title}\n\n${one.body}`;
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
                role: 'user',
                content: `Выдели ключевые слова из следующего текста:\n\n${text}`,
            },
        ],
    });

    console.log(completion.choices[0].message);
}, 'Keywords');
