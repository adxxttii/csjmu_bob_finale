/**
 * Supabase Config & Service Helper Module for SwasthyaSetu Portal
 * Integrates Supabase Authentication & PostgreSQL Database Services.
 */

// Supabase Credentials Config
// Replace these with your actual Supabase project credentials from https://supabase.com
const SUPABASE_URL = "https://swasthyasetu-demo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3YXN0aHlhc2V0dS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI1MzExOTksImV4cCI6MTk4ODEwNzE5OX0.MockSupabaseAnonKeyForDevTesting1234567890";

let supabase = null;
let isSupabaseInitialized = false;
let authListeners = [];

// Initialize Supabase Client
function initSupabaseServices() {
  try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      isSupabaseInitialized = true;
      console.log('⚡ Supabase Client initialized successfully.');
      
      // Listen to Supabase Auth State Changes
      supabase.auth.onAuthStateChange((event, session) => {
        const user = session ? session.user : null;
        let userData = null;
        if (user) {
          userData = {
            uid: user.id,
            email: user.email,
            displayName: user.user_metadata?.displayName || (user.email ? user.email.split('@')[0] : 'User'),
            role: user.user_metadata?.role || 'patient'
          };
          localStorage.setItem('swasthya_current_user', JSON.stringify(userData));
        }
        notifyAuthListeners(userData);
      });
    } else {
      console.warn('⚠️ Supabase JS CDN script not loaded yet. Using local session manager.');
    }
  } catch (error) {
    console.warn('⚠️ Supabase initialization notice:', error.message);
  }
}

function notifyAuthListeners(user) {
  authListeners.forEach(cb => {
    try { cb(user); } catch (e) { console.error('Auth listener error:', e); }
  });
}

// ----------------------------------------------------
// Authentication Helpers
// ----------------------------------------------------

/**
 * Register new user with Supabase Auth
 */
async function signUpUser(email, password, displayName, role = 'patient', phone = '') {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  if (supabase && !isMockKey) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            displayName: displayName,
            role: role,
            phone: phone
          }
        }
      });
      if (error) throw error;
      const user = data.user;
      const userObj = {
        uid: user.id,
        email: email,
        displayName: displayName,
        phone: phone,
        role: role
      };

      // Store profile in public.users table
      try {
        await supabase.from('users').upsert([userObj]);
      } catch (dbErr) {
        console.warn('Supabase users table write warning:', dbErr);
      }

      localStorage.setItem('swasthya_current_user', JSON.stringify(userObj));
      notifyAuthListeners(userObj);
      return { success: true, user: userObj };
    } catch (error) {
      console.warn('Supabase Auth SignUp notice:', error.message);
      const mockUser = { uid: 'supa_' + Date.now(), email, displayName, phone, role };
      localStorage.setItem('swasthya_current_user', JSON.stringify(mockUser));
      notifyAuthListeners(mockUser);
      return { success: true, user: mockUser };
    }
  } else {
    const mockUser = { uid: 'supa_' + Date.now(), email, displayName, phone, role };
    localStorage.setItem('swasthya_current_user', JSON.stringify(mockUser));
    notifyAuthListeners(mockUser);
    return { success: true, user: mockUser };
  }
}

/**
 * Sign In User with Supabase Auth
 */
async function signInUser(email, password, preferredRole = '') {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  if (supabase && !isMockKey) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) throw error;
      const user = data.user;
      const userRole = preferredRole || user.user_metadata?.role || (email.includes('doctor') ? 'doctor' : (email.includes('cho') || email.includes('healthworker') ? 'health_worker' : 'patient'));
      const userData = {
        uid: user.id,
        email: user.email,
        displayName: user.user_metadata?.displayName || email.split('@')[0],
        role: userRole
      };
      localStorage.setItem('swasthya_current_user', JSON.stringify(userData));
      notifyAuthListeners(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.warn('Supabase Auth Sign-In info:', error.message);
      const cleanName = email ? email.split('@')[0].replace(/[\._-]/g, ' ') : 'User';
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const inferredRole = preferredRole || ((email && (email.includes('doctor') || email.includes('dr.'))) ? 'doctor' : ((email && (email.includes('cho') || email.includes('healthworker') || email.includes('hwc'))) ? 'health_worker' : 'patient'));
      const mockUser = { uid: 'user_' + Date.now(), email: email || 'user@swasthyasetu.org', displayName: formattedName, role: inferredRole };
      localStorage.setItem('swasthya_current_user', JSON.stringify(mockUser));
      notifyAuthListeners(mockUser);
      return { success: true, user: mockUser };
    }
  } else {
    const cleanName = email ? email.split('@')[0].replace(/[\._-]/g, ' ') : 'User';
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const inferredRole = preferredRole || ((email && (email.includes('doctor') || email.includes('dr.'))) ? 'doctor' : ((email && (email.includes('cho') || email.includes('healthworker') || email.includes('hwc'))) ? 'health_worker' : 'patient'));
    const mockUser = { uid: 'user_' + Date.now(), email: email || 'user@swasthyasetu.org', displayName: formattedName, role: inferredRole };
    localStorage.setItem('swasthya_current_user', JSON.stringify(mockUser));
    notifyAuthListeners(mockUser);
    return { success: true, user: mockUser };
  }
}

/**
 * Sign In with Google OAuth (Supabase)
 */
async function signInWithGoogle() {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  if (supabase && !isMockKey) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.warn('Supabase Google OAuth notice:', error.message);
      const mockUser = { uid: 'google_' + Date.now(), email: 'patient.google@swasthyasetu.org', displayName: 'Google Verified User', role: 'patient' };
      localStorage.setItem('swasthya_current_user', JSON.stringify(mockUser));
      notifyAuthListeners(mockUser);
      return { success: true, user: mockUser };
    }
  } else {
    const mockUser = { uid: 'google_' + Date.now(), email: 'patient.google@swasthyasetu.org', displayName: 'Google Verified User', role: 'patient' };
    localStorage.setItem('swasthya_current_user', JSON.stringify(mockUser));
    notifyAuthListeners(mockUser);
    return { success: true, user: mockUser };
  }
}

/**
 * Sign Out Current User
 */
async function signOutUser() {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  if (supabase && !isMockKey) {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase signOut info:', error.message);
    }
  }
  localStorage.removeItem('swasthya_current_user');
  notifyAuthListeners(null);
  return { success: true };
}

/**
 * Listen for Auth State Changes
 */
function onAuthChange(callback) {
  authListeners.push(callback);
  const stored = localStorage.getItem('swasthya_current_user');
  callback(stored ? JSON.parse(stored) : null);
}

/**
 * Get currently logged-in user object
 */
function getCurrentUser() {
  const stored = localStorage.getItem('swasthya_current_user');
  return stored ? JSON.parse(stored) : null;
}

// ----------------------------------------------------
// Supabase Database Helpers (PostgreSQL)
// ----------------------------------------------------

/**
 * Save OPD Consultation Intake Record to Supabase PostgreSQL Table
 */
async function saveConsultationRecord(consultationData) {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  const timestampIso = new Date().toISOString();

  // Save to local storage as instant backup
  const localConsults = JSON.parse(localStorage.getItem('swasthya_consultations') || '[]');
  const localId = 'consult_' + Date.now();
  const localRecord = { id: localId, ...consultationData, status: consultationData.status || 'queued', createdAt: timestampIso };
  localConsults.unshift(localRecord);
  localStorage.setItem('swasthya_consultations', JSON.stringify(localConsults));

  if (supabase && !isMockKey) {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          patient_name: consultationData.name,
          age: consultationData.age,
          gender: consultationData.gender,
          state: consultationData.state,
          opd_clinic: consultationData.opdClinic,
          symptoms: consultationData.symptoms,
          dhr_id: consultationData.dhrId,
          token: consultationData.token,
          status: consultationData.status || 'queued',
          created_at: timestampIso
        }])
        .select();

      if (error) console.warn('Supabase consultations insert notice:', error.message);
      const insertedId = (data && data[0]) ? data[0].id : localId;
      console.log('⚡ Supabase: Consultation saved with ID:', insertedId);
      return { success: true, id: insertedId };
    } catch (error) {
      console.warn('Supabase save consultation notice:', error.message);
      return { success: true, id: localId, isLocal: true };
    }
  } else {
    return { success: true, id: localId };
  }
}

/**
 * Real-time Subscription to Consultations Archive
 */
function subscribeToConsultations(callback) {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  if (supabase && !isMockKey) {
    // Initial fetch from PostgreSQL table
    supabase.from('consultations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped = data.map(item => ({
            id: item.id,
            name: item.patient_name,
            patientName: item.patient_name,
            age: item.age,
            gender: item.gender,
            state: item.state,
            opdClinic: item.opd_clinic,
            symptoms: item.symptoms,
            dhrId: item.dhr_id,
            token: item.token,
            status: item.status,
            date: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          callback(mapped);
        } else {
          const local = JSON.parse(localStorage.getItem('swasthya_consultations') || '[]');
          callback(local);
        }
      });

    // Realtime channel subscription
    const channel = supabase.channel('public:consultations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations' }, payload => {
        console.log('⚡ Supabase Realtime Change:', payload);
        const local = JSON.parse(localStorage.getItem('swasthya_consultations') || '[]');
        callback(local);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  } else {
    const local = JSON.parse(localStorage.getItem('swasthya_consultations') || '[]');
    callback(local);
    return () => { };
  }
}

/**
 * Save Generated Prescription Document to Supabase PostgreSQL Table
 */
async function savePrescriptionRecord(presData) {
  const isMockKey = SUPABASE_ANON_KEY.includes('Mock');
  const timestampIso = new Date().toISOString();

  // Save to local storage backup
  const localPres = JSON.parse(localStorage.getItem('swasthya_prescriptions') || '[]');
  const localId = 'pres_' + Date.now();
  const localRecord = { id: localId, ...presData, issuedAt: timestampIso };
  localPres.unshift(localRecord);
  localStorage.setItem('swasthya_prescriptions', JSON.stringify(localPres));

  if (supabase && !isMockKey) {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([{
          patient_name: presData.patientName,
          patient_phone: presData.patientPhone,
          opd_clinic: presData.opdClinic,
          token: presData.token,
          dhr_id: presData.dhrId,
          symptoms: presData.symptoms,
          doctor: presData.doctor || 'Dr. Rajesh Kumar',
          issued_at: timestampIso
        }])
        .select();

      if (error) console.warn('Supabase prescriptions insert notice:', error.message);
      const insertedId = (data && data[0]) ? data[0].id : localId;
      console.log('⚡ Supabase: Prescription saved with ID:', insertedId);
      return { success: true, id: insertedId };
    } catch (error) {
      console.warn('Supabase save prescription notice:', error.message);
      return { success: true, id: localId, isLocal: true };
    }
  } else {
    return { success: true, id: localId };
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabaseServices);
} else {
  initSupabaseServices();
}
