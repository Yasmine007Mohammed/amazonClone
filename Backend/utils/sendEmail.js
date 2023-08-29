const nodeMailer=require('nodemailer')
const sendEmail=async (opations)=>{
    //1- create transporter is object (service that send emails)
    const transporter=nodeMailer.createTransport({
        service:'gmail',
        host:process.env.host,
        port:process.env.port,//if secure==false port==465
        secure: true,
        auth:{
            user:process.env.authUser,
            pass:process.env.authPass,
        }
    })
    //2- make some options for emails (like to ,from ,html formate)
    const emailOpation={
        from:'amazon Website <saturdayteam2266@gmail.com>',
        to:opations.email,
        subject:opations.subject,
        text:opations.message
    }
    //3- send email
    await transporter.sendMail(emailOpation)
}

module.exports=sendEmail;