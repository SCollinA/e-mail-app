const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const serviceKey = require('./service_key.json')

const app = express()
const port = 1961
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post('/contactKelly', (req, res) => {
    console.log('received request')
    console.log(req.body)
    const { name, contactEmail, message, artwork } = req.body

    const email = 'hi@collinargo.com'

    const jwtClient = new google.auth.JWT(
        serviceKey.client_email,
        null,
        serviceKey.private_key,
        ['https://mail.google.com/'],
        null,
        serviceKey.private_key_id
    )

    jwtClient.authorize((error, tokens) => {
        if (error) {
            console.log('could not authorize', error)
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
                serviceClient: serviceKey.client_id,
                privateKey: serviceKey.private_key,
                accessToken: tokens.access_token,
                expires: tokens.expiry_date
            }
        })

        transporter.sendMail({
            from: 'An Example <' + contactEmail + '>', // this is being overwritten by gmail
            to: 'collin.argo@gmail.com',
            subject: 'art gallery contact',
            text: `${name}. ${message}. ${artwork}` 
        }, (error, info) => {
            if (error) { res.json({success: false, error, info})
            } else { res.json({success: true, info}) }
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))