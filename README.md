# SAE : Projet BD (Mise en oeuvre et Exploitation d'une base de données)

## Introduction

Ce projet consiste à scraper des données de journées portes ouvertes (JPO) des établissements d'enseignement en France à partir du site de l'ONISEP, puis à les afficher dans une interface utilisateur interactive. Le projet utilise Puppeteer pour le scrapping et une interface web pour la visualisation des données.

## Scrapping

Le scrapping est réalisé à l'aide de Puppeteer, une bibliothèque Node.js qui permet de contrôler un navigateur web de manière programmatique. Le script de scrapping (`JPO_Scrapping.js`) récupère le nombre total de pages de résultats et scrape les informations de chaque établissement sur chaque page.

### Fichiers de scrapping

- **JPO_Scrapping.js** : Récupère les informations de base sur une JPO. Ces données sont ensuite utilisées par `FacPage_Scrap.js`.
- **FacPage_Scrap.js** : Récupère toutes les informations d'un établissement à partir de l'URL obtenue via `JPO_Scrapping.js`.
- **ExtractNom.js** : Extrait le nom de l'établissement depuis son URL.
- **AjoutDB.js** : Ajoute les données récupérées dans une base de données SQL à partir d'un fichier JSON.

## Interface Utilisateur

L'interface utilisateur est une page web qui permet de rechercher, filtrer et trier les données des JPO. Les utilisateurs peuvent rechercher par nom, formation, code postal et dates. Les résultats sont paginés pour une meilleure lisibilité.

### Fichiers de l'interface utilisateur

- **page.html** : La page principale de l'interface utilisateur.
- **style.css** : Les styles CSS pour l'interface utilisateur.
- **script.js** : Le script JavaScript pour gérer les interactions utilisateur et afficher les données.
- **scriptDetail.js** : Le script JavaScript pour afficher les détails d'un établissement spécifique.

## Données

Les données scrapées sont stockées dans un fichier JSON (`data_JPO.json`). Ce fichier contient les informations suivantes pour chaque établissement :
- URL
- Adresse
- Code postal
- Téléphone
- Site web
- Email
- Formations (formationNom, formationHref, duree, modalite)
- Dates des JPO
- Ville
- Nom

## Utilisation

1. Exécutez le script de scrapping pour récupérer les données des JPO.
2. Ouvrez `page.html` dans un navigateur web pour accéder à l'interface utilisateur.
3. Utilisez les champs de recherche et de filtrage pour trouver les informations souhaitées.

## Conclusion

Ce projet permet de centraliser et de visualiser les informations des journées portes ouvertes des établissements d'enseignement en France. Il combine le scrapping web avec une interface utilisateur interactive pour offrir une expérience utilisateur complète.
