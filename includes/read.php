<?php
include 'db.php';

$response = readCSV();
echo json_encode($response);
?>
