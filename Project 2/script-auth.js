// Tombol Pindah Panel
window.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });
});

// REGISTER USER
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("regNama").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value.trim();

    // Validasi input
    if (!nama || !email || !password) {
        Swal.fire("❌ Gagal", "Semua kolom wajib diisi!", "error");
        return;
    }

    // Ambil semua user
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah email sudah digunakan
    const isExist = users.find(user => user.email === email);
    if (isExist) {
        Swal.fire("❌ Gagal", "Email sudah terdaftar!", "error");
        return;
    }

    // Simpan user baru
    const newUser = {
        nama,
        email,
        password,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire("✅ Berhasil", "Akun berhasil dibuat!", "success").then(() => {
        document.getElementById("registerForm").reset();
        document.getElementById("container").classList.remove("right-panel-active");
    });
});

// LOGIN USER
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("logEmail").value.trim().toLowerCase();
    const password = document.getElementById("logPassword").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Mencari User
    const user = users.find(u => u.email === email);

    if (!user) {
        Swal.fire("❌ Gagal", "Email tidak ditemukan!", "error");
        return;
    }

    if (user.password !== password) {
        Swal.fire("❌ Gagal", "Password salah!", "error");
        return;
    }

    localStorage.setItem("loggedInUser", email);

    Swal.fire("✅ Berhasil", `Selamat datang ${user.nama}!`, "success").then(() => {
        window.location.href = "index.html";
    });
});

// Toggle Show/Hide Password
document.querySelectorAll('.toggle-password').forEach(function (el) {
    el.addEventListener('click', function () {
        const targetId = el.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            el.textContent = '🙈';
        } else {
            input.type = 'password';
            el.textContent = '👁️';
        }
    });
});
