# TROUBLESHOOTING — Git Errors
# Sri Laxmi Industries — Common Git issues and fixes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 1: remote: File exceeds 100 MB limit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    remote: error: File .terraform/providers/... exceeds GitHub's file size limit

  Why it happens:
    The .terraform/ directory contains binary provider plugins that can exceed
    100MB. Accidentally staging this folder blocks the push.

  How to fix:
    1. Add to .gitignore:
       .terraform/
       *.tfstate
       *.tfstate.*
    2. Remove from git tracking:
       git rm -r --cached .terraform/
       git rm --cached terraform/terraform.tfstate
    3. Undo the failed commit if needed:
       git reset --soft HEAD~1
    4. Recommit and push

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 2: fatal: remote origin already exists
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    fatal: remote origin already exists when running git remote add origin <url>

  Why it happens:
    You already configured a remote earlier (or the repo was cloned).

  How to fix:
    git remote set-url origin <new-url>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 3: Updates were rejected (non-fast-forward)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    error: failed to push some refs to 'https://github.com/...'
    hint: Updates were rejected because the tip of your current branch is behind

  Why it happens:
    Your local branch is behind the remote. Someone else pushed (or you
    edited files directly on GitHub).

  How to fix:
    git pull --rebase origin main
    git push origin main

    If there are conflicts, resolve them, then:
    git rebase --continue
    git push origin main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 4: Permission denied (publickey)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    git@github.com: Permission denied (publickey).

  Why it happens:
    SSH key is not configured for GitHub, or the agent is not running.

  How to fix:
    1. Generate key: ssh-keygen -t ed25519 -C "your@email.com"
    2. Add to agent: ssh-add ~/.ssh/id_ed25519
    3. Copy public key: cat ~/.ssh/id_ed25519.pub
    4. Add to GitHub: Settings → SSH Keys → New
    5. Test: ssh -T git@github.com
