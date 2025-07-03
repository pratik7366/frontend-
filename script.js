document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('authForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  const authBox = document.getElementById('authBox');
  const userDisplay = document.getElementById('userDisplay');
  const toggle = document.getElementById('toggleForm');
  const formTitle = document.getElementById('formTitle');
  const uploadForm = document.getElementById('uploadForm');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  let isLogin = true;

  function setLoginState(loggedIn, userId = '') {
    if (loggedIn) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
      if (userDisplay) {
        userDisplay.innerHTML = `<span class="user-id">User: ${userId}</span>`;
        userDisplay.style.display = 'flex';
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (userDisplay) {
        userDisplay.innerHTML = '';
        userDisplay.style.display = 'none';
      }
    }
  }

  // Check login state from localStorage
  if (localStorage.getItem('token')) {
    const userId = localStorage.getItem('userId') || 'Unknown';
    setLoginState(true, userId);
  }

  // Toggle between login and sign up
  if (toggle && formTitle && form) {
    toggle.addEventListener('click', () => {
      isLogin = !isLogin;
      formTitle.textContent = isLogin ? 'Login' : 'Sign Up';
      form.querySelector('button').textContent = isLogin ? 'Login' : 'Sign Up';
      toggle.innerHTML = isLogin
        ? `Don't have an account? <span>Create one</span>`
        : `Already have an account? <span>Login</span>`;
    });
  }

  // Show login panel
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (authBox) {
        authBox.classList.add('active', 'slide-in');
        setTimeout(() => authBox.classList.remove('slide-in'), 500);
      }
    });
  }

  // Logout logic
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      alert('You have been logged out.');
      setLoginState(false);
      window.location.reload();
    });
  }

  // Hide login box when clicking outside
  document.addEventListener('click', (e) => {
    if (
      authBox &&
      !authBox.contains(e.target) &&
      e.target !== loginBtn &&
      authBox.classList.contains('active')
    ) {
      authBox.classList.add('slide-out');
      setTimeout(() => {
        authBox.classList.remove('slide-out', 'active');
      }, 500);
    }
  });

  // Login or signup form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const endpoint = isLogin ? '/api/login' : '/api/signup';

      try {
        const res = await fetch(`https://image-share-backend-hwtt.onrender.com${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.email);
          alert(`Welcome ${isLogin ? 'back' : ''}!`);
          if (authBox) authBox.classList.remove('active');
          setLoginState(true, data.email);
        } else {
          alert(data.message || 'Something went wrong.');
        }
      } catch (err) {
        alert('Server error, please try again later.');
        console.error(err);
      }
    });
  }

  // Upload form logic
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const file = document.getElementById('imageInput').files[0];
      if (!file) return alert('Please select an image.');
      if (!file.type.startsWith('image/')) return alert('Only image files allowed!');
      if (file.size > 5 * 1024 * 1024) return alert('Max file size is 5MB.');

      const loading = document.getElementById('loading');
      if (loading) loading.style.display = 'block';

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('https://image-share-backend-hwtt.onrender.com/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const codeBox = document.getElementById('codeBox');
        if (codeBox) {
          codeBox.textContent = `Your Secret Code: ${data.code}`;
          codeBox.style.display = 'block';
        }
        if (copyCodeBtn) copyCodeBtn.style.display = 'block';

        uploadForm.reset();
        alert('Image uploaded successfully!');
      } catch (err) {
        alert('Failed to upload image. Try again.');
        console.error(err);
      } finally {
        if (loading) loading.style.display = 'none';
      }
    });
  }

  // Copy secret code
  if (copyCodeBtn) {
    copyCodeBtn.onclick = () => {
      const codeBox = document.getElementById('codeBox');
      const code = codeBox?.textContent?.replace('Your Secret Code: ', '') || '';
      if (code) {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
        codeBox.style.display = 'none';
        copyCodeBtn.style.display = 'none';
      }
    };
  }

  // Expose download function globally for HTML onclick
  window.downloadImage = function () {
    const code = document.getElementById('codeInput').value.trim();
    if (!code) return alert('Please enter a secret code.');
    window.location.href = `https://image-share-backend-hwtt.onrender.com/download/${code}`;
  };
});
