const fs = require('fs/promises');

function setLeadingZeros(v, c = 2) {
    return String(v).padStart(c, '0');
}

function fileExists(path) {
    return fs.stat(path).then(() => true, () => false)
}

function wait(time) {
    console.log('waiting', time);
    return new Promise((resolve) => {
        setTimeout(resolve, Number(time));
    });
}

module.exports = {
    setLeadingZeros,
    fileExists,
    wait,
}
