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
                    <p>
                        <strong>Dates JPO:</strong>
                        <ul>
                            ${item.dateJPO.map(date => `<li>${date.replace(/-/g, '/')}</li>`).join('')}
                        </ul>
                    </p>
                    <p><strong>Téléphone:</strong> <a href="tel:${item.telephone}">${item.telephone}</a></p>
                    <p><strong>Email:</strong> <a href="mailto:${item.email}">${item.email}</a></p>
                    <p><strong>Site Web:</strong> <a href="${item.siteWeb}" target="_blank">${item.siteWeb}</a></p>
                    <p>
                        <strong>Formations:</strong>
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
                                        <td>${formation.modalite ? formation.modalite : 'Aucune modalité requise ou modalité inconnue'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </p>
                `;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
