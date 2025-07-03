// script.js

let isLogin = true;
const form = document.getElementById('authForm');
const logoutBtn = document.getElementById('logoutBtn');
const loginBtn = document.getElementById('loginBtn');

function setLoginState(loggedIn, userId = '') {
  const authBox = document.getElementById('authBox');
  const userDisplay = document.getElementById('userDisplay');

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

if (localStorage.getItem('token')) {
  const userId = localStorage.getItem('userId') || 'Unknown';
  setLoginState(true, userId);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('You have been logged out.');
    setLoginState(false);
    window.location.reload();
  });
}

document.addEventListener('click', (e) => {
  const authBox = document.getElementById('authBox');
  if (!authBox.contains(e.target) && e.target !== loginBtn && authBox.classList.contains('active')) {
    authBox.classList.remove('active');
    authBox.classList.add('slide-out');
    setTimeout(() => {
      authBox.classList.remove('slide-out');
    }, 500);
  }
});

if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const authBox = document.getElementById('authBox');
    authBox.classList.add('active', 'slide-in');
    setTimeout(() => {
      authBox.classList.remove('slide-in');
    }, 500);
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const formTitle = document.getElementById('formTitle');
    isLogin = formTitle && formTitle.textContent.toLowerCase().includes('login');
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
        const authBox = document.getElementById('authBox');
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
}
