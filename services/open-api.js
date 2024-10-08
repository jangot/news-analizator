const { OpenAI } = require('openai');
const config = require('../configuration');

const openai = new OpenAI({ apiKey: config.openApi.key});

async function getKeywords(newsArray) {
    // Создаем контент запроса с хэшами для каждой новости
    const content = newsArray.map(({ id, title, body }) =>
        `Новость ID: ${id}\n${title}\n\n${body}`
    ).join('\n\n---\n\n');

    const requestContent = `
    Выдели ключевые слова из текста новостей и верни их в формате:
    ID: <hash>, ключевые слова,
    где ключевые слова разделены запятой.
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

    // Извлечение ключевых слов для каждой новости по хэшу
    keywordLines.forEach(line => {
        const match = line.match(/ID:\s*([^\s,]+),\s*(.*)/);
        if (match) {
            const id = match[1].trim();
            const keywordsString = match[2].trim();
            keywords[id] = keywordsString.split(',').map(k => k.trim());
        }
    });

    return keywords; // Возвращаем объект с ключевыми словами для каждой новости
}

module.exports = { getKeywords };
