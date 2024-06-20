<?php
$input = json_decode(file_get_contents('php://input'), true);
file_put_contents('../json/statuses.json', json_encode($input, JSON_PRETTY_PRINT));
echo json_encode(['status' => 'success', 'message' => 'Statuses updated successfully']);
?>