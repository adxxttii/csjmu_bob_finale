/**
 * gemini-llm.js
 * Thin wrapper around the Google Gemini REST API (gemini-2.0-flash).
 * Exposes:
 *   GeminiLLM.chat(history, userMessage)         → string (text reply)
 *   GeminiLLM.analyze(prompt)                    → string (text reply)
 *   GeminiLLM.analyzeImage(base64DataUrl, prompt)→ string (vision reply)
 *
 * API key is read from window.GEMINI_API_KEY (set in index.html before this script loads).
 */

const GeminiLLM = (() => {
  // Default model — overridden at runtime by _setModel() when the user picks in the UI
  let _model = 'gemini-2.5-flash-preview-05-20';
  const BASE  = 'https://generativelanguage.googleapis.com/v1beta/models';

  /** Called by the Gemini key modal save handler to switch models at runtime. */
  function _setModel(newModel) {
    if (newModel && typeof newModel === 'string') _model = newModel;
  }

  /** Returns the currently active model, falling back to localStorage then default. */
  function activeModel() {
    return window.GEMINI_MODEL
      || localStorage.getItem('swasthya_gemini_model')
      || _model;
  }

  function apiKey() {
    // Accept from window global (set by modal) OR directly from localStorage
    const k = window.GEMINI_API_KEY || localStorage.getItem('swasthya_gemini_api_key');
    if (!k) throw new Error('GeminiLLM: No Gemini API key found. Please configure it in the AI settings modal.');
    return k;
  }

  /**
   * Convert a simple [{role, text}] history array and a new user message
   * into the Gemini "contents" format, then POST and return the model reply.
   *
   * @param {Array<{role:'user'|'model', text:string}>} history  Prior turns (may be empty)
   * @param {string} userMessage                                  New user turn
   * @returns {Promise<string>}
   */
  async function chat(history, userMessage) {
    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    return await _post(contents);
  }

  /**
   * Single-turn text-only prompt.
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async function analyze(prompt) {
    const contents = [{ role: 'user', parts: [{ text: prompt }] }];
    return await _post(contents);
  }

  /**
   * Single-turn vision + text prompt.
   * @param {string} base64DataUrl   Full data-URL (e.g. "data:image/jpeg;base64,...")
   * @param {string} prompt          Text instruction
   * @returns {Promise<string>}
   */
  async function analyzeImage(base64DataUrl, prompt) {
    // Strip the data-url prefix to get raw base64 + mime type
    const match = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error('GeminiLLM.analyzeImage: invalid data URL');
    const mimeType  = match[1];
    const base64Data = match[2];

    const contents = [{
      role: 'user',
      parts: [
        { inline_data: { mime_type: mimeType, data: base64Data } },
        { text: prompt }
      ]
    }];
    return await _post(contents);
  }

  /**
   * Internal POST helper.
   */
  async function _post(contents) {
    const url = `${BASE}/${activeModel()}:generateContent?key=${apiKey()}`;
    const body = {
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GeminiLLM API error ${res.status}: ${errText}`);
    }

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('GeminiLLM: empty response from API');
    return text.trim();
  }

  // ─── Shared system prompts ───────────────────────────────────────────────────

  /**
   * Build the system preamble for Dr. Rajesh Kumar (OPD mode).
   */
  function doctorOPDSystem(patientName, age, gender, symptoms) {
    return `You are Dr. Rajesh Kumar, a licensed General Physician at SwasthyaSetu Telehealth OPD.
You are conducting a live video consultation in India.
Patient: ${patientName || 'Unknown'}, ${age || '?'}y/${gender || 'Unknown'}.
Reported symptoms: ${symptoms || 'Not specified'}.
Rules:
- Speak in a warm, professional, reassuring tone.
- Keep each reply to 2-4 sentences max.
- Do NOT prescribe controlled substances.
- Always remind the patient to end the call when done.
- This is a prototype/demo; include a disclaimer only if patient seems to misunderstand.`;
  }

  /**
   * Build the system preamble for Dr. Rajesh Kumar (HWC Spoke-to-Hub mode).
   */
  function doctorHWCSystem(session) {
    const s = session || {};
    return `You are Dr. Rajesh Kumar, a Specialist Hub Physician at SwasthyaSetu AB-HWC Telehealth.
You are consulting with a Community Health Officer (CHO) at a rural spoke.
Patient: ${s.name || 'Unknown'}, ${s.age || '?'}y/${s.gender || 'Unknown'}.
Vitals: Temp ${s.temp}°F, Pulse ${s.pulse} BPM, BP ${s.bp}, SpO2 ${s.spo2}%.
Symptoms: ${s.symptoms || 'Not yet reported'}.
Rules:
- Address the health worker, NOT the patient directly.
- Keep replies to 3-5 sentences.
- Give practical, actionable clinical guidance.
- This is a SwasthyaSetu simulation; do not reference real hospitals.`;
  }

  // ─── High-level application helpers ─────────────────────────────────────────

  /**
   * Get the opening greeting from the OPD doctor.
   */
  async function opdDoctorGreeting(patientName, age, gender, symptoms) {
    const system = doctorOPDSystem(patientName, age, gender, symptoms);
    return await chat(
      [{ role: 'user', text: system }],
      `Greet the patient by name and acknowledge their symptoms. Ask one clarifying question.`
    );
  }

  /**
   * Get an OPD doctor reply to a patient message.
   * @param {Array<{role, text}>} history  Full chat history so far
   * @param {string} userMsg               Latest patient message
   */
  async function opdDoctorReply(history, userMsg) {
    return await chat(history, userMsg);
  }

  /**
   * Generate a clinical AI triage report from vitals + symptoms text.
   */
  async function hwcTriageAnalysis(vitals, symptoms, structuredExam) {
    const prompt = `You are a clinical AI triage assistant for SwasthyaSetu AB-HWC rural telehealth.

PATIENT VITALS:
- Temperature: ${vitals.temp}°F
- Pulse: ${vitals.pulse} BPM
- Blood Pressure: ${vitals.bp} mmHg
- SpO2: ${vitals.spo2}%

CHIEF SYMPTOMS: ${symptoms}

STRUCTURED INJURY EXAMINATION:
- Injury Type: ${structuredExam.type}
- Body Part: ${structuredExam.body}
- Pain Scale: ${structuredExam.pain}
- Bleeding Status: ${structuredExam.bleed}
- Swelling: ${structuredExam.swell}
- Wound Depth: ${structuredExam.depth}
- Burn Degree: ${structuredExam.burn}
- Time Since Injury: ${structuredExam.time}

Task: Provide an emergency triage assessment in the following JSON format only. No other text.
{
  "riskLevel": "CRITICAL" | "URGENT" | "STABLE",
  "triageRationale": "One-sentence clinical rationale",
  "xaiReasons": ["Reason 1", "Reason 2", "Reason 3"],
  "aiSummaryBullets": "Short clinical summary paragraph"
}`;
    const raw = await analyze(prompt);
    // Extract JSON from response (model may wrap it in markdown fences)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Triage response parse error: ' + raw);
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Vision-based wound/injury assessment.
   * @param {string} base64DataUrl  Image data URL
   * @param {string} injuryType     Selected injury type from dropdown
   */
  async function hwcWoundVisionAnalysis(base64DataUrl, injuryType) {
    const prompt = `You are an expert clinical imaging and wound assessment AI for SwasthyaSetu rural telehealth (India).
The health worker has selected injury type: "${injuryType}".

IMPORTANT INSTRUCTIONS:
1. If the image is an X-RAY or radiograph, perform radiological analysis:
   - Identify any fractures, dislocations, bone abnormalities, or joint pathology
   - Specify the EXACT bone and anatomical region affected (e.g. "Fracture of proximal phalanx of ring finger")
   - Note fracture type (transverse, oblique, comminuted, greenstick, spiral etc.)
   - Note displacement, angulation, or soft tissue swelling if visible
   - The "infection" field should describe "Bone integrity status & soft tissue findings"

2. If the image is a WOUND/SKIN photo, perform wound assessment:
   - Describe wound type, size, depth, bleeding, color, edges
   - Assess infection risk

For BOTH types, return ONLY a valid JSON object with these exact keys:
{
  "injury": "Precise medical description of the injury or finding",
  "location": "Exact anatomical location (be specific — name the bone, finger, region)",
  "findings": "Detailed visible clinical or radiological findings",
  "severity": "🔴 High Severity | 🟡 Moderate Severity | 🟢 Low Severity",
  "infection": "Infection risk OR bone integrity & soft tissue assessment",
  "urgency": "Clinical urgency and recommended action for the health worker",
  "confidence": "Assessment Reliability: High | Moderate | Low"
}
No explanation, no markdown. Return only the JSON object.`;
    const raw = await analyzeImage(base64DataUrl, prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Wound vision response parse error: ' + raw);
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Generate a dynamic OPD prescription based on actual patient symptoms.
   */
  async function opdGeneratePrescription(patientName, age, gender, symptoms) {
    const prompt = `You are Dr. Rajesh Kumar, MD, General Medicine, SwasthyaSetu Telehealth India.
Patient: ${patientName}, ${age}y/${gender}.
Symptoms reported: ${symptoms}

Write a realistic, safe, evidence-based Indian outpatient e-prescription in this EXACT JSON format only:
{
  "diagnosis": "One-line ICD diagnosis",
  "medicines": [
    {"name": "Medicine name + strength", "dosage": "Dose & timing", "duration": "Days"},
    {"name": "...", "dosage": "...", "duration": "..."}
  ],
  "generalAdvice": ["Advice point 1", "Advice point 2", "Advice point 3"]
}
Use only generic medicines available in India. Max 4 medicines. No controlled substances. Only JSON.`;
    const raw = await analyze(prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Prescription response parse error: ' + raw);
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * HWC doctor (hub specialist) reply to a health worker chat message.
   */
  async function hwcDoctorReply(session, workerMessage) {
    const system = doctorHWCSystem(session);
    return await chat(
      [{ role: 'user', text: system }, { role: 'model', text: 'Understood. I am ready to assist.' }],
      workerMessage
    );
  }

  return {
    chat,
    analyze,
    analyzeImage,
    opdDoctorGreeting,
    opdDoctorReply,
    hwcTriageAnalysis,
    hwcWoundVisionAnalysis,
    opdGeneratePrescription,
    hwcDoctorReply,
    _setModel,
    activeModel
  };
})();
