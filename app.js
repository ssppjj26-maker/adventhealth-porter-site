/**
 * AdventHealth Porter (adventhealthtest-vercel)
 * Interactive Application & Olivia Virtual Assistant Chat Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
  initDoctorDirectory();
  initAppointmentModal();
  initERWaitTime();
  initMobileNav();
  initGuideTabs();
});

/* ==========================================================================
   1. OLIVIA VIRTUAL ASSISTANT CHATBOT ENGINE
   ========================================================================== */

function initChatbot() {
  const chatWindow = document.getElementById("chatWindow");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const restartButton = document.getElementById("restartChatBtn");
  const typingIndicator = document.getElementById("typingIndicator");

  // Reset chat to empty state
  window.resetChat = function() {
    chatBody.innerHTML = `
      <!-- TYPING INDICATOR -->
      <div class="typing" id="typingIndicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>Olivia is typing...</span>
      </div>
    `;
  };

  // Toggle chat window open / closed
  window.toggleChat = function() {
    chatWindow.classList.toggle("active");
    if (chatWindow.classList.contains("active")) {
      setTimeout(() => {
        chatInput.focus();
        scrollToBottom();
      }, 250);
    }
  };

  // Global helper to open chat window
  window.openChatWithTopic = function(topic) {
    if (!chatWindow.classList.contains("active")) {
      chatWindow.classList.add("active");
    }
    setTimeout(() => {
      chatInput.focus();
      scrollToBottom();
    }, 250);
  };

  // Send message on input button or Enter key
  function handleSendMessage() {
    const query = chatInput.value.trim();
    if (!query) return;

    addUserMessage(query);
    chatInput.value = "";
  }

  sendButton.addEventListener("click", handleSendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  });

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      window.resetChat();
    });
  }

  // Add User Message to Chat UI (clean message bubble, no time code)
  function addUserMessage(text) {
    const userRow = document.createElement("div");
    userRow.className = "message-row user";
    userRow.innerHTML = `
      <div class="message user-message">${escapeHTML(text)}</div>
    `;

    const typing = document.getElementById("typingIndicator");
    chatBody.insertBefore(userRow, typing);
    scrollToBottom();
  }

  // Optional helper to append bot message (only when called externally, not automatic)
  window.addBotMessage = function(htmlContent) {
    const botRow = document.createElement("div");
    botRow.className = "message-row bot";
    botRow.innerHTML = `
      <div class="message bot-message">${htmlContent}</div>
    `;

    const typing = document.getElementById("typingIndicator");
    if (typing) {
      chatBody.insertBefore(botRow, typing);
    } else {
      chatBody.appendChild(botRow);
    }
    scrollToBottom();
  };

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
  }
}

/* ==========================================================================
   2. DOCTORS DIRECTORY FILTERING & SEARCH
   ========================================================================== */
function initDoctorDirectory() {
  const searchInput = document.getElementById("doctorSearchInput");
  const filterPills = document.querySelectorAll(".filter-pill");
  const doctorCards = document.querySelectorAll(".doctor-card");

  if (!searchInput || !doctorCards.length) return;

  let currentCategory = "all";

  function filterDoctors() {
    const query = searchInput.value.toLowerCase().trim();

    doctorCards.forEach((card) => {
      const name = card.querySelector("h3").innerText.toLowerCase();
      const spec = card.querySelector(".doctor-spec").innerText.toLowerCase();
      const cardCategory = card.getAttribute("data-category") || "";

      const matchesCategory = (currentCategory === "all" || cardCategory === currentCategory);
      const matchesQuery = (!query || name.includes(query) || spec.includes(query));

      if (matchesCategory && matchesQuery) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", filterDoctors);

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-filter") || "all";
      filterDoctors();
    });
  });
}

/* ==========================================================================
   3. APPOINTMENT BOOKING MODAL
   ========================================================================== */
function initAppointmentModal() {
  const modal = document.getElementById("appointmentModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const bookingForm = document.getElementById("bookingForm");
  const confirmBanner = document.getElementById("bookingConfirmBanner");
  const doctorSelect = document.getElementById("appointmentDoctorSelect");

  window.openAppointmentModal = function(preselectedDoctor = "") {
    if (modal) {
      modal.classList.add("active");
      if (confirmBanner) confirmBanner.style.display = "none";
      if (preselectedDoctor && doctorSelect) {
        doctorSelect.value = preselectedDoctor;
      }
    }
  };

  window.closeAppointmentModal = function() {
    if (modal) {
      modal.classList.remove("active");
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", window.closeAppointmentModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        window.closeAppointmentModal();
      }
    });
  }

  // Attach to all booking buttons
  const bookButtons = document.querySelectorAll(".trigger-appointment-modal");
  bookButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const doc = btn.getAttribute("data-doctor") || "";
      window.openAppointmentModal(doc);
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerText;
      submitBtn.disabled = true;
      submitBtn.innerText = "Securing Appointment...";

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
        if (confirmBanner) {
          const refCode = "AH-" + Math.floor(100000 + Math.random() * 900000);
          confirmBanner.innerHTML = `
            <strong>✅ Appointment Request Received!</strong><br>
            Confirmation Reference: <strong>#${refCode}</strong><br>
            An AdventHealth Porter scheduling coordinator will contact you within 2 business hours.
          `;
          confirmBanner.style.display = "block";
          bookingForm.reset();
        }
      }, 1000);
    });
  }
}

/* ==========================================================================
   4. LIVE ER WAIT TIME SIMULATOR
   ========================================================================== */
function initERWaitTime() {
  const waitElement = document.getElementById("liveWaitTime");
  if (!waitElement) return;

  // Realistic minor fluctuation every 45 seconds
  setInterval(() => {
    const times = ["8 Mins", "9 Mins", "11 Mins", "12 Mins", "10 Mins"];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    waitElement.innerText = randomTime;
  }, 45000);
}

/* ==========================================================================
   5. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const navMenu = document.getElementById("navMenu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      toggleBtn.innerText = navMenu.classList.contains("open") ? "✕" : "☰";
    });
  }
}

/* ==========================================================================
   6. VISITOR GUIDE TABS
   ========================================================================== */
function initGuideTabs() {
  const tabs = document.querySelectorAll(".guide-tab-btn");
  const cards = document.querySelectorAll(".guide-card");

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.getAttribute("data-tab");
      cards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || cardCat === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}
