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
            const searchButton = document.getElementById('search-button');
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

            const filterData = () => {
                const searchTerm = searchBar.value.toLowerCase();
                const date = dateInput.value;
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;

                filteredData = data.filter(item => {
                    const matchesCity = item.city.toLowerCase().includes(searchTerm);
                    const itemDate = new Date(item.date);
                    const matchesDate = dateFilterType.value === 'exact' ? itemDate.toISOString().split('T')[0] === date :
                                        dateFilterType.value === 'interval' ? itemDate >= new Date(startDate) && itemDate <= new Date(endDate) : true;
                    return matchesCity && matchesDate;
                });

                renderTable(filteredData);
            };

            searchButton.addEventListener('click', filterData);

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

            renderTable(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));
});
