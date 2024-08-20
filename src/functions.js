const { fetchPages, fetchHome, fetchConfig, fetchBanners} = require('./apiService');
const path = require('path');
const fs = require('fs');

async function getPageByUrl(url) {
    const data = await fetchPages();
    const page = data.find(page => page.url === url);

    if (page) {
        return page;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada.</p>"
        };
    }
}

async function getBanners(domain) {
    const data = await fetchBanners(domain);
    const banners = data;
    console.log(banners)
    if (banners) {
        return banners;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada sin banner.</p>"
        };
    }
}

async function getInfoHomeText(domain) {
    const data = await fetchHome(domain);
    const infoHome = data.data[0].text_html_home;
    if (infoHome) {
        return infoHome;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada.</p>"
        };
    }
}

async function getConfig(domain) {
    const data = await fetchConfig(domain);

    if (data) {
        return data;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada.</p>"
        };
    }
}

function getSvgContent(title) {
    let filePath;
    switch (title.toLowerCase()) {
        case 'facebook':
            filePath = path.join(__dirname, 'svgs', 'facebook.svg');
            break;
        case 'ex':
            filePath = path.join(__dirname, 'svgs', 'ex.svg');
            break;
        case 'instagram':
            filePath = path.join(__dirname, 'svgs', 'instagram.svg');
            break;
        case 'tiktok':
            filePath = path.join(__dirname, 'svgs', 'tiktok.svg');
            break;
        case 'youtube':
            filePath = path.join(__dirname, 'svgs', 'youtube.svg');
            break;
        case 'linkedin':
            filePath = path.join(__dirname, 'svgs', 'linkedin.svg');
            break;

        default:
            return '';
    }
    return fs.readFileSync(filePath, 'utf8');
}

module.exports = { getPageByUrl, getBanners, getInfoHomeText, getConfig, getSvgContent };
