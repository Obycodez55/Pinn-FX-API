const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");
const CustomError = require("./CustomError");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "obycodez55@gmail.com",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN
  }
});

const sendPasswordResetEmail = async (options) => {
  transporter.accessToken  = await oAuth2Client.getAccessToken();
 
  ejs.renderFile(
    __dirname + "/../views/password-email.ejs",
   {code: options.message},
    async (err, template) => {
      if (err) {
        console.log(err);
      } else {
        const emailOptions = {
          from: "PinnFx support@pinnfx.com <obycodez55@gmail.com>",
          to: options.email,
          subject: options.subject,
          text: options.message,
          html: template,
          attachments: [
            {
              filename: "header3.png",
              path: __dirname + "/../views/images/header3.png",
              cid: "header3.png"
            },
            {
              filename: "logo.png",
              path: __dirname + "/../views/images/logo.jpg",
              cid: "logo.png"
            },
            {
              filename: "facebook.png",
              path: __dirname + "/../views/images/facebook2x.png",
              cid: "facebook.png"
            },
            {
              filename: "instagram.png",
              path: __dirname + "/../views/images/instagram2x.png",
              cid: "instagram.png"
            },
            {
              filename: "twitter.png",
              path: __dirname + "/../views/images/twitter2x.png",
              cid: "twitter.png"
            },
            {
              filename: "Beefree-logo.png",
              path: __dirname + "/../views/images/Beefree-logo.png",
              cid: "Beefree-logo.png"
            }
          ]
        };

        await transporter.sendMail(emailOptions);
      }
    }
  );
};

const sendInvestReturnEmail = async (options) => {
  transporter.accessToken  = await oAuth2Client.getAccessToken();
  ejs.renderFile(
    __dirname + "/../views/invest-return-email.ejs",
   options.info,
    async (err, template) => {
      if (err) {
        console.log(err);
      } else {
        const emailOptions = {
          from: "PinnFx support@pinnfx.com <obycodez55@gmail.com>",
          to: options.email,
          subject: options.subject,
          text: options.message,
          html: template,
          attachments: [
            {
              filename: "logo.png",
              path: __dirname + "/../views/images/logo.jpg",
              cid: "logo.png"
            }]
          //   {
          //     filename: "logo.png",
          //     path: __dirname + "/../views/images/logo.png",
          //     cid: "logo.png"
          //   },
          //   {
          //     filename: "facebook.png",
          //     path: __dirname + "/../views/images/facebook2x.png",
          //     cid: "facebook.png"
          //   },
          //   {
          //     filename: "instagram.png",
          //     path: __dirname + "/../views/images/instagram2x.png",
          //     cid: "instagram.png"
          //   },
          //   {
          //     filename: "twitter.png",
          //     path: __dirname + "/../views/images/twitter2x.png",
          //     cid: "twitter.png"
          //   },
          //   {
          //     filename: "Beefree-logo.png",
          //     path: __dirname + "/../views/images/Beefree-logo.png",
          //     cid: "Beefree-logo.png"
          //   }
          // ]
        };

        await transporter.sendMail(emailOptions);
      }
    }
  );
};

module.exports = { sendPasswordResetEmail, sendInvestReturnEmail };
