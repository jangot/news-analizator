function setLeadingZeros(v, c = 2) {
    return String(v).padStart(c, '0');
}

module.exports = {
    setLeadingZeros,
}
