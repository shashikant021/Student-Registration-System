// Ensure the script runs after the full HTML document has been loaded
document.addEventListener('DOMContentLoaded', function () {

    // Get form and input field references
    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const studentIdInput = document.getElementById('studentId');
    const emailInput = document.getElementById('email');
    const contactInput = document.getElementById('contact');
    const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
  
    // Load student data from local storage or initialize an empty array
    let students = JSON.parse(localStorage.getItem('students')) || [];
  
    // Function to render all student records in the table
    function renderTable() {
      studentTable.innerHTML = ''; // Clear the table
  
      students.forEach((student, index) => {
        const row = document.createElement('tr'); // Create a new table row
  
        // Fill row with student data
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.studentId}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td class="actions"></td>
        `;
  
        const actionsCell = row.querySelector('.actions'); // Select the actions cell
  
        // Create Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editStudent(index));
        actionsCell.appendChild(editButton); // Add Edit button
  
        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteStudent(index));
        actionsCell.appendChild(deleteButton); // Add Delete button
  
        studentTable.appendChild(row); // Add row to the table
      });
    }
  
    // Validate input fields with regex
    function validateInput(name, studentId, email, contact) {
      const nameRegex = /^[A-Za-z ]+$/;
      const idRegex = /^\d+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const contactRegex = /^\d+$/;
  
      return (
        nameRegex.test(name) &&
        idRegex.test(studentId) &&
        emailRegex.test(email) &&
        contactRegex.test(contact)
      );
    }
  
    // Handle form submission
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent form from reloading the page
  
      const name = nameInput.value.trim();
      const studentId = studentIdInput.value.trim();
      const email = emailInput.value.trim();
      const contact = contactInput.value.trim();
  
      if (!name || !studentId || !email || !contact) {
        alert('All fields are required.');
        return;
      }
  
      if (!validateInput(name, studentId, email, contact)) {
        alert('Please enter valid details.');
        return;
      }
  
      if (form.dataset.editIndex) {
        // Update existing student record
        students[form.dataset.editIndex] = { name, studentId, email, contact };
        delete form.dataset.editIndex;
      } else {
        // Add new student record
        students.push({ name, studentId, email, contact });
      }
  
      // Save to local storage and refresh table
      localStorage.setItem('students', JSON.stringify(students));
      form.reset(); // Clear form
      renderTable(); // Re-render table
    });
  
    // Delete a student record
    function deleteStudent(index) {
      if (confirm('Are you sure you want to delete this record?')) {
        students.splice(index, 1); // Remove from array
        localStorage.setItem('students', JSON.stringify(students)); // Update storage
        renderTable(); // Refresh table
      }
    }
  
    // Load student data into the form for editing
    function editStudent(index) {
      const student = students[index];
      nameInput.value = student.name;
      studentIdInput.value = student.studentId;
      emailInput.value = student.email;
      contactInput.value = student.contact;
      form.dataset.editIndex = index; // Store the index for editing
    }
  
    renderTable(); // Initial render on page load
  });
  