const { fetchPages, fetchHome, fetchConfig } = require('./apiService');

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
    const data = await fetchHome(domain);
    const banners = data.data[0].banner;
    if (banners) {
        return banners;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada.</p>"
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


module.exports = { getPageByUrl, getBanners, getInfoHomeText, getConfig };
