function loadJSON(callback) {

  fetch('./assets/js/users.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      callback(data); // Invoke callback with loaded JSON data
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  const formData = new FormData(event.target);
  fetch('./login.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(message => console.log(message));

  authenticateUser();
});


// Function to handle authentication
function authenticateUser() {
  loadJSON(users => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const authenticatedUser = users.find(user => user.username === username && user.password === password);

    if (authenticatedUser) {
      alert('Login successful!'); // Replace with your own logic (e.g., redirecting to another page)
      // Example: Redirect to a welcome page after successful login
      window.location.href = 'index.php'; // Redirect to a welcome page
    } else {
      alert('Invalid username or password. Please try again.');
    }
  });
}


// Toggle click password input
const togglePassBtnElem = document.querySelector(".icon-password");
const passwordInputElem = document.querySelector("#password");

togglePassBtnElem.addEventListener("click", () => {
    togglePassBtnElem.classList.toggle("active");

    passwordInputElem.type === "password"
        ?  passwordInputElem.type = "text"
        : passwordInputElem.type = "password"

})
