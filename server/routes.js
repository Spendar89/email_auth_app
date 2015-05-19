var express = require('express'),
    _ = require('lodash'),
    passwordless = require('passwordless'),
    router = express.Router();

var users = [
    { authId: 1, email: 'jakesendar@gmail.com'  },
    { authId: 2, email: 'alice@example.com'  }

];

router.post('/send_token',
    passwordless.requestToken(
        function(user, delivery, callback) {
            // check if email has a whitelisted authId
            // TODO: pull from SCI employees db
            _.each(users, function(u) {
                if (u.email === user.email) {
                    return callback(null, u.authId)
                }
            });
            // If no whitleist, use authId from payload
            callback(null, user.authId);
        }
    ),
    function(req, res) {
        // authId is the same as user.id from either whitelisted 
        // users array or request payload 
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
