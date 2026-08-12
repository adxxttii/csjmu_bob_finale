# SwasthyaSetu Portal - Secure Telehealth Platform

A high-fidelity, premium, and fully interactive frontend implementation of the **SwasthyaSetu** digital telehealth platform.

This project is built using modern web design principles (Harmonious HSL palettes, glassmorphism, responsive grids, and micro-animations) and features a fully functional **teleconsultation simulator** to provide a realistic experience of modern digital healthcare.

---

## 🌟 Key Features

1. **Accessibility Top-Bar (WCAG Compliant):**
   - **Text Resizing Engine:** Increase or decrease text size (`A+`, `A-`, `A` reset) dynamically.
   - **High Contrast Theme Toggler:** Switches stylesheet variable values instantly to pure black/white contrast for visually impaired citizens.
   - **Language Selector UI:** Interactive dropdown interface.

2. **Header & Security Badges:**
   - High-fidelity header interface displaying brand logo, identity, and industrial compliance badges.
   - Compliance labels representing HIPAA compliance, ISO 27001 security, and HL7 interoperability standards.

3. **Dynamic Hero Carousel:**
   - Multi-slide banner slider highlighting SwasthyaSetuOPD and SwasthyaSetuAB-HWC.
   - Houses **custom telemedicine illustrations** generated specifically for this clone.

4. **Dual Service Portals:**
   - **SwasthyaSetuAB-HWC (Assisted Telemedicine):** Green theme designed for clinical Spoke-to-Hub doctor-to-doctor consultations.
   - **SwasthyaSetuOPD (Stay Home OPD):** Blue theme designed for citizen-to-doctor direct consultations.

5. **Interactive Teleconsultation Simulator (OPD):**
   - **Login/Registration:** Enter a mobile number to trigger an OTP overlay. The system displays a simulated random 6-digit OTP code for authorization testing.
   - **OPD Intake Form:** Input patient demographics, symptoms, and option to generate/link a mock DHR (Digital Health Record) profile.
   - **Queue Dashboard:** Triggers an animated queue counter (starting position 3). The position and wait time decrease automatically. The browser plays a chime sound when your turn arrives.
   - **Live Video Consultation Room:**
     - Simulates establishing secure WebRTC call channels.
     - **Webcam Integration:** Requests browser webcam permissions to show a real-time patient feed (falls back gracefully to avatar placeholders if denied).
     - **Specialist Dialogue Bot:** Connects to a virtual physician, *Dr. Rajesh Kumar*, who initiates consultation questions in a side-chat log.
     - **Audio/Video Controls:** Fully interactive Mute/Unmute and Camera On/Off toggles.
   - **e-Prescription Download Engine:** Upon ending the call, a digitally signed prescription modal appears. Clicking download dynamically generates and saves a highly-professional printable `SwasthyaSetu_Prescription_XXX.html` invoice-styled document complete with medical council license tags, DHR details, symptom history, and dosage instructions.

6. **Fully Responsive Layout:**
   - Mobile-first CSS design supporting layout adjustments for mobile, tablet, and widescreen monitors.

---

## 🛠️ Technology Stack

- **Structure:** Semantic HTML5
- **Style:** Vanilla CSS3 (Custom Variables, Flexbox/Grid, Glassmorphic overlays, keyframe animations)
- **Logic:** Vanilla ES6+ Javascript (Web Audio API, Media Capture and Streams API, local state manager)
- **Assets:** Vector SVGs & generated PNG illustrations

---

## 🚀 How to Experience the Simulator

No server setups or dependencies are required. You can experience the clone immediately:

1. **Direct Browser Execution:**
   Double-click [index.html](file:///d:/csjmu_bob_finale/index.html) to open the page directly in any modern web browser (Chrome, Edge, Firefox, Safari).

2. **Using a Local Server (Recommended):**
   For full permission checks (e.g., webcam testing on local domains), launch a lightweight server:
   - **Python:** `python -m http.server 8000` (then navigate to `http://localhost:8000`)
   - **Node.js:** `npx live-server`
   - **VS Code:** Click "Go Live" using the Live Server extension.

---

*Developed under Google Gemini Developer Guidelines for the Digital Health Initiatives replication project.*