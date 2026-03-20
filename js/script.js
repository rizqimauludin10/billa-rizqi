// ============================================================
// APPS SCRIPT URL — Ganti dengan URL deployment lo
// ============================================================
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwB2V_jDquV9BfvNIDppQ-hXWZs19GidgOz9Cz8IGp8sPGdw2HHq3986m0yAcpkvnNR/exec";

document.addEventListener("DOMContentLoaded", function () {
  /* =============================
     AMBIL NAMA TAMU DARI URL
     Contoh: ?to=Nabilla+Eko+Putri
  ============================= */
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");
  const guestEl = document.getElementById("guestName");
  if (guestName && guestEl) {
    guestEl.innerText = guestName;
  }

  /* =============================
     COVER BUTTON
  ============================= */
  const openBtn = document.getElementById("openBtn");
  const cover = document.getElementById("cover");
  const bgVideo = document.getElementById("bgVideo");
  const mainContent = document.getElementById("mainContent");

  if (openBtn && cover && bgVideo && mainContent) {
    openBtn.addEventListener("click", function () {
      document.body.style.overflowY = "auto";

      cover.classList.add("fade-out");
      bgVideo.classList.add("show-video");
      bgVideo.play().catch(() => {});

      setTimeout(() => {
        cover.style.display = "none";
        mainContent.style.display = "block";

        // Double rAF biar opacity transition jalan setelah display:block
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            mainContent.classList.add("show-content");
          });
        });
      }, 1200);
    });
  }

  /* =============================
     COVER ENTRANCE ANIMATION
  ============================= */
  const coverElements = document.querySelectorAll(
    ".logo-wrapper, .couple-wrapper, .guest-wrapper, .button-wrapper",
  );

  coverElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("cover-show");
    }, index * 200);
  });

  /* =============================
     INTERSECTION OBSERVER
     Semua scroll animation dalam satu observer
  ============================= */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 },
  );

  // Quote section
  const quoteContainer = document.querySelector("#quoteSection .container");
  if (quoteContainer) observer.observe(quoteContainer);

  // Journey title & story items
  const journeyTitle = document.querySelector(".journey-title");
  if (journeyTitle) observer.observe(journeyTitle);
  document
    .querySelectorAll(".story-item")
    .forEach((item) => observer.observe(item));

  // Bride & Groom
  const brideSection = document.getElementById("brideSection");
  const groomSection = document.getElementById("groomSection");
  if (brideSection) observer.observe(brideSection);
  if (groomSection) observer.observe(groomSection);

  // Event section
  const eventSection = document.getElementById("eventSection");
  if (eventSection) observer.observe(eventSection);

  // Venue section
  const venueSection = document.getElementById("venueSection");
  if (venueSection) observer.observe(venueSection);

  // RSVP section
  const rsvpSection = document.getElementById("rsvpSection");
  if (rsvpSection) observer.observe(rsvpSection);

  // Wishes section
  const wishesSection = document.getElementById("wishesSection");
  if (wishesSection) observer.observe(wishesSection);

  // Gallery section
  const gallerySection = document.getElementById("gallerySection");
  if (gallerySection) observer.observe(gallerySection);

  // Closing section
  const closingSection = document.getElementById("closingSection");
  if (closingSection) observer.observe(closingSection);

  /* =============================
     SLIDER — Bride & Groom
     Reusable function
  ============================= */
  function startSlider(selector, interval) {
    const slides = document.querySelectorAll(selector);
    if (!slides.length) return;
    let index = 0;

    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, interval);
  }

  startSlider(".bride-slide", 4000);
  startSlider(".groom-slide", 4500);

  /* =============================
     COUNTDOWN TIMER
     Uncomment kalau countdown diaktifkan di HTML
  ============================= */
  // const weddingDate = new Date("2026-10-15T08:00:00+07:00");
  //
  // function updateCountdown() {
  //   const diff = weddingDate - new Date();
  //   if (diff <= 0) {
  //     ["cdDays","cdHours","cdMinutes","cdSeconds"].forEach(id => {
  //       const el = document.getElementById(id);
  //       if (el) el.textContent = "00";
  //     });
  //     return;
  //   }
  //   const days    = Math.floor(diff / 86400000);
  //   const hours   = Math.floor((diff % 86400000) / 3600000);
  //   const minutes = Math.floor((diff % 3600000) / 60000);
  //   const seconds = Math.floor((diff % 60000) / 1000);
  //   const pad = n => String(n).padStart(2, "0");
  //   const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };
  //   set("cdDays", days); set("cdHours", hours);
  //   set("cdMinutes", minutes); set("cdSeconds", seconds);
  // }
  // updateCountdown();
  // setInterval(updateCountdown, 1000);

  /* =============================
     RSVP CHAT
  ============================= */
  initRSVP();

  /* =============================
     WISHES
  ============================= */
  initWishes();

  /* =============================
     GALLERY
  ============================= */
  initGallery();
}); // end DOMContentLoaded

/* =============================
   RSVP FUNCTION
============================= */
function initRSVP() {
  const messagesEl = document.getElementById("rsvpMessages");
  const inputArea = document.getElementById("rsvpInputArea");
  const inputEl = document.getElementById("rsvpInput");
  const sendBtn = document.getElementById("rsvpSendBtn");

  if (!messagesEl || !inputArea || !inputEl || !sendBtn) return;

  let userData = { hadir: "", nama: "", jumlah: "", ucapan: "" };
  let currentCallback = null;

  // Pasang event listener sekali saja
  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  function handleSend() {
    const val = inputEl.value.trim();
    if (!val || !currentCallback) return;
    inputEl.disabled = true;
    sendBtn.disabled = true;
    inputArea.classList.add("hidden");
    const cb = currentCallback;
    currentCallback = null;
    cb(val);
  }

  inputArea.classList.add("hidden");

  // Mulai percakapan
  setTimeout(
    () =>
      addBubbleLeft("Halo! Senang sekali kamu sudah membuka undangan kami 🥰"),
    600,
  );
  setTimeout(() => {
    addBubbleLeft("Apakah kamu bisa hadir di hari istimewa kami?");
    addChoices(
      [
        { emoji: "🥂", text: "Insya Allah hadir!" },
        { emoji: "💔", text: "Maaf, berhalangan hadir" },
      ],
      handleHadir,
    );
  }, 1400);

  function handleHadir(pilihan) {
    userData.hadir = pilihan === 0 ? "Hadir" : "Tidak Hadir";
    addBubbleRight(
      pilihan === 0 ? "Insya Allah hadir! 🎉" : "Maaf, berhalangan hadir 🙏",
    );
    setTimeout(() => {
      addBubbleLeft(
        pilihan === 0
          ? "Alhamdulillah, senang sekali! 🤍"
          : "Tidak apa-apa, terima kasih sudah memberitahu kami 🤍",
      );
    }, 600);
    setTimeout(() => {
      addBubbleLeft("Boleh tau nama kamu?");
      showInput("Ketik nama kamu...", handleNama, "text");
    }, 1400);
  }

  function handleNama(nama) {
    userData.nama = nama;
    addBubbleRight(nama);
    setTimeout(() => addBubbleLeft(`Hai ${nama}! 😊`), 600);
    if (userData.hadir === "Hadir") {
      setTimeout(() => {
        addBubbleLeft("Berapa orang yang akan hadir? (termasuk kamu)");
        showInput("Contoh: 2", handleJumlah, "number");
      }, 1400);
    } else {
      setTimeout(() => {
        addBubbleLeft("Titip ucapan dan doa untuk kami yuk! 🤍");
        showInput("Tulis ucapan kamu...", handleUcapan, "text");
      }, 1400);
    }
  }

  function handleJumlah(jumlah) {
    if (isNaN(jumlah) || Number(jumlah) < 1) {
      addBubbleLeft("Hmm, sepertinya bukan angka yang valid. Coba lagi ya 😊");
      showInput("Contoh: 2", handleJumlah, "number");
      return;
    }
    userData.jumlah = jumlah;
    addBubbleRight(`${jumlah} orang`);
    setTimeout(
      () =>
        addBubbleLeft(
          `Siap! Kami akan menyiapkan tempat untuk ${jumlah} orang 🥰`,
        ),
      600,
    );
    setTimeout(() => {
      addBubbleLeft("Titip ucapan dan doa untuk kami yuk! 🤍");
      showInput("Tulis ucapan kamu...", handleUcapan, "text");
    }, 1400);
  }

  function handleUcapan(ucapan) {
    userData.ucapan = ucapan;
    addBubbleRight(ucapan);
    inputArea.classList.add("hidden");
    setTimeout(
      () =>
        addBubbleLeft(
          "Terima kasih banyak! Ucapanmu sangat berarti untuk kami 🤍",
        ),
      600,
    );
    setTimeout(() => {
      addBubbleLeft("Sedang menyimpan konfirmasimu...");
      showTyping();
      kirimKeSheets();
    }, 1400);
  }

  function kirimKeSheets() {
    const payload = {
      nama: userData.nama,
      hadir: userData.hadir,
      jumlah: userData.jumlah || "-",
      ucapan: userData.ucapan,
      waktu: new Date().toLocaleString("id-ID"),
    };

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        removeTyping();
        tampilkanSukses();
      })
      .catch(() => {
        removeTyping();
        tampilkanSukses();
      });
  }

  function tampilkanSukses() {
    inputArea.classList.add("hidden");
    setTimeout(() => {
      const sukses = document.createElement("div");
      sukses.className = "rsvp-success";
      sukses.innerHTML = `
        <div class="rsvp-success-icon">🎊</div>
        <div class="rsvp-success-title">Terima kasih, ${userData.nama}!</div>
        <div class="rsvp-success-desc">
          Konfirmasimu sudah kami terima.<br>
          ${
            userData.hadir === "Hadir"
              ? "Sampai jumpa di hari istimewa kami! 🥂"
              : "Doa dan dukunganmu sangat berarti untuk kami. 🤍"
          }
        </div>
      `;
      messagesEl.appendChild(sukses);
      scrollToBottom();
    }, 600);
  }

  function addBubbleLeft(text) {
    const wrap = document.createElement("div");
    wrap.className = "rsvp-bubble-left";
    wrap.innerHTML = `<div class="rsvp-bubble-avatar">💌</div><div class="rsvp-bubble">${text}</div>`;
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function addBubbleRight(text) {
    const wrap = document.createElement("div");
    wrap.className = "rsvp-bubble-right";
    wrap.innerHTML = `<div class="rsvp-bubble">${text}</div>`;
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function addChoices(choices, callback) {
    inputArea.classList.add("hidden");
    const wrap = document.createElement("div");
    wrap.className = "rsvp-choices";
    choices.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.className = "rsvp-choice-btn";
      btn.innerHTML = `${c.emoji} &nbsp;${c.text}`;
      btn.addEventListener("click", () => {
        wrap
          .querySelectorAll(".rsvp-choice-btn")
          .forEach((b) => (b.disabled = true));
        callback(i);
      });
      wrap.appendChild(btn);
    });
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function showInput(placeholder, callback, type = "text") {
    currentCallback = callback;
    inputEl.placeholder = placeholder;
    inputEl.type = type;
    inputEl.value = "";
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputArea.classList.remove("hidden");
    setTimeout(() => inputEl.focus(), 100);
    // FIX: scroll ke input saat keyboard muncul di HP
    setTimeout(
      () => inputEl.scrollIntoView({ behavior: "smooth", block: "center" }),
      300,
    );
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "rsvp-typing";
    el.id = "rsvpTyping";
    el.innerHTML = `
      <div class="rsvp-bubble-avatar">💌</div>
      <div class="rsvp-typing-dots">
        <div class="rsvp-dot"></div>
        <div class="rsvp-dot"></div>
        <div class="rsvp-dot"></div>
      </div>
    `;
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById("rsvpTyping");
    if (el) el.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

/* =============================
   WISHES FUNCTION
============================= */
function initWishes() {
  const masonry = document.getElementById("wishesMasonry");
  const loadMore = document.getElementById("wishesLoadMore");
  const loading = document.getElementById("wishesLoading");
  const empty = document.getElementById("wishesEmpty");

  if (!masonry || !loadMore || !loading || !empty) return;

  const PER_PAGE = 6;
  let allWishes = [];
  let currentIndex = 0;

  loadMore.classList.add("hidden");
  empty.classList.add("hidden");

  fetch(APPS_SCRIPT_URL)
    .then((res) => res.json())
    .then((data) => {
      loading.classList.add("hidden");
      allWishes = data.filter((row) => row.ucapan && row.ucapan.trim() !== "");
      if (allWishes.length === 0) {
        empty.classList.remove("hidden");
        return;
      }
      renderWishes();
      updateLoadMoreBtn();
    })
    .catch(() => {
      loading.classList.add("hidden");
      empty.classList.remove("hidden");
    });

  function renderWishes() {
    const batch = allWishes.slice(currentIndex, currentIndex + PER_PAGE);
    batch.forEach((wish, i) => {
      const card = document.createElement("div");
      card.className = "wishes-card";
      card.style.animationDelay = `${i * 0.08}s`;
      const isHadir = wish.hadir === "Hadir";
      const statusClass = isHadir ? "hadir" : "tidak";
      const statusText = isHadir ? "Hadir" : "Berhalangan";
      card.innerHTML = `
        <span class="wishes-card-quote">"</span>
        <div class="wishes-card-name">${escapeHTML(wish.nama)}</div>
        <span class="wishes-card-status ${statusClass}">${statusText}</span>
        <div class="wishes-card-text">${escapeHTML(wish.ucapan)}</div>
      `;
      masonry.appendChild(card);
    });
    currentIndex += batch.length;
  }

  function updateLoadMoreBtn() {
    if (currentIndex >= allWishes.length) {
      loadMore.classList.add("hidden");
    } else {
      loadMore.classList.remove("hidden");
    }
  }

  loadMore.addEventListener("click", () => {
    renderWishes();
    updateLoadMoreBtn();
  });

  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

/* =============================
   GALLERY FUNCTION
============================= */
function initGallery() {
  const items = document.querySelectorAll(".editorial-item");
  const lightbox = document.getElementById("galleryLightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbCounter = document.getElementById("lbCounter");

  if (!items.length || !lightbox) return;

  const srcs = Array.from(items)
    .sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index))
    .map((item) => item.querySelector("img").src);

  const total = srcs.length;
  let current = 0;

  function openLightbox(index) {
    current = index;
    lbImg.src = srcs[current];
    lbCounter.textContent = `${current + 1} / ${total}`;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    // FIX: reset overflow dengan benar biar scroll tidak hilang
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";
  }

  function prevPhoto() {
    current = (current - 1 + total) % total;
    lbImg.src = srcs[current];
    lbCounter.textContent = `${current + 1} / ${total}`;
  }

  function nextPhoto() {
    current = (current + 1) % total;
    lbImg.src = srcs[current];
    lbCounter.textContent = `${current + 1} / ${total}`;
  }

  items.forEach((item) => {
    item.addEventListener("click", () =>
      openLightbox(parseInt(item.dataset.index)),
    );
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", prevPhoto);
  lbNext.addEventListener("click", nextPhoto);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "ArrowLeft") prevPhoto();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "Escape") closeLightbox();
  });

  // FIX: Swipe support untuk mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextPhoto();
      else prevPhoto();
    }
  });
}
