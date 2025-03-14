const puppeteer = require("puppeteer");
const fs = require("fs");

// URL principale (permet de récupérer le nombre total de pages)
const MAIN_URL = "https://www.onisep.fr/recherche?context=jpo&not_show_facets=common_niveau_enseignement_mid&page=1&sf[common_niveau_enseignement_mid][]=coll%C3%A8ge&sf[common_niveau_enseignement_mid][]=jusqu%27au%20bac";

/**
 * Fonction pour récupérer le nombre total de pages de résultats
 */
async function getTotalPages() { // Async car on a un await
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("🔍 Récupération du nombre total de pages...");

  await page.goto(MAIN_URL, { waitUntil: "networkidle2" });

  // Extraire le nombre total de pages à partir des boutons de pagination
  const totalPages = await page.evaluate(() => {
    const pagination = document.querySelector(".search-ui-header-pagination-final-number");
    if (!pagination) return 1;
    const text = pagination.innerHTML;
    return parseInt(text);
  });

  console.log(`📄 Nombre total de pages trouvé : ${totalPages}`);

  await browser.close();
  return totalPages;
}

/**
 * Fonction pour scraper une page spécifique des JPO
 */
async function scrapeJPOPage(pageNumber, pageMax) {
  let browser;
  
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Simuler un vrai utilisateur pour éviter le blocage
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    const url = `https://www.onisep.fr/recherche/api/html?context=jpo&not_show_facets=common_niveau_enseignement_mid&page=${pageNumber}&sf[common_niveau_enseignement_mid][]=coll%C3%A8ge&sf[common_niveau_enseignement_mid][]=jusqu%27au%20bac`;
    console.log(`📡 Scraping de la page ${pageNumber}/${pageMax}...`);

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    } catch (navError) {
      console.error(`Erreur vers ${url}:`, navError.message);
      await browser.close();
      return [];
    }


    // Extraire les informations depuis la page
    const data = await page.evaluate(() => {
      try {
        const results = [];
        const rows = document.querySelectorAll("tbody tr"); // Sélectionne toutes les lignes du tableau
        
        rows.forEach(row => {
          const columns = row.querySelectorAll("td"); // Sélectionne toutes les colonnes

          if (columns.length >= 3) {
            const linkElement = columns[0].querySelector("a"); 
            const href = linkElement ? linkElement.href : null;
            
            const date = columns[1].innerText.trim();
            const city = columns[2].innerText.trim();

            results.push({ href, date, city });
          }
        });

        return results;
      } catch (scrapingError) {
        console.error("Erreur Scrapping :", scrapingError.message);
        return [];
      }
    });

    console.log(`✅ Page ${pageNumber} récupérée ! ${data.length} résultats trouvés.`);

    // sauvegarde des données pour 1 pages (ne pas de-commenter si on sauvegarde avec scrapeAllPages)
    // fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");
    // console.log("📂 Données sauvegardées dans data.json !");

    await browser.close();
    return data;
  } catch (error) {
    console.error(`Erreur Scraping page ${pageNumber}:`, error.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Fonction principale qui scrape toutes les pages
 */
async function scrapeAllPages() {
  let allResults = [];
  const totalPages = await getTotalPages();
  
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const pageData = await scrapeJPOPage(pageNumber, totalPages);
    allResults = allResults.concat(pageData);

    await new Promise(res => setTimeout(res, 1000));
  }

  // Sauvegarde dans un fichier JSON
  try {
    fs.writeFileSync("data.json", JSON.stringify(allResults, null, 2), "utf-8");
    console.log("📂 Données sauvegardées dans data.json !");
  } catch (writeError) {
    console.error("❌ Erreur lors de l'écriture du fichier JSON:", writeError.message);
  }
}

// Lancer le scraping de toutes les pages

// getTotalPages(); // Fonctionne !
// scrapeJPOPage(1, 1); // Fonctionne !
scrapeAllPages();
