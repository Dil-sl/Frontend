var baseUrl = 'http://localhost:7198/';
$(document).ready(function() {
    // Login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        // AJAX call to your login endpoint
        $.ajax({
            url: baseUrl+'api/Login/Login',
            method: 'POST',
            data: { email: email, password: password },
            success: function(response) {
                // Redirect to dashboard or show dashboard content
                window.location.href = 'pages/dashboard.html';
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Load departments and qualifications for create employee page
    function loadDepartments() {
        $.ajax({
            url: baseUrl+'api/Login/departments',
            method: 'GET',
            success: function(response) {
                // Populate department dropdown
                response.forEach(function(department) {
                    $('#department').append(`<option value="${department.id}">${department.name}</option>`);
                });
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function loadQualifications() {
        $.ajax({
            url: baseUrl+'api/Login/qualifications',
            method: 'GET',
            success: function(response) {
                // Populate qualifications list
                response.forEach(function(qualification) {
                    $('#qualifications').append(`<option value="${qualification.id}">${qualification.name}</option>`);
                });
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    // On dashboard page load, fetch and display employee data
    if (window.location.pathname === '/pages/dashboard.html') {
        $.ajax({
            url: baseUrl+'api/Login/employees',
            method: 'GET',
            success: function(response) {
                // Populate employee table
                response.forEach(function(employee) {
                    $('#employeeTable').append(`
                        <tr>
                            <td>${employee.name}</td>
                            <td>${employee.email}</td>
                            <td>${employee.departmentName}</td>
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

    // Event listener for create user button on dashboard
    $('#createUserBtn').click(function() {
        window.location.href = 'pages/createEmployee.html';
        loadDepartments();
        loadQualifications();
    });

    // Event listener for edit button in employee table
    $(document).on('click', '.editBtn', function() {
        const employeeId = $(this).data('id');
        $.ajax({
            url: baseUrl+`api/Login/${employeeId}`,
            method: 'GET',
            success: function(employee) {
                // Populate create employee form with employee data
                $('#name').val(employee.name);
                $('#email').val(employee.email);
                $('#password').val(employee.password);
                $('#department').val(employee.departmentId); // Assuming departmentId matches dropdown value
                employee.qualifications.forEach(function(qualification) {
                    $('#qualifications').find(`option[value="${qualification.id}"]`).prop('selected', true);
                });
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });

    // Create employee form submission
    $('#createEmployeeForm').submit(function(e) {
        e.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const departmentId = $('#department').val();
        const qualifications = $('#qualifications').val().join(',');
        // AJAX call to create employee endpoint
        $.ajax({
            url:baseUrl+'api/Login/create',
            method: 'POST',
            data: { name: name, email: email, password: password, departmentId: departmentId, qualifications: qualifications },
            success: function(response) {
                alert('Employee created successfully');
                // Redirect or perform any other action
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});
