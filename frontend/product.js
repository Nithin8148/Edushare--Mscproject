document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const fileInput = document.querySelector(".file-input");
  const documentListContainer = document.querySelector(".document-list");

  // Trigger file input click when form is clicked
  form.addEventListener("click", () => {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      showPopupForm(file);
    }
  });

  // Function to display the pop-up form
  function showPopupForm(file) {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    // Create the pop-up form
    const popup = document.createElement('div');
    popup.className = 'popup-form';
    popup.innerHTML = `
      <div class="popup-content">
        <h2>File Details</h2>
        <form id="detailsForm">
          <label for="subject">Subject:</label>
          <select id="subject" name="subject" required>
            <option value="math">Math</option>
            <option value="english">English</option>
            <option value="science">Science</option>
            <option value="aptitude">Aptitude</option>
          </select>
          <label for="type">Type:</label>
          <select id="type" name="type" required>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
          <div class="form-btns">
            <button type="submit">Submit</button>
            <button type="button" id="closePopup">Cancel</button>
          </div>
        </form>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Handle form submission
    document.getElementById('detailsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('subject').value;
      const type = document.getElementById('type').value;
      const userID = localStorage.getItem('userID');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);
      formData.append('type', type);
      formData.append('userID', userID);

      // Send the data to the backend
      fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          // Handle success (e.g., show a success message)
          document.body.removeChild(overlay); // Remove the overlay and pop-up form
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle error (e.g., show an error message)
        });
    });

    // Close the pop-up form
    document.getElementById('closePopup').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
}

  // Function to fetch and display user's downloaded files
  function fetchUserDownloadedFiles() {
    const userID = localStorage.getItem('userID');

    fetch('http://localhost:5000/api/users/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID })
    })
      .then(response => response.json())
      .then(data => {

        if (data.downloadedFiles) {
          populateDocumentList(data.downloadedFiles);
        } else {
          console.log('No downloaded files found');
        }
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }

  // Function to populate the document list
  function populateDocumentList(files) {
    documentListContainer.innerHTML = ''; // Clear existing content

    files.forEach(filename => {
      const documentElement = document.createElement('div');
      documentElement.className = 'document';
      documentElement.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <div class="document-info">
          <p class="document-name">${filename}</p>
          <p class="document-size">Unknown Size</p>
        </div>
        <i class="fas fa-download"></i>
      `;

      // Add download functionality
      documentElement.querySelector('.fa-download').addEventListener('click', () => {
        const fileUrl = `http://localhost:5000/api/files/download/${filename}`;
        window.location.href = fileUrl; // Redirect to download URL
      });

      documentListContainer.appendChild(documentElement);
    });
  }

  // Fetch and display user's downloaded files on page load
  fetchUserDownloadedFiles();
});
