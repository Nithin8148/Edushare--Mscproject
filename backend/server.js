const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const createTables = require('./models/createTables'); // Adjust the path as needed
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/product');
const handleFileUpload = require('./controllers/fileUploadController');
const getAllBooks = require('./controllers/books'); // Ensure this path is correct
const updateDownloadedFiles = require('./controllers/updateDownloadedFiles');
const getUserDetails = require('./controllers/getUserDetails');

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.post('/api/files/upload', handleFileUpload);
app.get('/api/books', getAllBooks); // Use GET request for fetching books
app.get('/api/files/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Could not download file.');
        }
    });
});

app.post('/api/files/update', updateDownloadedFiles);
app.post('/api/users/details', getUserDetails);

// Create tables before starting the server
createTables().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
