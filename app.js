/**
 * SwasthyaSetu Portal Interactive Logic Engine
 * Handles accessibility, counters, slider, FAQ, and Patient Teleconsultation Simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  initSlider();
  initFAQ();
  initSimulation();
  initHWCModule();
  initAuthModule();
});

/* ================= 1. Accessibility Controls & Multilingual Engine ================= */
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

  // Dynamic Multilingual Translations Object
  const translations = {
    en: {
      navHome: 'Home',
      navServices: 'Services',
      navHow: 'How it Works',
      navFaq: 'FAQs',
      heroTitle1: 'Stay Home, Consult Doctor',
      heroDesc1: 'A leading secure patient-to-doctor teleconsultation system. Register online, verify via OTP, consult medical specialists, and download digital prescriptions.',
      hwcBadge: 'Assisted Telemedicine',
      hwcTitle: 'SwasthyaSetuAB-HWC',
      hwcDesc: 'Designed for healthcare workers and Community Health Officers (CHOs) to connect rural patients at spokes with expert specialist doctors at diagnostic hubs.',
      hwcBtn: 'HWC Login',
      opdBadge: 'Stay Home OPD',
      opdTitle: 'SwasthyaSetuOPD',
      opdDesc: 'Direct access for citizens to consult doctors from home. Safe, instant, queue-based online clinics featuring real-time consultations and prescriptions.',
      opdBtn: 'Register / Login',
      howTitle: 'How does Citizen OPD Work?',
      faqTitle: 'Frequently Asked Questions'
    },
    hi: {
      navHome: 'मुख्य पृष्ठ',
      navServices: 'सेवाएं',
      navHow: 'यह कैसे काम करता है',
      navFaq: 'सामान्य प्रश्न',
      heroTitle1: 'घर पर रहें, डॉक्टर से परामर्श लें',
      heroDesc1: 'सुरक्षित मरीज-से-डॉक्टर टेलीकंसल्टेशन प्लेटफॉर्म। ऑनलाइन पंजीकरण करें, डॉक्टर से परामर्श करें और डिजिटल पर्ची डाउनलोड करें।',
      hwcBadge: 'सहायक टेलीमेडिसिन',
      hwcTitle: 'स्वास्थ्यसेतु AB-HWC',
      hwcDesc: 'स्वास्थ्य कार्यकर्ताओं और सीएचओ के लिए ग्रामीण रोगियों को विशेषज्ञ डॉक्टरों से जोड़ने हेतु डिजाइन किया गया।',
      hwcBtn: 'HWC लॉगिन',
      opdBadge: 'घर बैठे ओपीडी',
      opdTitle: 'स्वास्थ्यसेतु OPD',
      opdDesc: 'नागरिकों के लिए घर बैठे डॉक्टरों से परामर्श करने की प्रत्यक्ष सुविधा। सुरक्षित और त्वरित ऑनलाइन क्लिनिक।',
      opdBtn: 'पंजीकरण / लॉगिन',
      howTitle: 'नागरिक ओपीडी कैसे काम करता है?',
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न'
    },
    bn: {
      navHome: 'হোম পেজ',
      navServices: 'সেবাসমূহ',
      navHow: 'এটি কীভাবে কাজ করে',
      navFaq: 'প্রশ্নোত্তর',
      heroTitle1: 'ঘরে থাকুন, ডাক্তারের পরামর্শ নিন',
      heroDesc1: 'একটি নিরাপদ পেশেন্ট-টু-ডক্টর টেলিকনসালটেশন সিস্টেম। অনলাইনে নিবন্ধন করুন, ডাক্তারের সাথে পরামর্শ করুন এবং ডিজিটাল প্রেসক্রিপশন ডাউনলোড করুন।',
      hwcBadge: 'সহায়ক টেলিমেডিসিন',
      hwcTitle: 'স্বাস্থ্যসেতু AB-HWC',
      hwcDesc: 'স্বাস্থ্যকর্মী এবং সিএইচও-দের গ্রামীণ রোগীদের বিশেষজ্ঞ চিকিৎসকদের সাথে সংযুক্ত করার জন্য নির্মিত।',
      hwcBtn: 'HWC লগইন',
      opdBadge: 'ঘরে বসেই ওপিডি',
      opdTitle: 'স্বাস্থ্যসেতু OPD',
      opdDesc: 'নাগরিকদের জন্য বাড়ি থেকে সরাসরি ডাক্তারদের পরামর্শ নেওয়ার সুবিধা। নিরাপদ ও তাত্ক্ষণিক চিকিৎসা কেন্দ্র।',
      opdBtn: 'নিবন্ধন / লগইন',
      howTitle: 'সিটিজেন ওপিডি কীভাবে কাজ করে?',
      faqTitle: 'সাধারণ জিজ্ঞাসাসমূহ'
    },
    mr: {
      navHome: 'मुख्य पृष्ठ',
      navServices: 'सेवा',
      navHow: 'हे कसे कार्य करते',
      navFaq: 'वारंवार विचारले जाणारे प्रश्न',
      heroTitle1: 'घरी राहा, डॉक्टरांचा सल्ला घ्या',
      heroDesc1: 'एक सुरक्षित रुग्ण-ते-डॉक्टर टेलिकन्सल्टेशन प्रणाली. ऑनलाइन नोंदणी करा, डॉक्टरांचा सल्ला घ्या आणि डिजिटल प्रिस्क्रिप्शन डाउनलोड करा.',
      hwcBadge: 'सहाय्यक टेलिमेडिसिन',
      hwcTitle: 'स्वास्थ्यसेतु AB-HWC',
      hwcDesc: 'आरोग्य कर्मचारी आणि सीएचओ साठी ग्रामीण रुग्णांना तज्ज्ञ डॉक्टरांशी जोडण्यासाठी डिझाइन केलेले.',
      hwcBtn: 'HWC लॉगिन',
      opdBadge: 'घरीच ओपीडी',
      opdTitle: 'स्वास्थ्यसेतु OPD',
      opdDesc: 'नागरिकांना घरातूनच थेट डॉक्टरांचा सल्ला घेण्याची सुविधा. सुरक्षित आणि त्वरित ऑनलाइन क्लिनिक.',
      opdBtn: 'नोंदणी / लॉगिन',
      howTitle: 'नागरिक ओपीडी कसे कार्य करते?',
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न'
    },
    ta: {
      navHome: 'முகப்பு',
      navServices: 'சேவைகள்',
      navHow: 'செயல்படும் முறை',
      navFaq: 'கேள்விகள்',
      heroTitle1: 'வீட்டில் இருங்கள், மருத்துவரை அணுகுங்கள்',
      heroDesc1: 'பாதுகாப்பான நோயாளி-மருத்துவர் தொலை மருத்துவ சேவை. ஆன்லைனில் பதிவு செய்து டிஜிட்டல் மருந்துக் குறிப்பைத் பதிவிறக்கவும்.',
      hwcBadge: 'உதவி தொலை மருத்துவம்',
      hwcTitle: 'ஸ்வஸ்தியசேது AB-HWC',
      hwcDesc: 'சுகாதாரப் பணியாளர்கள் கிராமப்புற நோயாளிகளை நிபுணத்துவ மருத்துவர்களுடன் இணைக்க வடிவமைக்கப்பட்டது.',
      hwcBtn: 'HWC உள்நுழைவு',
      opdBadge: 'வீட்டு OPD',
      opdTitle: 'ஸ்வஸ்தியசேது OPD',
      opdDesc: 'வீட்டிலிருந்தபடியே நேரடியாக மருத்துவ ஆலோசனை பெறும் வசதி. பாதுகாப்பான ஆன்லைன் கிளினிக்.',
      opdBtn: 'பதிவு / உள்நுழைவு',
      howTitle: 'OPD எவ்வாறு செயல்படுகிறது?',
      faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்'
    },
    te: {
      navHome: 'హోమ్',
      navServices: 'సేవలు',
      navHow: 'ఇది ఎలా పనిచేస్తుంది',
      navFaq: 'ప్రశ్నలు',
      heroTitle1: 'ఇంట్లోనే ఉండండి, డాక్టర్‌ను సంప్రదించండి',
      heroDesc1: 'సురక్షితమైన పేషెంట్-టు-డాక్టర్ టెలికన్సల్టేషన్ వ్యవస్థ. ఆన్‌లైన్‌లో రిజిస్టర్ చేసుకోండి మరియు డిజిటల్ ప్రిస్క్రిప్షన్ పొందండి.',
      hwcBadge: 'సహాయక టెలిమెడిసిన్',
      hwcTitle: 'స్వాస్థ్యసేతు AB-HWC',
      hwcDesc: 'గ్రామీణ రోగులను నిపుణులైన వైద్యులతో అనుసంధానించడానికి ఆరోగ్య కార్యకర్తల కోసం రూపొందించబడింది.',
      hwcBtn: 'HWC లాగిన్',
      opdBadge: 'ఇంటి వద్దే OPD',
      opdTitle: 'స్వాస్థ్యసేతు OPD',
      opdDesc: 'ఇంటి నుంచే నేరుగా డాక్టర్లను సంప్రదించే వెసులుబాటు. సురక్షితమైన ఆన్‌లైన్ క్లినిక్.',
      opdBtn: 'రిజిస్టర్ / లాగిన్',
      howTitle: 'సిటిజన్ OPD ఎలా పనిచేస్తుంది?',
      faqTitle: 'తరచుగా అడిగే ప్రశ్నలు'
    },
    gu: {
      navHome: 'મુખ્ય પૃષ્ઠ',
      navServices: 'સેવાઓ',
      navHow: 'તે કેવી રીતે કામ કરે છે',
      navFaq: 'પ્રશ્નોત્તરી',
      heroTitle1: 'ઘરે રહો, ડૉક્ટરની સલાહ લો',
      heroDesc1: 'એક સુરક્ષિત પેશન્ટ-ટુ-ડૉક્ટર ટેલિકન્સલ્ટેશન સિસ્ટમ. ઓનલાઈન રજીસ્ટર કરો અને ડિજિટલ પ્રિસ્ક્રિપ્શન ડાઉનલોડ કરો.',
      hwcBadge: 'સહાયક ટેલિમેડિસિન',
      hwcTitle: 'સ્વાસ્થ્યસેતુ AB-HWC',
      hwcDesc: 'આરોગ્ય કાર્યકરો માટે ગ્રામીણ દર્દીઓને નિષ્ણાત ડૉક્ટરો સાથે જોડવા માટે ડિઝાઇન કરાયેલ.',
      hwcBtn: 'HWC લોગિન',
      opdBadge: 'ઘરે બેઠા OPD',
      opdTitle: 'સ્વાસ્થ્યસેતુ OPD',
      opdDesc: 'નાગરિકો માટે ઘરેથી સીધા ડૉક્ટરોની સલાહ લેવાની સુવિધા. સુરક્ષિત ઓનલાઈન ક્લિનિક.',
      opdBtn: 'રજીસ્ટર / લોગિન',
      howTitle: 'સિટીઝન OPD કેવી રીતે કામ કરે છે?',
      faqTitle: 'વારંવાર પૂછાતા પ્રશ્નો'
    }
  };

  const langSelector = document.getElementById('lang-selector');
  if (langSelector) {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    langSelector.value = savedLang;
    applyLanguage(savedLang);

    langSelector.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem('preferredLang', selectedLang);
      applyLanguage(selectedLang);
      showLanguageToast(selectedLang);
    });
  }

  function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    
    const navHome = document.getElementById('nav-home');
    const navServices = document.getElementById('nav-services');
    const navHow = document.getElementById('nav-how');
    const navFaq = document.getElementById('nav-faq');
    if (navHome) navHome.textContent = t.navHome;
    if (navServices) navServices.textContent = t.navServices;
    if (navHow) navHow.textContent = t.navHow;
    if (navFaq) navFaq.textContent = t.navFaq;

    const slide1H2 = document.querySelector('#slide-1 h2');
    const slide1P = document.querySelector('#slide-1 p');
    if (slide1H2) slide1H2.innerHTML = `${t.heroTitle1}<br><span>SwasthyaSetu OPD</span>`;
    if (slide1P) slide1P.textContent = t.heroDesc1;

    const hwcBadge = document.querySelector('.service-card.hwc .service-badge');
    const hwcTitle = document.getElementById('hwc-title');
    const hwcDesc = document.querySelector('.service-card.hwc .service-desc');
    const openHwcBtn = document.getElementById('open-hwc-login-btn');

    if (hwcBadge) hwcBadge.textContent = t.hwcBadge;
    if (hwcTitle) hwcTitle.textContent = t.hwcTitle;
    if (hwcDesc) hwcDesc.textContent = t.hwcDesc;
    if (openHwcBtn) openHwcBtn.innerHTML = `<span class="material-icons-outlined">login</span> ${t.hwcBtn}`;

    const opdBadge = document.querySelector('.service-card.opd .service-badge');
    const opdTitle = document.getElementById('opd-title');
    const opdDesc = document.querySelector('.service-card.opd .service-desc');
    const openRegBtn = document.getElementById('open-register-btn');

    if (opdBadge) opdBadge.textContent = t.opdBadge;
    if (opdTitle) opdTitle.textContent = t.opdTitle;
    if (opdDesc) opdDesc.textContent = t.opdDesc;
    if (openRegBtn) openRegBtn.innerHTML = `<span class="material-icons-outlined">how_to_reg</span> ${t.opdBtn}`;

    const howTitle = document.getElementById('how-title');
    const faqTitle = document.getElementById('faq-title');
    if (howTitle) howTitle.textContent = t.howTitle;
    if (faqTitle) faqTitle.textContent = t.faqTitle;
  }

  function showLanguageToast(lang) {
    const langNames = { en: 'English', hi: 'Hindi', bn: 'Bengali', mr: 'Marathi', ta: 'Tamil', te: 'Telugu', gu: 'Gujarati' };
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #0f3b5f; color: white; padding: 12px 20px; border-radius: 8px; font-weight: 600; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 0.9rem; animation: slide-down 0.3s ease;';
    toast.innerHTML = `<span class="material-icons-outlined" style="vertical-align: middle; margin-right: 6px; color: var(--accent-saffron);">translate</span> Language changed to <strong>${langNames[lang] || lang}</strong>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
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

    // Save Consultation Record to Cloud Firestore Database
    if (typeof saveConsultationRecord === 'function') {
      saveConsultationRecord(patientState);
    }

    closeModal(infoModal);
    startQueueSimulation();
  });

  // Affected Area Image Upload Handler
  const patientAffectedInput = document.getElementById('patient-affected-area-input');
  const patientAffectedPreview = document.getElementById('patient-affected-area-preview');
  const patientAffectedImgElem = document.getElementById('patient-affected-img-elem');

  if (patientAffectedInput) {
    patientAffectedInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          patientState.affectedImgDataUrl = evt.target.result;
          patientAffectedImgElem.src = evt.target.result;
          patientAffectedPreview.style.display = 'block';
          
          // Also update doctor consultation view if present
          const docImgElem = document.getElementById('doc-consult-affected-img');
          if (docImgElem) docImgElem.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

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
    // Save Prescription Record to Cloud Firestore Database
    if (typeof savePrescriptionRecord === 'function') {
      savePrescriptionRecord({
        patientName: patientState.name,
        patientPhone: patientState.phone,
        opdClinic: patientState.opdClinic,
        token: patientState.token,
        dhrId: patientState.dhrId,
        symptoms: patientState.symptoms,
        doctor: 'Dr. Rajesh Kumar'
      });
    }

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

/* ================= 6. Health Worker Module (HWC Portal) ================= */
function initHWCModule() {
  // DOM Elements
  const hwcLoginModal = document.getElementById('hwc-login-modal');
  const openHwcLoginBtn = document.getElementById('open-hwc-login-btn');
  const hwcLoginForm = document.getElementById('hwc-login-form');
  const hwcDashboardView = document.getElementById('hwc-dashboard-view');
  const landingView = document.getElementById('landing-view');
  const hwcLogoutBtn = document.getElementById('hwc-logout-btn');

  // Sidebar Tabs
  const menuItems = document.querySelectorAll('.hwc-sidebar .menu-item');
  const tabContents = document.querySelectorAll('.hwc-tab-content');
  const menuConsultTab = document.getElementById('menu-consult-tab');

  // Search & Register Elements
  const patientSearchInput = document.getElementById('hwc-patient-search');
  const patientSearchBtn = document.getElementById('hwc-patient-search-btn');
  const searchResultsList = document.getElementById('search-results-list');
  const regForm = document.getElementById('hwc-reg-form');
  const pnameInput = document.getElementById('hwc-pname');
  const pageInput = document.getElementById('hwc-page');
  const pgenderSelect = document.getElementById('hwc-pgender');
  const pphoneInput = document.getElementById('hwc-pphone');
  const pstateInput = document.getElementById('hwc-pstate');

  // Vitals & Clinical Inputs
  const tempInput = document.getElementById('hwc-temp');
  const pulseInput = document.getElementById('hwc-pulse');
  const bpInput = document.getElementById('hwc-bp');
  const spo2Input = document.getElementById('hwc-spo2');
  const injuriesSelect = document.getElementById('hwc-injuries');
  const historyInput = document.getElementById('hwc-history');
  const symptomsTextarea = document.getElementById('hwc-symptoms');

  // Voice Inputs
  const voiceBtnEn = document.getElementById('voice-dictate-en');
  const voiceBtnHi = document.getElementById('voice-dictate-hi');
  const voiceBtnBn = document.getElementById('voice-dictate-bn');
  const voiceBtnMr = document.getElementById('voice-dictate-mr');
  const voiceStatus = document.getElementById('voice-status');

  // Upload Zone
  const fileUploadZone = document.getElementById('file-upload-zone');
  const fileInput = document.getElementById('hwc-file-input');
  const uploadedFilesList = document.getElementById('uploaded-files-list');

  // AI & Triage
  const aiAnalyzeBtn = document.getElementById('hwc-ai-analyze-btn');
  const aiAnalysisOutput = document.getElementById('ai-analysis-output');
  const aiRiskBadge = document.getElementById('ai-risk-badge');
  const aiRiskText = document.getElementById('ai-risk-text');
  const aiSummaryText = document.getElementById('ai-summary-text');
  const firstaidTextarea = document.getElementById('hwc-firstaid');
  const startConsultBtn = document.getElementById('hwc-start-consult-btn');

  // Active Consult Elements
  const consultPname = document.getElementById('consult-pname');
  const consultPdetails = document.getElementById('consult-pdetails');
  const consultPdhr = document.getElementById('consult-pdhr');
  const monitorTemp = document.getElementById('monitor-temp');
  const monitorPulse = document.getElementById('monitor-pulse');
  const monitorBp = document.getElementById('monitor-bp');
  const monitorSpo2 = document.getElementById('monitor-spo2');
  const consultSymptoms = document.getElementById('consult-symptoms');
  const consultInjuries = document.getElementById('consult-injuries');
  const consultFirstaid = document.getElementById('consult-firstaid');
  const consultFiles = document.getElementById('consult-files');
  const hwcPatientVideo = document.getElementById('hwc-patient-video');
  const hwcDoctorStatus = document.getElementById('hwc-doctor-status');
  const doctorPrescriptionNotes = document.getElementById('doctor-prescription-notes');
  const prescriptionStatusText = document.getElementById('prescription-status-text');
  const endConsultBtn = document.getElementById('hwc-end-consult-btn');

  // Chat Elements
  const hwcChatMessages = document.getElementById('hwc-chat-messages');
  const hwcChatInput = document.getElementById('hwc-chat-input');
  const hwcChatSendBtn = document.getElementById('hwc-chat-send-btn');

  // Archive Table & Modal
  const archiveTableBody = document.getElementById('archive-table-body');
  const hwcCaseModal = document.getElementById('hwc-case-modal');
  const hwcCaseModalBody = document.getElementById('hwc-case-modal-body');

  // Prepopulated Registered Patients Database (Searchable)
  let registeredPatients = [
    { id: 'PAT-801', dhrId: 'DHR-8821-9910-1011', name: 'Ramesh Kumar', age: 45, gender: 'Male', phone: '9876543210', state: 'Uttar Pradesh', history: 'Hypertension, Mild Asthma' },
    { id: 'PAT-802', dhrId: 'DHR-3392-4412-8831', name: 'Sunita Devi', age: 38, gender: 'Female', phone: '9123456789', state: 'Delhi', history: 'Type 2 Diabetes, Penicillin Allergy' },
    { id: 'PAT-803', dhrId: 'DHR-5510-7729-2294', name: 'Vikram Singh', age: 52, gender: 'Male', phone: '9988776655', state: 'Punjab', history: 'No Known Allergies' }
  ];

  // Prepopulated Case Records Archive
  let caseArchive = [
    {
      date: '2026-08-10',
      token: 'HWC-9281',
      patientName: 'Ramesh Kumar',
      ageGender: '45 / Male',
      opdClinic: 'General Telemedicine Hub',
      aiRisk: { level: 'HIGH', badgeClass: 'risk-high' },
      temp: '101.4', pulse: '88', bp: '135/88', spo2: '94',
      symptoms: 'High fever for 3 days with cough and throat inflammation.',
      injuries: 'None',
      history: 'Hypertension',
      firstaid: 'Cold compress, Paracetamol 650mg given at Spoke.',
      aiSummary: 'Fever of unknown origin with mild hypoxemia. Triage: High Risk.',
      doctorNotes: 'Prescribed Tab. Amoxicillin 500mg BD x 5 days, Tab. Paracetamol 650mg TDS x 3 days. Saline gargles advised.',
      dhrId: 'DHR-8821-9910-1011'
    },
    {
      date: '2026-08-08',
      token: 'HWC-7410',
      patientName: 'Sunita Devi',
      ageGender: '38 / Female',
      opdClinic: 'Diabetic & Endocrine Spoke',
      aiRisk: { level: 'MODERATE', badgeClass: 'risk-moderate' },
      temp: '98.6', pulse: '76', bp: '128/82', spo2: '98',
      symptoms: 'Dizziness, routine HbA1c check follow-up.',
      injuries: 'None',
      history: 'Type 2 Diabetes',
      firstaid: 'Oral hydration offered.',
      aiSummary: 'Stable vitals, mild orthostatic dizziness.',
      doctorNotes: 'Continue Metformin 500mg. Recheck FBS in 2 weeks.',
      dhrId: 'DHR-3392-4412-8831'
    }
  ];

  // Current Session Data State
  let currentSession = {
    patientId: '',
    dhrId: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    state: '',
    temp: '',
    pulse: '',
    bp: '',
    spo2: '',
    injuries: 'None',
    history: '',
    symptoms: '',
    firstaid: '',
    uploadedFiles: [],
    aiSummary: '',
    aiRisk: null,
    doctorNotes: '',
    token: '',
    date: ''
  };

  let mediaStreamHWC = null;

  // Render Archive Table on Init
  renderArchiveTable();

  // Open HWC Login Modal
  if (openHwcLoginBtn) {
    openHwcLoginBtn.addEventListener('click', () => {
      document.getElementById('hwc-staff-id').value = 'HW101';
      document.getElementById('hwc-password').value = 'password123';
      hwcLoginModal.classList.add('active');
    });
  }

  // Handle Login Submit
  if (hwcLoginForm) {
    hwcLoginForm.addEventListener('submit', () => {
      hwcLoginModal.classList.remove('active');
      landingView.style.display = 'none';
      hwcDashboardView.style.display = 'flex';
    });
  }

  // Handle Logout
  if (hwcLogoutBtn) {
    hwcLogoutBtn.addEventListener('click', () => {
      hwcDashboardView.style.display = 'none';
      landingView.style.display = 'block';
    });
  }

  // Sidebar Tab Switching
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('disabled')) return;

      const targetTabId = item.dataset.tab;
      menuItems.forEach(m => m.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(targetTabId).classList.add('active');
    });
  });

  // Patient Search Implementation
  function performPatientSearch() {
    const query = patientSearchInput.value.trim().toLowerCase();
    searchResultsList.innerHTML = '';

    if (!query) return;

    const matches = registeredPatients.filter(p =>
      p.name.toLowerCase().includes(query) || p.phone.includes(query) || p.id.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResultsList.innerHTML = `<div style="padding: 8px; font-size: 0.8rem; color: var(--text-muted);">No matching patients found. Fill form to register new.</div>`;
      return;
    }

    matches.forEach(p => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div style="font-weight: 700; color: var(--primary-navy); display: flex; justify-content: space-between;">
          <span>${p.name} (${p.age}y/${p.gender})</span>
          <span style="font-family: monospace; font-size: 0.75rem; color: var(--health-teal);">${p.id}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">📱 ${p.phone} | 📍 ${p.state}</div>
        <div style="font-size: 0.72rem; color: var(--accent-saffron); margin-top: 2px;">Past History: ${p.history || 'None'}</div>
      `;
      item.addEventListener('click', () => {
        // Auto-fill patient registration fields
        pnameInput.value = p.name;
        pageInput.value = p.age;
        pgenderSelect.value = p.gender;
        pphoneInput.value = p.phone;
        pstateInput.value = p.state;
        historyInput.value = p.history;

        currentSession.patientId = p.id;
        currentSession.dhrId = p.dhrId;
        currentSession.name = p.name;
        currentSession.age = p.age;
        currentSession.gender = p.gender;
        currentSession.phone = p.phone;
        currentSession.state = p.state;
        currentSession.history = p.history;

        searchResultsList.innerHTML = `<div style="padding: 6px; font-size: 0.78rem; color: var(--flag-green); font-weight: 600;">✓ Selected Patient: ${p.name} (${p.dhrId})</div>`;
      });
      searchResultsList.appendChild(item);
    });
  }

  if (patientSearchInput) {
    patientSearchInput.addEventListener('input', performPatientSearch);
  }
  if (patientSearchBtn) {
    patientSearchBtn.addEventListener('click', performPatientSearch);
  }

  // Multilingual Voice Recognition
  function initVoiceRecognition(langCode, langName, sampleText, buttonEl) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    buttonEl.classList.add('active');
    voiceStatus.textContent = `🎙️ Listening in ${langName}... Speak now.`;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = langCode;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          symptomsTextarea.value = symptomsTextarea.value ? symptomsTextarea.value + ' ' + transcript : transcript;
          voiceStatus.textContent = `✓ Speech captured (${langName})!`;
          buttonEl.classList.remove('active');
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition error, using fallback: ", event.error);
          simulateSpeechInput(sampleText, langName, buttonEl);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn("Speech recognition failed to start: ", err);
      }
    }

    simulateSpeechInput(sampleText, langName, buttonEl);
  }

  function simulateSpeechInput(sampleText, langName, buttonEl) {
    setTimeout(() => {
      symptomsTextarea.value = symptomsTextarea.value ? symptomsTextarea.value + ' ' + sampleText : sampleText;
      voiceStatus.textContent = `✓ Simulated voice captured (${langName})!`;
      buttonEl.classList.remove('active');
    }, 1500);
  }

  if (voiceBtnEn) {
    voiceBtnEn.addEventListener('click', () => {
      initVoiceRecognition('en-IN', 'English', 'Patient reports high fever 102°F, chest congestion, and body pain for 2 days.', voiceBtnEn);
    });
  }
  if (voiceBtnHi) {
    voiceBtnHi.addEventListener('click', () => {
      initVoiceRecognition('hi-IN', 'Hindi', 'मरीज को 3 दिन से तेज बुखार, सूखी खांसी और सीने में दर्द है।', voiceBtnHi);
    });
  }
  if (voiceBtnBn) {
    voiceBtnBn.addEventListener('click', () => {
      initVoiceRecognition('bn-IN', 'Bengali', 'রোগীর ৩ দিন ধরে খুব জ্বর, বুকে কফ এবং সর্দি আছে।', voiceBtnBn);
    });
  }
  if (voiceBtnMr) {
    voiceBtnMr.addEventListener('click', () => {
      initVoiceRecognition('mr-IN', 'Marathi', 'रुग्णाला ३ दिवसांपासून खूप ताप, सुका खोकला आणि अंगदुखी आहे.', voiceBtnMr);
    });
  }

  // File Upload Handling
  if (fileUploadZone && fileInput) {
    fileUploadZone.addEventListener('click', () => fileInput.click());

    fileUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadZone.classList.add('dragover');
    });

    fileUploadZone.addEventListener('dragleave', () => {
      fileUploadZone.classList.remove('dragover');
    });

    fileUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUploadZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleFiles(e.target.files);
      }
    });
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type,
          dataUrl: e.target.result
        };
        currentSession.uploadedFiles.push(fileData);
        renderUploadedFiles();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderUploadedFiles() {
    uploadedFilesList.innerHTML = '';
    currentSession.uploadedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      const isImg = file.type.startsWith('image/');

      fileItem.innerHTML = `
        <div class="file-item-info">
          ${isImg ? `<img src="${file.dataUrl}" class="file-thumb" alt="preview">` : `<span class="material-icons-outlined" style="color:var(--health-teal);">description</span>`}
          <div>
            <strong style="font-size: 0.78rem;">${file.name}</strong>
            <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">${file.size}</span>
          </div>
        </div>
        <button class="remove-file-btn" data-index="${index}">&times;</button>
      `;

      fileItem.querySelector('.remove-file-btn').addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        currentSession.uploadedFiles.splice(idx, 1);
        renderUploadedFiles();
      });

      uploadedFilesList.appendChild(fileItem);
    });
  }

  // AI Decision Support & Risk Analysis Engine
  if (aiAnalyzeBtn) {
    aiAnalyzeBtn.addEventListener('click', () => {
      const name = pnameInput.value.trim() || 'Unregistered Patient';
      const age = pageInput.value || '35';
      const gender = pgenderSelect.value || 'Unknown';
      const temp = parseFloat(tempInput.value) || 98.6;
      const pulse = parseInt(pulseInput.value) || 72;
      const bp = bpInput.value.trim() || '120/80';
      const spo2 = parseInt(spo2Input.value) || 98;
      const injuries = injuriesSelect.value;
      const history = historyInput.value.trim() || 'None reported';
      const symptoms = symptomsTextarea.value.trim() || 'General feeling of malaise';

      currentSession.name = name;
      currentSession.age = age;
      currentSession.gender = gender;
      currentSession.phone = pphoneInput.value || '9876543210';
      currentSession.state = pstateInput.value || 'State Clinic';
      if (!currentSession.dhrId) {
        currentSession.dhrId = 'DHR-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
      }
      currentSession.temp = temp;
      currentSession.pulse = pulse;
      currentSession.bp = bp;
      currentSession.spo2 = spo2;
      currentSession.injuries = injuries;
      currentSession.history = history;
      currentSession.symptoms = symptoms;

      // Add to registered patients if new
      if (!registeredPatients.find(p => p.name.toLowerCase() === name.toLowerCase())) {
        registeredPatients.push({
          id: 'PAT-' + Math.floor(100 + Math.random() * 900),
          dhrId: currentSession.dhrId,
          name: name,
          age: age,
          gender: gender,
          phone: currentSession.phone,
          state: currentSession.state,
          history: history
        });
      }

      // Risk Evaluation Algorithm
      let riskLevel = 'LOW';
      let badgeClass = 'risk-low';
      let riskFactors = [];

      if (spo2 < 90 || temp >= 103 || injuries === 'Deep Wound' || injuries === 'Thermal Burn') {
        riskLevel = 'CRITICAL EMERGENCY';
        badgeClass = 'risk-critical';
        if (spo2 < 90) riskFactors.push(`Severe Hypoxia (SpO2: ${spo2}%)`);
        if (temp >= 103) riskFactors.push(`High Hyperpyrexia (${temp}°F)`);
        if (injuries !== 'None') riskFactors.push(`Severe Trauma (${injuries})`);
      } else if (spo2 < 95 || temp >= 101 || pulse > 105 || injuries === 'Suspected Fracture') {
        riskLevel = 'HIGH RISK';
        badgeClass = 'risk-high';
        if (spo2 < 95) riskFactors.push(`Mild Hypoxia (SpO2: ${spo2}%)`);
        if (temp >= 101) riskFactors.push(`Moderate Fever (${temp}°F)`);
        if (pulse > 105) riskFactors.push(`Tachycardia (${pulse} BPM)`);
        if (injuries !== 'None') riskFactors.push(`Trauma/Injury (${injuries})`);
      } else if (temp > 99.5 || pulse > 90) {
        riskLevel = 'MODERATE RISK';
        badgeClass = 'risk-moderate';
        if (temp > 99.5) riskFactors.push(`Low-grade Fever (${temp}°F)`);
        if (pulse > 90) riskFactors.push(`Elevated Pulse (${pulse} BPM)`);
      }

      currentSession.aiRisk = { level: riskLevel, badgeClass: badgeClass, factors: riskFactors };

      aiRiskBadge.className = `ai-risk-badge ${badgeClass}`;
      aiRiskText.textContent = `${riskLevel} ${riskFactors.length ? ' (' + riskFactors.join(', ') + ')' : ''}`;

      aiSummaryText.innerHTML = `
        • <strong>Demographics:</strong> ${name}, ${age}y/${gender}<br>
        • <strong>Vitals Assessment:</strong> Temp: ${temp}°F | Pulse: ${pulse} BPM | BP: ${bp} | SpO2: ${spo2}%<br>
        • <strong>Chief Complaints:</strong> ${symptoms}<br>
        • <strong>Injuries:</strong> ${injuries}<br>
        • <strong>Medical History:</strong> ${history}<br>
        • <strong>Uploaded Reports:</strong> ${currentSession.uploadedFiles.length} document(s) attached.<br>
        • <strong>Specialist Triage:</strong> ${riskLevel === 'LOW' ? 'Routine Teleconsultation' : 'Priority Tele-Specialist Evaluation Recommended'}.
      `;

      currentSession.aiSummary = aiSummaryText.innerText;

      aiAnalysisOutput.style.display = 'block';
      startConsultBtn.style.display = 'block';
    });
  }

  // Request Doctor Consultation
  if (startConsultBtn) {
    startConsultBtn.addEventListener('click', async () => {
      currentSession.firstaid = firstaidTextarea.value.trim() || 'Standard clinical observations recorded.';

      menuConsultTab.classList.remove('disabled');

      menuItems.forEach(m => m.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));
      menuConsultTab.classList.add('active');
      document.getElementById('tab-consult').classList.add('active');

      consultPname.textContent = currentSession.name;
      consultPdetails.textContent = `${currentSession.age} Yrs / ${currentSession.gender} | Mobile: ${currentSession.phone}`;
      consultPdhr.textContent = `DHR ID: ${currentSession.dhrId}`;

      monitorTemp.textContent = currentSession.temp;
      monitorPulse.textContent = currentSession.pulse;
      monitorBp.textContent = currentSession.bp;
      monitorSpo2.textContent = currentSession.spo2;

      consultSymptoms.textContent = currentSession.symptoms;
      consultInjuries.textContent = currentSession.injuries;
      consultFirstaid.textContent = currentSession.firstaid;

      consultFiles.innerHTML = '';
      if (currentSession.uploadedFiles.length === 0) {
        consultFiles.innerHTML = `<span style="font-size: 0.78rem; color: var(--text-muted);">No reports uploaded.</span>`;
      } else {
        currentSession.uploadedFiles.forEach(f => {
          const fileBadge = document.createElement('div');
          fileBadge.className = 'file-item';
          fileBadge.innerHTML = `<span class="material-icons-outlined" style="font-size: 16px;">attachment</span> ${f.name} (${f.size})`;
          consultFiles.appendChild(fileBadge);
        });
      }

      try {
        mediaStreamHWC = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        hwcPatientVideo.srcObject = mediaStreamHWC;
      } catch (e) {
        console.warn("Patient video capture error/denied: ", e);
      }

      startDoctorSimulationHWC();
    });
  }

  function startDoctorSimulationHWC() {
    hwcDoctorStatus.textContent = "Connecting with Hub Specialist...";
    prescriptionStatusText.textContent = "Connecting to Dr. Rajesh Kumar...";
    doctorPrescriptionNotes.textContent = "";

    setTimeout(() => {
      hwcDoctorStatus.innerHTML = `<div style="text-align:center;"><span class="material-icons-outlined" style="font-size: 48px; color: var(--flag-green);">support_agent</span><br>Dr. Rajesh Kumar (Specialist Hub)</div>`;
      prescriptionStatusText.textContent = "✓ Connected to Dr. Rajesh Kumar";

      appendHWCChat("doctor", "Dr. Rajesh Kumar: Namaste Health Worker! I have opened the intake file for " + currentSession.name + ". Reviewing vitals (SpO2: " + currentSession.spo2 + "%, Temp: " + currentSession.temp + "°F) and AI risk flag.");

      setTimeout(() => {
        appendHWCChat("doctor", "Dr. Rajesh Kumar: Excellent first-aid intervention. I am streaming the clinical recommendations into the prescription notes field now.");

        doctorPrescriptionNotes.textContent = `CLINICAL TELE-CONSULTATION RECOMMENDATION SHEET
---------------------------------------------------
Consulting Specialist: Dr. Rajesh Kumar, MD
Hub Station: Central Diagnostic & Tele-specialty Hub

DIAGNOSIS & CLINICAL OPINION:
Acute Clinical Presentation. Patient evaluated via HWC Spoke intake.

RECOMMENDED MEDICATIONS & MANAGEMENT:
1. Tab. Paracetamol 650mg - 1 tablet TDS after food x 3 days.
2. Syp. Ambroxol / Levosalbutamol 10ml BD x 5 days.
3. Tab. Augmentin 625mg (Amoxicillin + Clavulanate) 1 BD x 5 days (if bacterial infection suspected).

SPOKE ADVICE & FOLLOW-UP:
- Continue Spoke vital monitoring every 4 hours.
- Encourage oral hydration and steam inhalation.
- If SpO2 drops below 92%, administer supplemental oxygen and re-evaluate for Hub transfer.`;

        endConsultBtn.style.display = "block";
      }, 4000);

    }, 2500);
  }

  function appendHWCChat(sender, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    hwcChatMessages.appendChild(msg);
    hwcChatMessages.scrollTop = hwcChatMessages.scrollHeight;
  }

  if (hwcChatSendBtn && hwcChatInput) {
    const sendMsg = () => {
      const val = hwcChatInput.value.trim();
      if (val) {
        appendHWCChat("user", `[Health Worker]: ${val}`);
        hwcChatInput.value = '';

        setTimeout(() => {
          appendHWCChat("doctor", "Dr. Rajesh Kumar: Noted. Thank you for the update. I have updated the clinical notes accordingly.");
        }, 1500);
      }
    };
    hwcChatSendBtn.addEventListener('click', sendMsg);
    hwcChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMsg();
    });
  }

  if (endConsultBtn) {
    endConsultBtn.addEventListener('click', () => {
      if (mediaStreamHWC) {
        mediaStreamHWC.getTracks().forEach(t => t.stop());
        mediaStreamHWC = null;
      }

      const today = new Date().toISOString().split('T')[0];
      const token = 'HWC-' + Math.floor(1000 + Math.random() * 9000);

      currentSession.date = today;
      currentSession.token = token;
      currentSession.doctorNotes = doctorPrescriptionNotes.textContent;
      currentSession.opdClinic = 'Spoke-Station A Telemedicine Clinic';

      caseArchive.unshift(JSON.parse(JSON.stringify(currentSession)));
      renderArchiveTable();

      downloadHWCCaseDocument(currentSession);

      openHWCCaseModal(currentSession);
    });
  }

  function renderArchiveTable() {
    if (!archiveTableBody) return;
    archiveTableBody.innerHTML = '';

    caseArchive.forEach((record, idx) => {
      const tr = document.createElement('tr');
      const badgeClass = record.aiRisk ? record.aiRisk.badgeClass : 'risk-low';
      const riskLevel = record.aiRisk ? record.aiRisk.level : 'LOW';

      tr.innerHTML = `
        <td>${record.date}</td>
        <td style="font-family: monospace; font-weight: 700; color: var(--health-teal);">${record.token}</td>
        <td><strong>${record.patientName || record.name}</strong></td>
        <td>${record.ageGender || (record.age + ' / ' + record.gender)}</td>
        <td>${record.opdClinic || 'Spoke Clinic'}</td>
        <td><span class="ai-risk-badge ${badgeClass}" style="padding: 3px 8px; font-size: 0.72rem; margin: 0;">${riskLevel}</span></td>
        <td>
          <button class="table-btn view-case-btn" data-index="${idx}">
            <span class="material-icons-outlined" style="font-size: 14px;">visibility</span> View / Print
          </button>
        </td>
      `;

      tr.querySelector('.view-case-btn').addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.view-case-btn').dataset.index);
        openHWCCaseModal(caseArchive[index]);
      });

      archiveTableBody.appendChild(tr);
    });
  }

  function openHWCCaseModal(record) {
    const badgeClass = record.aiRisk ? record.aiRisk.badgeClass : 'risk-low';
    const riskLevel = record.aiRisk ? record.aiRisk.level : 'LOW';

    hwcCaseModalBody.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary-navy); padding-bottom: 12px; margin-bottom: 15px;">
        <div>
          <h3 style="margin: 0; color: var(--primary-navy);">SwasthyaSetu HWC Clinical Case Record</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Spoke Token: <strong>${record.token}</strong> | Date: ${record.date}</span>
        </div>
        <button id="modal-print-btn" class="form-submit" style="width: auto; padding: 8px 16px; background: var(--health-teal); font-weight: bold; cursor: pointer;">
          <span class="material-icons-outlined" style="vertical-align: middle;">print</span> Print Case Sheet
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div style="background: #f8fafc; border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm);">
          <strong>Patient Identity:</strong><br>
          Name: ${record.patientName || record.name}<br>
          Age/Gender: ${record.ageGender || (record.age + ' Yrs / ' + record.gender)}<br>
          Mobile: ${record.phone || 'N/A'}<br>
          DHR ID: <span style="font-family: monospace;">${record.dhrId || 'Linked'}</span>
        </div>
        <div style="background: #f8fafc; border: 1px solid var(--border-light); padding: 12px; border-radius: var(--radius-sm);">
          <strong>Vitals Log:</strong><br>
          Temp: ${record.temp}°F | Pulse: ${record.pulse} BPM<br>
          BP: ${record.bp} mmHg | SpO2: ${record.spo2}%<br>
          AI Risk Triage: <span class="ai-risk-badge ${badgeClass}" style="padding: 2px 6px; font-size: 0.7rem; display: inline-block;">${riskLevel}</span>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <strong>Symptoms Reported:</strong>
        <p style="background: #f1f5f9; padding: 8px; border-radius: 4px; font-size: 0.85rem; margin: 4px 0;">${record.symptoms || 'None'}</p>
      </div>

      <div style="margin-bottom: 12px;">
        <strong>Injuries & First-Aid Intervention:</strong>
        <p style="background: #f1f5f9; padding: 8px; border-radius: 4px; font-size: 0.85rem; margin: 4px 0;">Injuries: ${record.injuries || 'None'} | First-Aid: ${record.firstaid || 'N/A'}</p>
      </div>

      <div style="margin-bottom: 12px;">
        <strong>AI Decision Support Summary:</strong>
        <div style="background: #f8fafc; border-left: 3px solid var(--health-teal); padding: 8px; font-size: 0.82rem;">${record.aiSummary || 'N/A'}</div>
      </div>

      <div>
        <strong>Doctor Recommendation & e-Prescription Notes:</strong>
        <pre style="background: #0f3b5f; color: #fff; padding: 12px; border-radius: 6px; font-size: 0.82rem; white-space: pre-wrap; font-family: monospace;">${record.doctorNotes || 'No notes available.'}</pre>
      </div>
    `;

    document.getElementById('modal-print-btn').addEventListener('click', () => {
      downloadHWCCaseDocument(record);
    });

    hwcCaseModal.classList.add('active');
  }

  function downloadHWCCaseDocument(record) {
    const docHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SwasthyaSetu HWC Case Record - ${record.token}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; margin: 0; padding: 30px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10847e; padding-bottom: 15px; }
    .brand-name { font-size: 24px; font-weight: bold; color: #0f3b5f; }
    .card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .vitals-box { background: #0f3b5f; color: white; padding: 10px; border-radius: 4px; text-align: center; }
    pre { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; font-family: monospace; white-space: pre-wrap; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #10847e; color: white; padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Print / Download PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand-name">SwasthyaSetu AB-HWC</div>
      <div style="font-size: 12px; color: #666;">Assisted Telemedicine Clinical Spoke Record</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #444;">
      <strong>Token: ${record.token}</strong><br>
      Date: ${record.date}<br>
      DHR Profile: ${record.dhrId || 'Linked'}
    </div>
  </div>

  <div class="card grid">
    <div>
      <h4 style="margin:0 0 8px 0; color:#0f3b5f;">Patient Demographics</h4>
      <strong>Name:</strong> ${record.patientName || record.name}<br>
      <strong>Age/Gender:</strong> ${record.ageGender || (record.age + ' Yrs / ' + record.gender)}<br>
      <strong>Mobile:</strong> +91-${record.phone || 'N/A'}<br>
      <strong>State:</strong> ${record.state || 'N/A'}
    </div>
    <div>
      <h4 style="margin:0 0 8px 0; color:#0f3b5f;">Clinical Vitals</h4>
      <strong>Temp:</strong> ${record.temp}°F | <strong>Pulse:</strong> ${record.pulse} BPM<br>
      <strong>BP:</strong> ${record.bp} mmHg | <strong>SpO2:</strong> ${record.spo2}%<br>
      <strong>AI Risk Flag:</strong> ${record.aiRisk ? record.aiRisk.level : 'LOW'}
    </div>
  </div>

  <div class="card">
    <h4 style="margin:0 0 8px 0; color:#0f3b5f;">Spoke Intake & First-Aid</h4>
    <strong>Symptoms:</strong> ${record.symptoms}<br>
    <strong>Injuries:</strong> ${record.injuries}<br>
    <strong>First-Aid Administered:</strong> ${record.firstaid}<br>
    <strong>Past History:</strong> ${record.history || 'None'}
  </div>

  <div class="card">
    <h4 style="margin:0 0 8px 0; color:#0f3b5f;">AI Triage Summary</h4>
    <p style="margin:0;">${record.aiSummary}</p>
  </div>

  <h4>Doctor Tele-Consultation Recommendation Notes</h4>
  <pre>${record.doctorNotes || 'No notes recorded.'}</pre>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #cbd5e1; padding-top: 10px;">
    <div>Spoke Health Worker ID: HW101</div>
    <div>Digitally Verified by Dr. Rajesh Kumar (National Medical Board)</div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([docHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SwasthyaSetu_HWC_CaseSheet_${record.token}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/* ================= 7. Authentication & Role-Based Access Control (RBAC) ================= */
function initAuthModule() {
  const DEMO_ACCOUNTS = {
    'healthworker@medisetu.demo': { password: 'Demo@123', role: 'health_worker', name: 'Health Worker (HW101)', id: 'HW101' },
    'hw101': { password: 'password123', role: 'health_worker', name: 'Health Worker (HW101)', id: 'HW101' },
    'doctor@medisetu.demo': { password: 'Demo@123', role: 'doctor', name: 'Dr. Rajesh Kumar (MD)', id: 'NMB-82741-A' },
    'doc101': { password: 'password123', role: 'doctor', name: 'Dr. Rajesh Kumar (MD)', id: 'NMB-82741-A' },
    'patient@medisetu.demo': { password: 'Demo@123', role: 'patient', name: 'Citizen Patient', id: 'PAT-101' }
  };

  let currentUser = null;

  // Unified Auth Modal Elements
  const unifiedLoginModal = document.getElementById('unified-login-modal');
  const roleTabBtns = document.querySelectorAll('.role-tab-btn');
  const roleFormPanels = document.querySelectorAll('.role-form-panel');
  const googleLoginBtn = document.getElementById('google-login-btn');

  // Legacy/Direct modals
  const hwcLoginModal = document.getElementById('hwc-login-modal');
  const doctorLoginModal = document.getElementById('doctor-login-modal');

  // Trigger buttons across page
  const openHwcLoginBtn = document.getElementById('open-hwc-login-btn');
  const openDoctorLoginBtn = document.getElementById('open-doctor-login-btn');
  const openRegisterBtn = document.getElementById('open-register-btn');

  // Views & Dashboards
  const landingView = document.getElementById('landing-view');
  const hwcDashboardView = document.getElementById('hwc-dashboard-view');
  const doctorDashboardView = document.getElementById('doctor-dashboard-view');

  const hwcLogoutBtn = document.getElementById('hwc-logout-btn');
  const doctorLogoutBtn = document.getElementById('doctor-logout-btn');

  // Open Unified Modal with specific active role tab
  function openUnifiedModal(targetRole = 'doctor') {
    if (!unifiedLoginModal) return;
    
    // Switch active role tab
    roleTabBtns.forEach(btn => {
      if (btn.dataset.role === targetRole) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    roleFormPanels.forEach(panel => {
      if (panel.id === `panel-role-${targetRole}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    unifiedLoginModal.classList.add('active');
  }

  if (openUnifiedLoginBtn) {
    openUnifiedLoginBtn.addEventListener('click', () => openUnifiedModal('doctor'));
  }

  if (openDoctorLoginBtn) {
    openDoctorLoginBtn.addEventListener('click', () => openUnifiedModal('doctor'));
  }

  if (openHwcLoginBtn) {
    openHwcLoginBtn.addEventListener('click', () => openUnifiedModal('hwc'));
  }

  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', () => openUnifiedModal('patient'));
  }

  // Handle Role Tab Switching inside Unified Modal
  roleTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      roleTabBtns.forEach(b => b.classList.remove('active'));
      roleFormPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-role-${role}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Helper to update Top Header Auth Badge
  function updateHeaderAuthBadge(user) {
    const openUnifiedLoginBtn = document.getElementById('open-unified-login-btn');
    const userProfileDisplay = document.getElementById('user-profile-display');
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayRole = document.getElementById('user-display-role');

    if (user) {
      if (openUnifiedLoginBtn) openUnifiedLoginBtn.style.display = 'none';
      if (userProfileDisplay) userProfileDisplay.style.display = 'flex';
      
      const cleanName = user.displayName || (user.name ? user.name : (user.email ? user.email.split('@')[0].replace(/[\._-]/g, ' ') : 'User'));
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      if (userDisplayName) userDisplayName.textContent = formattedName;
      if (userDisplayRole) userDisplayRole.textContent = (user.role || 'Patient').toUpperCase();
    } else {
      if (openUnifiedLoginBtn) openUnifiedLoginBtn.style.display = 'flex';
      if (userProfileDisplay) userProfileDisplay.style.display = 'none';
    }
  }

  // Firebase Authentication & Database Helper Function
  async function handleFirebaseLogin(rawEmail, password, role, defaultName) {
    // Sanitize input: If user entered phone number or username without '@', format as email for Firebase Auth
    let email = rawEmail ? rawEmail.trim() : '';
    if (email && !email.includes('@')) {
      email = `${email.replace(/[^a-zA-Z0-9]/g, '')}@swasthya.app`;
    }
    
    // Ensure password meets Firebase min 6 char length requirement
    let pass = password && password.length >= 6 ? password : `${password || '123456'}Demo123!`;

    if (window.firebaseAuth && window.firebaseMethods) {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc } = window.firebaseMethods;
      try {
        let userCred = null;
        try {
          userCred = await signInWithEmailAndPassword(window.firebaseAuth, email, pass);
          showToast(`🔥 Firebase Auth: Signed in as ${email}`);
        } catch (authErr) {
          console.warn("Firebase SignIn code:", authErr.code, authErr.message);
          
          if (authErr.code === 'auth/unauthorized-domain') {
            showToast(`⚠️ Firebase Domain Warning: Please add '${window.location.hostname}' to Firebase Console -> Auth -> Settings -> Authorized Domains`);
          } else if (
            authErr.code === 'auth/invalid-credential' || 
            authErr.code === 'auth/user-not-found' || 
            authErr.code === 'auth/wrong-password' ||
            authErr.code === 'auth/invalid-email'
          ) {
            try {
              // Attempt to auto-create user on first sign-in
              userCred = await createUserWithEmailAndPassword(window.firebaseAuth, email, pass);
              showToast(`🔥 Firebase Auth: Created new user for ${email}`);
            } catch (createErr) {
              console.warn("Firebase CreateUser Error:", createErr.code, createErr.message);
              if (createErr.code === 'auth/unauthorized-domain') {
                showToast(`⚠️ Firebase Warning: Please add '${window.location.hostname}' to Authorized Domains in Firebase Console`);
              } else if (createErr.code === 'auth/email-already-in-use') {
                showToast(`⚠️ Password mismatch for email ${email}`);
              } else {
                showToast(`Auth Info: ${createErr.message}`);
              }
            }
          } else {
            showToast(`Auth Note: ${authErr.message}`);
          }
        }

        if (userCred && userCred.user && window.firebaseDb) {
          try {
            const userRef = doc(window.firebaseDb, 'users', userCred.user.uid);
            await setDoc(userRef, {
              uid: userCred.user.uid,
              email: email,
              role: role,
              name: defaultName,
              lastLogin: new Date().toISOString()
            }, { merge: true });
            console.log("🔥 Firestore updated for user UID:", userCred.user.uid);
          } catch (dbErr) {
            console.warn("Firestore save note:", dbErr.message);
          }
        }
      } catch (err) {
        console.warn("Firebase Login Error:", err.message);
      }
    }
    
    await loginAsRole(role, email, pass, defaultName);
  }

  // Direct Click Handlers & Form Submit Handlers for All Login Modals
  const submitUniDocBtn = document.getElementById('submit-uni-doc-btn');
  const submitUniPatBtn = document.getElementById('submit-uni-pat-btn');
  const submitUniHwcBtn = document.getElementById('submit-uni-hwc-btn');
  const submitHwcLoginBtn = document.getElementById('submit-hwc-login-btn');
  const submitDoctorLoginBtn = document.getElementById('submit-doctor-login-btn');

  const doDoctorLogin = async () => {
    const uniEmail = document.getElementById('uni-doc-email');
    const docEmail = document.getElementById('doctor-email');
    const uniPass = document.getElementById('uni-doc-pass');
    const docPass = document.getElementById('doctor-password');

    const email = (uniEmail && uniEmail.value) ? uniEmail.value : ((docEmail && docEmail.value) ? docEmail.value : 'doctor@medisetu.demo');
    const pass = (uniPass && uniPass.value) ? uniPass.value : ((docPass && docPass.value) ? docPass.value : 'Demo@123');
    await handleFirebaseLogin(email, pass, 'doctor', 'Dr. Rajesh Kumar (MD)');
  };

  const doPatientLogin = async () => {
    const patInput = document.getElementById('uni-pat-input');
    const patPass = document.getElementById('uni-pat-pass');
    const email = (patInput && patInput.value) ? patInput.value : 'patient@medisetu.demo';
    const pass = (patPass && patPass.value) ? patPass.value : 'Demo@123';
    await handleFirebaseLogin(email, pass, 'patient', 'Citizen Patient');
  };

  const doHwcLogin = async () => {
    const uniEmail = document.getElementById('uni-hwc-email');
    const staffEmail = document.getElementById('hwc-staff-id');
    const uniPass = document.getElementById('uni-hwc-pass');
    const staffPass = document.getElementById('hwc-password');

    const email = (uniEmail && uniEmail.value) ? uniEmail.value : ((staffEmail && staffEmail.value) ? staffEmail.value : 'healthworker@medisetu.demo');
    const pass = (uniPass && uniPass.value) ? uniPass.value : ((staffPass && staffPass.value) ? staffPass.value : 'Demo@123');
    await handleFirebaseLogin(email, pass, 'health_worker', 'Health Worker (HW101)');
  };

  // Attach button click listeners across all modals
  if (submitUniDocBtn) submitUniDocBtn.addEventListener('click', doDoctorLogin);
  if (submitDoctorLoginBtn) submitDoctorLoginBtn.addEventListener('click', doDoctorLogin);

  if (submitUniPatBtn) submitUniPatBtn.addEventListener('click', doPatientLogin);

  if (submitUniHwcBtn) submitUniHwcBtn.addEventListener('click', doHwcLogin);
  if (submitHwcLoginBtn) submitHwcLoginBtn.addEventListener('click', doHwcLogin);

  // Attach form submit listeners
  const uniDoctorForm = document.getElementById('unified-doctor-form');
  if (uniDoctorForm) uniDoctorForm.addEventListener('submit', (e) => { e.preventDefault(); doDoctorLogin(); });

  const doctorLoginForm = document.getElementById('doctor-login-form');
  if (doctorLoginForm) doctorLoginForm.addEventListener('submit', (e) => { e.preventDefault(); doDoctorLogin(); });

  const uniPatientForm = document.getElementById('unified-patient-form');
  if (uniPatientForm) uniPatientForm.addEventListener('submit', (e) => { e.preventDefault(); doPatientLogin(); });

  const uniHwcForm = document.getElementById('unified-hwc-form');
  if (uniHwcForm) uniHwcForm.addEventListener('submit', (e) => { e.preventDefault(); doHwcLogin(); });

  const hwcLoginForm = document.getElementById('hwc-login-form');
  if (hwcLoginForm) hwcLoginForm.addEventListener('submit', (e) => { e.preventDefault(); doHwcLogin(); });

  // Unified Google Login Handler
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      const activeTab = document.querySelector('.role-tab-btn.active');
      const activeRole = activeTab ? activeTab.dataset.role : 'doctor';

      let roleName = 'Doctor Specialist';
      let targetRole = 'doctor';

      if (activeRole === 'patient') {
        roleName = 'Citizen Patient';
        targetRole = 'patient';
      } else if (activeRole === 'hwc') {
        roleName = 'Health Worker';
        targetRole = 'health_worker';
      }

      showToast(`Initiating Google Firebase Authentication...`);

      if (window.firebaseAuth && window.firebaseMethods && window.googleProvider) {
        try {
          const result = await window.firebaseMethods.signInWithPopup(window.firebaseAuth, window.googleProvider);
          const user = result.user;
          showToast(`🔥 Firebase Google Auth: ${user.email}`);

          if (window.firebaseDb) {
            const userRef = window.firebaseMethods.doc(window.firebaseDb, 'users', user.uid);
            await window.firebaseMethods.setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              name: user.displayName || roleName,
              photoURL: user.photoURL || '',
              role: targetRole,
              lastLogin: new Date().toISOString()
            }, { merge: true });
          }
          await loginAsRole(targetRole, user.email, 'google_oauth', user.displayName || `Google User (${roleName})`);
          return;
        } catch (err) {
          console.warn("Google Auth popup note:", err.message);
          if (err.code === 'auth/unauthorized-domain') {
            showToast(`⚠️ Firebase Warning: Please add '${window.location.hostname}' to Authorized Domains in Firebase Console`);
          }
        }
      }

      await loginAsRole(targetRole, `google_user@swasthya.app`, 'google_demo', `Google Verified (${roleName})`);
    });
  }

  // Common Login Router
  async function loginAsRole(role, email, pass = '', defaultName = '') {
    const cleanName = defaultName || (email ? email.split('@')[0].replace(/[\._-]/g, ' ') : 'User');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    
    // Call Firebase Auth signInUser helper if available
    let authRes = null;
    if (typeof signInUser === 'function' && email) {
      authRes = await signInUser(email, pass || 'demo123456', role);
    }

    const userData = (authRes && authRes.user) ? { ...authRes.user, role: role || authRes.user.role } : {
      uid: 'user_' + Date.now(),
      email: email || 'user@swasthyasetu.org',
      displayName: formattedName,
      role: role
    };

    currentUser = userData;
    localStorage.setItem('swasthya_current_user', JSON.stringify(userData));
    updateHeaderAuthBadge(userData);

    if (unifiedLoginModal) unifiedLoginModal.classList.remove('active');
    if (hwcLoginModal) hwcLoginModal.classList.remove('active');
    if (doctorLoginModal) doctorLoginModal.classList.remove('active');

    if (role === 'doctor') {
      landingView.style.display = 'none';
      hwcDashboardView.style.display = 'none';
      doctorDashboardView.style.display = 'flex';
      initDoctorDashboardLogic();
      doctorDashboardView.scrollIntoView({ behavior: 'smooth' });
      showToast(`✓ Logged in as Doctor: ${formattedName}`);
    } else if (role === 'health_worker' || role === 'cho') {
      landingView.style.display = 'none';
      doctorDashboardView.style.display = 'none';
      hwcDashboardView.style.display = 'flex';
      hwcDashboardView.scrollIntoView({ behavior: 'smooth' });
      showToast(`✓ Logged in as Health Worker: ${formattedName}`);
    } else if (role === 'patient') {
      doctorDashboardView.style.display = 'none';
      hwcDashboardView.style.display = 'none';
      landingView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`✓ Welcome back, ${formattedName}! Signed in as Patient.`);
    } else {
      doctorDashboardView.style.display = 'none';
      hwcDashboardView.style.display = 'none';
      landingView.style.display = 'block';
    }
  }

  // Header Logout Button Handler
  const headerLogoutBtn = document.getElementById('header-logout-btn');
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', async () => {
      if (typeof signOutUser === 'function') await signOutUser();
      localStorage.removeItem('swasthya_current_user');
      currentUser = null;
      updateHeaderAuthBadge(null);
      landingView.style.display = 'block';
      doctorDashboardView.style.display = 'none';
      hwcDashboardView.style.display = 'none';
      showToast('Logged out of SwasthyaSetu.');
    });
  }

  // Auto-restore session from LocalStorage / Firebase on load
  const savedUser = localStorage.getItem('swasthya_current_user');
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && (parsedUser.role || parsedUser.email)) {
        currentUser = parsedUser;
        updateHeaderAuthBadge(parsedUser);
      }
    } catch (e) {}
  }

  // Firebase Auth State Listener
  if (typeof onAuthChange === 'function') {
    onAuthChange((user) => {
      if (user) {
        updateHeaderAuthBadge(user);
      }
    });
  }

  // Logout Handlers
  if (hwcLogoutBtn) {
    hwcLogoutBtn.addEventListener('click', async () => {
      if (typeof signOutUser === 'function') await signOutUser();
      localStorage.removeItem('swasthya_current_user');
      currentUser = null;
      updateHeaderAuthBadge(null);
      hwcDashboardView.style.display = 'none';
      doctorDashboardView.style.display = 'none';
      landingView.style.display = 'block';
      showToast('Logged out of Health Worker Portal.');
    });
  }

  if (doctorLogoutBtn) {
    doctorLogoutBtn.addEventListener('click', async () => {
      if (typeof signOutUser === 'function') await signOutUser();
      localStorage.removeItem('swasthya_current_user');
      currentUser = null;
      updateHeaderAuthBadge(null);
      hwcDashboardView.style.display = 'none';
      doctorDashboardView.style.display = 'none';
      landingView.style.display = 'block';
      showToast('Logged out of Doctor Specialist Portal.');
    });
  }

  // Helper Toast Notification
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #0f3b5f; color: white; padding: 12px 24px; border-radius: 25px; font-weight: 600; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 0.9rem; border: 1px solid var(--accent-saffron);';
    toast.innerHTML = `<span class="material-icons-outlined" style="vertical-align: middle; margin-right: 6px; color: var(--accent-saffron);">verified_user</span> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Doctor Dashboard Logic
  function initDoctorDashboardLogic() {
    const docMenuItems = document.querySelectorAll('#doctor-dashboard-view .menu-item');
    const docTabContents = document.querySelectorAll('#doctor-dashboard-view .hwc-tab-content');
    const doctorQueueTableBody = document.getElementById('doctor-queue-table-body');
    const doctorArchiveTableBody = document.getElementById('doctor-archive-table-body');
    const menuDocConsultTab = document.getElementById('menu-doc-consult-tab');

    const docClinicalNotes = document.getElementById('doc-clinical-notes');
    const docAssessment = document.getElementById('doc-assessment');
    const docDiagnosis = document.getElementById('doc-diagnosis');
    const docTreatmentPlan = document.getElementById('doc-treatment-plan');

    const typePrescriptionRadio = document.getElementById('type-prescription');
    const typeReferralRadio = document.getElementById('type-referral');
    const docPrescriptionSuite = document.getElementById('doc-prescription-suite');
    const docReferralSuite = document.getElementById('doc-referral-suite');
    const docMedicineRowsList = document.getElementById('doc-medicine-rows-list');
    const addMedicineBtn = document.getElementById('add-medicine-btn');

    const docRefHospital = document.getElementById('doc-ref-hospital');
    const docRefSpecialist = document.getElementById('doc-ref-specialist');
    const docRefReason = document.getElementById('doc-ref-reason');
    const docRefUrgency = document.getElementById('doc-ref-urgency');

    const docExplicitConfirmCheck = document.getElementById('doc-explicit-confirm-check');
    const docFinalizeDecisionBtn = document.getElementById('doc-finalize-decision-btn');

    const docConfirmationModal = document.getElementById('doc-confirmation-modal');
    const docConfirmModalBody = document.getElementById('doc-confirm-modal-body');

    const docChatMessages = document.getElementById('doc-chat-messages');
    const docChatInput = document.getElementById('doc-chat-input');
    const docChatSendBtn = document.getElementById('doc-chat-send-btn');
    const doctorSelfVideo = document.getElementById('doctor-self-video');

    let doctorStream = null;
    let doctorArchive = [
      {
        date: new Date().toISOString().split('T')[0],
        token: 'HWC-9281',
        patientName: 'Ramesh Kumar',
        ageGender: '45 / Male',
        type: 'prescription',
        diagnosis: 'Acute Upper Respiratory Tract Infection (ICD-10 J06.9)',
        summary: 'Tab. Paracetamol 650mg (1-1-1 x 3 Days)'
      }
    ];

    // Toggle Decision Type: Prescription vs Referral
    if (typePrescriptionRadio && typeReferralRadio) {
      typePrescriptionRadio.addEventListener('change', () => {
        if (typePrescriptionRadio.checked) {
          docPrescriptionSuite.style.display = 'block';
          docReferralSuite.style.display = 'none';
        }
      });
      typeReferralRadio.addEventListener('change', () => {
        if (typeReferralRadio.checked) {
          docPrescriptionSuite.style.display = 'none';
          docReferralSuite.style.display = 'block';
        }
      });
    }

    // Doctor Affected Area Image Inspection & Lightbox
    const docConsultAffectedImg = document.getElementById('doc-consult-affected-img');
    const imageLightboxModal = document.getElementById('image-lightbox-modal');
    const lightboxFullImg = document.getElementById('lightbox-full-img');
    const closeLightboxBtn = document.getElementById('close-lightbox-btn');

    if (docConsultAffectedImg) {
      docConsultAffectedImg.addEventListener('click', () => {
        if (lightboxFullImg && imageLightboxModal) {
          lightboxFullImg.src = docConsultAffectedImg.src;
          imageLightboxModal.classList.add('active');
        }
      });
    }

    if (closeLightboxBtn && imageLightboxModal) {
      closeLightboxBtn.addEventListener('click', () => {
        imageLightboxModal.classList.remove('active');
      });
    }

    // Add Dynamic Medicine Row
    if (addMedicineBtn) {
      addMedicineBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'medicine-row';
        row.style.cssText = 'background: #f8fafc; border: 1px solid var(--border-light); padding: 10px; border-radius: 6px; margin-bottom: 8px; position: relative;';
        row.innerHTML = `
          <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 8px; margin-bottom: 6px;">
            <input type="text" class="form-input med-name" placeholder="Medicine Name (e.g. Cap. Amoxycillin 500mg)">
            <input type="text" class="form-input med-dosage" placeholder="Dosage (e.g. 1 Capsule)">
            <select class="form-input med-freq">
              <option value="1-0-1 (BD)">1-0-1 (Twice Daily / BD)</option>
              <option value="1-1-1 (TDS)">1-1-1 (Thrice Daily / TDS)</option>
              <option value="1-0-0 (OD)">1-0-0 (Once Daily / OD)</option>
              <option value="0-0-1 (HS)">0-0-1 (At Bedtime / HS)</option>
              <option value="As Needed (PRN)">As Needed (PRN)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr 30px; gap: 8px; align-items: center;">
            <input type="text" class="form-input med-duration" placeholder="Duration (e.g. 5 Days)">
            <input type="text" class="form-input med-instructions" placeholder="Instructions (e.g. Take after food)">
            <button type="button" class="remove-med-row" style="background: none; border: none; color: #d9534f; font-weight: bold; cursor: pointer; font-size: 1.2rem;">&times;</button>
          </div>
        `;
        row.querySelector('.remove-med-row').addEventListener('click', () => row.remove());
        docMedicineRowsList.appendChild(row);
      });
    }

    docMenuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('disabled')) return;
        const target = item.dataset.tab;
        docMenuItems.forEach(m => m.classList.remove('active'));
        docTabContents.forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        document.getElementById(target).classList.add('active');

        if (target === 'tab-doc-archive') renderDoctorArchive();
      });
    });

    function renderDoctorQueue() {
      if (!doctorQueueTableBody) return;
      doctorQueueTableBody.innerHTML = `
        <tr>
          <td style="font-family: monospace; font-weight: 700; color: var(--health-teal);">HWC-9281</td>
          <td><strong>Ramesh Kumar</strong></td>
          <td>45 / Male</td>
          <td>Spoke-Station A (UP)</td>
          <td><span class="ai-risk-badge risk-high" style="padding: 2px 6px; font-size: 0.72rem; margin:0;">HIGH RISK</span></td>
          <td>SpO2: 94% | BP: 135/88</td>
          <td>
            <button class="table-btn accept-doc-consult-btn" style="background: var(--flag-green);">
              <span class="material-icons-outlined" style="font-size:14px;">video_call</span> Accept Call
            </button>
          </td>
        </tr>
        <tr>
          <td style="font-family: monospace; font-weight: 700; color: var(--health-teal);">HWC-7410</td>
          <td><strong>Sunita Devi</strong></td>
          <td>38 / Female</td>
          <td>Spoke-Station B (Delhi)</td>
          <td><span class="ai-risk-badge risk-moderate" style="padding: 2px 6px; font-size: 0.72rem; margin:0;">MODERATE</span></td>
          <td>SpO2: 98% | BP: 128/82</td>
          <td>
            <button class="table-btn accept-doc-consult-btn" style="background: var(--primary-navy-light);">
              <span class="material-icons-outlined" style="font-size:14px;">video_call</span> Accept Call
            </button>
          </td>
        </tr>
      `;

      doctorQueueTableBody.querySelectorAll('.accept-doc-consult-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          menuDocConsultTab.classList.remove('disabled');
          docMenuItems.forEach(m => m.classList.remove('active'));
          docTabContents.forEach(t => t.classList.remove('active'));
          menuDocConsultTab.classList.add('active');
          document.getElementById('tab-doc-consult').classList.add('active');

          document.getElementById('doc-consult-symptoms').textContent = "High fever for 3 days, cough, throat pain.";
          document.getElementById('doc-consult-injuries').textContent = "None";
          document.getElementById('doc-consult-firstaid').textContent = "Paracetamol 650mg & cold compress given at Spoke.";
          document.getElementById('doc-consult-history').textContent = "Hypertension";

          docClinicalNotes.value = "Patient presents with 3-day history of fever 101.4°F and throat inflammation.";
          docAssessment.value = "Acute bronchial respiratory infection with mild hypoxemia (SpO2 94%).";
          docDiagnosis.value = "Acute Upper Respiratory Tract Infection (ICD-10 J06.9)";
          docTreatmentPlan.value = "Symptomatic treatment, antipyretic therapy, saline gargles, hydration, follow-up in 48 hours.";

          try {
            doctorStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            doctorSelfVideo.srcObject = doctorStream;
          } catch (e) {
            console.warn("Doctor webcam denied: ", e);
          }
        });
      });
    }

    renderDoctorQueue();

    // Mandatory Explicit Approval Handler
    if (docFinalizeDecisionBtn) {
      docFinalizeDecisionBtn.addEventListener('click', () => {
        const isConfirmed = docExplicitConfirmCheck.checked;
        if (!isConfirmed) {
          alert('⚠️ MANDATORY DOCTOR APPROVAL REQUIRED:\nYou must explicitly check the confirmation box verifying that you, Dr. Rajesh Kumar (MD), have reviewed and approved this decision. AI systems cannot finalize clinical decisions.');
          return;
        }

        const diagnosis = docDiagnosis.value.trim();
        if (!diagnosis) {
          alert('Please enter Diagnosis before finalizing.');
          return;
        }

        const decisionType = document.querySelector('input[name="doc-decision-type"]:checked').value;
        openDoctorConfirmationModal(decisionType);
      });
    }

    function openDoctorConfirmationModal(type) {
      const diagnosis = docDiagnosis.value.trim();
      const notes = docClinicalNotes.value.trim() || 'Recorded during consultation';
      const assessment = docAssessment.value.trim() || 'Clinical evaluation performed';
      const treatmentPlan = docTreatmentPlan.value.trim() || 'Follow general healthcare advice';

      let detailsHTML = '';
      let summaryText = '';

      if (type === 'prescription') {
        const medRows = document.querySelectorAll('#doc-medicine-rows-list .medicine-row');
        let medsList = [];
        medRows.forEach(row => {
          const name = row.querySelector('.med-name').value.trim();
          const dosage = row.querySelector('.med-dosage').value.trim();
          const freq = row.querySelector('.med-freq').value;
          const duration = row.querySelector('.med-duration').value.trim();
          const instructions = row.querySelector('.med-instructions').value.trim();
          if (name) {
            medsList.push({ name, dosage, freq, duration, instructions });
          }
        });

        summaryText = medsList.map(m => `${m.name} (${m.freq} x ${m.duration})`).join(', ');

        detailsHTML = `
          <h4 style="color: var(--primary-navy); margin-top: 15px; margin-bottom: 8px;">Prescription Items (Rx):</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;" border="1" cellpadding="6">
            <thead>
              <tr style="background: #f1f5f9; color: var(--primary-navy);">
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${medsList.map(m => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.dosage}</td>
                  <td>${m.freq}</td>
                  <td>${m.duration}</td>
                  <td>${m.instructions}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else {
        const hospital = docRefHospital.value.trim() || 'District Hospital';
        const specialist = docRefSpecialist.value.trim() || 'Specialist Department';
        const reason = docRefReason.value.trim() || 'Further clinical evaluation';
        const urgency = docRefUrgency.value;

        summaryText = `Referral to ${hospital} (${specialist}) - Urgency: ${urgency}`;

        detailsHTML = `
          <div style="background: rgba(255, 153, 51, 0.08); border: 1px solid var(--accent-saffron); padding: 12px; border-radius: 6px; margin-top: 15px;">
            <h4 style="color: var(--primary-navy); margin: 0 0 8px 0;">Referral Order Details:</h4>
            <strong>Referred Hospital:</strong> ${hospital}<br>
            <strong>Specialist / Department:</strong> ${specialist}<br>
            <strong>Reason for Referral:</strong> ${reason}<br>
            <strong>Urgency Level:</strong> <span style="color: #c05621; font-weight: bold;">${urgency}</span>
          </div>
        `;
      }

      docConfirmModalBody.innerHTML = `
        <div style="background: #f8fafc; border-left: 4px solid var(--flag-green); padding: 12px; border-radius: 4px; margin-bottom: 15px;">
          <strong style="color: var(--flag-green); font-size: 0.88rem;">✓ PHYSICIAN EXPLICIT APPROVAL CONFIRMED</strong><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Signer: Dr. Rajesh Kumar, MD | Reg No: NMB-82741-A | National Medical Board Accredited
          </span>
        </div>

        <div style="font-size: 0.85rem; line-height: 1.6;">
          <strong>Diagnosis:</strong> ${diagnosis}<br>
          <strong>Clinical Notes:</strong> ${notes}<br>
          <strong>Assessment:</strong> ${assessment}<br>
          <strong>Treatment Plan:</strong> ${treatmentPlan}
        </div>

        ${detailsHTML}

        <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancel-confirm-btn" class="action-btn secondary" style="padding: 8px 16px;">Edit Details</button>
          <button id="final-issue-doc-btn" class="form-submit" style="width: auto; padding: 8px 20px; background: var(--flag-green);">
            Confirm & Issue Digitally Signed Document
          </button>
        </div>
      `;

      document.getElementById('cancel-confirm-btn').addEventListener('click', () => {
        docConfirmationModal.classList.remove('active');
      });

      document.getElementById('final-issue-doc-btn').addEventListener('click', () => {
        docConfirmationModal.classList.remove('active');

        doctorArchive.unshift({
          date: new Date().toISOString().split('T')[0],
          token: 'HWC-' + Math.floor(1000 + Math.random() * 9000),
          patientName: 'Ramesh Kumar',
          ageGender: '45 / Male',
          type: type,
          diagnosis: diagnosis,
          summary: summaryText
        });

        renderDoctorArchive();

        downloadDoctorSignedDocument(type, diagnosis, notes, assessment, treatmentPlan, summaryText);

        showToast(`✓ Clinical decision explicitly approved & signed by Dr. Rajesh Kumar!`);
      });

      docConfirmationModal.classList.add('active');
    }

    function renderDoctorArchive() {
      if (!doctorArchiveTableBody) return;
      doctorArchiveTableBody.innerHTML = '';
      doctorArchive.forEach(rec => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${rec.date}</td>
          <td style="font-family: monospace; font-weight: 700; color: var(--health-teal);">${rec.token}</td>
          <td><strong>${rec.patientName}</strong></td>
          <td>${rec.ageGender}</td>
          <td><span style="font-size: 0.8rem; color: var(--primary-navy);">${rec.diagnosis} (${rec.type.toUpperCase()})</span></td>
          <td>
            <button class="table-btn" style="background: var(--primary-navy);">
              <span class="material-icons-outlined" style="font-size: 14px;">description</span> View Document
            </button>
          </td>
        `;
        doctorArchiveTableBody.appendChild(tr);
      });
    }

    function downloadDoctorSignedDocument(type, diagnosis, notes, assessment, treatmentPlan, summaryText) {
      const today = new Date().toLocaleDateString('en-IN');
      const docHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SwasthyaSetu Signed Doctor ${type === 'prescription' ? 'e-Prescription' : 'Referral'}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; margin: 0; padding: 30px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f3b5f; padding-bottom: 15px; }
    .brand-name { font-size: 24px; font-weight: bold; color: #0f3b5f; }
    .card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin: 15px 0; }
    pre { background: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #10847e; color: white; padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Print / Download PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand-name">SwasthyaSetu Specialist Hub</div>
      <div style="font-size: 12px; color: #666;">Digitally Signed ${type === 'prescription' ? 'Medical Prescription' : 'Specialist Referral Order'}</div>
    </div>
    <div style="text-align: right; font-size: 11px;">
      Date: ${today}<br>
      Physician: Dr. Rajesh Kumar, MD<br>
      License Reg: NMB-82741-A
    </div>
  </div>

  <div class="card">
    <strong>Patient Name:</strong> Ramesh Kumar (45 Yrs / Male)<br>
    <strong>Diagnosis:</strong> ${diagnosis}<br>
    <strong>Clinical Notes:</strong> ${notes}<br>
    <strong>Assessment:</strong> ${assessment}<br>
    <strong>Treatment Plan:</strong> ${treatmentPlan}
  </div>

  <div class="card" style="border-left: 4px solid #10847e;">
    <h4 style="margin: 0 0 10px 0; color: #0f3b5f;">${type === 'prescription' ? 'Prescription / Medication Order (Rx)' : 'Specialist Referral Order'}</h4>
    <p style="margin: 0; font-size: 14px;">${summaryText}</p>
  </div>

  <div style="margin-top: 40px; text-align: right;">
    <div style="border-top: 1px solid #666; display: inline-block; padding-top: 5px; width: 220px; text-align: center; font-size: 12px;">
      Digitally Verified & Approved by<br>
      <strong>Dr. Rajesh Kumar, MD</strong><br>
      <span style="font-size: 10px; color: #888;">Explicit Approval Code: SWASTHYASETU-DOC-E-SIGN-99210</span>
    </div>
  </div>
</body>
</html>
      `;

      const blob = new Blob([docHTML], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `SwasthyaSetu_DoctorSigned_${type.toUpperCase()}_HWC-9281.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (docChatSendBtn && docChatInput) {
      const sendDocMsg = () => {
        const val = docChatInput.value.trim();
        if (val) {
          const msg = document.createElement('div');
          msg.className = 'chat-msg doctor';
          msg.textContent = `[Dr. Rajesh]: ${val}`;
          docChatMessages.appendChild(msg);
          docChatMessages.scrollTop = docChatMessages.scrollHeight;
          docChatInput.value = '';
        }
      };
      docChatSendBtn.addEventListener('click', sendDocMsg);
      docChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendDocMsg();
      });
    }
  }
}


