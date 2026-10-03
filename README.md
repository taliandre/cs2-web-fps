# 🎮 CS2 Low-Poly FFA Multiplayer & Private Rooms

> **CS2 tarzı hızlı tempolu, sıfır harici varlık (0-dependency 3D WebGL), düşük gecikmeli WebSocket çok oyunculu FFA FPS oyunu.**  
> Arkadaşlarınızla kendi özel odanızı (`KANKALAR`, `PROS`, vb.) kurup tek tıkla davet linki paylaşarak 7/24 ücretsiz oynayabilirsiniz!

---

## 🌟 Öne Çıkan Özellikler

- 🌐 **Gerçek 7/24 Online Çok Oyunculu:** Render.com üzerinde ücretsiz yayınlanabilir Node.js + WebSocket arka planı.
- 🔒 **Özel Oda (Private Room) & Davet Linki:** 
  - Kendi belirlediğiniz oda adıyla (örn: `KANKALAR`) arkadaş grubunuza özel lobi açın.
  - "ODA DAVET LİNKİNİ KOPYALA" butonu ile tek tıkla linki (`https://siteniz.onrender.com/?room=KANKALAR`) kopyalayıp WhatsApp veya Discord'dan arkadaşlarınıza atın.
  - Linke tıklayan herkes doğrudan sizin odanıza bağlanır!
- 🔫 **CS2 Silah & Balistik Mekaniği:**
  - **AK-47:** 1-tap kafadan vuruş (Dink sesi!), Source 2 tarzı '7' sprey geri tepme şablonu.
  - **M4A4:** Yüksek atış hızı (666 RPM), dikey ağırlıklı sprey kontrolü.
  - **AWP:** 2 kademeli dürbün (Scope), tek vuruş gövde/kafa hasarı, hareket halindeyken yüksek sapma cezası.
- 🏃 **Orijinal Source Engine Hareket Fiziği:**
  - Counter-Strafing (zıt yöne basınca anında durma), Bunnyhop, Air-Strafing, Eğilme (Crouch), Yürüme (Shift).
  - Mermi yiyince yavaşlama (Tagging).
- 🏷️ **3D İsim Etiketleri:** Her oyuncunun ve arkadaşınızın kafasının üzerinde canlı 3D isim ve takım rengi rozeti.
- 🏆 **Canlı Skor & 5 Dakikalık Maç Sonu:**
  - Sol üstte anlık canlı lider tablosu (1st, 2nd, 3rd sıralaması).
  - 5 dakika sonunda MVP, zafer bildirimi, detaylı K/D, Headshot ve skor istatistik tablosu.
- 🤖 **Akıllı Çevrimdışı Desteği:** Sunucu kapalıyken veya internet yokken oyun hata vermeden otomatik olarak yerel yapay zeka botlarıyla tek oyunculu modda çalışır.

---

## 🚀 RENDER.COM ÜZERİNDE 3 DAKİKADA ÜCRETSİZ YAYINLAMA REHBERİ

Render.com, Node.js ve WebSocket uygulamalarını **ücretsiz (Free Tier)** olarak 7/24 internete açan en popüler platformdur. Kredi kartı istemez!

### 1. Adım: Projeyi GitHub'a Yükleyin

Eğer projenizi henüz GitHub'a yüklemediyseniz:

1. [GitHub.com](https://github.com) sitesine gidin ve oturum açın.
2. Sağ üstteki **`+`** ikonuna tıklayıp **"New repository"** seçin.
3. İsim olarak `cs2-web-fps` yazın, **Public** seçin ve **"Create repository"** butonuna basın.
4. Bilgisayarınızdaki bu proje klasöründe terminal / PowerShell açıp şu komutları girin:
   ```bash
   git init
   git add .
   git commit -m "CS2 Low-Poly FFA Multiplayer"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/cs2-web-fps.git
   git push -u origin main
   ```

---

### 2. Adım: Render.com Hesabı Açın & Web Servisi Oluşturun

1. [https://render.com](https://render.com) adresine gidin ve **"GET STARTED FOR FREE"** diyerek GitHub hesabınızla giriş yapın.
2. Render panosunda sağ üstteki **"New +"** butonuna tıklayın ve **"Web Service"** seçeneğini seçin.
3. Açılan listeden az önce oluşturduğunuz `cs2-web-fps` GitHub reposunu bulun ve **"Connect"** butonuna basın.

---

### 3. Adım: Ayarları Girin (Sadece 3 Kutucuk!)

Render sizden şu ayarları isteyecektir:

| Ayar Alanı | Ne Yazılacak? | Açıklama |
|---|---|---|
| **Name** | `cs2-fps` (veya istediğiniz bir isim) | Web sitenizin linkini belirler |
| **Language** | `Node` | Otomatik seçilir |
| **Branch** | `main` | Varsayılan |
| **Build Command** | `npm install` | Gerekli paketleri kurar |
| **Start Command** | `node server.js` | WebSocket sunucusunu başlatır |
| **Instance Type** | `Free` (0$/ay) | Ücretsiz seçeneği işaretleyin |

Ayarları kontrol ettikten sonra sayfanın altındaki **"Create Web Service"** butonuna tıklayın!

---

### 4. Adım: Tebrikler, Oyununuz Yayında! 🎉

- Render.com 1-2 dakika içinde projenizi derleyip sunucuyu ayağa kaldıracaktır.
- Sayfanın sol üst köşesinde size özel bir link göreceksiniz:
  👉 **`https://cs2-fps-xxxx.onrender.com`**
- Bu linke tıkladığınız an oyununuz tüm dünyadan erişilebilir hale gelir!

---

## 👥 Arkadaşlarla Özel Odada Nasıl Oynanır?

1. Oyuna girin, **İsminizi** yazın (örn: `Ahmet`).
2. **Özel Oda Kodunu** belirleyin (örn: `KANKALAR`).
3. **"🔗 ODA DAVET LİNKİNİ KOPYALA"** butonuna basın.
4. Kopyalanan linki (`https://siteniz.onrender.com/?room=KANKALAR`) Discord veya WhatsApp'tan arkadaşlarınıza gönderin.
5. Arkadaşlarınız linke tıkladığında doğrudan sizin odanıza katılır ve anında birbirinizi görüp kapışmaya başlarsınız!

---

## 💻 Bilgisayarda Yerel (Localhost) Olarak Çalıştırma

Projeyi kendi bilgisayarınızda test etmek için:

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Sunucuyu başlatın
npm start
```

Tarayıcınızı açıp `http://localhost:3000` adresine gidin. Başka bir sekme açarak ikinci bir oyuncuyla test edebilirsiniz!

---

## 🎯 Tuş Kombinasyonları & Kontroller

- **W, A, S, D:** Hareket
- **Mouse:** Bakış açısı & Nişan
- **Sol Tık:** Ateş Et
- **Sağ Tık:** AWP Dürbün Açma (2 Kademeli Zoom)
- **1, 2, 3 / Mouse Tekerleği:** Silah Seçimi (AK-47 / M4A4 / AWP)
- **R:** Şarjör Değiştir
- **Boşluk (Space):** Zıpla (Bunnyhop / Air-Strafe uyumlu)
- **Sol Shift:** Yavaş Yürüme (Sessiz adımlar + sıfır sapma)
- **Sol Ctrl / C:** Eğilme (Crouch)
- **TAB:** Skor Tablosu
- **ESC:** Menü & Hassasiyet / Crosshair Ayarları
