/**
 * SwasthyaSetu Portal Interactive Logic Engine
 * Handles accessibility, counters, slider, FAQ, and Patient Teleconsultation Simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  initSlider();
  initFAQ();
  initSimulation();
});

/* ================= 1. Accessibility Controls ================= */
function initAccessibility() {
  const html = document.documentElement;
  const body = document.body;
  let currentZoom = 1.0;

  document.getElementById('font-increase').addEventListener('click', () => {
    if (currentZoom < 1.2) {
      currentZoom += 0.05;
      html.style.fontSize = `${currentZoom * 16}px`;
    }
  });

  document.getElementById('font-decrease').addEventListener('click', () => {
    if (currentZoom > 0.8) {
      currentZoom -= 0.05;
      html.style.fontSize = `${currentZoom * 16}px`;
    }
  });

  document.getElementById('font-reset').addEventListener('click', () => {
    currentZoom = 1.0;
    html.style.fontSize = '16px';
  });

  const contrastToggle = document.getElementById('contrast-toggle');
  
  // Load saved preference
  if (localStorage.getItem('highContrast') === 'true') {
    body.classList.add('high-contrast');
    contrastToggle.textContent = 'Normal View';
  }

  contrastToggle.addEventListener('click', () => {
    body.classList.toggle('high-contrast');
    const isHC = body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHC);
    contrastToggle.textContent = isHC ? 'Normal View' : 'High Contrast';
  });
}

/* ================= 2. Slider Carousel ================= */
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startAutoplay() {
    sliderInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoplay() {
    clearInterval(sliderInterval);
  }

  // Event Listeners for Dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      stopAutoplay();
      const slideIndex = parseInt(e.target.dataset.slide) - 1;
      showSlide(slideIndex);
      startAutoplay();
    });
  });

  // Pause on hover
  const heroSection = document.querySelector('.hero-slider');
  heroSection.addEventListener('mouseenter', stopAutoplay);
  heroSection.addEventListener('mouseleave', startAutoplay);

  // Initialize
  startAutoplay();
}


/* ================= 4. FAQ Accordion ================= */
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all first
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================= 5. Interactive Simulation Flow ================= */
function initSimulation() {
  // Modal Overlays
  const regModal = document.getElementById('register-modal');
  const otpModal = document.getElementById('otp-modal');
  const infoModal = document.getElementById('info-modal');
  const consultModal = document.getElementById('consultation-modal');
  const presModal = document.getElementById('prescription-modal');

  // Trigger Buttons
  const openRegBtn = document.getElementById('open-register-btn');
  const startConsultBtn = document.getElementById('start-consultation-btn');
  
  // Forms & Inputs
  const regForm = document.getElementById('register-form');
  const regPhoneInput = document.getElementById('reg-phone');
  const otpForm = document.getElementById('otp-form');
  const otpInput = document.getElementById('otp-input');
  const infoForm = document.getElementById('info-form');
  const chatInput = document.getElementById('chat-user-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  // Patient State variables
  let patientState = {
    phone: '',
    name: '',
    age: '',
    gender: '',
    state: '',
    opdClinic: '',
    symptoms: '',
    dhrId: '',
    token: ''
  };

  let simulatedOTP = '';
  let queueInterval;
  let mediaStream = null;
  let timerInterval;
  let chatScriptTimeout = [];

  // Helper to open / close modals
  function openModal(modal) {
    modal.classList.add('active');
  }
  function closeModal(modal) {
    modal.classList.remove('active');
  }

  // Add event listeners to all close buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
      
      // Cleanup streams/timers if consultation modal closed
      if (modal === consultModal) {
        endConsultation();
      }
    });
  });

  // Open Phone Registration
  openRegBtn.addEventListener('click', () => {
    openModal(regModal);
  });

  // Submit Phone (Send OTP)
  regForm.addEventListener('submit', () => {
    patientState.phone = regPhoneInput.value;
    
    // Generate Random 6 digit Code
    simulatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('simulated-otp-code').textContent = simulatedOTP;
    
    closeModal(regModal);
    openModal(otpModal);
  });

  // Submit OTP
  otpForm.addEventListener('submit', () => {
    if (otpInput.value === simulatedOTP) {
      closeModal(otpModal);
      
      // Reset inputs and open detail form
      infoForm.reset();
      openModal(infoModal);
    } else {
      alert('Invalid OTP code. Please enter the code shown on screen.');
    }
  });

  // Submit Registration Details
  infoForm.addEventListener('submit', () => {
    patientState.name = document.getElementById('patient-name').value;
    patientState.age = document.getElementById('patient-age').value;
    patientState.gender = document.getElementById('patient-gender').value;
    patientState.state = document.getElementById('patient-state').value;
    patientState.opdClinic = document.getElementById('patient-opd').value;
    patientState.symptoms = document.getElementById('patient-symptoms').value;
    
    const useDhr = document.getElementById('link-dhr').checked;
    if (useDhr) {
      patientState.dhrId = 'DHR-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
    } else {
      patientState.dhrId = 'Not Linked';
    }

    // Generate Token
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const deptCode = patientState.opdClinic.substring(0, 3).toUpperCase();
    patientState.token = `${deptCode}-${randNum}`;

    closeModal(infoModal);
    startQueueSimulation();
  });

  // Queue simulation controller
  function startQueueSimulation() {
    const dashboard = document.getElementById('patient-dashboard');
    const tokenVal = document.getElementById('queue-token');
    const positionVal = document.getElementById('queue-position');
    const waitTimeVal = document.getElementById('queue-wait-time');
    const statusTxt = document.getElementById('queue-status-txt');

    dashboard.classList.add('active');
    tokenVal.textContent = patientState.token;
    
    let position = 3;
    let waitMinutes = 4;

    positionVal.textContent = position;
    waitTimeVal.textContent = `${waitMinutes} min`;
    statusTxt.textContent = "In Consultation Queue";
    statusTxt.style.background = "var(--accent-saffron)";
    startConsultBtn.classList.remove('active');

    // Scroll to dashboard area
    dashboard.scrollIntoView({ behavior: 'smooth' });

    // Tick queue position down every 4 seconds
    clearInterval(queueInterval);
    queueInterval = setInterval(() => {
      position--;
      waitMinutes -= Math.floor(Math.random() * 2) + 1;
      if (waitMinutes < 1) waitMinutes = 1;

      if (position > 0) {
        positionVal.textContent = position;
        waitTimeVal.textContent = `${waitMinutes} min`;
      } else {
        // Queue ready!
        clearInterval(queueInterval);
        positionVal.textContent = "0";
        waitTimeVal.textContent = "0 min";
        statusTxt.textContent = "Doctor is Ready";
        statusTxt.style.background = "var(--flag-green)";
        startConsultBtn.classList.add('active');
        
        // Play gentle chime sound
        playNotificationBeep();
      }
    }, 4000);
  }

  // Sound generator using Web Audio API (so we don't rely on remote audio files)
  function playNotificationBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio Context error: ', e);
    }
  }

  // Start Consultation
  startConsultBtn.addEventListener('click', async () => {
    openModal(consultModal);
    document.getElementById('consulting-specialty').textContent = patientState.opdClinic;
    
    // Clear chat log
    chatMessages.innerHTML = `
      <div class="chat-msg doctor">
        Connecting to the server clinic... Establishing secure encryption...
      </div>`;

    // Attempt webcam access
    await startCamera();

    // Begin doctor scenario
    simulateDoctorCall();
  });

  // Access user camera
  async function startCamera() {
    const videoFeed = document.getElementById('patient-video-feed');
    const feedLabel = document.getElementById('user-video-feed-label');
    
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 140, height: 100 },
        audio: true
      });
      videoFeed.srcObject = mediaStream;
      videoFeed.style.display = 'block';
      feedLabel.style.display = 'none';
      
      // Update camera icon state
      document.getElementById('cam-icon').textContent = 'videocam';
      document.getElementById('mic-icon').textContent = 'mic';
    } catch (err) {
      console.warn("Camera access denied or unavailable: ", err);
      feedLabel.textContent = "Cam Off (Local)";
      videoFeed.style.display = 'none';
      feedLabel.style.display = 'flex';
    }
  }

  // Doctor Dialog script
  function simulateDoctorCall() {
    const statusText = document.getElementById('doctor-status-text');
    const callTimer = document.getElementById('call-timer');
    const docAvatarSvg = document.getElementById('doc-avatar-svg');
    const docAvatarBox = document.getElementById('doctor-avatar-box');
    
    let timerSec = 0;
    
    // Reset timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerSec++;
      const min = Math.floor(timerSec / 60).toString().padStart(2, '0');
      const sec = (timerSec % 60).toString().padStart(2, '0');
      callTimer.textContent = `${min}:${sec}`;
    }, 1000);

    // Dr Join Script
    chatScriptTimeout.push(setTimeout(() => {
      statusText.textContent = "Dr. Rajesh Kumar (General Medicine)";
      docAvatarSvg.textContent = "support_agent";
      docAvatarBox.querySelector('.doctor-avatar').style.borderColor = "var(--flag-green)";
      
      appendChatMessage("doctor", "Dr. Rajesh Kumar: Namaste! I am Dr. Rajesh Kumar. I have reviewed your case file and symptoms of fever/cough. How can I help you today?");
      playNotificationBeep();
    }, 3000));

    // Follow-ups based on user responses or timed cues
    chatScriptTimeout.push(setTimeout(() => {
      appendChatMessage("doctor", "Dr. Rajesh Kumar: To help me diagnose, are you experiencing high chills, throat pain, or shortness of breath?");
    }, 18000));

    chatScriptTimeout.push(setTimeout(() => {
      appendChatMessage("doctor", "Dr. Rajesh Kumar: Okay. I am writing down the diagnosis as an acute respiratory infection. I will prescribe Paracetamol for fever, and an antitussive cough syrup. I'll also link this prescription to your patient ID.");
    }, 35000));

    chatScriptTimeout.push(setTimeout(() => {
      appendChatMessage("doctor", "Dr. Rajesh Kumar: I have completed and digitally signed the prescription. Please download it and follow the dosage directions. Get plenty of rest. Feel free to end the call.");
    }, 55000));
  }

  // End Consultation
  function endConsultation() {
    // Stop Media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    
    // Clear timers
    clearInterval(timerInterval);
    chatScriptTimeout.forEach(clearTimeout);
    chatScriptTimeout = [];

    // Reset icons
    document.getElementById('doctor-status-text').textContent = "Connecting to doctor...";
    document.getElementById('doc-avatar-svg').textContent = "person";
    document.getElementById('doctor-avatar-box').querySelector('.doctor-avatar').style.borderColor = "var(--health-teal)";
    document.getElementById('call-timer').textContent = "00:00";

    // Close video modal
    closeModal(consultModal);

    // Reset Dashboard UI back to home or show completion
    const dashboard = document.getElementById('patient-dashboard');
    dashboard.classList.remove('active');

    // Display Prescription Issued modal
    document.getElementById('pres-patient-name').textContent = patientState.name;
    document.getElementById('pres-opd-specialty').textContent = patientState.opdClinic;
    openModal(presModal);
  }

  document.getElementById('btn-end-call').addEventListener('click', () => {
    endConsultation();
  });

  // Chat message appender
  function appendChatMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send message
  function handleSendMessage() {
    const val = chatInput.value.trim();
    if (val) {
      appendChatMessage("user", val);
      chatInput.value = '';
      
      // Auto reply logic if doctor is online
      const docOnline = document.getElementById('doctor-status-text').textContent !== "Connecting to doctor...";
      if (docOnline) {
        setTimeout(() => {
          if (val.toLowerCase().includes('fever') || val.toLowerCase().includes('cough')) {
            appendChatMessage("doctor", "Dr. Rajesh: Understood. Please make sure you check your temperature regularly. I've noted this.");
          } else {
            appendChatMessage("doctor", "Dr. Rajesh: Got it. I am incorporating your input into the active e-prescription record.");
          }
        }, 1500);
      }
    }
  }

  chatSendBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  // Call Toggles (Mic / Video)
  let micActive = true;
  document.getElementById('btn-toggle-mic').addEventListener('click', () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        micActive = !micActive;
        audioTrack.enabled = micActive;
        document.getElementById('mic-icon').textContent = micActive ? 'mic' : 'mic_off';
      }
    }
  });

  let camActive = true;
  document.getElementById('btn-toggle-cam').addEventListener('click', () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        camActive = !camActive;
        videoTrack.enabled = camActive;
        document.getElementById('patient-video-feed').style.display = camActive ? 'block' : 'none';
        document.getElementById('user-video-feed-label').style.display = camActive ? 'none' : 'flex';
        document.getElementById('cam-icon').textContent = camActive ? 'videocam' : 'videocam_off';
      }
    }
  });

  // Download PDF Prescription Simulation
  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    generateAndDownloadPrescription();
    closeModal(presModal);
  });

  function generateAndDownloadPrescription() {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const prescriptionHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SwasthyaSetu e-Prescription - ${patientState.token}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; margin: 0; padding: 30px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f3b5f; padding-bottom: 15px; }
    .logo-area { display: flex; align-items: center; gap: 10px; }
    .brand-name { font-size: 24px; font-weight: bold; color: #0f3b5f; }
    .record-badge { text-align: right; font-size: 10px; color: #666; }
    .clinic-section { margin: 20px 0; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .patient-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; }
    .rx-header { font-size: 20px; font-weight: bold; color: #0f3b5f; margin: 30px 0 10px 0; border-bottom: 1.5px solid #0f3b5f; padding-bottom: 5px; }
    .rx-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .rx-table th, .rx-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    .rx-table th { background: #f1f5f9; color: #0f3b5f; }
    .sign-section { margin-top: 50px; text-align: right; }
    .signature { display: inline-block; border-top: 1px solid #666; padding-top: 5px; width: 180px; text-align: center; font-size: 13px; font-style: italic; }
    .footer { font-size: 10px; color: #666; margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #10847e; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Print / Save PDF</button>
  </div>
  
  <div class="header">
    <div class="logo-area">
      <div style="background: #0f3b5f; color: white; width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold;">SS</div>
      <div class="brand-name">SwasthyaSetu <span style="font-size: 13px; display: block; font-weight: normal; color: #666;">Digital Telehealth Platform</span></div>
    </div>
    <div class="record-badge">
      <strong>SWASTHYASETU DIGITAL HEALTH NETWORK</strong><br>
      SECURE ELECTRONIC HEALTH RECORD<br>
      HIPAA / HL7 Compliant
    </div>
  </div>

  <div class="clinic-section">
    <strong>OPD Clinic:</strong> ${patientState.opdClinic}<br>
    <strong>Consulting Doctor:</strong> Dr. Rajesh Kumar, MD (General Medicine)<br>
    <strong>Medical Board Reg No:</strong> NMB-82741-A | National Medical Board Accredited
  </div>

  <div class="grid">
    <div class="patient-card">
      <h4 style="margin: 0 0 10px 0; color: #0f3b5f;">Patient Details</h4>
      <strong>Name:</strong> ${patientState.name}<br>
      <strong>Age/Gender:</strong> ${patientState.age} Yrs / ${patientState.gender}<br>
      <strong>Mobile:</strong> +91-${patientState.phone}<br>
      <strong>State:</strong> ${patientState.state}
    </div>
    <div class="patient-card">
      <h4 style="margin: 0 0 10px 0; color: #0f3b5f;">Record Details</h4>
      <strong>Token ID:</strong> ${patientState.token}<br>
      <strong>Date of Issue:</strong> ${today}<br>
      <strong>DHR Profile ID:</strong> ${patientState.dhrId}<br>
      <strong>Status:</strong> Completed & Digitally Signed
    </div>
  </div>

  <div>
    <strong>Reported Symptoms / History:</strong><br>
    <p style="margin: 5px 0; font-size: 14px; color: #555;">${patientState.symptoms}</p>
    <strong>Diagnosis:</strong> Acute Upper Respiratory Tract Infection (Bronchial Congestion)
  </div>

  <div class="rx-header">Rx (Medicines & Dosage)</div>
  <table class="rx-table">
    <thead>
      <tr>
        <th>Medicine Name</th>
        <th>Dosage / Instructions</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Tab. Paracetamol 650 mg</strong></td>
        <td>1 tablet 3 times a day (After Food) if fever &gt; 99°F</td>
        <td>3 Days</td>
      </tr>
      <tr>
        <td><strong>Syp. Ascoril LS (Levosalbutamol + Ambroxol)</strong></td>
        <td>10 ml twice a day (Morning/Night) for productive cough</td>
        <td>5 Days</td>
      </tr>
      <tr>
        <td><strong>Cap. Amoxycillin 500 mg</strong></td>
        <td>1 capsule twice a day (After Breakfast and Dinner)</td>
        <td>5 Days</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 30px;">
    <strong>General Advice:</strong><br>
    <ul>
      <li>Drink plenty of warm fluids and stay hydrated.</li>
      <li>Gargle with warm saline water 2-3 times a day.</li>
      <li>If fever persists beyond 3 days, consult a physician for further physical evaluation.</li>
    </ul>
  </div>

  <div class="sign-section">
    <div class="signature">
      Digitally Signed by<br>
      <strong>Dr. Rajesh Kumar</strong><br>
      <span style="font-size: 10px; color: #888;">Signed ID: SWASTHYASETU-E-SIGN-83921-9</span>
    </div>
  </div>

  <div class="footer">
    This is a secure electronic health record generated by the SwasthyaSetu Telehealth Platform. 
    No physical signature is required. Save this prescription to your DHR profile for permanent access.
  </div>
</body>
</html>
    `;

    // Download document as HTML file
    const blob = new Blob([prescriptionHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SwasthyaSetu_Prescription_${patientState.token}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
