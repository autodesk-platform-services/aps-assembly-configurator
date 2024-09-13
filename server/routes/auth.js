const express = require('express');
const { AuthenticationClient } = require('aps-sdk-node');
const { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_CALLBACK_URL, inDebugMode } = require('../../config.js');

const EmailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let router = express.Router();
let authenticationClient = new AuthenticationClient(APS_CLIENT_ID, APS_CLIENT_SECRET);

router.get('/login', async function (req, res, next) {
    if (inDebugMode()) {
        req.session.user_id = 'dev-test';
        req.session.user_name = 'Dev Test';
        res.redirect('/');
        return;
    }
    const url = authenticationClient.getAuthorizeRedirect(['user-profile:read', 'user:read'], APS_CALLBACK_URL);
    res.redirect(url);
});

router.get('/logout', async function (req, res, next) {
    delete req.session.access_token;
    delete req.session.refresh_token;
    delete req.session.expires_at;
    delete req.session.user_id;
    delete req.session.user_name;
    res.redirect('/');
});

router.get('/callback', async function (req, res, next) {
    try {
        const token = await authenticationClient.getToken(req.query.code, APS_CALLBACK_URL);
        req.session.access_token = token.access_token;
        req.session.refresh_token = token.refresh_token;
        req.session.expires_at = Date.now() + token.expires_in * 1000;
        const profile = await authenticationClient.getUserProfile(req.session.access_token);
        // Clean up the user name if it's an email
        if (EmailRegExp.test(profile.name.toLowerCase())) {
            profile.name = profile.name.substr(0, profile.name.indexOf('@'));
        }
        req.session.user_id = profile.sub;
        req.session.user_name = profile.name;
        res.redirect('/');
    } catch(err) {
        next(err);
    }
});

router.get('/user.js', async function (req, res, next) {
    if (req.session && req.session.user_id && req.session.user_name) {
        res.type('.js').send(`
            const USER = { id: "${req.session.user_id}", name: "${req.session.user_name}" };
            const DEBUG_MODE = ${inDebugMode()};
        `);
    } else {
        res.type('.js').send(`const USER = null; const DEBUG_MODE = false;`);
    }
});

module.exports = router;
