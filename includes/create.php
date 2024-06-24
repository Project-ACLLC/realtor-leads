<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    echo addNewMember(
        $_POST['agentName'],
        $_POST['teamName'],
        $_POST['state'],
        $_POST['brokerage'],
        $_POST['lastMonthSales'],
        $_POST['agentPhone'],
        $_POST['agentEmail'],
        $_POST['zillowProfile'],
        $_POST['zillowReviews'],
        $_POST['website'],
        $_POST['blog'],
        $_POST['facebook'],
        $_POST['instagram'],
        $_POST['linkedIn'],
        $_POST['pinterest'],
        $_POST['twitter'],
        $_POST['youtube'],
        $_POST['notes']
    );
}

function addNewMember(
    $name,
    $teamName,
    $state,
    $brokerage,
    $lastMonthSales,
    $phone,
    $email,
    $profile,
    $zillowReviews,
    $website,
    $blog,
    $facebook,
    $instagram,
    $linkedIn,
    $pinterest,
    $twitter,
    $youtube,
    $notes
) {
    $data = readCSV();

    $newId = count($data['data']) > 0 ? end($data['data'])[0] + 1 : 1;

    $newEntry = [
        $newId,
        htmlspecialchars($name),
        htmlspecialchars($teamName),
        htmlspecialchars($state),
        htmlspecialchars($brokerage),
        htmlspecialchars($lastMonthSales),
        htmlspecialchars($phone),
        htmlspecialchars($email),
        htmlspecialchars($profile),
        htmlspecialchars($zillowReviews),
        htmlspecialchars($website),
        htmlspecialchars($blog),
        htmlspecialchars($facebook),
        htmlspecialchars($instagram),
        htmlspecialchars($linkedIn),
        htmlspecialchars($pinterest),
        htmlspecialchars($twitter),
        htmlspecialchars($youtube),
        htmlspecialchars($notes)
    ];
    $data['data'][] = $newEntry;

    writeCSV($data);

    return json_encode(['status' => 'success', 'message' => 'Team member added successfully']);
}
?>