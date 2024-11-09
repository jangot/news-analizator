const fs = require('fs/promises');

function setLeadingZeros(v, c = 2) {
    return String(v).padStart(c, '0');
}

function fileExists(path) {
    return fs.stat(path).then(() => true, () => false)
}

module.exports = {
    setLeadingZeros,
    fileExists,
}
