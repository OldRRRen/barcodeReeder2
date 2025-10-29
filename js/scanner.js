// js/scanner.js - GÜNCELLENMİŞ ve GÜVENLİ
let html5QrcodeScanner = null;
let isScanning = false;

// Manuel barkod kontrolü
function checkManualBarcode() {
    const barcode = document.getElementById('manual-barcode').value.trim();
    if (barcode.length === 0) {
        alert('Lütfen barkod numarası girin!');
        return;
    }
    getProductInfo(barcode);
}

// Enter tuşu ile kontrol
document.getElementById('manual-barcode')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkManualBarcode();
    }
});

// Test barkodu
function testBarcode(barcode) {
    document.getElementById('manual-barcode').value = barcode;
    getProductInfo(barcode);
}

// Kamerayı başlat
async function startCamera() {
    if (isScanning) return;

    try {
        console.log('Kamera başlatılıyor...');
        
        // Html5Qrcode kontrolü
        if (typeof Html5Qrcode === 'undefined') {
            throw new Error('QR kütüphanesi yüklenemedi. Manuel giriş kullanın.');
        }
        
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('stop-btn').style.display = 'inline-block';
        document.getElementById('camera-status').innerHTML = '🟢 Kamera başlatılıyor...';
        
        // Html5Qrcode'u başlat
        html5QrcodeScanner = new Html5Qrcode("reader");
        
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 }
        };

        // Kamerayı başlat
        await html5QrcodeScanner.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            onScanFailure
        );
        
        isScanning = true;
        document.getElementById('camera-status').innerHTML = '🟢 Kamera açıldı - Barkodu gösterin';
        console.log('Kamera başarıyla başlatıldı');
        
    } catch (err) {
        console.error('Kamera hatası:', err);
        document.getElementById('camera-status').innerHTML = `
            <div style="color: red; background: #ffebee; padding: 10px; border-radius: 5px;">
                ❌ Kamera hatası: ${err.message}
                <br><small>Manuel barkod girişini kullanabilirsiniz.</small>
            </div>
        `;
        resetCamera();
    }
}

// Kamerayı durdur
async function stopCamera() {
    if (!isScanning || !html5QrcodeScanner) return;
    
    try {
        await html5QrcodeScanner.stop();
        resetCamera();
        document.getElementById('camera-status').innerHTML = '⏹️ Kamera kapandı';
        
    } catch (err) {
        console.error('Kamera durdurma hatası:', err);
        resetCamera();
    }
}

function resetCamera() {
    isScanning = false;
    html5QrcodeScanner = null;
    document.getElementById('start-btn').style.display = 'inline-block';
    document.getElementById('stop-btn').style.display = 'none';
}

// Barkod okunduğunda
function onScanSuccess(decodedText, decodedResult) {
    console.log('✅ Barkod okundu:', decodedText);
    getProductInfo(decodedText);
}

function onScanFailure(error) {
    // Hata mesajını gösterme
}

// Ürün bilgilerini getir
function getProductInfo(barcode) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.barcode === barcode);
    
    const resultDiv = document.getElementById('result');
    
    if (product) {
        resultDiv.innerHTML = `
            <div class="product-info">
                <h3>✅ ${product.name}</h3>
                <p><strong>💰 Fiyat:</strong> ${product.price} TL</p>
                <p><strong>📝 Açıklama:</strong> ${product.description || 'Açıklama yok'}</p>
                <p><strong>🏷️ Barkod:</strong> ${product.barcode}</p>
                <p><small>🕒 ${new Date().toLocaleTimeString()}</small></p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="error-info">
                <h3>❌ Ürün Bulunamadı</h3>
                <p><strong>🏷️ Barkod:</strong> ${barcode}</p>
                <p>Bu ürün sisteme kayıtlı değil.</p>
                <p><a href="admin.html" style="color: #4CAF50;">Ürün eklemek için tıklayın</a></p>
            </div>
        `;
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Örnek ürünler ekle (eğer yoksa)
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (existingProducts.length === 0) {
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
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        console.log('Örnek ürünler eklendi');
    }
    
    console.log('Scanner hazır. Manuel giriş veya kamera kullanabilirsiniz.');
});
