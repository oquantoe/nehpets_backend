const express = require("express");
const bodyParser = require('body-parser');
const { createServer } = require("http");
const { check, oneOf, validationResult } = require('express-validator');
const inlineCSS = require('inline-css');

const API_KEY = '51cff3b7a19525059f3bdecce9a1cbf7-c9746cf8-4b2d03d7';
const DOMAIN = 'https://api.mailgun.net/v3/sandbox1a4549f092224697ab968749f4987b8a.mailgun.org';

const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const httpServer = createServer(app);

app.route("/").get((req, res) => {
  res.json("Hey there welcome to Nehpets Backend")
});

const sendMail = (sender_email, receiver_email,
  email_subject, email_body, req, res, next) => {

  // const data = {
  //   "from": sender_email,
  //   "to": receiver_email,
  //   "subject": email_subject,
  //   "text": email_body
  // };

  // mailgun.messages().send(data, (error, body) => {
  //   if (error) console.log(error)
  //   else console.log(body);
  // });

  run().catch(err => console.log(err));

  async function run() {
    const html = await inlineCSS(email_body, { url: ' ' });

    await mailgun.messages().send({
      from: sender_email,
      to: receiver_email,
      subject: email_subject,
      html,
      text: 'Hello, Nehpets'
    });
  }
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

    const receiver_email = 'danielufeli@gmail.com'
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
