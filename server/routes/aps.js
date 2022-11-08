const express = require('express');
const { AuthenticationClient } = require('forge-server-utils');
const { APS_CLIENT_ID, APS_CLIENT_SECRET } = require('../../config.js');

let router = express.Router();
let authenticationClient = new AuthenticationClient(APS_CLIENT_ID, APS_CLIENT_SECRET);

router.get('/token', async function (req, res, next) {
    try {
        const result = await authenticationClient.authenticate(['viewables:read']);
        res.json(result);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
