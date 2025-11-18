// src/utils/patientsStorage.jsx

const STORAGE_KEY = "patients";

function safeParse(json, fallback) {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

// 🔹 Read all patients
export function listPatients() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

// internal helper to persist
function savePatients(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

// 🔹 Create a new patient and return it
export function createPatient(patientData) {
  const now = new Date().toISOString();
  const current = listPatients();

  const newPatient = {
    id: crypto.randomUUID(),
    fullName: patientData.fullName || "",
    dob: patientData.dob || "",
    gender: patientData.gender || "",
    phone: patientData.phone || "",
    email: patientData.email || "",
    address: patientData.address || "",
    notes: patientData.notes || "",
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newPatient, ...current];
  savePatients(updated);
  return newPatient;
}

// 🔹 Update an existing patient and return the full updated list
export function updatePatient(id, updates) {
  const now = new Date().toISOString();
  const current = listPatients();

  const updated = current.map((p) =>
    p.id === id
      ? {
          ...p,
          ...updates,
          updatedAt: now,
        }
      : p
  );

  savePatients(updated);
  return updated;
}
