const fs = require("fs");
const puppeteer = require("puppeteer");
const data = "Data/data_JPO.json"

function getTotalHrefs() {
  const rawData = fs.readFileSync(data, "utf-8");
  const jsonData = JSON.parse(rawData);

  return jsonData.map(item => {
      const formattedDates = item.date.map(dateStr => {
          const dateParts = dateStr.split(' ');
          const day = dateParts[0];
          const month = dateParts[1];
          const year = dateParts[2];
          return `${day}-${monthToNumber(month)}-${year}`;
      });
      return [item.href, formattedDates, item.city];
  });
}

// fonction pour convertir le mois en nombre
function monthToNumber(month) {
    const months = {
        'janvier': '01',
        'février': '02',
        'mars': '03',
        'avril': '04',
        'mai': '05',
        'juin': '06',
        'juillet': '07',
        'août': '08',
        'septembre': '09',
        'octobre': '10',
        'novembre': '11',
        'décembre': '12'
    };
    return months[month];
}

const jpoData = getTotalHrefs(); // Recupére tous les liens des universitais
console.log(`Nombre total de liens à scraper : ${jpoData.length}`);

async function scrapeFacPage(url, date, ville ,index, totalIndex) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    console.log(`📡 Scraping de la page : ${index}/${totalIndex}`);

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    } catch (navError) {
      console.error(`❌ Erreur de navigation vers ${url}:`, navError.message);
      return null;
    }

    // Extraction des données
    const data = await page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.innerText.trim() || null;

      // Récupération de l'adresse
      const adresse = getText("#adresse .callout-text.max-w-52w span"); // Recupere l'adresse

      // Recupere le code postal
      const adresseDiv = document.querySelector("#adresse");
      let codePostal = null;
      if (adresseDiv) {
        const spans = [...adresseDiv.querySelectorAll("span.ezstring-field")];
        const codePostalElement = spans.find(span => /^\d{5}$/.test(span.innerText.trim()));
        if (codePostalElement) {
            codePostal = codePostalElement.innerText.trim();
        }
      }

      // Recupere le contact
      const telephone = document.querySelector("#contact .callout-text span")?.innerText.trim().replace(/\s+/g, "") || null;
      const contactLinks = document.querySelectorAll("#contact .callout-text a");
      const siteWeb = contactLinks.length > 0 ? contactLinks[0].href : null;
      const email = contactLinks.length > 1 ? contactLinks[1].href.replace("mailto:", "") : null;

      // Recuperer les formations
      const formations = [];
      document.querySelectorAll("#formations .search-ui-result-inner .search-ui-tr-item").forEach(row => {
        const formationHref = row.querySelector("td.search-ui-td-name a")?.href || null;
        const formationNom = row.querySelector("td.search-ui-td-name a span span")?.innerText.trim() || null;
        const duree = row.querySelector("td[data-label='Durée'] span")?.innerText.trim().charAt(0) || null;
        const modalite = row.querySelector("td[data-label='Modalité']")?.innerText.trim() || null;
      
        if (formationNom) {
          formations.push({ formationNom, formationHref, duree, modalite });
        }
      });
      

      return { adresse, codePostal, telephone, siteWeb, email, formations };
    });

      // Ajouter la date de JPO et la ville associée
      data.dateJPO = date || null;
      data.ville = ville || null;

    console.log(`✅ Données récupérées pour ${url}`);
    return data;
  } catch (error) {
    console.error(`❌ Erreur lors du scraping de ${url}:`, error.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

async function scrapeAllFacs() {  
  let allData = [];
  for (let i = 0; i < 10; i++) {
    const [url, date, ville] = jpoData[i];
    const data = await scrapeFacPage(url, date, ville, i + 1, jpoData.length);
    if (data) allData.push({ url, ...data });
  }

  try {
    fs.writeFileSync("Data/data_FAC.json", JSON.stringify(allData, null, 2), "utf-8");
    console.log("📂 Données sauvegardées dans fac_data.json !");
  } catch (writeError) {
    console.error("❌ Erreur lors de l'écriture du fichier JSON:", writeError.message);
  }
}

scrapeAllFacs();