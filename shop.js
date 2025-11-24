// GitHub CMS Configuration
const GITHUB_REPO = 'BurbanOfficial/burbanv6';
const GITHUB_BRANCH = 'main';
const PRODUCTS_FILE = 'products.json';

// Load products from GitHub
async function loadProducts() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${PRODUCTS_FILE}`);
        const products = await response.json();
        return products.filter(product => {
            const now = new Date();
            const publishDate = product.publishDate ? new Date(product.publishDate) : null;
            const unpublishDate = product.unpublishDate ? new Date(product.unpublishDate) : null;
            
            if (publishDate && now < publishDate) return false;
            if (unpublishDate && now > unpublishDate) return false;
            return product.published !== false;
        });
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Render products
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-item';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        productCard.dataset.price = product.salePrice || product.price;
        
        const badges = [];
        if (product.isNew) badges.push('<span class="badge new">New</span>');
        if (product.salePrice) badges.push('<span class="badge sale">Sale</span>');
        if (product.backInStock) badges.push('<span class="badge back-in-stock">Back in Stock</span>');
        
        const priceHTML = product.salePrice 
            ? `<div class="product-price sale">
                <span class="original-price">${product.price}€</span>
                <span class="sale-price">${product.salePrice}€</span>
               </div>`
            : `<div class="product-price">${product.price}€</div>`;
        
        const colorsHTML = product.colors && product.colors.length > 0
            ? `<div class="product-colors">
                ${product.colors.map(color => `<span class="color-dot" style="background-color: ${color}"></span>`).join('')}
               </div>`
            : '';
        
        productCard.innerHTML = `
            <div class="product-image-wrapper">
                ${badges.length > 0 ? `<div class="product-badges">${badges.join('')}</div>` : ''}
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                ${priceHTML}
                ${colorsHTML}
            </div>
        `;
        
        productCard.addEventListener('click', () => openProductModal(product));
        grid.appendChild(productCard);
    });
}

// Open product modal
function openProductModal(product) {
    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description || '';
    
    const priceHTML = product.salePrice 
        ? `<span class="original-price">${product.price}€</span> <span class="sale-price">${product.salePrice}€</span>`
        : `${product.price}€`;
    document.getElementById('modalPrice').innerHTML = priceHTML;
    
    // Sizes
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = product.sizes.map(size => 
        `<div class="size-option" data-size="${size}">${size}</div>`
    ).join('');
    
    // Colors
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = product.colors.map(color => 
        `<div class="color-option" data-color="${color}" style="background-color: ${color}; width: 40px; height: 40px;"></div>`
    ).join('');
    
    modal.classList.add('active');
    
    // Add click handlers for variants
    document.querySelectorAll('.size-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
        });
    });
    
    document.querySelectorAll('.color-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
        });
    });
}

// Close modal
document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('productModal').classList.remove('active');
});

document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        document.getElementById('productModal').classList.remove('active');
    }
});

// Filters
let allProducts = [];

document.querySelector('.filter-toggle').addEventListener('click', () => {
    document.querySelector('.filter-panel').classList.toggle('active');
});

function applyFilters() {
    const categories = Array.from(document.querySelectorAll('.filter-category:checked')).map(el => el.value);
    const sizes = Array.from(document.querySelectorAll('.filter-size:checked')).map(el => el.value);
    const colors = Array.from(document.querySelectorAll('.filter-color:checked')).map(el => el.value);
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    const filtered = allProducts.filter(product => {
        if (categories.length > 0 && !categories.includes(product.category)) return false;
        if (sizes.length > 0 && !product.sizes.some(s => sizes.includes(s))) return false;
        if (colors.length > 0 && !product.colors.some(c => colors.includes(c))) return false;
        const price = product.salePrice || product.price;
        if (price > maxPrice) return false;
        return true;
    });
    
    renderProducts(filtered);
}

document.querySelectorAll('.filter-category, .filter-size, .filter-color').forEach(el => {
    el.addEventListener('change', applyFilters);
});

document.getElementById('priceRange').addEventListener('input', (e) => {
    document.getElementById('priceValue').textContent = `0€ - ${e.target.value}€`;
    applyFilters();
});

document.querySelector('.filter-reset').addEventListener('click', () => {
    document.querySelectorAll('.filter-category, .filter-size, .filter-color').forEach(el => el.checked = false);
    document.getElementById('priceRange').value = 200;
    document.getElementById('priceValue').textContent = '0€ - 200€';
    renderProducts(allProducts);
});

// Initialize
(async function init() {
    allProducts = await loadProducts();
    renderProducts(allProducts);
})();
