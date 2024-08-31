document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if (!email || !password) {
        alert('Please fill in both fields.');
        return;
    }
  
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
            // Save token, userID, firstName, lastName, and email to local storage
            localStorage.setItem('userID', data.userID);
            localStorage.setItem('firstName', data.firstName);
            localStorage.setItem('lastName', data.lastName);
            localStorage.setItem('email', data.email);
  
            // Redirect to dashboard or another page
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
  });
  