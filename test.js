const express = require('express')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const serviceKey = {
    "type": "service_account",
    "project_id": "art-gallery-230404",
    "private_key_id": "f96f341c9a4aa70645b9d6a5695d91319bab9bbe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDjt4EiZ6WvhPze\nzR0xWVYRUyRIvcOaU9YZnl8waQ669BwlKmUiChqCIaPcWd+bAnP9l8OE2c2+cW/U\n3t1bIOAVGt0hzOmgPeB9av5OtANgGDgQnwCgJPlipuKlJ6DNZO+giHxA/V05EgMC\nwPnlEZi7U2N450aBw4Sz2+PAmW+8aJ116dKBEXI60+ORvT4WwD0hpGgsK5ob0qhe\nICNgxC45/h/dP40rjMyOV3k9MSrVNbANc80p05oPn+gLpyRaVfG1jUEUnBmMneAL\nVjTCKpNx+ncNJZ1wGBel8D0bNqW1sdyHhV1T6P3j7whyIjAMMh8qhaUoTyY057fw\nI3WeObwfAgMBAAECggEACogwbwUm27kecdMjq9gwlm5R/YQs5gnv8J9kUlcXyt+R\nO+bRLbyGVjrmTNANF4AK4N+7KX1iQVkWqiOPTrCROtpvqn7DSFJ3343/uKCXOScC\nDUK/JnAdkZC4LmChf1A0r7ZK+q9n4ihKN81/wVMmIpITcJelVBBxmB/8UY3jnt+M\nIXRl2fMRgvc4JAnLCvsQYurqK4TASYYCbuL/81Fq2pKnncnT6a7BldL8lw0sQLat\nSPPkC7CpmPndPsR1sWvZcqGAwHAZe46VppfyPpBslwfNbonX9sm+581CDBTg95YK\nOwobsrLKZDFxtxcSfF8MnPwY0EGy3CLIG9Icy1PRAQKBgQDygK4bDO4XLbGYaGiQ\nblTrsWqArFbmjSvvGyjQwNhXVjU+M8CiScBs8x6e3UCsebBgWxqLrtTciGskaTpP\n3ioa5m8YGG4iB9PLclrjryC5YZk+ieSDmr96I6bUtZN2MXtTchPmJupfE4kMWnXm\nPLnwONte2C3EGDXzFPCEsrJiGQKBgQDwZCWg681nmrxOkJ5T6t5r4m8m6yBt4oB6\nPKbKzxoWvY69cHfd+SVcEQBYGb9ER3Q2p0nk4Bi4Na81d6O1DuJmekLPe+Hn0eJN\nXboB2QGz5dFNv5lwQ7Ws/lTjVDxvLUlzXxlca0hwIRQbM+i9SFulvqFgcjoLXC4u\nrXEf+2SG9wKBgQDfUwYDv1qcWeZNlwmEyTbHf7G3If89fxDQuFBUPuR9OdT6napv\nSkA9lX/Dibp/m+mEMyI1NSKunasd8xJSbySTdVcl94mlKVQw7fUp7SPT1T/NSiv5\nzs87ag2/oiBVHqiWZl5Q+9GnEVSK3dvp1k7eHV5Y7/jlt+4nGEePzQleMQKBgQDH\nBuNwnEpv4NjPY0TyzZ5hTBQi8MDkuYcNrXGasGU1NrQbfCaCDWk1FI5oYsjMyywY\no+C2MiPFQA1UAz3zBePEXK08A6FBwa/Pxi3eocCbJUdpS5zKKgUcuWWm4XM3yRLr\nBm2E6v4KeBihfRTQwju+uln59BjClwtVchwbEpRkeQKBgQCE9dEAz6NP6zvVj2TE\nFTorLSZXac8ed+WW3+FeXsX+nc9oWNIW098zCCY9HFKQ4q90LmAf4zkRBg1onlCH\no6tsdnx3kWHbNwGAu21rdFrMfjdDlATN6zA6IUa+PwRHmhN2MkyDX1zs02g+komS\nZu4qTB6X6+vSmh1T1TVmhXEvgg==\n-----END PRIVATE KEY-----\n",
    "client_email": "art-gallery@art-gallery-230404.iam.gserviceaccount.com",
    "client_id": "103073303970424573237",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/art-gallery%40art-gallery-230404.iam.gserviceaccount.com"
  }

const app = express()
const port = 1961

app.post('/', (req, res) => {
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

        console.log('checking the transporter', transporter)

        transporter.sendMail({
            from: 'An Example <' + email + '>',
            to: 'collin.argo@gmail.com',
            subject: 'Apple and Banana',
            html: '<p>Your html here</p>' // or text: 'hello world'
        }, (error, info) => {
            if (error) { res.json({success: false, error, info})
            } else { res.json({success: true, info}) }
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))