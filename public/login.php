<?php
session_start(); 

$data = json_decode(file_get_contents('./assets/js/users.json'), true);

function checkLogin($username, $password) {
  global $data;
  foreach ($data as $user) {
    if ($user['username'] === $username && $user['password'] === $password) {
      return true;
    }
  }
  return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'];
  $password = $_POST['password'];
  if (checkLogin($username, $password)) {
    $_SESSION['loggedin'] = true; // Set session variable indicating user is logged in
    $_SESSION['username'] = $username;
    header("Location: index.php"); // Redirect to the search view
    exit;
  } else {
    echo "Invalid username or password";
  }
}
?>