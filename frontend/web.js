// Placeholder for future JavaScript code if needed
console.log('Script loaded');
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const filePath = card.getAttribute('data-file');
            if (filePath) {
                const link = document.createElement('a');
                link.href = filePath;
                link.download = filePath.split('/').pop(); // Extracts the file name from the path
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    function navigateToSearch() {
        window.location.href = 'search.html';
    }

    // Add event listeners to all buttons in the search section
    const buttons = document.querySelectorAll('.subjects button');
    buttons.forEach(button => {
        button.addEventListener('click', navigateToSearch);
    });
});
