document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
      alert('Please fill in all fields.');
      return;
  }

  try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = 'login.html';
      } else {
          alert(data.message || 'Sign up failed. Please try again.');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
  }
});
