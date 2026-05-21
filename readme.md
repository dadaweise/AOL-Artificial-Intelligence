# 🩺 SkinSpectra: AI Skin Disease Detection

Proyek ini menggunakan **VGG16 Transfer Learning** untuk mendeteksi 23 jenis penyakit kulit. Model telah dioptimasi untuk mendeteksi kategori seperti Acne, Tinea, hingga Psoriasis dengan preprocessing khusus.

## 🚀 Cara Memulai

### 1. Update Kodingan
Pastikan kamu menarik update terbaru dari repository ini:
```
git pull origin main

pip install tensorflow opencv-python numpy

# Contoh penggunaan
hasil = quick_predict("path/ke/gambar_kulit.jpg")
print(f"Hasil Diagnosa: {hasil}")

Download Modelnya dari https://drive.google.com/drive/folders/1mJpCX_RPlFM26aasGAF2rX6MOFWzaMPx?usp=sharing
copy paste ke folder skin spectranya aja
```

# KASIH PAHAM BOS BOS BOS BOS BOS INI DAVIS NGELANJUTIN YA
PERTAMA DOWNLOAD DULU MODELNYA ALFRED TERUS MASUKIN FOLDER results

(buka terminal vscode pake Cmd +  `)
DI TERMINAL VSCODE BIKIN ENVIRONMENT PYTHON BARU (sesuai urutan):
```
python -m venv myenv
pip install -r requirements.txt
```

HARUSNYA NANTI FILENYA
<br>results/
<br>└── skin_model_v2_fix_23.keras <-- File model eksperimental VGG16

ABIS ITU MASUK KE app.py TERUS DI TERMINAL VSCODE
```
python -m uvicorn app:app --reload
```
TERUS KE CHROME/EDGE/browser pilihan n di link nya tulis
```
http://127.0.0.1:8000/frontend
```
TERUS bebas sih upload aja image yang di folder testimg

## peratiin kalau error berikut
Error: "uvicorn is not recognized"
Virtual environment kamu sepertinya belum aktif. Kembali ke Langkah 2 dan jalankan perintah aktivasinya.

Error: "Directory 'static' does not exist"
Kamu menjalankan perintah dari luar folder proyek. Pastikan kamu sudah melakukan cd AOL-Artificial-Intelligence terlebih dahulu.

Website Muncul Pesan "Failed to connect to the API"
Kamu membuka file index.html langsung dengan cara klik dua kali (URL di atas bertuliskan file:///...). Ingat, kamu harus membukanya lewat alamat server: http://127.0.0.1:8000/frontend.

Error: "ImportError: DLL load failed" (Khusus Pengguna Windows)
Jika TensorFlow gagal dimuat di Windows, kamu mungkin perlu menginstal Microsoft Visual C++ Redistributable terlebih dahulu.
