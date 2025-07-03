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
