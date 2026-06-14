const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Configure AWS SES Client
const sesConfig = {};
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  sesConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}
sesConfig.region = process.env.AWS_REGION || "eu-west-1";

const sesClient = new SESClient(sesConfig);

/**
 * Sends B2B enquiry emails via AWS SES (to both owner/business and the customer)
 * @param {object} enquiryData
 * @returns {Promise<{success: boolean, error?: string, mocked?: boolean}>}
 */
async function sendEnquiryEmail(enquiryData) {
  const fromEmail = process.env.SES_FROM_EMAIL;
  const toEmail = process.env.SES_TO_EMAIL;

  if (!fromEmail || !toEmail) {
    console.warn(
      "AWS SES: SES_FROM_EMAIL or SES_TO_EMAIL is not set. Skipping AWS SES transmission.",
    );
    console.log(
      "========================================================================",
    );
    console.log("AWS SES [MOCKED EMAIL LOG]");
    console.log(`From:    ${fromEmail || "MOCKED_SENDER@srilaxmi.com"}`);
    console.log(`To:      ${toEmail || "MOCKED_RECEIVER@srilaxmi.com"}`);
    console.log(`ReplyTo: ${enquiryData.email}`);
    console.log(
      `Subject: New Quotation Enquiry - ${enquiryData.product_interest} from ${enquiryData.contact_name}`,
    );
    console.log(
      "------------------------------------------------------------------------",
    );
    console.log("Enquiry Data:", JSON.stringify(enquiryData, null, 2));
    console.log(
      "========================================================================",
    );
    return { success: true, mocked: true };
  }

  const ownerHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background:#0a0f1e;padding:24px;text-align:center;">
      <h1 style="color:#e8a020;margin:0;font-size:1.4rem;letter-spacing:1px;">SRI LAXMI ENGINEERING WORKS</h1>
      <p style="color:#8fa3b8;margin:4px 0 0;font-size:0.8rem;">NEW B2B QUOTATION ENQUIRY</p>
    </div>
    <div style="background:#f9f9f9;padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;width:40%;">Contact Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;color:#111;">${enquiryData.contact_name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Company Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;">${enquiryData.company_name || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Email Address</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;"><a href="mailto:${enquiryData.email}" style="color:#e8a020;text-decoration:none;">${enquiryData.email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Phone / WhatsApp</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;">${enquiryData.phone || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Country</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;">${enquiryData.country}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Product Interest</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;"><strong style="color:#e8a020;">${enquiryData.product_interest}</strong></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">CAD/PDF Drawing</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;">
            ${
              enquiryData.uploaded_file_url
                ? `<a href="${enquiryData.uploaded_file_url}" target="_blank" style="color: #e8a020; font-weight: bold; text-decoration: underline;">Download Drawing File</a>`
                : '<span style="color:#999;font-style:italic;">No file uploaded</span>'
            }
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#666;vertical-align:top;">Specifications</td>
          <td style="padding:10px 0;color:#111;white-space: pre-wrap;">${enquiryData.message || "Not provided"}</td>
        </tr>
      </table>
    </div>
    <div style="background:#0a0f1e;padding:16px;text-align:center;">
      <p style="color:#8fa3b8;margin:0;font-size:0.75rem;">Sri Laxmi Engineering Works — B2B Manufacturing Cloud Platform</p>
    </div>
  </div>
  `;

  const customerHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background:#0a0f1e;padding:24px;text-align:center;">
      <h1 style="color:#e8a020;margin:0;font-size:1.4rem;letter-spacing:1px;">SRI LAXMI ENGINEERING WORKS</h1>
      <p style="color:#8fa3b8;margin:4px 0 0;font-size:0.8rem;">PRECISION MANUFACTURING & B2B SERVICES</p>
    </div>
    <div style="background:#f9f9f9;padding:32px;">
      <h2 style="color: #0a0f1e; margin-top: 0; font-size: 1.25rem;">Dear ${enquiryData.contact_name},</h2>
      <p>Thank you for contacting <strong>Sri Laxmi Engineering Works</strong>.</p>
      <p>We have successfully received your quotation enquiry regarding <strong>${enquiryData.product_interest}</strong>. Our engineering estimation team will review your requirements and any attached technical drawings shortly.</p>
      <p>We aim to respond to all B2B inquiries within <strong>24 hours</strong> with a detailed proposal.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.9rem; color: #555;"><strong>Submitted Details Summary:</strong></p>
      <ul style="font-size: 0.9rem; color: #555; padding-left: 20px;">
        <li><strong>Product Interest:</strong> ${enquiryData.product_interest}</li>
        <li><strong>Company Name:</strong> ${enquiryData.company_name || "Individual"}</li>
        <li><strong>Origin Country:</strong> ${enquiryData.country}</li>
      </ul>
      <p style="font-size: 0.9rem; color: #555;">If you have any additions to make, simply reply to this email.</p>
      <p style="margin-top: 30px; font-size: 0.9rem; color: #333;">Best regards,<br><strong>B2B Sales Team</strong><br>Sri Laxmi Engineering Works</p>
    </div>
    <div style="background:#0a0f1e;padding:16px;text-align:center;">
      <p style="color:#8fa3b8;margin:0;font-size:0.75rem;">Sri Laxmi Engineering Works · Precision Engineering & Exports</p>
    </div>
  </div>
  `;

  try {
    // 1. Email to Business Owner (B2B team)
    const sendOwnerCommand = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: `[B2B Enquiry] ${enquiryData.product_interest} request from ${enquiryData.contact_name}`,
        },
        Body: {
          Html: {
            Data: ownerHTML,
          },
        },
      },
      ReplyToAddresses: [enquiryData.email],
    });
    await sesClient.send(sendOwnerCommand);
    console.log("AWS SES: Notification email sent to business owner.");

    // 2. Email to Customer (Confirmation)
    const sendCustomerCommand = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [enquiryData.email],
      },
      Message: {
        Subject: {
          Data: `We received your quotation request - Sri Laxmi Engineering Works`,
        },
        Body: {
          Html: {
            Data: customerHTML,
          },
        },
      },
    });
    await sesClient.send(sendCustomerCommand);
    console.log("AWS SES: Confirmation email sent to customer.");

    return { success: true };
  } catch (error) {
    console.error(
      "AWS SES: Failed to send emails via SES. Error:",
      error.message,
    );
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendEnquiryEmail,
};
