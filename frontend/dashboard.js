document.addEventListener('DOMContentLoaded', function() {
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const userEmail = localStorage.getItem('email');

  // Dynamically set the content of the divs
  document.getElementById('firstName').textContent = firstName || 'No first name available';
  document.getElementById('lastName').textContent = lastName || 'No last name available';
  document.getElementById('userEmail').textContent = userEmail || 'No email available';
});