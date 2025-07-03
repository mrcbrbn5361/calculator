# Web Tabanlı Hesap Makinesi

Bu proje, HTML, CSS (Bootstrap ile) ve JavaScript kullanılarak oluşturulmuş basit bir web tabanlı hesap makinesidir. Orijinal Windows Hesap Makinesi'nin temel işlevlerini taklit etmeyi amaçlar.

## Özellikler

*   Temel aritmetik işlemler: Toplama, Çıkarma, Çarpma, Bölme
*   Yüzde (%) ve Karekök (√) işlemleri
*   Sayı işaretini değiştirme (+/-)
*   Girişi temizleme (CE) ve tümünü temizleme (C)
*   Son karakteri silme (Backspace)
*   Klavye desteği
*   Hesaplama geçmişi (son 20 işlem)
    *   Geçmişi görüntüleme
    *   Geçmişten sonuç yükleme
    *   Geçmişi temizleme
*   Hafıza fonksiyonları: MC, MR, M+, M-
*   Duyarlı tasarım (Responsive design)

## Nasıl Çalıştırılır

1.  Bu projeyi bilgisayarınıza klonlayın veya indirin.
2.  `index.html` dosyasını herhangi bir modern web tarayıcısında (Chrome, Firefox, Edge vb.) açın.

## Dosya Yapısı

*   `index.html`: Hesap makinesinin ana HTML yapısı.
*   `css/style.css`: Özel CSS stilleri ve Bootstrap üzerine yazılan kurallar.
*   `js/script.js`: Hesap makinesinin tüm işlevselliğini içeren JavaScript kodu.

## Geliştirme Notları

*   **Bootstrap:** Arayüz bileşenleri ve duyarlılık için kullanılmıştır.
*   **JavaScript:**
    *   Temel hesaplama mantığı, ekran güncellemesi, olay dinleyicileri içerir.
    *   Geçmiş ve hafıza yönetimi `script.js` içinde bulunur.
    *   Klavye girişleri için olay dinleyicisi eklenmiştir.
*   **CSS:**
    *   Hesap makinesinin görünümünü özelleştirmek için kullanılmıştır.
    *   Farklı ekran boyutlarına uyum sağlamak için `@media` sorguları içerir.

## Potansiyel Geliştirmeler

*   Daha fazla bilimsel fonksiyon (üs alma, logaritma, trigonometrik fonksiyonlar vb.).
*   Programcı modu (HEX, DEC, OCT, BIN dönüşümleri ve bitwise işlemler).
*   Birim dönüştürücü.
*   Tarih hesaplama.
*   Koyu tema / Açık tema seçeneği.
*   Daha gelişmiş hata yönetimi.
*   Kapsamlı birim testleri.
