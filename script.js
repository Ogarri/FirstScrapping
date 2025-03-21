document.addEventListener('DOMContentLoaded', () => {
    fetch('Data/data_JPO.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('data-container');
            const searchBar = document.getElementById('search-bar');
            const searchButton = document.getElementById('search-button');
            const resetButton = document.getElementById('reset-button');
            const startDateFilter = document.getElementById('start-date-filter');
            const endDateFilter = document.getElementById('end-date-filter');
            const postalCodeFilter = document.getElementById('postal-code-filter');
            const paginationContainer = document.getElementById('pagination-container');
            const sortSelect = document.getElementById('sort-select'); // Menu déroulant pour le tri
            let filteredData = data;
            let currentPage = 1;
            const itemsPerPage = 30;
            let currentSort = { column: null, order: 'asc' };

            const renderTable = (data, page = 1) => {
                container.innerHTML = '';
                const table = document.createElement('table');
                table.id = 'tableauGeneral';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Ville</th>
                            <th>Code Postal</th>
                            <th>Formations</th>
                            <th>Dates JPO</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(item => `
                            <tr onclick="window.open('details.html?nom=${encodeURIComponent(item.nom)}', '_blank')">
                                <td>${item.nom}</td>
                                <td>${item.ville}</td>
                                <td>${item.codePostal}</td>
                                <td>
                                    <ul>
                                        ${item.formations.map(formation => `<li>${formation.formationNom}</li>`).join('')}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        ${item.dateJPO.map(date => `<li>${date.replace(/-/g, '/')}</li>`).join('')}
                                    </ul>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                container.appendChild(table);
                renderPagination(data.length, page);
            };

            const renderPagination = (totalItems, currentPage) => {
                paginationContainer.innerHTML = '';
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = i;
                    pageButton.disabled = i === currentPage;
                    pageButton.addEventListener('click', () => {
                        renderTable(filteredData, i);
                    });
                    paginationContainer.appendChild(pageButton);
                }
            };

            const normalizeDate = (date) => {
                const [day, month, year] = date.split('/');
                return `${year}-${month}-${day}`;
            };

            const filterData = () => {
                const searchTerm = searchBar.value.toLowerCase();
                const startDateTerm = startDateFilter.value;
                const endDateTerm = endDateFilter.value;
                const postalCodeTerm = postalCodeFilter.value;

                filteredData = data.filter(item => {
                    const matchesName = item.nom.toLowerCase().includes(searchTerm);
                    const matchesPostalCode = item.codePostal.includes(postalCodeTerm);
                    const matchesDate = item.dateJPO.some(date => {
                        const normalizedDate = normalizeDate(date.replace(/-/g, '/'));
                        const dateMatches = (!startDateTerm || normalizedDate >= startDateTerm) && (!endDateTerm || normalizedDate <= endDateTerm);
                        return dateMatches;
                    });
                    return matchesName && matchesPostalCode && matchesDate;
                });

                sortTable();
                renderTable(filteredData, 1);
            };

            const resetFilters = () => {
                searchBar.value = '';
                startDateFilter.value = '';
                endDateFilter.value = '';
                postalCodeFilter.value = '';
                filteredData = data;
                sortTable();
                renderTable(filteredData, 1);
            };

            const sortTable = () => {
                const [column, order] = sortSelect.value.split('-');
                currentSort = { column, order };

                filteredData.sort((a, b) => {
                    let aValue = a[column];
                    let bValue = b[column];

                    if (column === 'dateJPO') {
                        aValue = normalizeDate(a.dateJPO[0].replace(/-/g, '/'));
                        bValue = normalizeDate(b.dateJPO[0].replace(/-/g, '/'));
                    }

                    if (aValue < bValue) return order === 'asc' ? -1 : 1;
                    if (aValue > bValue) return order === 'asc' ? 1 : -1;
                    return 0;
                });

                renderTable(filteredData, 1);
            };

            searchButton.addEventListener('click', filterData);
            resetButton.addEventListener('click', resetFilters);
            sortSelect.addEventListener('change', sortTable);

            renderTable(filteredData, 1);
        })
        .catch(error => console.error('Error fetching data:', error));
});
