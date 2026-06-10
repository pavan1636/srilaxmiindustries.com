function loadSection(id, file) {
  return fetch(`sections/${file}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

Promise.all([
  loadSection("header", "header.html"),
  loadSection("hero", "hero.html"),
  loadSection("capabilities", "capabilities.html"),
  loadSection("products", "products.html"),
  loadSection("about", "about.html"),
  loadSection("quotation", "quotation.html"),
  loadSection("contact", "contact.html"),
  loadSection("footer", "footer.html")
]).then(() => {
  setTimeout(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }, 100);
});

function showFileName(input) {
  const el = document.getElementById('file-name');
  if (input.files && input.files[0]) {
    el.textContent = '📎 ' + input.files[0].name;
  }
}

// ✅ NEW submitForm function
async function submitForm(e) {
  e.preventDefault();

  const btn = document.querySelector('.btn-submit');
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  const fileInput = document.querySelector('input[type="file"]');
  const formData = new FormData();

  formData.append('name', document.querySelector('input[placeholder="John Smith"]').value);
  formData.append('company', document.querySelector('input[placeholder="ACME Engineering Ltd."]').value);
  formData.append('email', document.querySelector('input[type="email"]').value);
  formData.append('phone', document.querySelector('input[type="tel"]').value);
  formData.append('country', document.querySelectorAll('select')[0].value);
  formData.append('product', document.querySelectorAll('select')[1].value);
  formData.append('specifications', document.querySelector('textarea').value);

  if (fileInput && fileInput.files && fileInput.files[0]) {
    formData.append('drawing', fileInput.files[0]);
  }

  try {
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      document.getElementById('quotation-form').style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    btn.innerHTML = '<span>Send Quotation Request</span><span>→</span>';
    btn.disabled = false;
    alert(error.message || 'Something went wrong. Please email us directly.');
    console.error(error);
  }
}

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = '';
  } else {
    links.style.cssText = `
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 72px; left: 0; right: 0;
      background: rgba(10,15,30,0.98);
      padding: 24px 48px 32px;
      gap: 20px;
      border-bottom: 1px solid rgba(232,160,32,0.2);
      z-index: 99;
    `;
  }
}

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 40) {
    nav.style.boxShadow = '0 4px 40px rgba(0,0,0,0.5)';
  } else {
    nav.style.boxShadow = '';
  }
});