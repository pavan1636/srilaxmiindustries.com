# Troubleshooting - Git Errors

Use this guide when you encounter Git authentication or command failures.

---

## 🚫 Error 1: `Password authentication is not supported for Git operations`
* **Symptom**:
  ```
  remote: Invalid username or token. Password authentication is not supported for Git operations.
  fatal: Authentication failed for 'https://github.com/.../'
  ```
* **Why it happens**: GitHub disabled account passwords for git terminal actions (HTTPS) in August 2021 to improve security.
* **How to fix it**:
  1. Generate a **Personal Access Token (PAT)**:
     - Go to GitHub ➔ Settings ➔ Developer Settings ➔ Personal Access Tokens ➔ Tokens (classic) ➔ Generate new token (classic).
     - Enter a note, choose expiration, and select the **`repo`** scope.
     - Copy the generated token (begins with `ghp_`).
  2. Run `git push` again.
  3. Enter your GitHub username.
  4. Paste the token (`ghp_...`) when prompted for the password.

---

## 🚫 Error 2: `error: remote origin already exists`
* **Symptom**: `fatal: remote origin already exists.`
* **Why it happens**: You tried to add a remote link using `git remote add origin`, but a link named `origin` is already registered.
* **How to fix it**:
  - To change the link: `git remote set-url origin <new-url>`
  - To remove the link: `git remote remove origin`
