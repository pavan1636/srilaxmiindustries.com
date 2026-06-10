# Troubleshooting - Kubernetes Errors

Even though our primary deployment is on AWS EC2 using Docker Compose, recruiters will value your familiarity with Kubernetes (K8s) troubleshooting. Here is a cheat sheet.

---

## 🚫 Error 1: `CrashLoopBackOff`
* **Symptom**: Pod status shows `CrashLoopBackOff`.
* **Why it happens**: The container starts, but crashes immediately. Kubernetes restarts it repeatedly, waiting longer between each restart.
* **How to debug it**:
  1. Inspect container logs:
     ```bash
     kubectl logs <pod-name> --previous
     ```
     *The `--previous` flag pulls logs from the crashed container instance before K8s restarted it.*
  2. Inspect the pod details to find event logs:
     ```bash
     kubectl describe pod <pod-name>
     ```

---

## 🚫 Error 2: `ImagePullBackOff`
* **Symptom**: Pod status is `ImagePullBackOff` or `ErrImagePull`.
* **Why it happens**: Kubernetes cannot pull the Docker image from your image registry (Docker Hub, AWS ECR).
* **How to fix it**:
  1. Check for typos in the image name or tag.
  2. Ensure the image is public, or check your registry pull secrets (`imagePullSecrets`).
  3. Log in to ECR/Docker Hub on the command line to verify image availability.

---

## 🚫 Error 3: `Service connection refused / Service not routing`
* **Symptom**: You cannot reach your pods through a Service IP.
* **Why it happens**: Selector label mismatches.
* **How to fix it**:
  1. Run `kubectl get endpoints <service-name>` to see if any pods are bound to the service.
  2. If the list is empty, verify that your service `spec.selector` labels match the `metadata.labels` on your pods exactly.
