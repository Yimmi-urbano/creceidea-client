const { fetchPages,fetchHome, fetchConfig} = require('./apiService');

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

async function getBanners() {
    const data = await fetchHome();
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

async function getInfoHomeText() {
    const data = await fetchHome();
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

async function getConfig() {
    const data = await fetchConfig();
    if (data) {
        return data;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada.</p>"
        };
    }
}

/*
async function getPageByIdProduct(url) {
    const data = await fetchCatalogo();
    const product = data.find(product => product.url === url);
    
    if (product) {
        return product;
    } else {
        return {
            title: "No Encontrado",
            content_html: "<h1>No Encontrado</h1><p>La página que buscas no fue encontrada.</p>"
        };
    }
}
*/

module.exports = { getPageByUrl,getBanners, getInfoHomeText,getConfig };
