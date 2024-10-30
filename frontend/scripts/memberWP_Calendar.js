const monthYearElement = document.getElementById('monthYear');
const calendarBody = document.getElementById('calendarBody');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const dateClickedElement = document.getElementById('dateClicked');

let currentDate = new Date();
let currentDay = currentDate.getDate(); // Get the current day of the month
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();




function renderCalendar(month, year) {
    monthYearElement.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month));
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarBody.innerHTML = '';

    let row = '<tr>';
    for (let i = 0; i < firstDay; i++) {
        row += '<td class="border-r border-b border-50"></td>'; // Empty cells for days before the first day of the month
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDay && month === currentMonth && year === currentYear;

        // Create the cell with an onclick event to set the clicked date
        row += `<td class="${isToday ? 'bg-customOrange text-white' : ''}" onclick="setClickedDate(${day}, ${month}, ${year})">
                    <div class="flex flex-col xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-transparent border-r border-b border-50 transition-all duration-300 hover:bg-50 cursor-pointer ${isToday ? 'bg-customOrange text-white rounded-full' : ''}">
                        <p class="text-base font-semibold">${day}</p>
                        <br>
                        <p class="text-xs">10 </p>
                        <p class="text-xs">workouts</p>
                    </div>
                </td>`;

        if ((day + firstDay) % 7 === 0) {
            row += '</tr><tr>'; // New row after every week
        }
    }
    row += '</tr>'; // Closing the last row
    calendarBody.innerHTML = row;
}



prevButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

// Initial render
renderCalendar(currentMonth, currentYear);