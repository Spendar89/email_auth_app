var express = require('express'),
    _ = require('lodash'),
    passwordless = require('./../server/lib/passwordless.js').start(),
    router = express.Router();


router.get('/test', function(req, res) {
    res.json("I am running playa!")
});

router.post('/send_token',
    passwordless.sendToken(),
    function(req, res) {
        var authId = req.passwordless.uidToAuth;
        res.json({authId: authId});
    }
);

router.post('/authenticate',
    passwordless.acceptToken({
        allowPost: true
    }),
    passwordless.restricted(),
    function(req, res) {
        res.json({
            user: req.user
        });
    }
)

module.exports = router;
