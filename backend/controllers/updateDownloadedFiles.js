const pool = require('../config/database'); // Adjust path as needed

const updateDownloadedFiles = async (req, res) => {
    const { userID, filename } = req.body;

    if (!userID || !filename) {
        return res.status(400).json({ error: 'User ID and filename are required' });
    }

    try {
        const connection = await pool.getConnection();

        // Check if user exists and fetch current files
        const [rows] = await connection.execute('SELECT downloaded_files FROM users WHERE id = ?', [userID]);

        if (rows.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'User not found' });
        }

        const currentFiles = rows[0].downloaded_files ? rows[0].downloaded_files.split(',') : [];
        console.log('Current Files:', currentFiles); // Debugging

        if (!currentFiles.includes(filename)) {
            currentFiles.push(filename);
            const updatedFiles = currentFiles.join(',');
            console.log('Updated Files:', updatedFiles); // Debugging

            const [updateResult] = await connection.execute('UPDATE users SET downloaded_files = ? WHERE id = ?', [updatedFiles, userID]);

            if (updateResult.affectedRows === 1) {
                res.status(200).json({ message: 'Downloaded files updated successfully' });
            } else {
                res.status(500).json({ error: 'Failed to update downloaded files' });
            }
        } else {
            res.status(200).json({ message: 'File already exists in the list' });
        }

        connection.release();
    } catch (error) {
        console.error('Error updating downloaded_files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = updateDownloadedFiles;