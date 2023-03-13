const express = require("express");
const bodyParser = require('body-parser');
const { createServer } = require("http");
const { check, oneOf, validationResult } = require('express-validator');
const Paystack = require('paystack')('sk_test_5001f1f18257a2b086d9b96a32acecb0a4e93356');
const inlineCSS = require('inline-css');
const nodemailer = require("nodemailer");
const cors = require('cors');

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOpts));
const httpServer = createServer(app);

app.route("/").get((req, res) => {
  res.json("Hey there welcome to Nehpets Backend")
});

const sendMail = (sender_email, receiver_email,
  email_subject, email_body, req, res, next) => {

  async function main() {
    // SMTP config
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.API_KEY,
      }
    }); // Send the email
    let info = await transporter.sendMail({
      from: `"Enquiry Form Nehpets" <nehpets@buynigeriaonline.com>`,
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
    check('age').exists(),
    check('phoneNumber').exists(),
    check('mailingAddress').exists(),
    check('country').exists(),
    check('email').exists(),
  ]
]), (req, res, next) => {
  try {
    validationResult(req).throw();


    const {
      firstName,
      lastName,
      age,
      phoneNumber,
      mailingAddress,
      country,
      nationality,
      highestLevelEducation,
      immigratingToCanada,
      maritalStatus,
      children,
      howManyMembersHouseHold,
      primaryReason,
      currentOccupation,
      transcriptsEvaluated,
      canadianOfficialLanguage,
      firstLanguage,
      relativesOrFriendsLivingInCanada,
      amountOfSettlementFunds,
      writtenIELTS,
      ieltsMonthYear,
      provinceMigrating,
      aboutNephetsConsults,
      email,
    } = req.body;

    const receiver_email = 'nickacad26@gmail.com, sahodu06@gmail.com'
    const email_subject = 'Sent from Nehpets Booking Form';

    const email_body = `<div>
      <style>
        h1 {color: green; }
      </style>

      <h1>Hello, Admin Find Below Details of the Booking Form Submitted on Nehpets Site</h1>
      <p>First Name: ${firstName}</p>
      <p>Last Name: ${lastName}</p>
      <p>Phone Number: ${phoneNumber}</p>
      <p>Email: ${email}</p>
      <p>Age: ${age}</p>
      <p>Current Mailing Address: ${mailingAddress}</p>
      <p>Nationality(Country of Birth): ${nationality}</p>
      <p>Country of Residence: ${country}</p>
      <p>Highest Level of Education for you and your partner: ${highestLevelEducation}</p>
      <p>How soon are you Immigrating to Canada: ${immigratingToCanada}</p>
      <p>Marital Status: ${maritalStatus}</p>
      <p>Do you have any dependent Children: ${children}</p>
      <p>How many members of your household plan to immigrate with you: ${howManyMembersHouseHold}</p>
      <p>What is the Primary Reason for immigrating to canada: ${primaryReason}</p>
      <p>Current Occupation: ${currentOccupation}</p>
      <p>Have you had you Transcripts Evaluated by Canada evalucation service: ${transcriptsEvaluated}</p>
      <p>Which Canadian Official Language do you speak: ${canadianOfficialLanguage}</p>
      <p>What is your First Language Spoken Fluently: ${firstLanguage}</p>
      <p>Do you have Relatives or Friends Living in Canada: ${relativesOrFriendsLivingInCanada}</p>
      <p>Amount of Settlement Funds Available: ${amountOfSettlementFunds}</p>
      <p>Have you Written IELTS Exam: ${writtenIELTS}</p>
      <p>IELTS Month and Year: ${ieltsMonthYear}</p>
      <p>What Province are you interested in Migrating to: ${provinceMigrating}</p>
      <p>How did you hear about Nephets Consults: ${aboutNephetsConsults}</p>
    </div>`;
    
    sendMail(email, receiver_email, email_subject, email_body);

    return res.status(200).json({
      message: 'Email sent successfully',
      data: req.body
    });

  } catch (err) {
    console.log(err)
    return res.status(400).json({ errors: err.array() });
  }
});

app.post('/book', oneOf([
  [
    check('firstName').exists(),
    check('lastName').exists(),
    check('phoneNumber').exists(),
    check('email').exists(),
  ]
]), (req, res, next) => {
  try {
    validationResult(req).throw();

    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      purpose,
      ieltsReg,
      ieltsExamDate,
      tutorial,
      studyMaterials,
      consultation,
      examinationLocation,
    } = req.body;

    const receiver_email = 'nickacad26@gmail.com, sahodu06@gmail.com'
    const email_subject = 'Sent from Nehpets Booking Form';

    const email_body = `<div>
      <style>
        h1 {color: green; }
      </style>

      <h1>Hello, Admin Find Below Details of the Booking Form Submitted on Nehpets Site</h1>
      <p>First Name: ${firstName}</p>
      <p>Last Name: ${lastName}</p>
      <p>Phone Number: ${phoneNumber}</p>
      <p>Email: ${email}</p>
      <p>Address: ${address}</p>
      <p>Purpose: ${purpose}</p>
      <p>Ielts Registration: ${ieltsReg}</p>
      <p>Ielts Exam Date: ${ieltsExamDate}</p>
      <p>Tutorial: ${tutorial}</p>
      <p>Study Materials: ${studyMaterials}</p>
      <p>Consultation: ${consultation}</p>
      <p>Examination Location: ${examinationLocation}</p>
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

app.post('/pay', oneOf([
  [
    check('amount').exists(),
    check('email').exists(),
  ]
]), (req, res, next) => {
  try {
    validationResult(req).throw();

    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      amount
    } = req.body;

    Paystack.transaction.initialize({
      email: email,
      amount: parseInt(amount) * 100 // in kobo
    }).then(function(body){
      // send the authorization_url in the response to the client to redirect them to
      // the payment page where they can make the payment
      // res.redirect(body.data.authorization_url);
      res.status(200).json({
        success: true,
        url: body.data.authorization_url
      });
    });

    // const receiver_email = 'nickacad26@gmail.com, sahodu06@gmail.com'
    // const email_subject = 'Sent from Nehpets Booking Form';

    // const email_body = `<div>
    //   <style>
    //     h1 {color: green; }
    //   </style>

    //   <h1>Hello, Admin Find Below Details of the Booking Form Submitted on Nehpets Site</h1>
    //   <p>First Name: ${firstName}</p>
    //   <p>Last Name: ${lastName}</p>
    //   <p>Phone Number: ${phoneNumber}</p>
    //   <p>Email: ${email}</p>
    //   <p>Address: ${address}</p>
    //   <p>Purpose: ${purpose}</p>
    //   <p>Ielts Registration: ${ieltsReg}</p>
    //   <p>Ielts Exam Date: ${ieltsExamDate}</p>
    //   <p>Tutorial: ${tutorial}</p>
    //   <p>Study Materials: ${studyMaterials}</p>
    //   <p>Consultation: ${consultation}</p>
    //   <p>Examination Location: ${examinationLocation}</p>
    // </div>`;

    // sendMail(email, receiver_email, email_subject, email_body);

    // return res.status(200).json({
    //   message: 'Email sent successfully',
    //   data: req.body
    // });

  } catch (err) {
    return res.status(400).json({ errors: err.array() });
  }
});


httpServer.listen(3000);
