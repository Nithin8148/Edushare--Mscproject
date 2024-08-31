document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.getElementById('searchInput');

    function switchTab(targetId) {
        tabContents.forEach(content => {
            content.classList.add('hidden');
            if (content.id === targetId) {
                content.classList.remove('hidden');
            }
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            switchTab(targetId);
        });
    });

    async function fetchFiles() {
        try {
            const response = await fetch('http://localhost:5000/api/books');
            const data = await response.json();
            const yourFilesContainer = document.getElementById('yourFilesContainer');
            const othersFilesContainer = document.getElementById('othersFilesContainer');
            const currUserId = localStorage.getItem('userID');

            yourFilesContainer.innerHTML = '';
            othersFilesContainer.innerHTML = '';

            data.forEach(file => {
                const fileElement = document.createElement('div');
                fileElement.className = 'p-4 border mb-4 rounded';
                fileElement.setAttribute('data-filename', file.filename.toLowerCase());

                if (String(file.userID) === currUserId) {
                    // Your own files
                    fileElement.innerHTML = `
                        <div class="bg-green-100 p-2 rounded mb-2">
                            <strong>Your File</strong>
                        </div>
                        <p><strong>Filename:</strong> ${file.filename}</p>
                        <p><strong>Subject:</strong> ${file.subject}</p>
                        <p><strong>Type:</strong> ${file.type}</p>
                    `;
                    
                    const actionElement = document.createElement('div');
                    actionElement.className = 'mt-2';
                    actionElement.innerHTML = `<button class="bg-blue-500 text-white px-4 py-2 rounded download-btn" data-filename="${file.filename}">Download</button>`;
                    fileElement.appendChild(actionElement);

                    yourFilesContainer.appendChild(fileElement);
                } else {
                    // Others' files
                    fileElement.innerHTML = `
                        <div class="bg-yellow-100 p-2 rounded mb-2">
                            <strong>Shared File</strong>
                        </div>
                        <p><strong>Filename:</strong> ${file.filename}</p>
                        <p><strong>Subject:</strong> ${file.subject}</p>
                        <p><strong>Type:</strong> ${file.type}</p>
                        <p><strong>Uploaded By:</strong> ${file.userID}</p>
                    `;
                    
                    const actionElement = document.createElement('div');
                    actionElement.className = 'mt-2';

                    if (file.type === 'free') {
                        actionElement.innerHTML = `<button class="bg-blue-500 text-white px-4 py-2 rounded download-btn" data-filename="${file.filename}">Download</button>`;
                    } else {
                        actionElement.innerHTML = `<button class="bg-blue-500 text-white px-4 py-2 rounded pay-btn" data-filename="${file.filename}">Buy and Download</button>`;
                    }

                    fileElement.appendChild(actionElement);
                    othersFilesContainer.appendChild(fileElement);
                }
            });

            document.querySelectorAll('.download-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const filename = e.target.getAttribute('data-filename');
                    const fileUrl = `http://localhost:5000/api/files/download/${filename}`;
                    const currUserId = localStorage.getItem('userID');

                    if (fileUrl) {
                        try {
                            await fetch('http://localhost:5000/api/files/update', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ userID: currUserId, filename })
                            });
                            window.location.href = fileUrl;
                        } catch (error) {
                            console.error('Error updating downloaded files:', error);
                        }
                    } else {
                        window.location.href = fileUrl;
                    }
                });
            });

            document.querySelectorAll('.pay-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('paymentModal').classList.remove('hidden');
                    document.getElementById('paymentForm').addEventListener('submit', async (event) => {
                        event.preventDefault();
                        const filename = btn.getAttribute('data-filename');
                        const currUserId = localStorage.getItem('userID');
                        const fileUrl = `http://localhost:5000/api/files/download/${filename}`;
                        const sendReq = `http://localhost:5000/api/files/update/`;
                        
                        try {
                            await fetch(sendReq, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ userID: currUserId, filename })
                            });
                        } catch (error) {
                            console.error('Error updating downloaded files:', error);
                        }

                        window.location.href = fileUrl;
                        document.getElementById('paymentModal').classList.add('hidden');
                    });
                });
            });

            document.getElementById('closeModal').addEventListener('click', () => {
                document.getElementById('paymentModal').classList.add('hidden');
            });

        } catch (error) {
            console.error('Error fetching files:', error);
        }
    }

    function filterFiles() {
        const searchTerm = searchInput.value.toLowerCase();
        const fileElements = document.querySelectorAll('.tab-content .p-4.border.mb-4.rounded');

        fileElements.forEach(fileElement => {
            const filename = fileElement.getAttribute('data-filename');
            if (filename.includes(searchTerm)) {
                fileElement.classList.remove('hidden');
            } else {
                fileElement.classList.add('hidden');
            }
        });
    }

    searchInput.addEventListener('input', filterFiles);

    fetchFiles();
    switchTab('your-files');
});
