<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = readCSV();
    foreach ($data as $key => $row) {
        if ($row[0] == $_POST['id']) {
            unset($data[$key]);
            break;
        }
    }
    writeCSV(array_values($data));
    echo json_encode(['status' => 'success', 'message' => 'Team member deleted successfully']);
}
?>
