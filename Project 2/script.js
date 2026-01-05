let filter = 'semua';
let tugasList = JSON.parse(localStorage.getItem("tugasList")) || [];
let alarmAktif = true;

function simpanTugas() {
    localStorage.setItem("tugasList", JSON.stringify(tugasList));
}

function tambahTugas() {
    const input = document.getElementById("taskInput");
    const dosenInput = document.getElementById("dosenInput");
    const noteInput = document.getElementById("taskNote");
    const fileInput = document.getElementById("taskImage");
    const deadlineInput = document.getElementById("taskDeadline");
    const repeatInput = document.getElementById("taskRepeat");

    const namaTugas = input.value.trim();
    const namaDosen = dosenInput.value.trim();
    const catatan = noteInput.value.trim();
    const deadline = deadlineInput.value;

    if (!namaTugas) {
        alert("❗ Harap Isi Nama Tugas Terlebih Dahulu.");
        return;
    }

    const newTugas = {
        text: namaTugas,
        dosen: namaDosen,
        note: catatan,
        deadline: deadline,
        repeat: repeatInput.value,
        selesai: false,
        diingatkan: false,
        image: null
    };

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            newTugas.image = e.target.result;
            tugasList.push(newTugas);
            simpanTugas(); renderTugas();
        };
        reader.readAsDataURL(file);
    } else {
        tugasList.push(newTugas);
        simpanTugas(); renderTugas();
    }

    input.value = dosenInput.value = noteInput.value = deadlineInput.value = '';
    repeatInput.value = '';
    fileInput.value = '';
    periksaValidasiForm();
}

function periksaValidasiForm() {
    const namaTugas = document.getElementById("taskInput").value.trim();
    const deadline = document.getElementById("taskDeadline").value;
    const tombol = document.getElementById("tombolTambah");

    let valid = !!namaTugas;
    if (deadline) {
        const now = new Date();
        const waktuDeadline = new Date(deadline);
        if (waktuDeadline < now) valid = false;
    }

    tombol.disabled = !valid;
    tombol.classList.toggle("opacity-50", !valid);
    tombol.classList.toggle("cursor-not-allowed", !valid);
}

function renderTugas() {
    document.querySelectorAll('#taskInput, #taskDeadline').forEach(input => {
        input.addEventListener('input', periksaValidasiForm);
    });
    periksaValidasiForm();

    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    function kirimNotifikasi(judul, isi) {
        if (Notification.permission === "granted") {
            new Notification(judul, {
                body: isi,
                icon: "Favicon.png"
            });
        }
    }

    setInterval(() => {
        if (!alarmAktif) return;
        const now = new Date();
        tugasList.forEach((tugas, i) => {
            if (!tugas.selesai && !tugas.diingatkan && tugas.deadline) {
                const waktuDeadline = new Date(tugas.deadline);
                const selisihMenit = (waktuDeadline - now) / 1000 / 60;
                if (selisihMenit <= 30 && selisihMenit > 0) {
                    tugas.diingatkan = true;
                    simpanTugas();
                    document.getElementById("alarmSound").play();
                    kirimNotifikasi("⏰ Pengingat Tugas", `Tugas "${tugas.text}" tinggal ${Math.round(selisihMenit)} menit lagi!`);
                    alert(`⏰ Tugas "${tugas.text}" tinggal ${Math.round(selisihMenit)} menit lagi!`);
                }
            }
        });
    }, 60000);

    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tugasList.forEach((tugas, i) => {
        if (filter === 'semua' || (filter === 'belum' && !tugas.selesai) || (filter === 'selesai' && tugas.selesai)) {
            const item = document.createElement("li");
            item.className = "bg-gray-100 p-4 rounded shadow";
            let inner = `<div class="flex justify-between">
        <label class="flex gap-2">
          <input type="checkbox" onchange="toggleSelesai(${i})" ${tugas.selesai ? 'checked' : ''} />
          <div>
            <b>${tugas.text}</b><br>
            <small>${tugas.dosen || ''}</small><br>
            <small>${tugas.note || ''}</small><br>`;

            if (tugas.deadline) {
                const deadline = new Date(tugas.deadline);
                inner += `<small>🕓 ${deadline.toLocaleString()}</small><br>`;
                if (tugas.repeat) inner += `<small>🔁 ${tugas.repeat}</small><br>`;
            }

            if (tugas.image) {
                inner += `<img src="${tugas.image}" class="h-24 rounded mt-2 cursor-pointer" onclick="previewGambar('${tugas.image}')">`;
            }

            inner += `</div></label>
        <div class="flex flex-col gap-1 text-right">
          <button onclick="editTugas(${i})" class="text-sm text-blue-600">✏️</button>
          <button onclick="hapusTugas(${i})" class="text-sm text-red-600">🗑️</button>
        </div>
      </div>`;
            item.innerHTML = inner;
            list.appendChild(item);
        }
    });
}

function hapusTugas(i) {
    tugasList.splice(i, 1);
    simpanTugas(); renderTugas();
}

function toggleSelesai(i) {
    tugasList[i].selesai = !tugasList[i].selesai;
    simpanTugas(); renderTugas();
}

function editTugas(i) {
    const t = tugasList[i];
    document.getElementById("taskInput").value = t.text;
    document.getElementById("dosenInput").value = t.dosen;
    document.getElementById("taskNote").value = t.note;
    document.getElementById("taskDeadline").value = t.deadline;
    document.getElementById("taskRepeat").value = t.repeat || "";
    hapusTugas(i);
}

function setFilter(kategori) {
    filter = kategori;
    renderTugas();
}

function toggleAlarm() {
    alarmAktif = !alarmAktif;
    document.getElementById("alarmToggle").textContent = alarmAktif ? "🔔 Alarm: ON" : "🔕 Alarm: OFF";
}

function previewGambar(src) {
    document.getElementById("previewImage").src = src;
    document.getElementById("previewModal").style.display = "flex";
}

function tampilkanKalender() {
    const daftar = tugasList.map(t => `${t.text} - ${new Date(t.deadline).toLocaleString()}`).join('\n');
    alert("📅 Calendar Assigment:\n\n" + daftar);
}
// Cek apakah user sudah login
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("loggedInUser");
    if (!isLoggedIn) {
        window.location.href = "auth.html"; // Paksa balik ke login kalau belum login
    }
});

// Fungsi Logout
function animasiLogout() {
    const overlay = document.getElementById("logoutOverlay");
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");

    setTimeout(() => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "Deadline.html";
    }, 1500);
}
// Tampilkan data profil saat halaman dimuat
function loadProfile() {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (!loggedInUserEmail) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === loggedInUserEmail);

    if (user) {
        document.getElementById("profileDisplayName").textContent = user.nama || "Tidak ada nama";
        document.getElementById("profileDisplayEmail").textContent = user.email;
    }
}

// Toggle tampilan section profil
function toggleProfileSection() {
    const section = document.getElementById("profileSection");
    section.classList.toggle("hidden");
}

// Tampilkan form ubah password
function showPasswordForm() {
    document.getElementById("passwordForm").classList.toggle("hidden");
}

// Update password
function updatePassword() {
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const loggedInUserEmail = localStorage.getItem("loggedInUser");

    if (!newPassword || newPassword !== confirmPassword) {
        alert("Password tidak cocok atau kosong!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === loggedInUserEmail);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Password berhasil diubah!");
        document.getElementById("passwordForm").classList.add("hidden");
    }
}

// Panggil saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
});


renderTugas();
