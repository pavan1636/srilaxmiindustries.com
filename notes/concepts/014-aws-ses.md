# CONCEPT 014 — What is AWS SES?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SES (Simple Email Service) is AWS's cloud-based email sending
service. It lets your application send transactional emails
programmatically without running your own mail server.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Running your own email server = building your own post office
  AWS SES = using Royal Mail / An Post — you just hand them the letter
  and they handle delivery, spam filtering, and bounce tracking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. SES requires email address verification before sending
  2. New accounts start in "sandbox mode" (can only send to verified addresses)
  3. SES is region-specific — configure it in the same region as your app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: backend/mailer.js
  Region: eu-west-1
  Sends TWO emails per enquiry:
    1. To business owner: Full enquiry details + download link
    2. To customer: Confirmation email with submitted details summary
  Fallback: If SES credentials are missing, logs a mocked email to console
  Env vars: SES_FROM_EMAIL, SES_TO_EMAIL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I integrated AWS SES to send dual
transactional emails on every B2B enquiry submission. The first
email goes to the business owner with full contact details and a
download link for any attached CAD drawings. The second email is
a professional confirmation sent to the customer. If SES
credentials are not configured, the system gracefully falls back
to logging a mocked email in the container logs for local
development."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Assuming SES works immediately after setup
✅ New SES accounts are in sandbox mode. You must verify both sender
   and recipient addresses, or request production access from AWS.
