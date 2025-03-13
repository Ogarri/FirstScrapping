const puppeteer = require("puppeteer");

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
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Simuler un vrai utilisateur pour éviter le blocage
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  );

  const url = `https://www.onisep.fr/recherche/api/html?context=jpo&not_show_facets=common_niveau_enseignement_mid&page=${pageNumber}&sf[common_niveau_enseignement_mid][]=après%20bac`;
  console.log(`📡 Scraping de la page ${pageNumber}/${pageMax}...`);

  await page.goto(url, { waitUntil: "networkidle2" });

  // Récupérer le HTML complet de la page
  const fullPageHTML = await page.evaluate(() => document.documentElement.outerHTML);

  console.log(`✅ Page ${pageNumber} récupérée !`);

  await browser.close();
  console.log(fullPageHTML);
  return fullPageHTML;
}

/**
 * Fonction principale qui scrape toutes les pages
 */
async function scrapeAllPages() {
  const totalPages = await getTotalPages();
  
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const html = await scrapeJPOPage(pageNumber, totalPages);
    console.log(`📝 Contenu de la page ${pageNumber} :\n`, html.substring(0, 500)); // Affiche un extrait
  }
}

// Lancer le scraping de toutes les pages

// getTotalPages(); // Fonctionne !
// scrapeJPOPage(1, 1); // Fonctionne !
// scrapeAllPages(); PAS ENCORE TESTER !
