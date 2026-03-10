require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4
});
// ✅ Verify Gmail connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail connection failed:', error.message);
  } else {
    console.log('✅ Gmail connected successfully - ready to send emails');
  }
});

app.get('/', (req, res) => {
  res.send('Sri Laxmi Industries - Server is running ✅');
});

app.post('/send-quotation', async (req, res) => {
  const { name, company, email, phone, country, product, specifications } = req.body;

  const ownerMail = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Quotation Request — ${product} from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a0f1e; padding: 24px; text-align: center;">
          <h1 style="color: #e8a020; margin: 0; font-size: 1.4rem;">SRI LAXMI INDUSTRIES</h1>
          <p style="color: #8fa3b8; margin: 4px 0 0; font-size: 0.8rem;">NEW QUOTATION REQUEST</p>
        </div>
        <div style="background: #f9f9f9; padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;">Full Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Company</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Phone / WhatsApp</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Country</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${country}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Product Type</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong style="color: #e8a020;">${product}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; vertical-align: top;">Specifications</td>
              <td style="padding: 10px 0;">${specifications || 'Not provided'}</td>
            </tr>
          </table>
        </div>
        <div style="background: #0a0f1e; padding: 16px; text-align: center;">
          <p style="color: #8fa3b8; margin: 0; font-size: 0.75rem;">Sri Laxmi Industries — Precision Engineering</p>
        </div>
      </div>
    `
  };

  const customerMail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `We received your quotation request — Sri Laxmi Industries`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a0f1e; padding: 24px; text-align: center;">
          <h1 style="color: #e8a020; margin: 0; font-size: 1.4rem;">SRI LAXMI INDUSTRIES</h1>
          <p style="color: #8fa3b8; margin: 4px 0 0; font-size: 0.8rem;">PRECISION ENGINEERING · INDIA</p>
        </div>
        <div style="background: #f9f9f9; padding: 32px;">
          <h2 style="color: #0a0f1e; margin-top: 0;">Thank you, ${name}!</h2>
          <p style="color: #444; line-height: 1.7;">
            We have received your quotation request for <strong>${product}</strong>. 
            Our team will review your requirements and get back to you within <strong>24 hours</strong>.
          </p>
          <div style="background: #fff; border-left: 4px solid #e8a020; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">If you have any urgent questions:</p>
            <p style="margin: 8px 0 0; font-weight: bold;">
              📧 ${process.env.EMAIL_USER}<br>
              💬 WhatsApp: +91 XXXX XXX XXX
            </p>
          </div>
          <p style="color: #444; line-height: 1.7;">
            Best regards,<br>
            <strong>Sri Laxmi Industries Team</strong>
          </p>
        </div>
        <div style="background: #0a0f1e; padding: 16px; text-align: center;">
          <p style="color: #8fa3b8; margin: 0; font-size: 0.75rem;">Sri Laxmi Industries · Precision Engineering · India</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(ownerMail);
    console.log('✅ Owner email sent to:', process.env.RECEIVER_EMAIL);
    await transporter.sendMail(customerMail);
    console.log('✅ Customer email sent to:', email);
    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});