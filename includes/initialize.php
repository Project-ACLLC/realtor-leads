<?php
// Define file paths
$csvFile = '../csvs/realtor_teams.csv';
$statusesFile = '../json/statuses.json';
$contactStatusFile = '../json/contact_status.json';

// Helper function to read the CSV file
function readCSV($csvFile) {
    $file = fopen($csvFile, 'r');
    $headers = fgetcsv($file);
    $data = [];
    while (($row = fgetcsv($file)) !== FALSE) {
        $data[] = $row;
    }
    fclose($file);
    return ['headers' => $headers, 'data' => $data];
}

// Helper function to generate unique ID
function generateUniqueId() {
    return uniqid();
}

// Step 1: Read CSV and generate contact_status.json
$csvData = readCSV($csvFile);
$headers = $csvData['headers'];
$rows = $csvData['data'];

$contactStatus = [];
foreach ($rows as $index => $row) {
    $contactStatus[$index] = [
        'id' => generateUniqueId(),
        'status' => 'New',
        'record' => $row
    ];
}

file_put_contents($contactStatusFile, json_encode($contactStatus, JSON_PRETTY_PRINT));

// Step 2: Create statuses.json with default statuses
$defaultStatuses = ["New", "Contacted", "Follow-up", "Closed", "Archived"];
file_put_contents($statusesFile, json_encode($defaultStatuses, JSON_PRETTY_PRINT));

// Step 3: Create required PHP files

// get_statuses.php
$get_statuses_content = <<<'PHP'
<?php
header('Content-Type: application/json');
echo file_get_contents('../json/statuses.json');
?>
PHP;
file_put_contents('../includes/get_statuses.php', $get_statuses_content);

// get_contact_status.php
$get_contact_status_content = <<<'PHP'
<?php
header('Content-Type: application/json');
echo file_get_contents('../json/contact_status.json');
?>
PHP;
file_put_contents('../includes/get_contact_status.php', $get_contact_status_content);

// update_contact_status.php
$update_contact_status_content = <<<'PHP'
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
PHP;
file_put_contents('../includes/update_contact_status.php', $update_contact_status_content);

// update_statuses.php
$update_statuses_content = <<<'PHP'
<?php
$input = json_decode(file_get_contents('php://input'), true);
file_put_contents('../json/statuses.json', json_encode($input, JSON_PRETTY_PRINT));
echo json_encode(['status' => 'success', 'message' => 'Statuses updated successfully']);
?>
PHP;
file_put_contents('../includes/update_statuses.php', $update_statuses_content);

echo "Initialization complete!";
?>
