document.addEventListener('DOMContentLoaded', () => {
    fetch('Scrapping/old_data.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('data-container');
            const searchBar = document.getElementById('search-bar');
            const dateFilterType = document.getElementById('date-filter-type');
            const dateInput = document.getElementById('date-input');
            const startDateInput = document.getElementById('start-date-input');
            const endDateInput = document.getElementById('end-date-input');
            let filteredData = data;

            const renderTable = (data) => {
                container.innerHTML = '';
                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Lien</th>
                            <th>Date</th>
                            <th>Ville</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td><a href="${item.href}">${item.href}</a></td>
                                <td>${item.date}</td>
                                <td>${item.city}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                container.appendChild(table);
            };

            searchBar.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filteredData = data.filter(item => item.city.toLowerCase().includes(searchTerm));
                renderTable(filteredData);
            });

            dateFilterType.addEventListener('change', () => {
                if (dateFilterType.value === 'exact') {
                    dateInput.style.display = 'block';
                    startDateInput.style.display = 'none';
                    endDateInput.style.display = 'none';
                } else if (dateFilterType.value === 'interval') {
                    dateInput.style.display = 'none';
                    startDateInput.style.display = 'block';
                    endDateInput.style.display = 'block';
                } else {
                    dateInput.style.display = 'none';
                    startDateInput.style.display = 'none';
                    endDateInput.style.display = 'none';
                }
            });

            dateInput.addEventListener('input', (e) => {
                const date = e.target.value;
                filteredData = data.filter(item => item.date === date);
                renderTable(filteredData);
            });

            startDateInput.addEventListener('input', () => {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;
                if (startDate && endDate) {
                    filteredData = data.filter(item => item.date >= startDate && item.date <= endDate);
                    renderTable(filteredData);
                }
            });

            endDateInput.addEventListener('input', () => {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;
                if (startDate && endDate) {
                    filteredData = data.filter(item => item.date >= startDate && item.date <= endDate);
                    renderTable(filteredData);
                }
            });

            renderTable(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));
});
