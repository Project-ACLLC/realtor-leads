<?php
session_start();
// Check if user is already logged in, redirect to search_view.php
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header('Location: index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log in</title>
    <!-- <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet"> -->
    <link href="./assets/css/auth.css" rel="stylesheet">
    <style>

    </style>
</head>
<body id="auth">
    <main>
        <div class="container">
            <h1 class="mt-5">Log in</h1>
            <form id="loginForm"  method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <div class="form-group flex" style="margin-bottom: 20px;">
                    <label for="directory">Username:</label>
                    <input class="form-control" type="text" id="username" name="username" autocomplete="off" required>
                </div>
                <div class="form-group flex" style="position: relative">
                    <label for="searchString">Password:</label>
                    <div style="width: 100%"><input class="form-control" type="password" id="password" name="password" required><i class="icon-password"></i></div>
                </div>
                <div class="button-container">
                    <button type="submit" class="btn btn-primary mt-3">Login</button>
                </div>

            </form>
        </div>
    </main>
</body>
<script>


</script>
<script src="./assets/js/auth.js"></script>
</html>