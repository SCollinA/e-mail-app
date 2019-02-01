const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let transporter = nodemailer.createTransport({
    sendmail: true,
    path: '/usr/sbin/sendmail'
    // host: "smtp.gmail.email",
        // port: 465, // 465 is ssl, 587 is tls
        // secure: true, // true for 465, false for other ports
        // auth: {
        //   user: account.user, // generated ethereal user
        //   pass: account.pass // generated ethereal password
        // }
})

app.post('/contactKelly', (req, res) => {
    const { name, email, message, artwork } = req.body
    transporter.sendMail({
        from: 'contact@example.com',
        to: 'collin.argo@gmail.com',
        subject: 'art-gallery contact',
        text: `${name}${email}${message}${artwork.title}`
    }, (err, info) => {
        console.log(info.envelope)
        console.log(info.messageId)
        res.send(info)
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))