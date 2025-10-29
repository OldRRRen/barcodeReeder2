// js/admin.js
let products = JSON.parse(localStorage.getItem('products')) || [];

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateProductCount();
});

function addProduct() {
    const barcode = document.getElementById('barcode').value.trim();
    const name = document.getElementById('name').value.trim();
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value.trim();

    if (barcode && name && price) {
        // Barkod kontrolü
        if (products.find(p => p.barcode === barcode)) {
            alert('⚠️ Bu barkod zaten kayıtlı!');
            return;
        }

        const newProduct = {
            barcode: barcode,
            name: name,
            price: parseFloat(price),
            description: description
        };

        products.push(newProduct);
        saveProducts();
        loadProducts();
        clearForm();
        
        alert('✅ Ürün başarıyla eklendi!');
    } else {
        alert('❌ Lütfen zorunlu alanları doldurun!');
    }
}

function loadProducts() {
    const productList = document.getElementById('productList');
    
    if (products.length === 0) {
        productList.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #f5f5f5; border-radius: 10px;">
                <h3>📭 Henüz ürün yok</h3>
                <p>İlk ürününüzü ekleyin veya örnek ürünler ekleyin.</p>
            </div>
        `;
        return;
    }

    productList.innerHTML = '';
    
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <strong>${product.name}</strong> - ${product.price.toFixed(2)} TL
            <br><small>📋 Barkod: ${product.barcode}</small>
            ${product.description ? `<br><small>📝 ${product.description}</small>` : ''}
            <br>
            <button onclick="deleteProduct(${index})" style="background: #f44336; margin-top: 10px; padding: 5px 10px; font-size: 14px;">
                🗑️ Sil
            </button>
        `;
        productList.appendChild(productDiv);
    });
    
    updateProductCount();
}

function updateProductCount() {
    document.getElementById('productCount').textContent = products.length;
}

function deleteProduct(index) {
    if (confirm('❓ Bu ürünü silmek istediğinizden emin misiniz?')) {
        const deletedProduct = products[index];
        products.splice(index, 1);
        saveProducts();
        loadProducts();
        alert(`✅ "${deletedProduct.name}" silindi!`);
    }
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function clearForm() {
    document.getElementById('barcode').value = '';
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').value = '';
}

function exportProducts() {
    if (products.length === 0) {
        alert('❌ Dışa aktarılacak ürün yok!');
        return;
    }
    
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'urunler.json';
    link.click();
    
    alert('📥 Ürünler JSON dosyası olarak indirildi!');
}

function addSampleProducts() {
    const sampleProducts = [
        {
            barcode: "8691234567890",
            name: "Coca Cola 330ml",
            price: 12.50,
            description: "Kutu kola"
        },
        {
            barcode: "8699876543210", 
            name: "Eti Browni",
            price: 8.75,
            description: "Çikolatalı kek"
        },
        {
            barcode: "8695555555555",
            name: "Uludağ Gazoz",
            price: 6.00,
            description: "Maden suyu"
        },
        {
            barcode: "1234567890123",
            name: "Test Ürünü",
            price: 15.99,
            description: "Bu bir test ürünüdür"
        }
    ];
    
    // Sadece benzersiz ürünleri ekle
    sampleProducts.forEach(sample => {
        if (!products.find(p => p.barcode === sample.barcode)) {
            products.push(sample);
        }
    });
    
    saveProducts();
    loadProducts();
    alert('🎯 Örnek ürünler eklendi!');
}

function clearAll() {
    if (products.length === 0) {
        alert('❌ Zaten hiç ürün yok!');
        return;
    }
    
    if (confirm('🚨 TÜM ürünleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        products = [];
        saveProducts();
        loadProducts();
        alert('✅ Tüm ürünler silindi!');
    }
}