const fs = require("fs");
const data = "Data/data_JPO.json";

const rawData = fs.readFileSync(data, "utf-8");
const jsonData = JSON.parse(rawData);

const dataWithNom = jsonData.map(item => {
    const nom = item.url.split("/").pop().replace(/-/g, ' ');
    return {...item, nom};
});

const noms = dataWithNom.map(item => item.nom);

fs.writeFileSync(data, JSON.stringify(dataWithNom, null, 2), "utf-8");

