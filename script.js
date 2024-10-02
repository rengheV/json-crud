const carForm = document.getElementById('carForm');
const carTableBody = document.querySelector('#carTable tbody');
const updateButton = document.getElementById('updateButton');
const carIdInput = document.getElementById('carId');

const API_URL = 'http://localhost:3000/cars';

// Fetch and display cars on page load
async function fetchCars() {
  const response = await fetch(API_URL);
  const cars = await response.json();
  displayCars(cars);
}

function displayCars(cars) {
  carTableBody.innerHTML = '';
  cars.forEach(car => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${car.brand}</td>
      <td>${car.model}</td>
      <td>${car.year}</td>
      <td>
        <button class="edit-button" data-id="${car.id}">Edit</button>
        <button class="delete-button" data-id="${car.id}">Delete</button>
      </td>
    `;
    carTableBody.appendChild(row);
  });
}

// Add a new car
carForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const brand = document.getElementById('brand').value;
  const model = document.getElementById('model').value;
  const year = document.getElementById('year').value;

  if (carIdInput.value) {
    // Update existing car
    const carId = carIdInput.value;
    await fetch(`${API_URL}/${carId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, model, year })
    });
    carIdInput.value = '';
    updateButton.style.display = 'none';
  } else {
    // Add new car
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, model, year })
    });
  }

  carForm.reset();
  fetchCars();
});

// Handle delete and edit actions
carTableBody.addEventListener('click', async function (e) {
  const carId = e.target.dataset.id;

  if (e.target.classList.contains('delete-button')) {
    await fetch(`${API_URL}/${carId}`, { method: 'DELETE' });
    fetchCars();
  } else if (e.target.classList.contains('edit-button')) {
    const response = await fetch(`${API_URL}/${carId}`);
    const car = await response.json();
    document.getElementById('brand').value = car.brand;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    carIdInput.value = car.id;
    updateButton.style.display = 'block';
  }
});

// Fetch cars on load
fetchCars();
