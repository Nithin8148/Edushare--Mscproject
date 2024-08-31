const pool = require('../config/database'); // Adjust path as needed

const getUserDetails = async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT downloaded_files FROM users WHERE id = ?', [userID]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const downloadedFiles = rows[0].downloaded_files ? rows[0].downloaded_files.split(',') : [];
        connection.release();

        res.status(200).json({ downloadedFiles });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = getUserDetails;
