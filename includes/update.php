<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $updatedData = json_decode(file_get_contents('php://input'), true);
    $data = readCSV(false);
    $headers = $data['headers'];
    $rows = $data['data'];

    $file = fopen('../csvs/realtor_teams.csv', 'w'); 

    fputcsv($file, $headers);

    foreach ($rows as $row) {
        if ($row[0] == $updatedData['id']) { 
            foreach ($headers as $index => $header) {
                if (isset($updatedData[$header])) {
                    $row[$index] = $updatedData[$header];
                }else {
                    $row[$index] = ''; 
                }

            }
        }
        fputcsv($file, $row); 
    }

    fclose($file);

    echo json_encode(['status' => 'success', 'message' => 'Team member updated successfully']);
}
?>