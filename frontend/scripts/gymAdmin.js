document.addEventListener('DOMContentLoaded', async () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const id = getCookie("gymAdminId");
  let gymId;

  // Initialize empty data arrays for registered members and amount
  const registeredMembersData = new Array(12).fill(0); // Monthly registered members count
  const amountData = new Array(12).fill(0); // Monthly total amount paid

  // Track the current chart instances
  let amountChartInstance = null;
  let membersChartInstance = null;
  let lineChartInstance = null;

  // Fetch sales data from the endpoint
  loadGymDropdowns(id);

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

  async function loadGymDropdowns(id) {
    try {
      const response = await axios.get(`http://localhost:3000/getAdminGyms?id=${id}`);
      const gyms = response.data;

      const dropdown = document.getElementById('gymDropdown');
      dropdown.innerHTML = ''; // Clear existing options

      gyms.forEach(gym => {
        const option = document.createElement('option');
        option.value = gym.gym_id;
        option.textContent = gym.gym_name;
        dropdown.appendChild(option);
      });

      gymId = gyms[0].gym_id; // Set initial gymId based on the first gym
      await fetchSalesData(gymId); // Fetch sales data for the initial gym

    } catch (error) {
      console.error('Error fetching gyms:', error);
      alert('Could not load gyms. Please try again later.');
    }
  }

  // Add event listener to update the charts when a gym is selected from the dropdown
  document.getElementById('gymDropdown').addEventListener('change', async (event) => {
    const selectedGymId = event.target.value;
    gymId = selectedGymId;
    await fetchSalesData(gymId); // Fetch data for the newly selected gym
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
