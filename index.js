const express = require("express");
const bodyParser = require('body-parser');
const { createServer } = require("http");
const { check, oneOf, validationResult } = require('express-validator');
const inlineCSS = require('inline-css');
const nodemailer = require("nodemailer");
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const httpServer = createServer(app);

app.route("/").get((req, res) => {
  res.json("Hey there welcome to Nehpets Backend")
});

const sendMail = (sender_email, receiver_email,
  email_subject, email_body, req, res, next) => {

  async function main() {
    // SMTP config
    const transporter = nodemailer.createTransport({
      host: 'mail.buynigeriaonline.com',
      port: 465,
      secure: true,
      auth: {
        user: 'nehpets@buynigeriaonline.com',
        pass: 'Domi@2020'
      }
    }); // Send the email
    let info = await transporter.sendMail({
      from: `"Web Form" <${sender_email}>`,
      to: receiver_email, // Test email address
      subject: email_subject,
      text: "Email body in plain text",
      html: email_body,
    });
    console.log("Message sent: %s", info.messageId); // Output message ID
    console.log("View email: %s", nodemailer.getTestMessageUrl(info)); // URL to preview email
  }
  // Catch any errors and output them to the console
  main().catch(console.error);
}

app.post('/form', oneOf([
  [
    check('firstName').exists(),
    check('lastName').exists(),
    check('mobileNumber').exists(),
    check('age').exists(),
    check('maritalStatus').exists(),
    check('email').exists(),
  ]
]), (req, res, next) => {
  try {
    validationResult(req).throw();

    const {
      firstName,
      lastName,
      mobileNumber,
      age,
      maritalStatus,
      nationality,
      address,
      email,
      country,
      doYouHaveChildren,
      listAllMembers,
      job,
      passport,
      terms
    } = req.body;

    const receiver_email = 'nickacad26@gmail.com'
    const email_subject = 'Sent from Nehpets Enquiry Form';

    const email_body = `<div>
      <style>
        h1 {color: green; }
      </style>

      <h1>Hello, Admin Find Below Details of the Form Submitted on Nehpets Site</h1>
      <p>First Name: ${firstName}</p>
      <p>Last Name: ${lastName}</p>
      <p>Mobile Number: ${mobileNumber}</p>
      <p>Age: ${age}</p>
      <p>Marital Status: ${maritalStatus}</p>
      <p>Nationality: ${nationality}</p>
      <p>Address: ${address}</p>
      <p>Email: ${email}</p>
      <p>Country: ${country}</p>
      <p>Do you have children: ${doYouHaveChildren}</p>
      <p>List all members: ${listAllMembers}</p>
      <p>Job: ${job}</p>
      <p>Passport: ${passport}</p>
      <p>Terms: ${terms}</p>
    </div>`;

    sendMail(email, receiver_email, email_subject, email_body);

    return res.status(200).json({
      message: 'Email sent successfully',
      data: req.body
    });

  } catch (err) {
    return res.status(400).json({ errors: err.array() });
  }
});


httpServer.listen(3000);
