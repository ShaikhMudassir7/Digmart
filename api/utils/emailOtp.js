var nodemailer = require("nodemailer")

exports.sendEmail = async({ email, subj, msg }) => {
    
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    
    const options = {
        from: process.env.EMAIL,
        to: email,
        subject: subj,
        text: msg,
    }
    
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err)
            return
        }
        console.log("Sent :- " + info.response)
    })
    
}



