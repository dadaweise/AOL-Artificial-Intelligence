# 🩺 SkinSpectra: AI Skin Disease Detection

Proyek ini menggunakan **VGG16 Transfer Learning** untuk mendeteksi 23 jenis penyakit kulit. Model telah dioptimasi untuk mendeteksi kategori seperti Acne, Tinea, hingga Psoriasis dengan preprocessing khusus.

## 🚀 Cara Memulai

### 1. Update Kodingan
Pastikan kamu menarik update terbaru dari repository ini:
```bash
git pull origin main

pip install tensorflow opencv-python numpy

# Contoh penggunaan
hasil = quick_predict("path/ke/gambar_kulit.jpg")
print(f"Hasil Diagnosa: {hasil}")
