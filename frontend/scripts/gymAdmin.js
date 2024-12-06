document.addEventListener('DOMContentLoaded', async () => {

  let gymId;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const id = getCookie("gymAdminId");

  // Initialize empty data arrays for registered members and amount
  const registeredMembersData = new Array(12).fill(0); // Monthly registered members count
  const amountData = new Array(12).fill(0); // Monthly total amount paid

  // Track the current chart instances
  let amountChartInstance = null;
  let membersChartInstance = null;
  let lineChartInstance = null;

  // Fetch sales data from the endpoint
  loadGymDropdowns(id);


  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Days to milliseconds
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  async function fetchAndPopulateTable(gymId) {
    const endpoint = `http://localhost:3000/getActiveCustomers?gym_id=${gymId}`;
    const memberTableBody = document.getElementById("memberTableBody");
    try {
      const response = await axios.get(endpoint);
      const members = response.data;
      console.log(members)
      // Clear the table before appending new data
      memberTableBody.innerHTML = "";

      // Populate the table
      members.forEach(member => {
        const statusClass =
          member.registration_status === "Active"
            ? "bg-green-500 text-white px-3 py-1 rounded-full"
            : "bg-red-500 text-white px-3 py-1 rounded-full";

        const row = `
            <tr class="text-white">
                <td class="px-6 py-3 border-b border-gray-800">${member.name}</td>
                <td class="px-6 py-3 border-b border-gray-800">${member.membership_type}</td>
                <td class="px-6 py-3 border-b border-gray-800">${new Date(member.date_started).toLocaleDateString()}</td>
                <td class="px-6 py-3 border-b border-gray-800">${new Date(member.date_end).toLocaleDateString()}</td>
                <td class="px-6 py-3 border-b border-gray-800">
                    <span class="${statusClass}">${member.registration_status}</span>
                </td>
            </tr>
        `;
        memberTableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  }

  async function fetchAndPopulatePaymentLogsTable(gymId) {
    const endpoint = `http://localhost:3000/getPaymentsLog?gym_id=${gymId}`;
    const PaymentsLogTableBody = document.getElementById("PaymentsLogTableBody");

    try {
      const response = await axios.get(endpoint);
      const members = response.data;
      console.log(members);

      // Clear the table before appending new data
      PaymentsLogTableBody.innerHTML = "";

      // Populate the table
      members.forEach(member => {
        const transferButton = member.payment_status === "Awaiting Transfer"
          ? `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="handleTransfer('${member.payment_id}', '${member.amount}')">Transfer Money</button>`
          : "Transferred";

        const row = `
          <tr class="text-white">
            <td class="px-6 py-3 border-b border-gray-800">${member.member_name}</td>
            <td class="px-6 py-3 border-b border-gray-800">${member.trainer_name}</td>
            <td class="px-6 py-3 border-b border-gray-800">${member.payment_method}</td>
            <td class="px-6 py-3 border-b border-gray-800">${member.amount}</td>
            <td class="px-6 py-3 border-b border-gray-800">${member.formatted_payment_date}</td>
            <td class="px-6 py-3 border-b border-gray-800">${transferButton}</td>
          </tr>
        `;
        PaymentsLogTableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  }

  async function fetchAndPopulateTrainers(gymId) {
    const endpoint = `http://localhost:3000/getTrainersd?gym_id=${gymId}`;
    const trainerTableBody = document.getElementById("trainerTableBody");

    try {
      const response = await axios.get(endpoint);
      const trainers = response.data;
      console.log("-x-x-xx-");
      console.log(trainers);

      // Clear the table before appending new data
      trainerTableBody.innerHTML = "";

      // Populate the table
      trainers.forEach(trainer => {
        const row = `
            <tr class="text-white">
                <td class="px-6 py-3 border-b border-gray-800">${trainer.trainer_name}</td>
                <td class="px-6 py-3 border-b border-gray-800">${trainer.experience}</td>
                <td class="px-6 py-3 border-b border-gray-800">${trainer.rates}</td>
                <td class="px-6 py-3 border-b border-gray-800 flex gap-2">
                    <button 
                        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                        onclick="openModal(${trainer.trainer_id})">
                        <i class="fas fa-users"></i> View Clients
                    </button>
                    <button
                        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"
                        onclick="opensModal(${trainer.trainer_id})">
                        <i class="fas fa-user-plus"></i> Assign Client
                    </button>
                    <button 
                        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2" 
                        onclick="alert('Sending payment to Trainer ID: ${trainer.trainer_id}')">
                        <i class="fas fa-dollar-sign"></i> Send Payment
                    </button>
                </td>
            </tr>
        `;
        trainerTableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  }

  async function fetchAndPopulateTrainerSales(gymId) {
    const endpoint = `http://localhost:3000/getAdminTrainers?gym_id=${gymId}`;
    const commissionTableBody = document.getElementById("commissionTableBody");

    // Array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    try {
      const response = await axios.get(endpoint);
      const members = response.data;

      // Clear the table before appending new data
      commissionTableBody.innerHTML = "";

      // Populate the table
      members.forEach(trainer => {
        const monthName = monthNames[trainer.month - 1];  // Convert number to month name

        const row = `
          <tr class="text-white">
              <td class="px-6 py-3 border-b border-gray-800">${trainer.Name}</td>
              <td class="px-6 py-3 border-b border-gray-800">${monthName}</td>
              <td class="px-6 py-3 border-b border-gray-800">${trainer.total_amount}</td>
              <td class="px-6 py-3 border-b border-gray-800">${trainer.member_count}</td>
              <td class="px-6 py-3 border-b border-gray-800">${trainer.gym_commission}</td>
          </tr>
        `;
        commissionTableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  }


  async function loadGymDropdowns(id) {
    try {
      const response = await axios.get(`http://localhost:3000/getAdminGyms?id=${id}`);
      const gyms = response.data;

      const dropdown = document.getElementById('gymDropdown');
      dropdown.innerHTML = ''; // Clear existing options

      if (!gyms || gyms.length === 0) {
        alert('No gyms found for this admin.');
        return; // Exit the function early if no gyms are found
      }

      gyms.forEach(gym => {
        const option = document.createElement('option');
        option.value = gym.gym_id;
        option.textContent = gym.gym_name;
        dropdown.appendChild(option);
      });

      const initialGymId = gyms[0]?.gym_id; // Check if gyms[0] exists before accessing gym_id
      setCookie('gymId', initialGymId, 1); // Expires in 1 day
      if (initialGymId) {
        await fetchSalesData(initialGymId); // Fetch sales data for the initial gym
        await fetchAndPopulateTable(initialGymId);
        await fetchAndPopulatePaymentLogsTable(initialGymId)
        await fetchAndPopulateTrainerSales(initialGymId);
        await fetchAndPopulateTrainers(initialGymId)
        await loadGymTrainers(initialGymId)
      }
    } catch (error) {
      console.error('Error fetching gyms:', error);
      alert('Could not load gyms. Please try again later.');
    }
  }
  async function loadGymTrainers(id) {
    try {
      const trainerDropdown = document.getElementById('trainerDropdown');

      // Fetch trainer data using Axios
      const response = await axios.get(`http://localhost:3000/getTrainersd`, {
        params: {
          gym_id: id
        }
      });

      console.log("Response:", response);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch trainers: ${response.statusText}`);
      }

      const trainers = response.data;

      // Clear the initial placeholder option
      trainerDropdown.innerHTML = '<option value="">Select a Trainer</option>';

      // Populate dropdown with trainer data
      trainers.forEach(trainer => {
        const option = document.createElement('option');
        option.value = trainer.trainer_id; // Use trainer_id as the value
        option.textContent = `${trainer.trainer_name}`;
        trainerDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching trainers:', error);
      const trainerDropdown = document.getElementById('trainerDropdown');
      trainerDropdown.innerHTML = '<option value="">Failed to load trainers</option>';
    }
  }



  // Add event listener to update the charts when a gym is selected from the dropdown
  document.getElementById('gymDropdown').addEventListener('change', async (event) => {
    const selectedGymId = event.target.value;
    gymId = selectedGymId;
    setCookie('gymId', gymId, 1); // Expires in 1 day
    await fetchSalesData(gymId); // Fetch data for the newly selected gym
    await fetchAndPopulateTable(gymId)
    await fetchAndPopulatePaymentLogsTable(gymId)
    await fetchAndPopulateTrainerSales(gymId)
    await fetchAndPopulateTrainers(gymId)
    await loadGymTrainers(gymId)
  });

  async function fetchSalesData(gymId) {
    try {
      const response = await axios.get(`http://localhost:3000/getSalesById?gym_id=${gymId}`);
      const salesData = response.data;

      // Reset data arrays to avoid carrying over old data
      amountData.fill(0); // Reset total amount data
      registeredMembersData.fill(0); // Reset registered members data

      if (salesData.length > 0) {
        // Populate data arrays with fetched data if there is sales data
        salesData.forEach(item => {
          const monthIndex = item.month - 1; // Convert month number to zero-based index
          amountData[monthIndex] = parseInt(item.total_amount_paid, 10);
          registeredMembersData[monthIndex] = item.members_registered;
        });
      }

      // Update the charts with the new data (even if it's empty, it will be correctly displayed)
      updateCharts();
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  }

  // Function to update the charts
  function updateCharts() {
    // Destroy existing chart instances if they exist
    if (amountChartInstance) amountChartInstance.destroy();
    if (membersChartInstance) membersChartInstance.destroy();
    if (lineChartInstance) lineChartInstance.destroy();

    // Chart for Total Amount Paid
    const amountCtx = document.getElementById('amountChart').getContext('2d');
    amountChartInstance = new Chart(amountCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Total Sales',
            data: amountData,
            backgroundColor: 'rgba(236, 126, 74, 0.5)',  // rgba equivalent of #EC7E4A with 50% opacity
            borderColor: 'rgba(236, 126, 74, 1)',       // rgba equivalent of #EC7E4A with full opacity          
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });

    // Chart for Registered Members
    const membersCtx = document.getElementById('membersChart').getContext('2d');
    membersChartInstance = new Chart(membersCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Registered Members',
            data: registeredMembersData,
            backgroundColor: 'rgba(236, 126, 74, 0.5)',  // rgba equivalent of #EC7E4A with 50% opacity
            borderColor: 'rgba(236, 126, 74, 1)',       // rgba equivalent of #EC7E4A with full opacity   
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });

    // Set up the months array (for the x-axis)
    const monthss = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Line Chart for Sales Data Over Time
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    lineChartInstance = new Chart(lineChartCtx, {
      type: 'line',
      data: {
        labels: monthss, // X-axis: months
        datasets: [
          {
            label: 'Total Sales Over Time',
            data: amountData, // Y-axis: total sales (from the server)
            borderColor: 'rgba(250, 126, 90, 60)',
            backgroundColor: 'rgba(236, 126, 74, 0.5)',
            fill: true,
            tension: 0.4  // Smooth the line
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });
  }




});
let trainerId;
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function opensModal(trainer_id) {
  trainerId = trainer_id
  document.getElementById('assignModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('assignModal').classList.add('hidden');
}

async function submitModal() {
  const accountId = document.getElementById('searchId').value;
  const plan = document.getElementById('plan').value;
  const gymId = getCookie("gymId");

  if (!accountId || !plan) {
    alert('Please fill in all fields.');
    return;
  }

  // Prepare the payload for the POST request
  const payload = {
    gym_id: gymId,
    trainer_id: trainerId,
    member_id: accountId,
    plan_type: plan
  };

  try {
    // Make the POST request using Axios
    const response = await axios.post('http://localhost:3000/insertTrainerClient', payload);

    if (response.status === 200) {
      alert(`Successfully assigned account ID ${accountId} to the ${plan} plan.`);
      closeModal(); // Assuming this closes the modal
    } else {
      alert('Failed to assign client. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    alert('An error occurred while assigning the client. Please try again.');
  }
}


async function fetchFilteredResults() {
  const input = document.getElementById('searchId').value;
  const dropdown = document.getElementById('dropdownList');

  // If input is empty, hide dropdown
  if (input.trim() === '') {
    dropdown.classList.add('hidden');
    dropdown.innerHTML = '';
    return;
  }
  try {
    // Fetch data from the API
    const response = await fetch(`http://localhost:3000/getSearchFilter?member_id=${input}`);
    const data = await response.json();

    // Clear previous dropdown content
    dropdown.innerHTML = '';
    dropdown.classList.remove('hidden');

    // Check if we have matching results
    if (data[0].length === 0) {
      const noResultsItem = document.createElement('li');
      noResultsItem.textContent = 'No results found';
      noResultsItem.className = 'px-4 py-2 text-gray-500';
      dropdown.appendChild(noResultsItem);
    } else {
      // Loop through the returned data and create list items
      data[0].forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.firstname} ${item.lastname} (ID: ${item.member_id})`;
        listItem.className =
          'px-4 py-2 hover:bg-gray-200 cursor-pointer';
        listItem.onclick = (event) => {
          event.stopPropagation();
          document.getElementById('searchId').value = ` ${item.member_id}`;
          document.getElementById('dropdownList').classList.add('hidden');
        };


        dropdown.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function selectMember(member) {
  console.log('Inside selectMember:', member); // Debugging
  alert('hi');
  document.getElementById('searchId').value = ` ${member.member_id}`;
  document.getElementById('dropdownList').classList.add('hidden');
}

// Function to handle the "Transfer Money" button click
async function handleTransfer(paymentId, price) {
  console.log(`Transfer initiated for payment ID: ${paymentId} and price of ${price}`);

  const response = await axios.post('http://localhost:3000/clientPayment', {
    paymentId: paymentId,
    price: price,

  });

  const result = response.data;
  window.location.href = result;
}

// Function to open the modal and fetch data
async function openModal(trainerId) {
  // Show the modal
  const modal = document.getElementById('clientModal');
  modal.classList.remove('hidden');

  // Fetch data from the endpoint
  const endpoint = `http://localhost:3000/getTrainersMembers?trainer_id=${trainerId}`;
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.length > 0) {
      // Populate modal content
      modalContent.innerHTML = `
                  <div class="grid grid-cols-1 gap-4">
                      ${data.map(member => `
                          <div class="p-4 border rounded-lg shadow-sm bg-gray-100">
                              <h3 class="font-semibold">${member.member_name}</h3>
                              <p class="text-sm text-gray-600">Plan Type: ${member.plan_type}</p>
                              <p class="text-sm text-gray-600">Start Date: ${member.start_date}</p>
                              <p class="text-sm text-gray-600">End Date: ${member.end_date}</p>
                          </div>
                      `).join('')}
                  </div>
              `;
    } else {
      modalContent.innerHTML = `<p class="text-gray-500">No clients found for this trainer.</p>`;
    }
  } catch (error) {
    modalContent.innerHTML = `<p class="text-red-500">Error fetching data. Please try again later.</p>`;
    console.error(error);
  }
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('clientModal');
  modal.classList.add('hidden');
}

