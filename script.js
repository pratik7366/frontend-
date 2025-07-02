// script.js
if (localStorage.getItem('token')) {
  alert('You are already logged in!');
}

const logoutBtn = document.getElementById('logoutBtn');

if (localStorage.getItem('token')) {
  logoutBtn.style.display = 'block';
} else {
  logoutBtn.style.display = 'none';
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  alert('You have been logged out.');
  logoutBtn.style.display = 'none';
  window.location.reload();
});

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
    const res = await fetch('https://image-backend-4img.onrender.com/upload', {
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
  window.location.href = `https://image-backend-4img.onrender.com/download/${code}`;
}

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
  localStorage.removeItem('token'); // force logout before new login
  authBox.classList.toggle('active');
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
      alert(`Welcome ${isLogin ? 'back' : ''}!`);
      document.getElementById('authBox').classList.remove('active');
    } else {
      alert(data.message || 'Something went wrong.');
    }
  } catch (err) {
    alert("Server error, please try again later.");
    console.error(err);
  }
});
