'use strict'

var passwordless = require('passwordless'),
    _ = require('lodash'),
    MongoStore = require('passwordless-mongostore'),
    nodemailer = require("nodemailer");

const MONGO_BASEPATH = process.env.MONGO_BASEPATH || 'mongodb://localhost',
    MONGO_URI = `${MONGO_BASEPATH}/email-auth-app`,
    SES_USER = process.env.SES_USER,
    SES_PASSWORD = process.env.SES_PASSWORD;


var passwordless = _.extend(passwordless, {

    validateEmail: function(user) {
        var users = ["jake.sendar@gmail.com", "jakesendar@gmail.com"];

        var isUserEmail = _.includes(users, user.email),
            isSciEmail = _.includes(user.email, "@scitexas.edu"),
            isClientApprovedEmail = user.id;

        return isClientApprovedEmail || isUserEmail || isSciEmail;
    },

    getAuthId: function(user, delivery, callback) {
        if (this.validateEmail(user)) {
            user.authId = _.random(10000, 99999);
        }

        callback(null, user.authId);
    },

    sendToken: function() {
        var getAuthId = this.getAuthId.bind(this);
        return this.requestToken(getAuthId);
    },

    start: function() {
        this.init(
            new MongoStore(MONGO_URI), {
                allowTokenReuse: true
            }
        );

        this.addDelivery(
            function(tokenToSend, uidToSend, user, callback) {
                var from = process.env.SES_EMAIL || 'jakesendar@gmail.com',
                    text = `Hi ${user.name}!  Your Confirmation Code is ${tokenToSend}`;

                var mailOptions = {
                    from: from,
                    to: user.email,
                    subject: `Confirmation Code for ${user.name}`,
                    text: text,
                    html: `<b>${text}</b>`
                };

                var transporter = nodemailer.createTransport({
                    service: 'ses',
                    auth: {
                        user: SES_USER,
                        pass: SES_PASSWORD
                    }
                });

                transporter.sendMail(
                    mailOptions,
                    function(err, info) {
                        if (err) console.log(err);
                        callback(err);
                    }
                );
            }, {
                tokenAlgorithm: function() {
                    var n = _.random(10000, 99999);
                    return n.toString();
                }
            }
        );

        return this;
    }
    
});

module.exports = passwordless;
