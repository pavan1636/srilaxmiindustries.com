# TROUBLESHOOTING — Kubernetes Errors
# Reference for interview discussions (primary deployment uses Docker Compose)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Sri Laxmi Industries uses Docker Compose on EC2 for deployment.
  This cheat sheet covers common Kubernetes errors for interview prep
  and future migration scenarios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 1: CrashLoopBackOff
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Pod status shows CrashLoopBackOff.

  Why it happens:
    The container starts but crashes immediately. Kubernetes restarts
    it repeatedly, waiting longer between each restart (exponential backoff).

  How to debug:
    1. Inspect container logs from the PREVIOUS crash:
       kubectl logs <pod-name> --previous
    2. Check pod events for OOM kills or config errors:
       kubectl describe pod <pod-name>
    3. Common causes: missing env vars, wrong CMD, failing healthcheck

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 2: ImagePullBackOff
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Pod status is ImagePullBackOff or ErrImagePull.

  Why it happens:
    Kubernetes cannot pull the Docker image from your registry.

  How to fix:
    1. Check for typos in the image name or tag
    2. Ensure the image is public, or configure imagePullSecrets
    3. Log in to ECR/Docker Hub on the command line to verify the image exists
    4. Check: kubectl describe pod <pod-name> → Events section

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 3: Service connection refused / not routing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Cannot reach pods through a Service IP or ClusterIP.

  Why it happens:
    The Service selector labels do not match the Pod labels.

  How to fix:
    1. Check endpoints: kubectl get endpoints <service-name>
    2. If the list is empty → labels don't match
    3. Compare: service spec.selector labels vs pod metadata.labels
    4. Fix the label mismatch and redeploy
