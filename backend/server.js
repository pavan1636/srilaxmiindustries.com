require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDb, pool } = require("./db");
const { upload, uploadFile } = require("./upload");
const { sendEnquiryEmail } = require("./mailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads locally (for local S3 upload fallbacks)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Check PostgreSQL connection
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "UP",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        server: "healthy",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "DOWN",
      timestamp: new Date().toISOString(),
      services: {
        database: "error: " + error.message,
        server: "healthy",
      },
    });
  }
});

// Root welcome route
app.get("/", (req, res) => {
  res.send("Sri Laxmi Engineering Works B2B Platform API is running ✅");
});

// Helper for validating email format
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

// Admin authentication middleware for GDPR endpoints
function adminAuth(req, res, next) {
  const adminApiKey = process.env.ADMIN_API_KEY;
  if (!adminApiKey) {
    return res
      .status(500)
      .json({
        error: "Server configuration error: ADMIN_API_KEY is not configured.",
      });
  }
  const providedKey = req.headers["x-admin-api-key"] || req.query.admin_api_key;
  if (!providedKey || providedKey !== adminApiKey) {
    return res
      .status(401)
      .json({
        error: "Unauthorized. Valid X-Admin-API-Key header is required.",
      });
  }
  next();
}

// ----------------------------------------------------
// Core B2B Enquiry Submission Endpoint
// ----------------------------------------------------
app.post("/api/enquiries", upload.single("drawing"), async (req, res) => {
  const {
    name, // from body (can be contact_name)
    company, // from body (can be company_name)
    email,
    phone,
    country,
    product, // from body (can be product_interest)
    specifications, // from body (can be message)
    currency,
  } = req.body;

  // Map incoming body variables (handling both new format and old website format compatibility)
  const contactName = name || req.body.contact_name;
  const companyName = company || req.body.company_name;
  const productInterest = product || req.body.product_interest;
  const message = specifications || req.body.message;
  const preferredCurrency = currency || "EUR";

  // Input Validation
  if (!contactName || !email || !country || !productInterest) {
    return res.status(400).json({
      success: false,
      message:
        "Validation failed. Required fields are missing (name/contact_name, email, country, product/product_interest).",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Invalid email format.",
    });
  }

  try {
    let uploadedFileUrl = null;
    if (req.file) {
      console.log(
        `Uploading file: ${req.file.originalname} (${req.file.size} bytes)...`,
      );
      uploadedFileUrl = await uploadFile(req.file);
      console.log(`File uploaded successfully. URL: ${uploadedFileUrl}`);
    }

    // Insert into PostgreSQL database
    const insertQuery = `
      INSERT INTO enquiries (company_name, contact_name, email, phone, country, product_interest, currency, message, uploaded_file_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'New')
      RETURNING *
    `;
    const values = [
      companyName || null,
      contactName,
      email,
      phone || null,
      country,
      productInterest,
      preferredCurrency,
      message || null,
      uploadedFileUrl,
    ];

    const result = await pool.query(insertQuery, values);
    const savedEnquiry = result.rows[0];
    console.log(`Enquiry saved to DB with ID: ${savedEnquiry.id}`);

    // Send emails (SES or Local Mock logs)
    const emailResponse = await sendEnquiryEmail(savedEnquiry);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: savedEnquiry,
      emailSent: emailResponse.success,
    });
  } catch (error) {
    console.error("Error handling enquiry submission:", error.message);
    res.status(500).json({
      success: false,
      message:
        "An internal server error occurred while processing your request: " +
        error.message,
    });
  }
});

// Legacy endpoint mapping to handle old code requests
app.post("/send-quotation", upload.single("drawing"), async (req, res) => {
  console.log(
    "Legacy /send-quotation requested. Forwarding to /api/enquiries...",
  );
  // Express handles routing alias beautifully:
  req.url = "/api/enquiries";
  app.handle(req, res);
});

// ----------------------------------------------------
// GDPR Export & Deletion Endpoints (Admin Authenticated)
// ----------------------------------------------------

// GET /api/enquiries/export?email=john@company.com
app.get("/api/enquiries/export", adminAuth, async (req, res) => {
  const { email } = req.query;

  if (!email || !validateEmail(email)) {
    return res
      .status(400)
      .json({ error: 'Valid query parameter "email" is required.' });
  }

  try {
    const query =
      "SELECT * FROM enquiries WHERE email = $1 ORDER BY created_at DESC";
    const result = await pool.query(query, [email]);

    res.status(200).json({
      success: true,
      email: email,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("GDPR Export Error:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error during export operation." });
  }
});

// DELETE /api/enquiries/delete?email=john@company.com
app.delete("/api/enquiries/delete", adminAuth, async (req, res) => {
  const { email } = req.query;

  if (!email || !validateEmail(email)) {
    return res
      .status(400)
      .json({ error: 'Valid query parameter "email" is required.' });
  }

  try {
    // Delete database rows
    const query = "DELETE FROM enquiries WHERE email = $1 RETURNING *";
    const result = await pool.query(query, [email]);

    console.log(`GDPR Delete: Removed ${result.rowCount} records for ${email}`);

    res.status(200).json({
      success: true,
      email: email,
      deleted_count: result.rowCount,
      message: `Successfully deleted all data records associated with ${email}`,
    });
  } catch (error) {
    console.error("GDPR Delete Error:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error during deletion operation." });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start server due to database initialization failure:",
      err.message,
    );
    process.exit(1);
  });
