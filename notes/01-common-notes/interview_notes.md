# Interview Q&A Notes - DevOps Portfolio

If you present this B2B Manufacturing Platform in interviews (e.g. in Ireland / Europe), here are the questions you are highly likely to face, along with the correct professional answers.

---

### Q1: Why did you use Nginx for the frontend container instead of hosting Node.js directly?
* **A-Grade Answer**: 
  > "Nginx is built specifically for high-concurrency static file delivery and acts as a reverse proxy. By routing traffic through Nginx, we keep the Node backend hidden in the internal container network. Node is single-threaded and struggles with serving heavy static assets. Offloading static assets to Nginx frees up backend resource cycles to process API calls, validate database transactions, and handle file transfers."

### Q2: How did you implement secure uploads for CAD drawings?
* **A-Grade Answer**: 
  > "Instead of storing files on the local EC2 server filesystem—which would prevent scaling horizontally—we upload technical drawings directly to AWS S3. The backend container uses Multer (memory storage) and the AWS SDK to stream file buffers straight to an S3 bucket. The bucket blocks all public access. The database only stores the S3 object URL, and access is governed using IAM Roles assigned to the EC2 host."

### Q3: Why did you run the backend container as the non-root user `node`?
* **A-Grade Answer**: 
  > "By default, Docker containers run processes as the `root` root user inside the container. If a remote vulnerability allows an attacker to break out of the container process (a container escape exploit), they would instantly gain root access to the underlying EC2 host server. Running the backend under the restricted user `node` implements the principle of least privilege, preventing an attacker from executing administrative system calls on the host machine."

### Q4: How are you protecting GDPR enquiries?
* **A-Grade Answer**:
  > "Enquiries contain personal identifiable information (PII) like name, email, and phone number. We created GDPR-compliant export and deletion endpoints. To secure this data, these endpoints are shielded by an API key header check (`X-Admin-API-Key`) matching a server-side environment secret. This prevents public users from scraping database files or deleting other customers' records."
