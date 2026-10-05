// ===================================================
// PORTFOLIO INTERACTIVE SCRIPT (Vanilla JavaScript)
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------
  // 1. Sidebar Navigation Active State (IntersectionObserver)
  // ---------------------------------------------------
  const navItems = document.querySelectorAll('.nav-item');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('#home, #about, #project, #contact');

  // Event listener klik untuk navigasi & smooth scrolling
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Hapus class .active dari semua .nav-item dan .nav-link
      navItems.forEach((item) => item.classList.remove('active'));
      navLinks.forEach((item) => item.classList.remove('active'));

      // Tambahkan class .active ke item dan link yang diklik
      link.classList.add('active');
      link.closest('.nav-item')?.classList.add('active');
    });
  });

  // ---------------------------------------------------
  // Typing Animation Setup untuk Heading About
  // ---------------------------------------------------
  const aboutHeading = document.querySelector('.about-heading');
  const targetText = "Hi, I'm Michelle Lavinia Intan";
  let aboutTyped = false;

  // Kosongkan teks awal agar animasi mengetik dimulai saat section #about terlihat
  if (aboutHeading) {
    aboutHeading.textContent = '';
  }

  const startAboutTyping = () => {
    if (!aboutHeading) return;

    let index = 0;
    const speed = 80; // Kecepatan 80 ms per karakter (antara 70-90 ms)

    const typeNextChar = () => {
      if (index < targetText.length) {
        aboutHeading.textContent += targetText.charAt(index);
        index++;
        setTimeout(typeNextChar, speed);
      } else {
        // Setelah selesai, tampilkan cursor | yang berkedip
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        aboutHeading.appendChild(cursor);
      }
    };

    typeNextChar();
  };

  // Konfigurasi IntersectionObserver dengan threshold sekitar 0.5
  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Saat sebuah section terlihat cukup jelas (>= 50% di viewport)
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // 1. Hapus class .active dari semua .nav-item (dan .nav-link)
        navItems.forEach((item) => item.classList.remove('active'));
        navLinks.forEach((link) => link.classList.remove('active'));

        // 2. Cari link yang href-nya sesuai dengan id section
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

        // 3. Tambahkan class .active ke link tersebut
        if (activeLink) {
          activeLink.classList.add('active');
          activeLink.closest('.nav-item')?.classList.add('active');
        }

        // 4. Jalankan animasi typing heading About satu kali saat #about terlihat
        if (id === 'about' && !aboutTyped) {
          aboutTyped = true;
          startAboutTyping();
        }
      }
    });
  }, observerOptions);

  // Amati setiap section: #home, #about, #project, #contact
  sections.forEach((section) => {
    if (section) observer.observe(section);
  });

  // ---------------------------------------------------
  // 2. Karakter Mengikuti Arah Kursor (Akurat & Responsif)
  // ---------------------------------------------------
  const charImg = document.getElementById('main-character');
  const homeSection = document.getElementById('home');

  if (charImg && homeSection) {
    // 9 arah sesuai file gambar yang telah dikalibrasi presisi
    const images = {
      'center': 'asset/image/character-center.png',
      'up': 'asset/image/character-up.png',
      'down': 'asset/image/character-down.png',
      'left': 'asset/image/character-left.png',
      'right': 'asset/image/character-right.png',
      'up-left': 'asset/image/character-up-left.png',
      'up-right': 'asset/image/character-up-right.png',
      'down-left': 'asset/image/character-down-left.png',
      'down-right': 'asset/image/character-down-right.png'
    };

    // Preload semua gambar untuk mencegah kedipan / delay pergantian
    Object.values(images).forEach((src) => {
      const preloadImg = new Image();
      preloadImg.src = src;
    });

    let currentDirection = 'center';
    let ticking = false;

    // Fungsi update src hanya jika arah berubah
    const updateCharacterDirection = (direction) => {
      if (currentDirection !== direction && images[direction]) {
        currentDirection = direction;
        charImg.src = images[direction];
      }
    };

    const handleMouseMove = (e) => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;

        // Pastikan section #home sedang aktif di viewport
        const homeRect = homeSection.getBoundingClientRect();
        if (homeRect.bottom <= 0 || homeRect.top >= window.innerHeight) {
          return;
        }

        // Ambil titik mata karakter (fokus pandangan tatapan)
        const charRect = charImg.getBoundingClientRect();
        const eyeCenterX = charRect.left + charRect.width / 2;
        // Posisi mata sekitar 33% dari atas gambar karakter
        const eyeCenterY = charRect.top + charRect.height * 0.33;

        // Hitung jarak dan sudut kursor terhadap mata karakter
        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;
        const distance = Math.hypot(deltaX, deltaY);

        // Ambang batas radius tengah (deadzone agar tidak terlalu sensitif)
        const deadzoneRadius = 80;

        if (distance < deadzoneRadius) {
          updateCharacterDirection('center');
          return;
        }

        // Hitung sudut dalam derajat (-180 sampai 180)
        // 0° = kanan, 90° = bawah, -90° = atas, 180°/-180° = kiri
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        let direction = 'center';

        if (angle >= -22.5 && angle < 22.5) {
          direction = 'right';
        } else if (angle >= 22.5 && angle < 67.5) {
          direction = 'down-right';
        } else if (angle >= 67.5 && angle < 112.5) {
          direction = 'down';
        } else if (angle >= 112.5 && angle < 157.5) {
          direction = 'down-left';
        } else if (angle >= 157.5 || angle < -157.5) {
          direction = 'left';
        } else if (angle >= -157.5 && angle < -112.5) {
          direction = 'up-left';
        } else if (angle >= -112.5 && angle < -67.5) {
          direction = 'up';
        } else if (angle >= -67.5 && angle < -22.5) {
          direction = 'up-right';
        }

        updateCharacterDirection(direction);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Saat kursor keluar dari window, kembalikan tatapan ke depan (center)
    document.addEventListener('mouseleave', () => {
      updateCharacterDirection('center');
    });
  }

  // ---------------------------------------------------
  // 3. Interaksi Drag & Drop Lanyard (Mouse & Touch)
  // ---------------------------------------------------
  const lanyardWrapper = document.querySelector('.lanyard-wrapper');
  const lanyardImg = document.querySelector('.lanyard-img');

  if (lanyardWrapper) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let currentRotation = 0;
    let targetRotation = 0;

    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    let lastPointerX = 0;
    let lastTime = 0;
    let rafId = null;

    // Cegah native image drag / ghost image
    if (lanyardImg) {
      lanyardImg.addEventListener('dragstart', (e) => e.preventDefault());
    }

    const updateDragPhysics = () => {
      if (!isDragging) return;

      // Peluruhan rotasi halus saat mouse berhenti bergerak
      targetRotation *= 0.88;
      currentRotation += (targetRotation - currentRotation) * 0.25;

      // Batasi rotasi maksimum sekitar -30 sampai 30 derajat
      currentRotation = Math.max(-30, Math.min(30, currentRotation));

      lanyardWrapper.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px) rotate(${currentRotation.toFixed(2)}deg)`;

      rafId = requestAnimationFrame(updateDragPhysics);
    };

    const handlePointerDown = (e) => {
      // Hanya tangani tombol mouse utama (kiri) atau touch
      if (e.button !== undefined && e.button !== 0) return;

      isDragging = true;
      e.preventDefault();

      // Simpan offset titik klik supaya posisi gambar tidak loncat
      startX = e.clientX;
      startY = e.clientY;
      initialX = currentX;
      initialY = currentY;

      lastPointerX = e.clientX;
      lastTime = performance.now();
      targetRotation = 0;

      // Matikan transisi saat drag aktif agar gerakan instan & responsif
      lanyardWrapper.style.transition = 'none';

      // Ubah kursor menjadi grabbing
      lanyardWrapper.classList.add('is-dragging');
      document.body.classList.add('lanyard-is-dragging');

      // Tangkap pointer agar tracking tetap aktif walau kursor keluar elemen
      if (lanyardWrapper.setPointerCapture) {
        try {
          lanyardWrapper.setPointerCapture(e.pointerId);
        } catch (_) {}
      }

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDragPhysics);
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;

      // Izinkan translasi X dan Y
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      currentX = initialX + deltaX;
      currentY = initialY + deltaY;

      // Hitung kecepatan horizontal mouse untuk rotasi badge
      const now = performance.now();
      const dt = Math.max(8, now - lastTime);
      const moveDx = e.clientX - lastPointerX;

      lastPointerX = e.clientX;
      lastTime = now;

      // Kecepatan dinormalisasi ke ~60fps
      const speedX = moveDx / (dt / 16.67);

      // Rotasi mengikuti kecepatan horizontal mouse (maksimum -30 sampai 30 derajat)
      targetRotation = speedX * 2.2;
      targetRotation = Math.max(-30, Math.min(30, targetRotation));
    };

    const handlePointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;

      cancelAnimationFrame(rafId);

      // Lepaskan pointer capture
      if (lanyardWrapper.releasePointerCapture) {
        try {
          lanyardWrapper.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }

      // Kembalikan kursor ke grab
      lanyardWrapper.classList.remove('is-dragging');
      document.body.classList.remove('lanyard-is-dragging');

      // Saat mouse/touch dilepas:
      // 1. Posisi terakhir tetap (currentX dan currentY dipertahankan)
      // 2. Rotasi kembali ke 0 derajat
      // 3. Gunakan easing elastic / spring-like yang halus
      currentRotation = 0;
      targetRotation = 0;
      lanyardWrapper.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
      lanyardWrapper.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px) rotate(0deg)`;
    };

    lanyardWrapper.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  // ---------------------------------------------------
  // 4. Horizontal Slider Section #project (Vanilla JS)
  // ---------------------------------------------------
  const projectSlider = document.getElementById('project-slider');
  const projectPrevBtn = document.getElementById('project-prev');
  const projectNextBtn = document.getElementById('project-next');

  if (projectSlider && projectPrevBtn && projectNextBtn) {
    const getScrollStep = () => {
      const card = projectSlider.querySelector('.project-card');
      if (card) {
        const style = window.getComputedStyle(projectSlider);
        const gap = parseFloat(style.gap) || 24;
        return card.offsetWidth + gap;
      }
      return 360;
    };

    projectPrevBtn.addEventListener('click', () => {
      projectSlider.scrollBy({
        left: -getScrollStep(),
        behavior: 'smooth'
      });
    });

    projectNextBtn.addEventListener('click', () => {
      projectSlider.scrollBy({
        left: getScrollStep(),
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------
  // 5. Popup Modal Preview untuk Project (Vanilla JS)
  // ---------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalCloseBtn = document.getElementById('modal-close');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectModal && modalImg && modalCloseBtn) {
    let lastFocusedTrigger = null;

    const openModal = (card, triggerEl) => {
      lastFocusedTrigger = triggerEl || card.querySelector('.card-img-wrap');
      const img = card.querySelector('.project-img');
      const name = card.querySelector('.card-name');
      const category = card.querySelector('.card-category');

      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Project Preview';
      }
      if (modalTitle && name) {
        modalTitle.textContent = name.textContent;
      }
      if (modalCategory && category) {
        modalCategory.textContent = category.textContent;
      }

      projectModal.classList.add('is-open');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Cegah scrolling latar belakang saat modal aktif

      // Fokuskan tombol close untuk aksesibilitas keyboard
      setTimeout(() => {
        modalCloseBtn.focus();
      }, 50);
    };

    const closeModal = () => {
      projectModal.classList.remove('is-open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Kembalikan scroll latar belakang

      // Kembalikan fokus ke elemen pemicu sebelumnya
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }

      // Bersihkan gambar setelah transisi selesai
      setTimeout(() => {
        if (!projectModal.classList.contains('is-open')) {
          modalImg.src = '';
        }
      }, 300);
    };

    // Buka modal saat user klik atau tekan Enter/Spasi pada area gambar card
    projectCards.forEach((card) => {
      const imgWrap = card.querySelector('.card-img-wrap');
      if (imgWrap) {
        imgWrap.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(card, imgWrap);
        });

        // Dukungan navigasi keyboard (Enter / Spasi)
        imgWrap.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            openModal(card, imgWrap);
          }
        });
      }
    });

    // 1. Klik tombol close X
    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    // 2. Klik area overlay di luar content
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal || e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });

    // 3. Tekan tombol Escape pada keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // ---------------------------------------------------
  // 6. Section #contact Envelope CTA Touch/Click Toggle
  // ---------------------------------------------------
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', (e) => {
      // Jika yang diklik adalah tombol mailto atau elemen di dalamnya, biarkan navigasi email berjalan normal
      if (e.target.closest('#contact-email-btn')) {
        return;
      }
      // Toggle class .is-open untuk kemudahan interaksi sentuh/klik di layar mobile
      envelopeWrapper.classList.toggle('is-open');
    });
  }
});

