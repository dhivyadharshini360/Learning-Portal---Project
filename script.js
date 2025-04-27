// script.js

// Store registered users and progress in localStorage
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;

// Register
const registerForm = document.querySelector('#register form');
registerForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirmPassword').value;

  if (password !== confirm) {
    alert('Passwords do not match');
    return;
  }

  if (users[email]) {
    alert('User already exists. Please log in.');
    return;
  }

  users[email] = {
    name,
    password,
    completedWeeks: []
  };

  localStorage.setItem('users', JSON.stringify(users));
  alert('Registered successfully! Now login.');
});

// Login
const loginForm = document.querySelector('#login form');
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!users[email] || users[email].password !== password) {
    alert('Invalid credentials');
    return;
  }

  currentUser = email;
  localStorage.setItem('currentUser', currentUser);
  alert(`Welcome ${users[email].name}! Happy Learning.`);
  updateProgressUI();
});

// Mark Week as Complete
const weekButtons = document.querySelectorAll('.mark-complete');
weekButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentUser) {
      alert('Please log in first.');
      return;
    }
    const weekText = btn.innerText;
    const weekNumber = parseInt(weekText.match(/\d+/)[0]);

    const userData = users[currentUser];
    if (!userData.completedWeeks.includes(weekNumber)) {
      userData.completedWeeks.push(weekNumber);
      btn.classList.remove('btn-outline-success');
      btn.classList.add('btn-success');
      btn.innerText = `Week ${weekNumber} Completed!`;
    }
    localStorage.setItem('users', JSON.stringify(users));
    updateProgressUI();
  });
});

// Reset Progress
const resetBtn = document.getElementById('resetProgress');
resetBtn.addEventListener('click', () => {
  if (!currentUser) {
    alert('Log in to reset progress.');
    return;
  }
  users[currentUser].completedWeeks = [];
  localStorage.setItem('users', JSON.stringify(users));
  updateProgressUI();
});





// Update My Progress UI
function updateProgressUI() {
  if (!currentUser || !users[currentUser]) return;
  const completedWeeks = users[currentUser].completedWeeks;

  const badges = document.querySelectorAll('#progress .list-group-item');
  badges.forEach((item, index) => {
    const badge = item.querySelector('span');
    if (completedWeeks.includes(index + 1)) {
      badge.classList.remove('bg-secondary');
      badge.classList.add('bg-success');
      badge.innerHTML = '<i class="fas fa-check"></i>';
    } else {
      badge.classList.remove('bg-success');
      badge.classList.add('bg-secondary');
      badge.innerHTML = '<i class="fas fa-times"></i>';
    }
  });

  const percent = Math.round((completedWeeks.length / 12) * 100);
  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = percent + '%';
  progressBar.setAttribute('aria-valuenow', percent);
  progressBar.innerText = percent + '%';

  document.querySelector('#progress p').innerText = `You've completed ${completedWeeks.length} out of 12 weeks.`;

  weekButtons.forEach(btn => {
    const weekNumber = parseInt(btn.innerText.match(/\d+/)[0]);
    if (completedWeeks.includes(weekNumber)) {
      btn.classList.remove('btn-outline-success');
      btn.classList.add('btn-success');
      btn.innerText = `Week ${weekNumber} Completed!`;
    } else {
      btn.classList.remove('btn-success');
      btn.classList.add('btn-outline-success');
      btn.innerText = `Mark Week${weekNumber} as Complete`;
    }
  });
}

// Auto-update on load
window.addEventListener('load', updateProgressUI);
