const { fetchPages, fetchCatalogo } = require('./apiService');

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

module.exports = { getPageByUrl,getPageByIdProduct };
