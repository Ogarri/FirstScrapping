document.addEventListener('DOMContentLoaded', () => {
    fetch('Data/data_JPO.json')
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
                            <th>Nom</th>
                            <th>Ville</th>
                            <th>Code Postal</th>
                            <th>Formations</th> <!-- Nouvelle colonne pour les formations -->
                            <th>Dates JPO</th> <!-- Nouvelle colonne pour les dates JPO -->
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr onclick="window.location.href='details.html?nom=${encodeURIComponent(item.nom)}'">
                                <td>${item.nom}</td>
                                <td>${item.ville}</td>
                                <td>${item.codePostal}</td>
                                <td>
                                    <ul>
                                        ${item.formations.map(formation => `<li>${formation.formationNom}</li>`).join('')}
                                    </ul>
                                </td> <!-- Affichage des noms des formations -->
                                <td>
                                    <ul>
                                        ${item.dateJPO.map(date => `<li>${date.replace(/-/g, '/')}</li>`).join('')} <!-- Remplacement des "-" par des "/" -->
                                    </ul>
                                </td> <!-- Affichage des dates JPO -->
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
                    const matchesName = item.nom.toLowerCase().includes(searchTerm);
                    const itemDate = new Date(item.date);
                    const matchesDate = dateFilterType.value === 'exact' ? itemDate.toISOString().split('T')[0] === date :
                                        dateFilterType.value === 'interval' ? itemDate >= new Date(startDate) && itemDate <= new Date(endDate) : true;
                    return matchesName && matchesDate;
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
