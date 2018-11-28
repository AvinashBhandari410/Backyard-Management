




var express= require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var helper = require('sendgrid').mail;
const async = require('async');
var mongoose = require('mongoose');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

function sendEmail(
    parentCallback,
    fromEmail,
    toEmails,
    subject,
    textContent,
    htmlContent
  ) {
    const errorEmails = [];
    const successfulEmails = [];

const sg = require('sendgrid')('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');

async.parallel([
      function(callback) {
        // Add to emails
        for (let i = 0; i < toEmails.length; i += 1) {
          // Add from emails
          const senderEmail = new helper.Email(fromEmail);

          // Add to email
          const toEmail = new helper.Email(toEmails[i]);

          // HTML Content
          const content = new helper.Content('text/html', htmlContent);

          const mail = new helper.Mail(senderEmail, subject, toEmail, content);

          var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
          });

          sg.API(request, function (error, response) {
            console.log('SendGrid');
            if (error) {
              console.log('Error response received');
            }
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
          });
        }

        // return
        callback(null, true);
      }
    ], function(err, results) {
      console.log('Done');
    });

    parentCallback(null,
      {
        successfulEmails: successfulEmails,
        errorEmails: errorEmails,
      }
    );
}

router.post('/sendmail', function (req, res, next) {
    async.parallel([
      function (callback) {
        sendEmail(
          callback,
          req.body.from_email_address,
          [req.body.to_email_address],
          req.body.subject,
          req.body.mailbody,
          '<p style="font-size: 32px;">HTML Content</p>'
        );
      }
    ], function(err, results) {
      res.send({
        success: true,
        message: 'Emails sent',
        successfulEmails: results[0].successfulEmails,
        errorEmails: results[0].errorEmails,
      });
    });

 });

 module.exports=router;