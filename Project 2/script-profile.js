document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (!loggedInUserEmail) {
        window.location.href = "auth.html"; // Redirect jika belum login
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === loggedInUserEmail);

    if (user) {
        // Tampilkan email
        document.getElementById("userEmail").textContent = user.email;

        // Simpan password asli di atribut data (untuk toggle)
        const passwordElement = document.getElementById("userPassword");
        passwordElement.setAttribute("data-real-password", user.password);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === loggedInUserEmail);

    if (user) {
        // Pastikan ini dijalankan
        document.getElementById("userName").textContent = user.nama || "Belum diisi";
    }
});

// Toggle visibility password
function togglePasswordVisibility() {
    const passwordElement = document.getElementById("userPassword");
    const button = document.querySelector("button[onclick='togglePasswordVisibility()']");

    if (passwordElement.textContent === "••••••••") {
        passwordElement.textContent = passwordElement.getAttribute("data-real-password");
        button.textContent = "🙈 hide";
    } else {
        passwordElement.textContent = "••••••••";
        button.textContent = "👁️ Display";
    }
}
let cropper;

// Fungsi untuk menampilkan modal crop
function showCropModal(imageSrc) {
    const modal = document.getElementById('cropModal');
    const image = document.getElementById('imageToCrop');
    
    image.src = imageSrc;
    modal.style.display = 'flex';
    
    // Inisialisasi Cropper.js
    cropper = new Cropper(image, {
        aspectRatio: 1, // Rasio 1:1 (persegi)
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        guides: false
    });
    
    // Tombol batal
    document.getElementById('cancelCrop').onclick = function() {
        modal.style.display = 'none';
        cropper.destroy();
    };
    
    // Tombol simpan
    document.getElementById('saveCrop').onclick = function() {
        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300,
            minWidth: 256,
            minHeight: 256,
            maxWidth: 1024,
            maxHeight: 1024,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });
        
        // Konversi ke base64 dan simpan
        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
        document.getElementById('profilePicture').src = croppedImage;
        saveProfilePicture(croppedImage);
        
        modal.style.display = 'none';
        cropper.destroy();
    };
}

document.getElementById('profilePictureInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi
    if (!file.type.match('image.*')) {
        Swal.fire('Error', 'Hanya file gambar yang diperbolehkan', 'error');
        return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
        Swal.fire('Error', 'Ukuran file maksimal 2MB', 'error');
        return;
    }

    // Preview gambar
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('profilePicture').src = event.target.result;
        saveProfilePicture(event.target.result); // Simpan ke storage
    };
    reader.readAsDataURL(file);
});


// Simpan foto profil ke localStorage 
function saveProfilePicture(imageData) {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === loggedInUserEmail);

    if (userIndex !== -1) {
        users[userIndex].profilePicture = imageData;
        localStorage.setItem('users', JSON.stringify(users));
        Swal.fire('Success', 'Foto profil berhasil diupdate!', 'success');
    }
}

/**
 * Hapus foto profil
 */
function removeProfilePicture() {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (!loggedInUserEmail) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === loggedInUserEmail);

    if (userIndex !== -1) {
        users[userIndex].profilePicture = null;
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('profilePicture').src = 'default-avatar.jpg';
        Swal.fire('Success', 'Foto profil dihapus!', 'success');
    }
}