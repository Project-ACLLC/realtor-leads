document.addEventListener('DOMContentLoaded', function() {
    loadTeamList(1); // Load the first page by default
    loadStateFilter(); // Load the state filter options

    document.getElementById("creationForm").addEventListener("submit", submitForm);

});

function loadStateFilter() {
    fetch('../includes/read.php')
    .then(response => response.json())
    .then(data => {
        const headers = data.headers;
        const rows = data.data;
        const stateIndex = headers.indexOf('State');
        const states = [...new Set(rows.map(row => row[stateIndex]))].sort();
        const stateFilter = document.getElementById('stateFilter');
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        });
    });
}

function filterData() {
    const state = document.getElementById('stateFilter').value;
    const salesFilter = document.getElementById('salesFilter').value;
    const reviewsFilter = document.getElementById('reviewsFilter').value;
    const searchByAgentName = document.getElementById('searchByName').value;
    loadTeamList(1, state, salesFilter, reviewsFilter, searchByAgentName);
}

function salesFilterSort(salesFilter) {
    document.getElementById('reviewsFilter').value = ''; // Reset the reviews filter
    loadTeamList(1, '', salesFilter, '', '');
}

function reviewsFilterSort(reviewsFilter) {
    document.getElementById('salesFilter').value = ''; // Reset the sales filter
    loadTeamList(1, '', '', reviewsFilter, '');
}

const searchFilter = document.querySelector('.search-filter');
const searchFilterContainer = document.querySelector('.search-filter-container');
const searchIcon = document.querySelector('.search-icon');

searchFilter.addEventListener('click', function() {
    searchIcon.style.display = 'none';
});

document.addEventListener('click', function(event) {
    if (!searchFilterContainer.contains(event.target)) {
        searchIcon.style.display = 'inline-block';
    }
});

function loadTeamList(page, filterState = '', salesFilter = '', reviewsFilter = '', agentName = '') {
    fetch('../includes/read.php')
    .then(response => response.json())
    .then(data => {
        const headers = data.headers;
        const rows = data.data;
        const itemsPerPage = 5; // Change the number of items per page to 5
        let filteredRows = rows;

        if (filterState || salesFilter || reviewsFilter || agentName) {
            const stateIndex = headers.indexOf('State');
            const salesIndex = headers.indexOf('Last 12 Months Sales');
            const reviewsIndex = headers.indexOf('Zillow Reviews');
            const agentNameIndex = headers.indexOf('Agent Name');

            filteredRows = rows.filter(row => {
                const stateMatch = filterState ? row[stateIndex] === filterState : true;
                const agentNameMatch = agentName ? row[agentNameIndex].toLowerCase().includes(agentName.toLowerCase()) : true;
                return stateMatch && agentNameMatch;
            });

            if (salesFilter) {
                filteredRows.sort((a, b) => {
                    const salesA = parseInt(a[salesIndex]);
                    const salesB = parseInt(b[salesIndex]);
                    if (salesFilter === 'highest') {
                        return salesB - salesA; // Sort descending for highest
                    } else if (salesFilter === 'lowest') {
                        return salesA - salesB; // Sort ascending for lowest
                    }
                });
            }

            if (reviewsFilter) {
                filteredRows.sort((a, b) => {
                    const reviewsA = parseInt(a[reviewsIndex]);
                    const reviewsB = parseInt(b[reviewsIndex]);
                    if (reviewsFilter === 'highest') {
                        return reviewsB - reviewsA; // Sort descending for highest
                    } else if (reviewsFilter === 'lowest') {
                        return reviewsA - reviewsB; // Sort ascending for lowest
                    }
                });
            }
        }

        const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedRows = filteredRows.slice(start, end);

        let table = `<div class="table-responsive"><div class="table-width"><table class="table table-bordered"><thead><tr>`;
        headers.forEach(header => {
            if (!['Facebook', 'Instagram', 'LinkedIn', 'Pinterest', 'Twitter', 'YouTube', 'Website', 'Blog'].includes(header)) {
                if (header === 'Last 12 Months Sales') {
                    table += `<th>${header} 
                    <span class="filter-arrow">
                        <a class="arrow-up" onclick="loadTeamList(${page}, '${filterState}', 'highest', '', '${agentName}')">
                            <i class="fa fa-caret-up"></i>
                        </a>
                        <a class="arrow-down" onclick="loadTeamList(${page}, '${filterState}', 'lowest', '', '${agentName}')">
                            <i class="fa fa-caret-down"></i>
                        </a>
                    </span>
                    `;
                }
                else if (header === 'Zillow Reviews') {
                    table += `<th>${header} 
                    <span class="filter-arrow">
                        <a class="arrow-up" onclick="loadTeamList(${page}, '${filterState}', '', 'highest', '${agentName}')">
                            <i class="fa fa-caret-up"></i>
                        </a>
                        <a class="arrow-down" onclick="loadTeamList(${page}, '${filterState}', '', 'lowest', '${agentName}')">
                            <i class="fa fa-caret-down"></i>
                        </a>
                    </span>
                    `;
                }
                else {
                    table += `<th>${header}</th>`;
                }
            }
        });
        table += `<th>Actions</th></tr></thead><tbody>`;
        paginatedRows.forEach((row, index) => {
            table += `<tr id="row-${index}" data-id="${row[0]}">`;
            row.forEach((cell, cellIndex) => {
                if (headers[cellIndex] === 'Zillow Profile') {
                    if(cell !== ''){
                        table += `<td><button class="btn btn-link" onclick="window.open('${cell}', '_blank')">View Profile</button></td>`;
                    }else {
                        table += `<td></td>`;
                    }
                    
                } else if (!['Facebook', 'Instagram', 'LinkedIn', 'Pinterest', 'Twitter', 'YouTube', 'Website', 'Blog'].includes(headers[cellIndex])) {
                    table += `<td class="table-value" data-header="${headers[cellIndex]}">${cell}</td>`;
                } 
            });
            table += `<td>
                <div class="btn-wrap">
                    <button class="btn btn-info btn-sm" title="Details" data-toggle="modal" data-target="#showSocialDetailsModal" onclick="toggleDetails(${row[0]})">
                        <i class="fa fa-info"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" title="Edit" data-toggle="modal" data-target="#showEditModal" onclick="editRows(${row[0]})">
                        <i class="fa fa-edit"></i>
                    </button>
                </div>
            </td></tr>`;
        });
        table += `</tbody></table></div></div>`;
        
        let pagination = `<nav class="d-flex align-items-center justify-content-between" aria-label="Page navigation"><div class="left-container"><span id="recordCount" class="record-count"></span></div><ul class="pagination m-0">`;
        const maxPagesToShow = 5;
        let startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
        let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(endPage - maxPagesToShow + 1, 1);
        }

        if (startPage > 1) {
            pagination += `<li class="page-item"><a class="page-link" href="#" onclick="loadTeamList(1, '${filterState}', '${salesFilter}', '${reviewsFilter}', '${agentName}')">First</a></li>`;
            pagination += `<li class="page-item"><a class="page-link" href="#" onclick="loadTeamList(${page - 1}, '${filterState}', '${salesFilter}', '${reviewsFilter}', '${agentName}')">Previous</a></li>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination += `<li class="page-item ${i === page ? 'active' : ''}"><a class="page-link" href="#" onclick="loadTeamList(${i}, '${filterState}', '${salesFilter}', '${reviewsFilter}', '${agentName}')">${i}</a></li>`;
        }

        if (endPage < totalPages) {
            pagination += `<li class="page-item"><a class="page-link" href="#" onclick="loadTeamList(${page + 1}, '${filterState}', '${salesFilter}', '${reviewsFilter}', '${agentName}')">Next</a></li>`;
            pagination += `<li class="page-item"><a class="page-link" href="#" onclick="loadTeamList(${totalPages}, '${filterState}', '${salesFilter}', '${reviewsFilter}', '${agentName}')">Last</a></li>`;
        }

        pagination += `</ul></nav>`;

        document.getElementById('teamList').innerHTML = table + pagination;
        document.getElementById('recordCount').textContent = `Total Records: ${filteredRows.length}`;
    });
}

async function toggleDetails(id) {

    const data = await this.getById(id);

    const form = document.getElementById('viewDetailsForm');
   
    form.elements['website'].value = data["Website"];
    form.elements['facebook'].value = data["Facebook"];
    form.elements['pinterest'].value = data["Pinterest"];
    form.elements['blog'].value = data["Blog"];
    form.elements['instagram'].value = data["Instagram"];
    form.elements['linkedIn'].value = data["LinkedIn"];
    form.elements['youtube'].value = data["YouTube"];
    form.elements['twitter'].value = data["Twitter"];

}

// US States
const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
    "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

function showCreateForm() {
    const createForm = document.getElementById('createForm');

    let showFormModal = `
        <!-- Add New Realtor Lead Modal -->
        <div class="modal fade" id="showAddNewModal" tabindex="-1" role="dialog" aria-labelledby="showAddNewModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="showAddNewModalTitle">Add New Team Member</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form id="creationForm" action="" method="POST">
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
                            <select id="state" class="state form-control" name="state" required>
                            </select>
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
                        <button type="submit" class="btn btn-primary" onclick="submitForm()">Submit</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    `;

    createForm.insertAdjacentHTML('beforeend', showFormModal);

    // Agent Phone Format
    document.getElementById('agentPhone').addEventListener('input', function (e) {
        let value = e.target.value;
    
        // Insert formatting logic here
        // For simplicity, let's assume we just handle "Cell" designation
        if (value.startsWith("Cell")) {
            value = value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4) + ' ' + value.slice(4);
            if (value.length > 8) value = value.slice(0, 8) + '-' + value.slice(8);
            if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
            e.target.value = 'Cell ' + value;
        } else {
            // Default phone formatting
            value = value.replace(/\D/g, '');
            if (value.length > 3) value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
            if (value.length > 9) value = value.slice(0, 9) + '-' + value.slice(9);
            e.target.value = value;
        }
    });

    let optionsAppended = false;
    const showStates = document.querySelector('.state');

    showStates.addEventListener('click', function(event) {
        const stateSelect = event.target;

        if (!optionsAppended) {
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateSelect.appendChild(option);
            });
            optionsAppended = true;
        }
    });
}

let optionsAppended = false;
const showStates = document.querySelector('.state');

showStates.addEventListener('click', function(event) {
    const stateSelect = event.target;

    if (!optionsAppended) {
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            option.selected = true;
            stateSelect.appendChild(option);
        });
        optionsAppended = true;
    }
});

function submitForm(){
    event.preventDefault(); 

    var form = document.getElementById("creationForm");

    if (form.checkValidity() === false) {
        form.reportValidity();
        return;
    }

    var formData = new FormData(form);

    fetch('../includes/create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);
        loadTeamList(1);
        hideCreateForm();
        window.location.reload();
    });

}

function hideCreateForm() {
    document.getElementById('createForm').style.display = 'none';
    document.getElementById('createForm').innerHTML = '';
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
}
var forUpdateId = 0;

async function editRows(id){
    forUpdateId = id;
    const form = document.getElementById('editForm');
    form.setAttribute("data-header", `${id}`);

    const result = await this.getById(id);

    showModalEdit(result);
    
}
function populateSelect(data) {
    // Get the select element
    var select = document.getElementById('state');

    // Create a new option element
    var option = document.createElement('option');
    option.value = data.state;
    option.textContent = data.state;

    // Add the option to the select element
    select.appendChild(option);
}

function showModalEdit(data){

    const form = document.getElementById('editForm');

    form.elements['agentName'].value = data["Agent Name"];
    form.elements['teamName'].value = data["Team Name"];
    form.elements['state'].value = data["State"];
    form.elements['brokerage'].value = data["Brokerage"];
    form.elements['lastMonthSales'].value = data["Last 12 Months Sales"];
    form.elements['agentPhone'].value = data["Agent Phone"];
    form.elements['agentEmail'].value = data["Agent Email"];
    form.elements['zillowProfile'].value = data["Zillow Profile"];
    form.elements['zillowReviews'].value = data["Zillow Reviews"];
    form.elements['notes'].value = data["Notes"];
    form.elements['website'].value = data["Website"];
    form.elements['facebook'].value = data["Facebook"];
    form.elements['pinterest'].value = data["Pinterest"];
    form.elements['blog'].value = data["Blog"];
    form.elements['instagram'].value = data["Instagram"];
    form.elements['linkedIn'].value = data["LinkedIn"];
    form.elements['youtube'].value = data["YouTube"];
    form.elements['twitter'].value = data["Twitter"];

     // Populate the state select element
     const stateSelect = form.elements['state'];
     stateSelect.innerHTML = ''; // Clear any existing options
     const option = document.createElement('option');
     option.value = data["State"];
     option.textContent = data["State"];
     stateSelect.appendChild(option);
 


    // Agent Phone Format
    document.getElementById('agentPhone').addEventListener('input', function (e) {
        let value = e.target.value;
    
        // Insert formatting logic here
        // For simplicity, let's assume we just handle "Cell" designation
        if (value.startsWith("Cell")) {
            value = value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4) + ' ' + value.slice(4);
            if (value.length > 8) value = value.slice(0, 8) + '-' + value.slice(8);
            if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
            e.target.value = 'Cell ' + value;
        } else {
            // Default phone formatting
            value = value.replace(/\D/g, '');
            if (value.length > 3) value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
            if (value.length > 9) value = value.slice(0, 9) + '-' + value.slice(9);
            e.target.value = value;
        }
    });
}
function updateForm() {
    var form = document.getElementById("editForm");
    const id = form.getAttribute("data-header");
    const updatedData = { id: id };
    var formData = new FormData(form);

    formData.forEach((value, key) => {
        updatedData[key] = value;
    });

    // Map form field names to CSV headers
    const fieldMap = {
        agentName: "Agent Name",
        teamName: "Team Name",
        state: "State",
        brokerage: "Brokerage",
        lastMonthSales: "Last 12 Months Sales",
        agentPhone: "Agent Phone",
        agentEmail: "Agent Email",
        zillowProfile: "Zillow Profile",
        zillowReviews: "Zillow Reviews",
        notes: "Notes",
        website: "Website",
        facebook: "Facebook",
        pinterest: "Pinterest",
        blog: "Blog",
        instagram: "Instagram",
        linkedIn: "LinkedIn",
        youtube: "YouTube",
        twitter: "Twitter",
        status: "Status"
    };

    for (const [formField, csvHeader] of Object.entries(fieldMap)) {
        if (updatedData[formField]) {
            updatedData[csvHeader] = updatedData[formField];
            delete updatedData[formField];
        }
    }

    console.log("Updated data to be sent:", updatedData);

    fetch('../includes/update.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);
        if (data.status === 'success') {
            // window.location.reload(); // Refresh the page to reflect the changes
        }
    })
    .catch(error => {
        console.error('Error updating data:', error);
        showMessage('Failed to update data.');
    });
}

function saveRow(index) {
    const row = document.getElementById(`row-${index}`);
    const cells = row.querySelectorAll('.table-value');
    const updatedData = { id: row.getAttribute('data-id') };

    cells.forEach(cell => {
        const header = cell.getAttribute('data-header');
        updatedData[header] = cell.textContent;
    });

    fetch('../includes/update.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);
        if (data.status === 'success') {
            loadTeamList(1); // Reload the first page after saving
        }
    });
}

async function getById(id) {
    try {
        const response = await fetch('../includes/read.php');
        const data = await response.json();
        const headers = data.headers;
        const rows = data.data;

        const index = headers.indexOf('id');
        const filteredRows = rows.filter(row => row[index] === id.toString());

        if (filteredRows.length === 0) {
            return null; // or handle the case where no matching record is found
        }

        const result = headers.reduce((obj, property, index) => {
            obj[property] = filteredRows[0][index];
            return obj;
        }, {});

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // or handle the error appropriately
    }
}