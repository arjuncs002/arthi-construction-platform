document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('loginForm');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');
  const loginError = document.getElementById('loginError');
  const loginErrorText = document.getElementById('loginErrorText');
  const loginBtnText = document.getElementById('loginBtnText');
  const loginSpinner = document.getElementById('loginSpinner');
  const submitBtn = document.getElementById('loginSubmitBtn');

  document.getElementById('scrollToLoginBtn').addEventListener('click', () => {
    document.getElementById('login-anchor').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => loginUser.focus(), 400);
  });

  document.getElementById('togglePass').addEventListener('click', () => {
    const isPass = loginPass.type === 'password';
    loginPass.type = isPass ? 'text' : 'password';
    document.getElementById('togglePass').textContent = isPass ? '🙈' : '👁️';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.remove('show');

    const username = loginUser.value;
    const password = loginPass.value;

    if (!username || !password) {
      loginErrorText.textContent = 'Please enter both username and password.';
      loginError.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    loginBtnText.textContent = 'Signing in...';
    loginSpinner.classList.remove('hidden');

    try {
      const ok = await AUTH.login(username, password);
      if (ok) {
        const profile = AUTH.getProfile();
        const dest = profile.role === 'SUPERVISOR' ? 'supervisor/dashboard.html' : 'dashboard.html';
        showToast('Login successful. Redirecting to your dashboard...', 'success');
        setTimeout(() => { window.location.href = dest; }, 600);
      } else {
        loginErrorText.textContent = 'Invalid username or password. Please try again.';
        loginError.classList.add('show');
        submitBtn.disabled = false;
        loginBtnText.textContent = 'Login';
        loginSpinner.classList.add('hidden');
        loginPass.value = '';
        loginPass.focus();
      }
    } catch (err) {
      loginErrorText.textContent = 'Failed to connect to authentication server.';
      loginError.classList.add('show');
      submitBtn.disabled = false;
      loginBtnText.textContent = 'Login';
      loginSpinner.classList.add('hidden');
    }
  });

  document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('forgotModal');
  });
  document.getElementById('requestAccessLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal('requestAccessModal');
  });

  document.getElementById('forgotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('forgotModal');
    showToast('Password reset link sent to your email.', 'success');
    e.target.reset();
  });
  document.getElementById('requestAccessForm').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('requestAccessModal');
    showToast('Access request submitted. Our team will contact you shortly.', 'success');
    e.target.reset();
  });
});