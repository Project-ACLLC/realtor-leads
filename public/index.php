<?php
session_start(); 
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: log-in.php");
    echo "Not authenticated!";
    exit;
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Realtor Teams Management</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- Font Awesome CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/cleave.js@1.6.0/dist/cleave.min.js"></script>

    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="assets/css/auth.css">
</head>
<body>

<header class="auth">
    <div>Welcome <?php echo strtoupper($_SESSION['username']) ?></div>
    <a href="logout.php" class="log-out">Logout <i class="icon-logout"></i></a>
</header>

    <div class="container mt-5">
        <div class="d-flex flex-wrap justify-content-between gap-4 mb-5">
            <div class="filter-container">
                <h1 class="m-0 mb-4">Realtor Teams Management</h1>
                <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
                    <div class="label-container">
                        <span class="label-text">Search by Name:</span>
                    </div>
                    <div class="d-grid align-items-center gap-3">
                        <div class="search-filter-container">
                            <input id="searchByName" type="text" class="search-filter form-control m-0" placeholder="" oninput="filterData()">
                            <i class="search-icon fa fa-magnifying-glass"></i>
                        </div>
                        <!-- <input id="salesFilter" type="text" class="min-sales form-control filter-input m-0" placeholder="Sales" maxlength="4" oninput="filterData()"> -->
                        <select id="salesFilter" class="min-sales form-control filter-sort" onchange="filterData()">
                            <option value="" selected disabled>Sales</option>
                            <option value="highest">Highest Sales</option>
                            <option value="lowest">Lowest Sales</option>
                        </select>
                    </div>
                </div>
                <div class="d-flex flex-wrap align-items-center gap-3">
                    <div class="label-container">
                        <span class="label-text">Filter by State:</span>
                    </div>
                    <div class="d-grid align-items-center gap-3">
                        <select id="stateFilter" class="state-filter form-control" onchange="filterData()">
                            <option value="">All States</option>
                            <!-- States will be dynamically loaded here -->
                        </select>
                        <!-- <input id="reviewsFilter" type="text" class="min-reviews form-control filter-input m-0" placeholder="Min Reviews" maxlength="4" oninput="filterData()"> -->
                        <select id="reviewsFilter" class="min-reviews form-control filter-sort" onchange="filterData()">
                            <option value="" selected disabled>Reviews</option>
                            <option value="highest">Highest Reviews</option>
                            <option value="lowest">Lowest Reviews</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="add-new-container d-flex flex-column gap-2 mt-auto">
                <div id="message" class="message-text"></div>
                <div class="add-new col">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#showAddNewModal" onclick="showCreateForm()">Add New Realtor Lead</button>
                </div>
                <!-- <div class="align-self-end">
                    <span id="recordCount" class="record-count"></span>
                </div> -->
            </div>
        </div>
        <div id="createForm" class="create-form">
            <!-- Form will be dynamically loaded here -->
        </div>
        <div id="teamList" class="team-list">
            <!-- Team list will be dynamically loaded here -->
        </div>

        <!-- Details Modal -->
        <div class="details-modal modal fade" id="showSocialDetailsModal" tabindex="-1" role="dialog" aria-labelledby="showSocialDetailsModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="showSocialDetailsModalTitle">Details</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id="viewDetailsForm" action="">
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="website">Website:</label>
                                <input type="text" id="website" class="form-control read-only" name="website" readonly>
                            </div>
                            <div class="form-group">
                                <label for="facebook">Facebook:</label>
                                <input type="text" id="facebook" class="form-control read-only" name="facebook" readonly>
                            </div>
                            <div class="form-group">
                                <label for="pinterest">Pinterest:</label>
                                <input type="text" id="pinterest" class="form-control read-only" name="pinterest" readonly>
                            </div>
                            <div class="form-group">
                                <label for="blog">Blog:</label>
                                <input type="text" id="blog" class="form-control read-only" name="blog" readonly>
                            </div>
                            <div class="form-group">
                                <label for="instagram">Instagram:</label>
                                <input type="text" id="instagram" class="form-control read-only" name="instagram" readonly>
                            </div>
                            <div class="form-group">
                                <label for="twitter">Twitter:</label>
                                <input type="text" id="twitter" class="form-control read-only" name="twitter" readonly>
                            </div>
                            <div class="form-group">
                                <label for="linkedIn">LinkedIn:</label>
                                <input type="text" id="linkedIn" class="form-control read-only" name="linkedIn" readonly>
                            </div>
                            <div class="form-group">
                                <label for="youtube">YouTube:</label>
                                <input type="text" id="youtube" class="form-control read-only" name="youtube" readonly>
                            </div>
                        </div>
                        <div class="modal-footer">
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal fade" id="showEditModal" tabindex="-1" role="dialog" aria-labelledby="showEditModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="showEditModalTitle">Edit a Team Member</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="editForm" >
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="agentName">Agent Name:</label>
                            <input type="text" id="agentName" class="form-control" name="agentName" required>
                        </div>
                        <div class="form-group">
                            <label for="teamName">Team Name:</label>
                            <input type="text" id="teamName" class="form-control" name="teamName" required>
                        </div>
                        <div class="form-group">
                            <label for="state">State:</label>
                            <input type="text" id="state" class="form-control" name="state" required>
                        </div>
                        <div class="form-group">
                            <label for="brokerage">Brokerage:</label>
                            <input type="text" id="brokerage" class="form-control" name="brokerage" required>
                        </div>
                        <div class="form-group">
                            <label for="lastMonthSales">Last 12 Months Sales:</label>
                            <input type="number" id="lastMonthSales" class="form-control" name="lastMonthSales" value="0" required>
                        </div>
                        <div class="form-group">
                            <label for="agentPhone">Agent Phone:</label>
                            <input type="text" id="agentPhone" class="form-control" name="agentPhone" placeholder="(123) 456-7890" required>
                        </div>
                        <div class="form-group">
                            <label for="agentEmail">Agent Email:</label>
                            <input type="email" id="agentEmail" class="form-control" name="agentEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="zillowProfile">Zillow Profile:</label>
                            <input type="url" id="zillowProfile" class="form-control" name="zillowProfile">
                        </div>
                        <div class="form-group">
                            <label for="zillowReviews">Zillow Reviews:</label>
                            <input type="number" id="zillowReviews" class="form-control" name="zillowReviews" value="0">
                        </div>
                        <div class="form-group">
                            <label for="notes">Notes:</label>
                            <textarea id="notes" class="form-control" name="notes" rows="1"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="website">Website:</label>
                            <input type="text" id="website" class="form-control" name="website">
                        </div>
                        <div class="form-group">
                            <label for="facebook">Facebook:</label>
                            <input type="text" id="facebook" class="form-control" name="facebook">
                        </div>
                        <div class="form-group">
                            <label for="pinterest">Pinterest:</label>
                            <input type="text" id="pinterest" class="form-control" name="pinterest">
                        </div>
                        <div class="form-group">
                            <label for="blog">Blog:</label>
                            <input type="text" id="blog" class="form-control" name="blog">
                        </div>
                        <div class="form-group">
                            <label for="instagram">Instagram:</label>
                            <input type="text" id="instagram" class="form-control" name="instagram">
                        </div>
                        <div class="form-group">
                            <label for="twitter">Twitter:</label>
                            <input type="text" id="twitter" class="form-control" name="twitter">
                        </div>
                        <div class="form-group">
                            <label for="linkedIn">LinkedIn:</label>
                            <input type="text" id="linkedIn" class="form-control" name="linkedIn">
                        </div>
                        <div class="form-group">
                            <label for="youtube">YouTube:</label>
                            <input type="text" id="youtube" class="form-control" name="youtube">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" onclick="updateForm()">Update</button>
                    </div>
                </form>
                </div>
            </div>
        </div>

    </div>

    <script src="assets/js/scripts.js"></script>

    <!-- Bootstrap Bundle with Popper.js -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

</body>
</html>
