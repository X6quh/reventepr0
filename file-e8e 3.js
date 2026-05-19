// Données initiales (exemples)
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        title: "iPhone 13 Pro - 256Go",
        price: 650,
        category: "electronique",
        description: "iPhone 13 Pro en excellent état. Acheté il y a 1 an. Batterie à 92%. Vendu avec chargeur et coque.",
        image: null,
        location: "Paris",
        email: "vendeur@example.com",
        phone: "06 12 34 56 78",
        date: new Date().toISOString()
    },
    {
        id: 2,
        title: "Canapé 3 places en cuir",
        price: 350,
        category: "maison",
        description: "Canapé moderne en cuir véritable. Très confortable. Dimensions: 220x90cm. À venir chercher sur place.",
        image: null,
        location: "Lyon",
        email: "marie@example.com",
        phone: "",
        date: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: "Vélo de route Specialized",
        price: 800,
        category: "sport",
        description: "Vélo de route Specialized Tarmac SL6. Taille 54. Équipé Shimano 105. Très bon état.",
        image: null,
        location: "Marseille",
        email: "cycliste@example.com",
        phone: "07 98 76 54 32",
        date: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: 4,
        title: "MacBook Pro M1 2020",
        price: 900,
        category: "electronique",
        description: "MacBook Pro 13 pouces avec puce M1. 16Go RAM, 512Go SSD. Parfait état, peu utilisé.",
        image: null,
        location: "Bordeaux",
        email: "tech@example.com",
        phone: "",
        date: new Date(Date.now() - 259200000).toISOString()
    },
    {
        id: 5,
        title: "Veste en cuir vintage",
        price: 120,
        category: "mode",
        description: "Veste en cuir véritable style motard. Taille L. Vintage des années 90. Belle patine.",
        image: null,
        location: "Nantes",
        email: "mode@example.com",
        phone: "06 45 67 89 01",
        date: new Date(Date.now() - 345600000).toISOString()
    },
    {
        id: 6,
        title: "Peugeot 208 Active",
        price: 8500,
        category: "vehicules",
        description: "Peugeot 208 1.2 PureTech 82ch. 45 000km. CT OK. Première main. Entretien régulier.",
        image: null,
        location: "Toulouse",
        email: "auto@example.com",
        phone: "06 11 22 33 44",
        date: new Date(Date.now() - 432000000).toISOString()
    }
];

let currentFilter = 'all';
let searchTerm = '';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateStats();
});

// Afficher les produits
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    document.getElementById('productCount').textContent = `${filteredProducts.length} annonce${filteredProducts.length > 1 ? 's' : ''}`;

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>Aucune annonce trouvée</h3>
                <p>Essayez avec d'autres critères de recherche</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.title}">` : 
                    `<i class="fas fa-image fa-3x"></i>`
                }
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price.toLocaleString('fr-FR')} €</div>
                <div class="product-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${product.location}</span>
                </div>
                <button class="contact-btn" onclick="showContact(${product.id})">
                    <i class="fas fa-envelope"></i> Contacter
                </button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        'electronique': 'Électronique',
        'mode': 'Mode',
        'maison': 'Maison',
        'sport': 'Sport',
        'vehicules': 'Véhicules'
    };
    return names[category] || category;
}

// Filtrer par catégorie
function filterByCategory(category) {
    currentFilter = category;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts();
}

// Filtrer par recherche
function filterProducts() {
    searchTerm = document.getElementById('searchInput').value;
    displayProducts();
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Prévisualisation de l'image
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Ajouter un produit
function addProduct(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('productImage');
    let imageData = null;
    
    const processProduct = (imageBase64) => {
        const newProduct = {
            id: Date.now(),
            title: document.getElementById('productTitle').value,
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            image: imageBase64,
            location: document.getElementById('productLocation').value,
            email: document.getElementById('sellerEmail').value,
            phone: document.getElementById('sellerPhone').value,
            date: new Date().toISOString()
        };
        
        products.unshift(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        // Reset form
        document.getElementById('sellForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        
        closeModal('sellModal');
        displayProducts();
        updateStats();
        
        // Notification
        showNotification('Annonce publiée avec succès ! 🎉');
    };
    
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processProduct(e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        processProduct(null);
    }
}

// Afficher les coordonnées du vendeur
function showContact(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = `
        <div class="contact-details">
            <h3>${product.title}</h3>
            <p><i class="fas fa-euro-sign"></i> <strong>${product.price.toLocaleString('fr-FR')} €</strong></p>
            <p><i class="fas fa-envelope"></i> ${product.email}</p>
            ${product.phone ? `<p><i class="fas fa-phone"></i> ${product.phone}</p>` : ''}
            <p><i class="fas fa-map-marker-alt"></i> ${product.location}</p>
        </div>
        <div class="safety-tips">
            <h4><i class="fas fa-shield-alt"></i> Conseils de sécurité</h4>
            <ul>
                <li>Rencontrez le vendeur dans un lieu public</li>
                <li>Vérifiez l'article avant de payer</li>
                <li>Méfiez-vous des prix trop bas</li>
                <li>Ne payez jamais à l'avance</li>
            </ul>
        </div>
        <button class="btn btn-primary btn-full" onclick="closeModal('contactModal')" style="margin-top: 20px;">
            J'ai compris
        </button>
    `;
    
    openModal('contactModal');
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Mettre à jour les statistiques
function updateStats() {
    const totalSales = products.reduce((sum, p) => sum + p.price, 0);
    const commission = totalSales * 0.05; // 5% de commission
    
    // Animation des nombres
    animateNumber('totalUsers', 1247, 1500);
    animateNumber('totalSales', `€${(totalSales + 45890).toLocaleString('fr-FR')}`, 2000, true);
    animateNumber('satisfaction', '98%', 1000, true);
}

function animateNumber(elementId, target, duration, isText = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isText) {
        element.textContent = target;
        return;
    }
    
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString('fr-FR');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Mode admin (pour toi) - appuie sur Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        showAdminPanel();
    }
});

function showAdminPanel() {
    const totalSales = products.reduce((sum, p) => sum + p.price, 0);
    const commission = totalSales * 0.05;
    
    alert(`📊 TABLEAU DE BORD ADMIN
    
💰 Commission totale potentielle: ${commission.toLocaleString('fr-FR')} €
📦 Nombre d'annonces: ${products.length}
👥 Utilisateurs: 1,247

Astuce: Pour gagner de l'argent, tu peux:
1. Prendre une commission de 5% sur chaque vente
2. Proposer des annonces sponsorisées (mise en avant payante)
3. Ajouter un système de livraison avec frais de service`);
}