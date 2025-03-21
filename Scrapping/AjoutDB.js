const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const rawData = fs.readFileSync('Data/data_JPO.json');
const data = JSON.parse(rawData);


const db = new sqlite3.Database('Data/JPO.db');

db.serialize(() => {
    data.forEach((etablissement, indexEtab) => {
        const idFac = indexEtab + 1;

        db.run(`INSERT INTO Faculte (id_fac, nom_fac, adresse_fac, tel_fac) 
                VALUES (?, ?, ?, ?)`, 
                [idFac, etablissement.nom, etablissement.adresse, etablissement.telephone]);

        if (Array.isArray(etablissement.dateJPO)) {
            etablissement.dateJPO.forEach((date, indexJPO) => {
                db.run(`INSERT INTO JPO (id_jpo, date_jpo, ville_jpo, code_postal_jpo) 
                        VALUES (?, ?, ?, ?)`, 
                        [idFac * 10 + indexJPO + 1, date, etablissement.ville, etablissement.codePostal]);
            });
        }

        if (Array.isArray(etablissement.formations)) {
            etablissement.formations.forEach((formation, indexFormation) => {
                db.run(`INSERT INTO Formation (nom_formation, duree_formation, id_fac) 
                    VALUES (?, ?, ?)`, 
                    [formation.formationNom, formation.duree, idFac]);
            });
        }
    });
    console.log("🕒 Données en cours de traitement...");
});

console.log("✅ Données insérées avec succès !");
db.close();

