document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nom = urlParams.get('nom');

    fetch('Data/data_JPO.json')
        .then(response => response.json())
        .then(data => {
            const item = data.find(item => item.nom === nom);
            if (item) {
                const detailsContainer = document.getElementById('item-details');
                detailsContainer.innerHTML = `
                    <p><strong>Nom:</strong> ${item.nom}</p>
                    <p><strong>Ville:</strong> ${item.ville}</p>
                    <p><strong>Code Postal:</strong> ${item.codePostal}</p>
                    <p><strong>Formations:</strong></p>
                    <table id="tableauDetail">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Durée</th>
                                <th>Modalité</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.formations.map(formation => `
                                <tr>
                                    <td>${formation.formationNom}</td>
                                    <td>${formation.duree}</td>
                                    <td>${formation.modalite}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <p><strong>Dates JPO:</strong></p>
                    <ul>
                        ${item.dateJPO.map(date => `<li>${date.replace(/-/g, '/')}</li>`).join('')}
                    </ul>
                    <p><strong>Téléphone:</strong> ${item.telephone}</p>
                    <p><strong>Email:</strong> ${item.email}</p>
                    <p><strong>Site Web:</strong> <a href="${item.siteWeb}" target="_blank">${item.siteWeb}</a></p>
                `;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
