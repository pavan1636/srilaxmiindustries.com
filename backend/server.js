require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get('/', (req, res) => {
  res.send('Sri Laxmi Industries - Server is running ✅');
});

app.post('/send-quotation', async (req, res) => {
  const { name, company, email, phone, country, product, specifications } = req.body;

  const ownerHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background:#0a0f1e;padding:24px;text-align:center;">
      <h1 style="color:#e8a020;margin:0;font-size:1.4rem;">SRI LAXMI INDUSTRIES</h1>
      <p style="color:#8fa3b8;margin:4px 0 0;font-size:0.8rem;">NEW QUOTATION REQUEST</p>
    </div>

    <div style="background:#f9f9f9;padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;width:40%;">Full Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Company</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">${company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">${email}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">${phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Country</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">${country}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Product</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;"><strong style="color:#e8a020;">${product}</strong></td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;vertical-align:top;">Specifications</td>
          <td style="padding:10px 0;">${specifications || 'Not provided'}</td>
        </tr>
      </table>
    </div>

    <div style="background:#0a0f1e;padding:16px;text-align:center;">
      <p style="color:#8fa3b8;margin:0;font-size:0.75rem;">Sri Laxmi Industries — Precision Engineering</p>
    </div>
  </div>
  `;

  const customerHTML = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#0a0f1e;padding:24px;text-align:center;">
      <h1 style="color:#e8a020;margin:0;">SRI LAXMI INDUSTRIES</h1>
      <p style="color:#8fa3b8;font-size:0.8rem;">PRECISION ENGINEERING · INDIA</p>
    </div>

    <div style="background:#f9f9f9;padding:32px;">
      <h2>Thank you, ${name}!</h2>

      <p>
        We received your quotation request for
        <strong>${product}</strong>.
        Our team will contact you within 24 hours.
      </p>

      <p>
        If you have urgent questions please reply to this email.
      </p>

      <p>
        Best regards<br>
        <strong>Sri Laxmi Industries Team</strong>
      </p>
    </div>

    <div style="background:#0a0f1e;padding:16px;text-align:center;">
      <p style="color:#8fa3b8;margin:0;font-size:0.75rem;">
        Sri Laxmi Industries · Precision Engineering · India
      </p>
    </div>
  </div>
  `;

  try {

    // Email to Owner
    await resend.emails.send({
      from: 'Sri Laxmi Industries <info@srilaxmiindustries.com>',
      to: process.env.RECEIVER_EMAIL,
      subject: `New Quotation Request — ${product} from ${name}`,
      html: ownerHTML
      reply_to: email
    });

    console.log('Owner email sent');

    // Email to Customer
    await resend.emails.send({
      from: 'Sri Laxmi Industries <info@srilaxmiindustries.com>',
      to: email,
      subject: 'We received your quotation request — Sri Laxmi Industries',
      html: customerHTML
    });

    console.log('Customer confirmation email sent');

    res.status(200).json({ success: true, message: 'Emails sent successfully' });

  } catch (error) {

    console.error('Email error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});