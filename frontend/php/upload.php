<?php
if (isset($_FILES['file'])) {
    $fileName = $_FILES['file']['name'];
    $fileTmpName = $_FILES['file']['tmp_name'];
    $uploadPath = '../../backend/uploads/files/' . basename($fileName); 

    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        echo "File uploaded successfully";
    } else {
        echo "Failed to upload file";
    }
}
?>
