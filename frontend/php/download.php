<?php
if (isset($_GET['file'])) {
    $fileName = $_GET['file'];
    $filePath = '../../backend/uploads/files/' . $fileName; 
    
    if (file_exists($filePath)) {
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    } else {
        // File not found
        echo "File not found";
    }
}
?>
