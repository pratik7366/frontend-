 document.getElementById('uploadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const file = document.getElementById('imageInput').files[0];
      if (!file) return alert("Please select an image.");
      if (!file.type.startsWith("image/")) return alert("Only image files allowed!");
      if (file.size > 5 * 1024 * 1024) return alert("Max file size is 5MB.");

      const loading = document.getElementById('loading');
      loading.style.display = 'block';

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
        codeBox.textContent = `Your Secret Code: ${data.code}`;
        codeBox.style.display = 'block';
        document.getElementById('copyCodeBtn').style.display = 'block';
        document.getElementById('uploadForm').reset();
        alert("Image uploaded successfully!");
      } catch (err) {
        alert("Failed to upload image. Try again.");
        console.error(err);
      } finally {
        loading.style.display = 'none';
      }
    });

    document.getElementById('copyCodeBtn').onclick = () => {
      const codeBox = document.getElementById('codeBox');
      const code = codeBox.textContent.replace('Your Secret Code: ', '');
      navigator.clipboard.writeText(code);
      alert("Code copied to clipboard!");
      codeBox.style.display = 'none';
      document.getElementById('copyCodeBtn').style.display = 'none';
    };

    function downloadImage() {
      const code = document.getElementById('codeInput').value.trim();
      if (!code) return alert("Please enter a secret code.");
      window.location.href = `https://image-share-backend-hwtt.onrender.com/download/${code}`;
    }

    // Auth logic toggle
    const form = document.getElementById('authForm');
    const toggle = document.getElementById('toggleForm');
    const formTitle = document.getElementById('formTitle');
    const loginBtn = document.getElementById('loginBtn');
    const authBox = document.getElementById('authBox');
    let isLogin = true;

    toggle.addEventListener('click', () => {
      isLogin = !isLogin;
      formTitle.textContent = isLogin ? 'Login' : 'Sign Up';
      form.querySelector('button').textContent = isLogin ? 'Login' : 'Sign Up';
      toggle.innerHTML = isLogin ? "Don't have an account? <span>Create one</span>" : "Already have an account? <span>Login</span>";
    });

    loginBtn.addEventListener('click', () => {
      authBox.classList.toggle('active');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const endpoint = isLogin ? '/api/login' : '/api/signup';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert(`Welcome ${isLogin ? 'back' : ''}! Redirecting to dashboard...`);
        window.location.href = '/dashboard.html';
      } else {
        alert(data.message || 'Something went wrong.');
      }
    });
  
// script.js

function setLoginState(loggedIn, userId = '') {
  const loginBtn = document.getElementById('loginBtn');
  const authBox = document.getElementById('authBox');
  const userDisplay = document.getElementById('userDisplay');

  if (loggedIn) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    userDisplay.innerHTML = `<span class="user-id">User: ${userId}</span>`;
    userDisplay.style.display = 'flex';
  } else {
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    userDisplay.innerHTML = '';
    userDisplay.style.display = 'none';
  }
}

if (localStorage.getItem('token')) {
  const userId = localStorage.getItem('userId') || 'Unknown';
  setLoginState(true, userId);
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  alert('You have been logged out.');
  setLoginState(false);
  window.location.reload();
});

document.addEventListener('click', (e) => {
  const authBox = document.getElementById('authBox');
  const loginBtn = document.getElementById('loginBtn');
  if (!authBox.contains(e.target) && e.target !== loginBtn && authBox.classList.contains('active')) {
    authBox.classList.remove('active');
    authBox.classList.add('slide-out');
    setTimeout(() => {
      authBox.classList.remove('slide-out');
    }, 500);
  }
});

loginBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const authBox = document.getElementById('authBox');
  authBox.classList.add('active', 'slide-in');
  setTimeout(() => {
    authBox.classList.remove('slide-in');
  }, 500);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const endpoint = isLogin ? '/api/login' : '/api/signup';

  try {
    const res = await fetch(`https://image-backend-4img.onrender.com${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.email);
      alert(`Welcome ${isLogin ? 'back' : ''}!`);
      authBox.classList.remove('active');
      setLoginState(true, data.email);
    } else {
      alert(data.message || 'Something went wrong.');
    }
  } catch (err) {
    alert("Server error, please try again later.");
    console.error(err);
  }
});
