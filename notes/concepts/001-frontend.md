# CONCEPT 001 — What is a Frontend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  The frontend is the part of a web application that runs in the user's
  browser. It is built with HTML (structure), CSS (styling), and
  JavaScript (interactivity). It is what users see and click on.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without a frontend, users would have to interact with raw data or
  command-line tools. No buttons, no forms, no product catalog pages.
  The business cannot function if dealers cannot browse and order steel
  products through a visual interface.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  The frontend is like the showroom of a factory. Customers walk in,
  see products on display, and place orders. The actual manufacturing
  (backend) happens behind closed doors — the customer never sees it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. HTML defines the page structure (headings, forms, tables)
  2. CSS controls the visual appearance (colors, layout, fonts)
  3. JavaScript adds dynamic behavior (form validation, API calls)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌─────────────────────────────────────┐
  │          USER'S BROWSER             │
  │                                     │
  │  ┌─────────┐ ┌─────┐ ┌──────────┐  │
  │  │  HTML    │ │ CSS │ │    JS    │  │
  │  │(structure│ │(look│ │(behavior)│  │
  │  └─────────┘ └─────┘ └────┬─────┘  │
  │                            │        │
  │                     fetch('/api')   │
  └────────────────────────────┼────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Express Backend │
                    └──────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Our frontend is plain HTML5, CSS3, and vanilla JavaScript — no React
  or Angular. It is served as static files by an Nginx container.
  Pages include the product catalog, dealer registration form, quote
  request form, and admin dashboard. JavaScript uses fetch() to call
  the Express backend API for data like product lists and orders.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "In my Sri Laxmi Industries project, the frontend is built with
  plain HTML, CSS, and vanilla JavaScript — no frameworks. Nginx
  serves the static files inside a Docker container. The JS code
  uses fetch() to call our Express REST API for product data,
  dealer registration, and quote requests. Keeping it framework-free
  made the Docker image small and the build pipeline simple."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ Thinking frontend always means React/Angular/Vue
  ✅ A frontend can be plain HTML/CSS/JS — frameworks are optional.
     For a B2B platform with simple pages, vanilla JS is sufficient
     and results in faster load times and smaller container images.
