# CONCEPT 018 — What is GDPR?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GDPR (General Data Protection Regulation) is a European law that
gives individuals rights over their personal data. Any application
that collects data from EU citizens must comply.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without GDPR compliance:
    Companies collect unlimited data without consent
    Users cannot request their data or ask for deletion
    Data breaches have no legal consequences
    Fines: up to €20 million or 4% of global annual revenue

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GDPR = rental agreement rules for storing someone's belongings
  The person (data subject) can:
    Ask to see everything you stored (Right to Access / Export)
    Ask you to delete everything (Right to Erasure)
    Refuse to let you store certain items (Consent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Right to Access: users can request ALL data you hold about them
  2. Right to Erasure: users can request complete deletion of their data
  3. These endpoints must be PROTECTED — only admins should run them

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: backend/server.js
  PII Collected: name, email, phone, company, country (enquiry form)

  GDPR Export Endpoint:
    GET /api/enquiries/export?email=john@company.com
    Returns all enquiry records for that email address
    Protected by: X-Admin-API-Key header (adminAuth middleware)

  GDPR Delete Endpoint:
    DELETE /api/enquiries/delete?email=john@company.com
    Permanently deletes all records for that email address
    Protected by: X-Admin-API-Key header (adminAuth middleware)

  Auth middleware checks:
    1. ADMIN_API_KEY environment variable exists
    2. Request header X-Admin-API-Key matches the secret
    3. If mismatch → 401 Unauthorized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I implemented GDPR-compliant data handling
for B2B enquiries. The system stores personal identifiable information
like name, email, and phone number. I built two admin-only endpoints:
one for data export (Right to Access) and one for data deletion
(Right to Erasure). Both endpoints are protected by an API key header
check — the X-Admin-API-Key must match a server-side environment
secret. This prevents unauthorized users from accessing or deleting
other customers' data."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Making GDPR export/delete endpoints publicly accessible
✅ Always protect them with authentication. Anyone could scrape
   your database or delete records maliciously without auth.
