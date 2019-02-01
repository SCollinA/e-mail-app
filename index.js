const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const nodemailer = require('nodemailer')

const app = express()
const port = 1961
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// let transporter = nodemailer.createTransport({
//     sendmail: true,
//     newline: 'unix',
//     path: '/usr/sbin/sendmail'
// });
    // host: "smtp.gmail.email",
    //     port: 465, // 465 is ssl, 587 is tls
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //       user: account.user, // generated ethereal user
    //       pass: account.pass // generated ethereal password
    //     } 

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    // service: 'gmail',
    auth: {
        type: 'OAUTH2',
        user: process.env.E_MAIL, // generated ethereal user
        serviceClient: process.env.SERVICE_CLIENT,
        privateKey: process.env.PRIVATE_KEY,
        pass: 'notasecret'
    }
})  

app.post('/contactKelly', (req, res) => {
    console.log('received request')
    console.log(req.body)
    const { name, email, message, artwork } = req.body
    transporter.sendMail({
        from: 'collinargo@gmail.com',
        to: 'collin.argo@gmail.com',
        subject: 'art-gallery contact',
        text: `${name}${email}${message}${artwork}`
    }, (err, info) => {
        console.log(err)
        console.log(info.envelope)
        console.log(info.messageId)
        res.send(info)
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))