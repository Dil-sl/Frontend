const baseUrl = 'https://localhost:7198/';

$(document).ready(function() {
    // Load all employees initially
    loadAllEmployees();

    // Load departments and qualifications for create employee page initially
    loadDepartments().then(loadQualifications).then(() => {
        // Check if there's employee data in localStorage for editing
        const employeeData = JSON.parse(localStorage.getItem('employeeData'));
        if (employeeData) {
            populateForm(employeeData);
            localStorage.removeItem('employeeData'); // Clear the stored data
        }
    });

    // Event listener for login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        $.ajax({
            url: baseUrl + 'api/Login/Login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),
            success: function(response) {
                window.location.href = 'pages/dashboard.html';
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Event listener for create user button on dashboard
    $('#createUserBtn').click(function() {
        window.location.href = 'createEmployee.html';
    });

    // Event listener for edit button in employee table
    $(document).on('click', '.editBtn', function() {
        const employeeId = $(this).data('id');
        $.ajax({
            url: baseUrl + `api/Login/${employeeId}`,
            method: 'GET',
            success: function(employee) {
                localStorage.setItem('employeeData', JSON.stringify(employee));
                window.location.href = 'createEmployee.html';
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Event listener for delete button in employee table
    $(document).on('click', '.deleteBtn', function() {
        const employeeId = $(this).data('id');
        $.ajax({
            url: baseUrl + `api/Login/delete/${employeeId}`,
            method: 'DELETE',
            success: function(response) {
                alert('Employee deleted successfully');
                loadAllEmployees(); // Reload employees after deletion
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Event listener for create/update employee form submission
    $('#createEmployeeForm').submit(function(e) {
        e.preventDefault();
        const id = $(this).data('id') || 0; // Use 0 if creating a new employee
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const departmentName = $('#department').val();

        // Get the selected qualifications by name
        const qualifications = $('#qualifications option:selected').map(function() {
            return $(this).text();
        }).get().join(',');

        const employeeData = {
            id: id,
            name: name,
            email: email,
            password: password,
            departmentName: departmentName,
            qualifications: qualifications
        };

        const url = id ? `${baseUrl}api/Login/update/${id}` : `${baseUrl}api/Login/create`;
        const method = id ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(employeeData),
            success: function(response) {
                alert(id ? 'Employee updated successfully' : 'Employee created successfully');
                // Redirect or perform any other action
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});

// Function to load all employees
function loadAllEmployees() {
    $.ajax({
        url: baseUrl + 'api/Login/employees',
        method: 'GET',
        success: function(employees) {
            // Clear existing table data
            $('#employeeTable tbody').empty();
            // Populate the table with employee data
            employees.forEach(function(employee) {
                $('#employeeTable tbody').append(`
                    <tr>
                        <td>${employee.name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.departmentName}</td>
                        <td>${employee.qualifications}</td>
                        <td><button class="editBtn" data-id="${employee.id}">Edit</button></td>
                        <td><button class="deleteBtn" data-id="${employee.id}">Delete</button></td>
                    </tr>
                `);
            });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

// Function to load departments
function loadDepartments() {
    return $.ajax({
        url: baseUrl + 'api/Login/departments',
        method: 'GET',
        success: function(response) {
            // Populate department dropdown
            response.forEach(function(department) {
                $('#department').append(`<option value="${department.name}">${department.name}</option>`);
            });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

// Function to load qualifications
function loadQualifications() {
    return $.ajax({
        url: baseUrl + 'api/Login/qualifications',
        method: 'GET',
        success: function(response) {
            // Populate qualifications
            response.forEach(function(qualification) {
                $('#qualifications').append(`<option value="${qualification.id}">${qualification.name}</option>`);
            });
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

// Function to populate form with employee data
function populateForm(employee) {
    $('#name').val(employee.name);
    $('#email').val(employee.email);
    $('#password').val(employee.password);
    $('#department').val(employee.departmentName);

    // Split the qualifications string into an array
    const qualifications = employee.qualifications.split(',');

    // Clear existing selections
    $('#qualifications').val([]);

    // Select qualifications in the dropdown
    qualifications.forEach(function(qualification) {
        $('#qualifications').find(`option:contains("${qualification.trim()}")`).prop('selected', true);
    });

    // Change form action to update
    $('#createEmployeeForm').data('id', employee.id);
    $('#createEmployeeForm button').text('Update');
    $('#formTitle').text('Update Employee');
}


