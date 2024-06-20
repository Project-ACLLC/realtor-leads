<?php
$input = json_decode(file_get_contents('php://input'), true);
$contactStatusFile = '../json/contact_status.json';
$contactStatus = json_decode(file_get_contents($contactStatusFile), true);

$id = $input['id'];
$status = $input['status'];

if (isset($contactStatus[$id])) {
    $contactStatus[$id]['status'] = $status;
    file_put_contents($contactStatusFile, json_encode($contactStatus, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'success', 'message' => 'Contact status updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid ID']);
}
?>