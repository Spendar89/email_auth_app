'use strict'

var passwordless = require('passwordless'),
    _ = require('lodash'),
    MongoStore = require('passwordless-mongostore'),
    nodemailer = require("nodemailer");

const MONGO_PATH = 'mongodb://localhost/email-auth-app',
    SES_USER =  'AKIAIT6ARWUP3T6ZQMBQ',
    SES_PASSWORD = 'AlvZ/3MgmYWorVnWu6vFTsrkLfnH6tMbuKGD72qYSHPf';

var transporter = nodemailer.createTransport({
    service: 'ses',
    auth: {
        user: SES_USER,
        pass: SES_PASSWORD
    }
});

passwordless.init(
    new MongoStore(MONGO_PATH),
    { allowTokenReuse: true  }
);

passwordless.addDelivery(
    function(tokenToSend, uidToSend, user, callback) {
        var text = `Yooo Your Auth Code Is ${tokenToSend}`;

        var mailOptions = {
            from: 'jakesendar@gmail.com', 
            to: user.email,
            subject: 'Token for Doc App Test',
            text: text, 
            html: `<b>${text}</b>`
        }

        transporter.sendMail(
            mailOptions, 
            function(err, info){
                if (err) console.log(err);
                callback(err);
            }
        );
    },
    {
        tokenAlgorithm: function() {
            var n = _.random(10000, 99999);
            return n.toString();
        }
    }
);


module.exports = passwordless;
