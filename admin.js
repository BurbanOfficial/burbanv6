// Configuration
const ADMIN_PASSWORD = '041-522'; // Change this to your secure password
const GITHUB_TOKEN = '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'; // Add your GitHub Personal Access Token
const GITHUB_REPO = 'BurbanOfficial/Burban-CMS';
const GITHUB_BRANCH = 'main';
const PRODUCTS_FILE = 'products.json';

let products = [];

// Authentication
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        sessionStorage.setItem('adminAuth', 'true');
        loadProducts();
    } else {
        alert('Incorrect password');
    }
});

// Check if already logged in
if (sessionStorage.getItem('adminAuth') === 'true') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadProducts();
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminAuth');
    location.reload();
});

// Load products from GitHub
async function loadProducts() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${PRODUCTS_FILE}?ref=${GITHUB_BRANCH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content);
            products = JSON.parse(content);
        } else {
            products = [];
        }
        
        renderProductsList();
    } catch (error) {
        console.error('Error loading products:', error);
        products = [];
        renderProductsList();
    }
}

// Render products list
function renderProductsList() {
    const list = document.getElementById('productsList');
    list.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const priceHTML = product.salePrice 
            ? `<div class="price"><s>${product.price}€</s> ${product.salePrice}€</div>`
            : `<div class="price">${product.price}€</div>`;
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            ${priceHTML}
            <div class="actions">
                <button class="edit-btn" onclick="editProduct('${product.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
            </div>
        `;
        
        list.appendChild(card);
    });
}

// Add new product
document.getElementById('addProductBtn').addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productFormModal').classList.add('active');
});

// Edit product
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productSalePrice').value = product.salePrice || '';
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productSizes').value = product.sizes.join(',');
    document.getElementById('productColors').value = product.colors.join(',');
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productPublishDate').value = product.publishDate || '';
    document.getElementById('productUnpublishDate').value = product.unpublishDate || '';
    document.getElementById('productIsNew').checked = product.isNew || false;
    document.getElementById('productBackInStock').checked = product.backInStock || false;
    document.getElementById('productPublished').checked = product.published !== false;
    
    document.getElementById('productFormModal').classList.add('active');
};

// Delete product
window.deleteProduct = async function(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    products = products.filter(p => p.id !== id);
    await saveProducts();
    renderProductsList();
};

// Save product
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productId').value || Date.now().toString();
    const productData = {
        id,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        salePrice: document.getElementById('productSalePrice').value ? parseFloat(document.getElementById('productSalePrice').value) : null,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        sizes: document.getElementById('productSizes').value.split(',').map(s => s.trim()),
        colors: document.getElementById('productColors').value.split(',').map(c => c.trim()),
        stock: parseInt(document.getElementById('productStock').value),
        publishDate: document.getElementById('productPublishDate').value || null,
        unpublishDate: document.getElementById('productUnpublishDate').value || null,
        isNew: document.getElementById('productIsNew').checked,
        backInStock: document.getElementById('productBackInStock').checked,
        published: document.getElementById('productPublished').checked
    };
    
    const existingIndex = products.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
        products[existingIndex] = productData;
    } else {
        products.push(productData);
    }
    
    await saveProducts();
    document.getElementById('productFormModal').classList.remove('active');
    renderProductsList();
});

// Cancel form
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('productFormModal').classList.remove('active');
});

// Save products to GitHub
async function saveProducts() {
    try {
        // Get current file SHA
        const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${PRODUCTS_FILE}?ref=${GITHUB_BRANCH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        let sha = null;
        if (getResponse.ok) {
            const data = await getResponse.json();
            sha = data.sha;
        }
        
        // Update file
        const content = btoa(JSON.stringify(products, null, 2));
        const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${PRODUCTS_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update products',
                content: content,
                sha: sha,
                branch: GITHUB_BRANCH
            })
        });
        
        if (updateResponse.ok) {
            alert('Products saved successfully!');
        } else {
            throw new Error('Failed to save products');
        }
    } catch (error) {
        console.error('Error saving products:', error);
        alert('Error saving products. Check console for details.');
    }
}
