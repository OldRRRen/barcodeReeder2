// js/scanner.js - GÜNCELLENMİŞ
let html5QrcodeScanner = null;
let isScanning = false;

// Kamerayı başlat
async function startCamera() {
    if (isScanning) return;

    try {
        console.log('Kamera başlatılıyor...');
        
        // Önce izin iste
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment" // Arka kamerayı kullan
            } 
        });
        
        // İzin alındı, stream'i durdur (Html5Qrcode kendi yönetecek)
        stream.getTracks().forEach(track => track.stop());
        
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('stop-btn').style.display = 'inline-block';
        document.getElementById('camera-status').innerHTML = '🟢 Kamera açıldı - Barkodu gösterin';
        
        // Html5Qrcode'u başlat
        html5QrcodeScanner = new Html5Qrcode("reader");
        
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0
        };

        // Kamerayı başlat
        const cameras = await Html5Qrcode.getCameras();
        const cameraId = cameras[0].id; // İlk kamerayı kullan
        
        await html5QrcodeScanner.start(
            cameraId,
            config,
            onScanSuccess,
            onScanFailure
        );
        
        isScanning = true;
        console.log('Kamera başarıyla başlatıldı');
        
    } catch (err) {
        console.error('Kamera hatası:', err);
        document.getElementById('camera-status').innerHTML = `
            <div style="color: red; background: #ffebee; padding: 10px; border-radius: 5px;">
                ❌ Kamera hatası: ${err.message}
                <br><small>1. Kamera izni verin<br>2. HTTPS kullanın<br>3. Test butonlarını deneyin</small>
            </div>
        `;
    }
}

// Kamerayı durdur
async function stopCamera() {
    if (!isScanning || !html5QrcodeScanner) return;
    
    try {
        await html5QrcodeScanner.stop();
        html5QrcodeScanner = null;
        isScanning = false;
        
        document.getElementById('start-btn').style.display = 'inline-block';
        document.getElementById('stop-btn').style.display = 'none';
        document.getElementById('camera-status').innerHTML = 'Kamera kapandı';
        
    } catch (err) {
        console.error('Kamera durdurma hatası:', err);
    }
}

// Barkod okunduğunda
function onScanSuccess(decodedText, decodedResult) {
    console.log('✅ Barkod okundu:', decodedText);
    getProductInfo(decodedText);
}

function onScanFailure(error) {
    // Hata mesajını gösterme, sadece konsola yaz
    // console.log('Tarama devam ediyor...');
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
                <p>Lütfen admin panelinden ekleyin.</p>
            </div>
        `;
    }
}

// Test fonksiyonları
function testBarcode() {
    const testBarcodes = ["8691234567890", "8699876543210", "8695555555555", "1234567890123"];
    const randomBarcode = testBarcodes[Math.floor(Math.random() * testBarcodes.length)];
    getProductInfo(randomBarcode);
}

function simulateBarcode(barcode) {
    getProductInfo(barcode);
}

// Sayfa yüklendiğinde örnek ürünleri ekle
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
    
    console.log('Scanner hazır. Test butonlarını kullanabilirsiniz.');
});