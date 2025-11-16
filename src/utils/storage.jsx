// src/utils/storage.jsx

// --- Appointments storage ---
const APPTS_KEY = "dh_appointments";

export function loadAppts() {
  try {
    return JSON.parse(localStorage.getItem(APPTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveAppts(list) {
  localStorage.setItem(APPTS_KEY, JSON.stringify(list));
}

// --- Activity storage ---
const ACTIVITY_KEY = "dh_activity";

export function loadActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveActivity(list) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list));
}

// --- Patients storage ---
const PATIENTS_KEY = "dh_patients";

export function loadPatients() {
  try {
    return JSON.parse(localStorage.getItem(PATIENTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function savePatients(list) {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(list));
}
