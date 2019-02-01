const express = require('express')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const serviceKey = require('./')

const app = express()
const port = 1961

app.post('/', (req, res) => {
    const email = 'collin.argo@gmail.com'

    const jwtClient = new google.auth.JWT(
        serviceKey.client_email,
        null,
        serviceKey.private_key,
        ['https://mail.google.com/'],
        email
    )

    jwtClient.authorize((error, tokens) => {
        if (error) {
            res.json({success: false, error: error})
            return
        }

        console.log('Successfully got access token! token: ', tokens)
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: email,
                clientId: serviceKey.client_id,
                privateKey: serviceKey.private_key,
                accessToken: tokens.access_token,
                expires: tokens.expiry_date
            }
        })

        transporter.sendMail({
            from: 'An Example <' + email + '>',
            to: req.body.email,
            subject: 'Apple and Banana',
            html: '<p>Your html here</p>' // or text: 'hello world'
        }, (error, info) => {
            if (error) { res.json({success: false, error, info})
            } else { res.json({success: true, info}) }
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))