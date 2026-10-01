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

  // Initial welcome state template matching user's template
  const initialBotHTML = `
    <!-- BOT MESSAGE -->
    <div class="message-row bot">
      <div class="message-meta">
        <span>Olivia</span>
        <span>·</span>
        <span>Online</span>
      </div>
      <div class="message bot-message">
        Hello! 👋 I'm your virtual assistant.
        <br><br>
        How can I help you today?
      </div>
      <div class="quick-actions">
        <button class="quick-button" data-action="appointment">📅 Book an Appointment</button>
        <button class="quick-button" data-action="specialist">🩺 Find a Specialist</button>
        <button class="quick-button" data-action="billing">💳 Insurance & Billing</button>
        <button class="quick-button" data-action="location">📍 Location & Parking</button>
      </div>
    </div>
  `;

  // Reset to initial state
  window.resetChat = function() {
    chatBody.innerHTML = initialBotHTML + `
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
    attachQuickButtonListeners();
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

  // Global helper to open chat and trigger a specific topic
  window.openChatWithTopic = function(topic) {
    if (!chatWindow.classList.contains("active")) {
      chatWindow.classList.add("active");
    }
    setTimeout(() => {
      handleUserAction(topic);
    }, 300);
  };

  // Attach quick action listeners
  function attachQuickButtonListeners() {
    const buttons = chatBody.querySelectorAll(".quick-button");
    buttons.forEach((btn) => {
      btn.onclick = () => {
        const text = btn.innerText.trim();
        const action = btn.getAttribute("data-action");
        addUserMessage(text);
        respondToAction(action, text);
      };
    });
  }

  // Send message on input button or Enter key
  function handleSendMessage() {
    const query = chatInput.value.trim();
    if (!query) return;

    addUserMessage(query);
    chatInput.value = "";
    processUserText(query);
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

  // Add User Message to Chat UI
  function addUserMessage(text) {
    const timeStr = getCurrentTime();
    const userRow = document.createElement("div");
    userRow.className = "message-row user";
    userRow.innerHTML = `
      <div class="message-meta">
        <span>You</span>
        <span>·</span>
        <span>${timeStr}</span>
      </div>
      <div class="message user-message">${escapeHTML(text)}</div>
    `;

    const typing = document.getElementById("typingIndicator");
    chatBody.insertBefore(userRow, typing);
    scrollToBottom();
  }

  // Show Typing Indicator
  function showTyping(show) {
    const typing = document.getElementById("typingIndicator");
    if (typing) {
      if (show) {
        typing.classList.add("active");
        scrollToBottom();
      } else {
        typing.classList.remove("active");
      }
    }
  }

  // Add Bot Response to Chat UI
  function addBotMessage(htmlContent, quickActions = []) {
    showTyping(true);
    const delay = Math.min(1100, Math.max(500, htmlContent.length * 5));

    setTimeout(() => {
      showTyping(false);
      const timeStr = getCurrentTime();
      const botRow = document.createElement("div");
      botRow.className = "message-row bot";

      let actionsHTML = "";
      if (quickActions.length > 0) {
        actionsHTML = `<div class="quick-actions">` +
          quickActions.map(a => `<button class="quick-button" data-action="${a.action}">${a.label}</button>`).join("") +
          `</div>`;
      }

      botRow.innerHTML = `
        <div class="message-meta">
          <span>Olivia</span>
          <span>·</span>
          <span>${timeStr}</span>
        </div>
        <div class="message bot-message">${htmlContent}</div>
        ${actionsHTML}
      `;

      const typing = document.getElementById("typingIndicator");
      chatBody.insertBefore(botRow, typing);
      attachQuickButtonListeners();
      scrollToBottom();
    }, delay);
  }

  // Action responses
  function respondToAction(action, text) {
    switch (action) {
      case "appointment":
        addBotMessage(
          `I can help schedule your appointment at AdventHealth Porter! What type of specialty or care do you need?`,
          [
            { action: "care_primary", label: "🩺 Primary Care" },
            { action: "care_cardio", label: "❤️ Cardiology" },
            { action: "care_ortho", label: "🦴 Orthopedics & Spine" },
            { action: "care_transplant", label: "🔄 Transplant Services" },
            { action: "open_modal", label: "📝 Open Scheduling Form" }
          ]
        );
        break;

      case "open_modal":
        addBotMessage(`Opening the appointment booking form on your screen right now...`);
        setTimeout(() => {
          window.openAppointmentModal();
        }, 600);
        break;

      case "care_primary":
        addBotMessage(
          `Our <strong>Primary Care</strong> physicians at AdventHealth Porter emphasize whole-person wellness, prevention, and ongoing chronic care for the entire family.<br><br>• Same-day & next-day visits available<br>• In-person and Virtual Care telehealth visits<br><br>Would you like to schedule with a primary care doctor now?`,
          [
            { action: "open_modal", label: "📅 Schedule Primary Care" },
            { action: "call_scheduling", label: "📞 Call (303) 778-1955" },
            { action: "location", label: "📍 Clinic Location" }
          ]
        );
        break;

      case "care_ortho":
        addBotMessage(
          `AdventHealth Porter is renowned for <strong>Orthopedics & Spine</strong> care, featuring Mako™ robotic-assisted hip and knee replacements, spine surgery, and sports medicine under orthopedic leaders like <strong>Dr. Marcus Vance, MD</strong>.<br><br>Would you like to consult with our joint replacement & orthopedic team?`,
          [
            { action: "open_modal", label: "📅 Schedule Ortho Consult" },
            { action: "call_scheduling", label: "📞 Call (303) 778-1955" },
            { action: "location", label: "📍 Center for Joint Replacement" }
          ]
        );
        break;

      case "care_cardio":
        addBotMessage(
          `The <strong>Porter Heart & Vascular Institute</strong> offers world-class cardiology, cardiac catheterization, minimally invasive valve repair (TAVR), and thoracic surgery led by <strong>Dr. David Chen, MD, FACS</strong>.<br><br>• Accredited Chest Pain Center<br>• Dedicated Cardiovascular ICU`,
          [
            { action: "open_modal", label: "📅 Schedule Heart Consult" },
            { action: "er", label: "🚑 Emergency Cardiac Care" },
            { action: "call_scheduling", label: "📞 Call (303) 778-1955" }
          ]
        );
        break;

      case "care_neuro":
        addBotMessage(
          `Our <strong>Neurosciences & Spine Institute</strong> provides advanced diagnosis and compassionate treatment for spine disorders, stroke, neuropathy, and complex cranial conditions in Denver.<br><br>Would you like to book a neurological consultation?`,
          [
            { action: "open_modal", label: "📅 Schedule Neuro Consult" },
            { action: "call_scheduling", label: "📞 Call (303) 778-1955" }
          ]
        );
        break;

      case "specialist":
      case "care_transplant":
        addBotMessage(
          `AdventHealth Porter features board-certified physicians in Denver. You can view our available physicians below or book directly:
          <br><br>
          • <strong>Dr. David Chen, MD, FACS</strong> (Cardiothoracic Surgery)<br>
          • <strong>Dr. Sarah Lewis, MD</strong> (Kidney & Liver Transplant)<br>
          • <strong>Dr. Marcus Vance, MD</strong> (Orthopedic Surgery & Joint Replacement)<br>
          • <strong>Dr. Elena Rodriguez, MD</strong> (Medical Oncology)
          <br><br>
          Would you like to book with one of our doctors or speak with patient scheduling at <strong>(303) 778-1955</strong>?`,
          [
            { action: "open_modal", label: "📅 Schedule Now" },
            { action: "call_scheduling", label: "📞 Call (303) 778-1955" },
            { action: "location", label: "📍 Where is the clinic?" }
          ]
        );
        break;

      case "billing":
        addBotMessage(
          `AdventHealth Porter accepts Medicare, Colorado Medicaid, and most major commercial insurances (Aetna, Anthem BCBS, Cigna, UnitedHealthcare, Humana).
          <br><br>
          • <strong>Pay Online:</strong> Access your AdventHealth Account to review statements.<br>
          • <strong>Financial Assistance:</strong> We offer flexible, interest-free payment plans and charity care options.<br>
          • <strong>Billing Phone:</strong> (303) 778-5700`,
          [
            { action: "appointment", label: "📅 Book Care" },
            { action: "location", label: "📍 Campus Map" }
          ]
        );
        break;

      case "location":
        addBotMessage(
          `<strong>AdventHealth Porter</strong><br>
          📍 <strong>Address:</strong> 2525 South Downing Street, Denver, CO 80210<br>
          📞 <strong>Main Hospital:</strong> (303) 778-1955<br><br>
          • <strong>Complimentary Valet:</strong> Available at the Main Entrance Monday–Friday, 7:00 AM – 5:00 PM.<br>
          • <strong>Visitor Parking Garage:</strong> Located adjacent to the hospital on East Harvard Ave (Free for patients & visitors).<br>
          • <strong>Light Rail:</strong> University of Denver (DU) Station on E and H lines with RTD bus connections.`,
          [
            { action: "er", label: "🚑 Where is the ER entrance?" },
            { action: "visiting", label: "⏰ Visiting Hours" }
          ]
        );
        break;

      case "er":
        addBotMessage(
          `🚑 <strong>24/7 Emergency Room & Level III Trauma Center</strong><br><br>
          Our Emergency Department is open 24 hours a day, 365 days a year with dedicated trauma, chest pain, and stroke teams.<br>
          • <strong>Current Estimated Triage Time:</strong> ~8 - 11 minutes.<br>
          • <strong>ER Entrance:</strong> Located on the east wing off S. Downing St & E. Harvard Ave.<br><br>
          ⚠️ <em>If you are experiencing a life-threatening emergency, please dial 911 immediately.</em>`,
          [
            { action: "location", label: "📍 Get Directions" },
            { action: "visiting", label: "⏰ Visitor Policy" }
          ]
        );
        break;

      case "visiting":
        addBotMessage(
          `<strong>Patient & Visitor Hours:</strong><br>
          ⏰ <strong>General Inpatient Units:</strong> 8:00 AM – 8:00 PM daily.<br>
          • <strong>Intensive Care Unit (ICU):</strong> Specialized hours, 2 visitors at a time.<br>
          • <strong>Overnight Visitors:</strong> 1 designated support person allowed per private room.<br>
          • <strong>Masks:</strong> Recommended for symptomatic visitors; complimentary masks available at every entrance.`,
          [
            { action: "location", label: "📍 Parking Information" },
            { action: "appointment", label: "📅 Book an Appointment" }
          ]
        );
        break;

      case "call_scheduling":
        addBotMessage(
          `You can reach our centralized patient scheduling line directly at <a href="tel:3037781955"><strong>(303) 778-1955</strong></a> (Mon–Fri, 7:30 AM – 5:30 PM MT).`
        );
        break;

      default:
        addBotMessage(
          `I'm here to assist! Would you like to schedule an appointment, check emergency services, or find a doctor?`,
          [
            { action: "appointment", label: "📅 Book an Appointment" },
            { action: "specialist", label: "🩺 Find a Specialist" },
            { action: "location", label: "📍 Location & Parking" }
          ]
        );
    }
  }

  // Natural Language Understanding keyword handler
  function processUserText(rawText) {
    const text = rawText.toLowerCase();

    if (text.includes("appoint") || text.includes("book") || text.includes("schedule") || text.includes("see a doctor")) {
      respondToAction("appointment", rawText);
    } else if (text.includes("er") || text.includes("emergency") || text.includes("trauma") || text.includes("urgent") || text.includes("wait")) {
      respondToAction("er", rawText);
    } else if (text.includes("doctor") || text.includes("specialist") || text.includes("physician") || text.includes("surgeon")) {
      respondToAction("specialist", rawText);
    } else if (text.includes("where") || text.includes("address") || text.includes("location") || text.includes("park") || text.includes("direction") || text.includes("map")) {
      respondToAction("location", rawText);
    } else if (text.includes("bill") || text.includes("insurance") || text.includes("cost") || text.includes("pay") || text.includes("medicare") || text.includes("medicaid")) {
      respondToAction("billing", rawText);
    } else if (text.includes("hour") || text.includes("visit") || text.includes("visitor") || text.includes("guest")) {
      respondToAction("visiting", rawText);
    } else if (text.includes("transplant") || text.includes("kidney") || text.includes("liver")) {
      addBotMessage(
        `AdventHealth Porter is home to the Rocky Mountain region's premier <strong>Centura / AdventHealth Transplant Institute</strong>, performing award-winning adult kidney, liver, and living donor transplants for over 35 years.<br><br>For direct transplant referral and inquiries, call <strong>(303) 778-5797</strong>.`,
        [
          { action: "appointment", label: "📅 Request Consultation" },
          { action: "location", label: "📍 Location & Directions" }
        ]
      );
    } else if (text.includes("heart") || text.includes("cardio") || text.includes("vascular")) {
      respondToAction("care_cardio", rawText);
    } else if (text.includes("ortho") || text.includes("bone") || text.includes("joint") || text.includes("knee") || text.includes("hip")) {
      respondToAction("care_ortho", rawText);
    } else if (text.includes("neuro") || text.includes("brain") || text.includes("spine")) {
      respondToAction("care_neuro", rawText);
    } else if (text.includes("primary") || text.includes("general") || text.includes("family medicine") || text.includes("checkup")) {
      respondToAction("care_primary", rawText);
    } else if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("good morning") || text.includes("good afternoon")) {
      addBotMessage(
        `Hello there! 👋 Welcome to AdventHealth Porter. How can I assist you with your health care needs today?`,
        [
          { action: "appointment", label: "📅 Book an Appointment" },
          { action: "specialist", label: "🩺 Find a Specialist" },
          { action: "er", label: "🚑 ER Wait Times" }
        ]
      );
    } else {
      // General fallback
      addBotMessage(
        `Thank you for reaching out. At AdventHealth Porter in Denver, CO, we are dedicated to providing whole-person care for body, mind, and spirit.
        <br><br>
        How may I direct you?`,
        [
          { action: "appointment", label: "📅 Book an Appointment" },
          { action: "specialist", label: "🩺 Find a Doctor" },
          { action: "location", label: "📍 Location & Parking" },
          { action: "billing", label: "💳 Insurance & Billing" }
        ]
      );
    }
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
  }

  // Initial listener attachment
  attachQuickButtonListeners();
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
