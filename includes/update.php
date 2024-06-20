<?php
    include 'db.php';

    // if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //     $updatedData = json_decode(file_get_contents('php://input'), true);
    //     $data = readCSV(false);
    //     $headers = $data['headers'];
    //     $rows = $data['data'];

    //     foreach ($rows as &$row) {
    //         if ($row[0] == $updatedData['id']) { // Assuming 'id' is the first column
    //             foreach ($headers as $index => $header) {
    //                 if (isset($updatedData[$header])) {
    //                     $row[$index] = $updatedData[$header];
    //                 }
    //             }
    //             break;
    //         }
    //     }

    //     $file = fopen('../csvs/realtor_teams.csv', 'w');
    //     fputcsv($file, $headers);
    //     foreach ($rows as $row) {
    //         fputcsv($file, $row);
    //     }
    //     fclose($file);

    //     echo json_encode(['status' => 'success', 'message' => 'Team member updated successfully']);
    // }
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $updatedData = json_decode(file_get_contents('php://input'), true);
    
        // Log incoming data
        error_log("Incoming data: " . print_r($updatedData, true));
    
        $data = readCSV(false);
        $headers = $data['headers'];
        $rows = $data['data'];
    
        // Log CSV data
        error_log("CSV Headers: " . print_r($headers, true));
        error_log("CSV Rows: " . print_r($rows, true));
    
        $idIndex = array_search('id', array_map('strtolower', $headers)); // Assuming 'id' is a header, using strtolower for case-insensitivity
        if ($idIndex === false) {
            echo json_encode(['status' => 'error', 'message' => 'ID column not found in CSV']);
            exit();
        }
    
        $isUpdated = false;
        foreach ($rows as &$row) {
            if ($row[$idIndex] == $updatedData['id']) {
                foreach ($headers as $index => $header) {
                    if (isset($updatedData[$header])) {
                        $row[$index] = $updatedData[$header];
                    }
                }
                $isUpdated = true;
                break;
            }
        }
    
        if ($isUpdated) {
            $file = fopen('../csvs/realtor_teams.csv', 'w');
            fputcsv($file, $headers);
            foreach ($rows as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
            echo json_encode(['status' => 'success', 'message' => 'Team member updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Record not found']);
        }
    }
?>