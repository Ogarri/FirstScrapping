document.addEventListener('DOMContentLoaded', () => {
    fetch('Data/data_JPO.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('data-container');
            const searchBar = document.getElementById('search-bar');
            const searchButton = document.getElementById('search-button');
            const resetButton = document.getElementById('reset-button');
            let filteredData = data;

            const renderTable = (data) => {
                container.innerHTML = '';
                const table = document.createElement('table');
                table.id = 'tableauGeneral';
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

                filteredData = data.filter(item => {
                    const matchesName = item.nom.toLowerCase().includes(searchTerm);
                    return matchesName;
                });

                renderTable(filteredData);
            };

            const resetFilters = () => {
                searchBar.value = '';
                filteredData = data;
                renderTable(filteredData);
            };

            searchButton.addEventListener('click', filterData);
            resetButton.addEventListener('click', resetFilters);

            renderTable(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));
});
