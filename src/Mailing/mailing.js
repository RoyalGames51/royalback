require("dotenv").config();

const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

module.exports = async (userName, email, preSubject, message) => {


    console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN);


    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAUTH2",
                    user: "royalgames2025@gmail.com",
                    pass: "eylh ynjd efsc kkhv",
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                },
            })
            const mailOptions = {
                from: '"RoyalGames.me!!" <royalgames2025@gmail.com>', // sender address
                to: email, // list of receivers
                subject: `${preSubject}`,
                //text: `${message}`, // plain text body
                html: `${message}`, // html body
            }


            transporter.verify((error, success) => {
                if (error) {
                    console.error("Error de conexión:", error.message);
                } else {
                    console.log("Conexión exitosa al servidor SMTP");
                }
            });

            try {
                console.log("antes de enviar");
                const result = await transporter.sendMail(mailOptions);
                console.log("después de enviar", result);
            } catch (error) {
                console.error("Error al enviar el correo:", error.message);
            }


            return result;
        } catch (error) {
            throw new Error(`Error al enviar correo. ${error.message}`);
        }
    }
    sendMail()
        .then(result => ('¡Envío exitoso!'))
        .catch(error => (error.message));
}