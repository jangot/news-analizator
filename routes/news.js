const express = require('express');
const axios = require('axios');

const config = require('../configuration');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const { data } = axios.get(`${config.riaUrl}/20240918/index.xml`)
  res.send('respond with a resource');
});

module.exports = router;
