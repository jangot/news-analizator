const { Op } = require('sequelize');
const { News } = require('../models');

async function getPostsByDay(day, month, year = 2024) {
    const specificDate = `${year}-${month}-${day}`;

    console.log(specificDate)
    const startOfDay = new Date(specificDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Конец дня (последняя секунда)
    const endOfDay = new Date(specificDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        return await News.findAll({
            where: {
                date: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });
    } catch (error) {
        console.error('Ошибка при получении новостей за конкретный день:', error);
        throw error;
    }
}

module.exports = {
    getPostsByDay
};
