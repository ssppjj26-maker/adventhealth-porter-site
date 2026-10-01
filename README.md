# adventhealthtest-vercel 🏥

A duplicate website of **AdventHealth Porter** hospital (Denver, CO: [https://www.adventhealth.com/locations/hospitals/porter](https://www.adventhealth.com/locations/hospitals/porter)) with the custom **Olivia · Virtual Assistant** chatbot integration.

---

## 🌟 Key Features

1. **AdventHealth Porter Hospital Experience**:
   - **Branding & Design System**: Authentic AdventHealth color palette (`#003764`, `#005a96`, `#0076c0`, `#6cc04a`), four-leaf butterfly cross logo mark, and typography (`Inter`).
   - **Live ER Wait Time Widget**: Simulated real-time estimated emergency department triage times with direct check-in links.
   - **Interactive Physician Directory**: Searchable by physician name and filterable by clinical specialties (Cardiology, Transplant Surgery, Orthopedics, Oncology, Emergency Medicine).
   - **Centura / AdventHealth Transplant Institute Spotlight**: Highlighting 35+ years of kidney & liver transplant excellence in the Rocky Mountain region.
   - **Denver Campus Map & Guide**: 2525 South Downing Street location details, complimentary valet instructions, visitor parking garage information, and RTD Light Rail transit.
   - **Appointment Booking Modal**: Interactive appointment request workflow with immediate reference code confirmation.

2. **Olivia Virtual Assistant Chatbot (Uploaded Code Integrated & Enhanced)**:
   - **Floating Launcher**: Floating button with animated online indicator and "Need help? Chat with Olivia" pill.
   - **Rich Interactive Dialogue**: Instant responses with quick buttons (`📅 Book an Appointment`, `🩺 Find a Specialist`, `💳 Insurance & Billing`, `📍 Location & Parking`, `🚑 ER & Wait Times`, `⏰ Visiting Hours`).
   - **Intelligent Keyword Engine**: Responds to user queries regarding Denver campus directions, phone numbers `(303) 778-1955`, parking, visiting hours, insurance, emergency care, and doctors.
   - **Emergency Safety Prompts**: Quick disclaimer and 911 emergency hotline reminders.
   - **Typing Indicator & Sound Transitions**: Smooth animations for realistic conversational pacing.

---

## 📁 Project Structure

```
adventhealthtest-vercel/
├── assets/
│   ├── hospital.jpg             # High-res AdventHealth Porter hospital campus
│   └── doctor.jpg               # Compassionate doctor consultation
├── index.html                   # Main hospital page with chatbot integration
├── styles.css                   # Complete design system & responsive styling
├── app.js                       # Interactive logic, doctor search & chat engine
├── vercel.json                  # Vercel deployment configuration
├── package.json                 # Project configuration & preview scripts
└── README.md                    # Project documentation
```

---

## 🚀 How to Run Locally

You can run the project locally with any static web server:

```powershell
# Using npx serve:
npx -y serve . -p 3000
```

Or open `index.html` directly in any web browser.

---

## ☁️ How to Deploy to Vercel

### Method 1: Using the Vercel CLI (Fastest)

1. Open your terminal inside this directory (`adventhealthtest-vercel`):
   ```powershell
   cd "C:\Users\Sachin\.gemini\antigravity-ide\scratch\adventhealthtest-vercel"
   ```
2. Run the Vercel deployment command:
   ```powershell
   npx vercel
   ```
3. Follow the simple prompts (accept defaults). When prompted for production deployment:
   ```powershell
   npx vercel --prod
   ```

### Method 2: Via GitHub & Vercel Dashboard

1. Push this directory to your GitHub account:
   ```powershell
   git init
   git add .
   git commit -m "AdventHealth Porter duplicate with Olivia chatbot"
   git branch -M main
   git remote add origin https://github.com/<your-username>/adventhealthtest-vercel.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository `adventhealthtest-vercel`.
4. Click **Deploy**. Vercel will build and deploy the website with zero extra configuration.
