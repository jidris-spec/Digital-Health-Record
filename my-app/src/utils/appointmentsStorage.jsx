// src/utils/appointmentsStorage.jsx

const STORAGE_KEY = "appointments";

function safeParse(json, fallback) {
  try {
    const val = JSON.parse(json);
    if (!Array.isArray(val)) return fallback;
    return val;
  } catch {
    return fallback;
  }
}

export function listAppointments() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function createAppointment({ patientId = null, patientName, dateTime, reason }) {
  const now = new Date().toISOString();
  const current = listAppointments();

  const newAppt = {
    id: crypto.randomUUID(),
    patientId,
    patientName,
    dateTime,          // "YYYY-MM-DDTHH:MM"
    reason,
    status: "upcoming", // lifecycle start
    createdAt: now,
    updatedAt: now,
  };

  const updated = [newAppt, ...current];
  persist(updated);
  return newAppt;
}

export function deleteAppointment(id) {
  const current = listAppointments();
  const updated = current.filter((a) => a.id !== id);
  persist(updated);
  return updated;
}

// 🔹 NEW: update status (upcoming → completed / cancelled)
export function updateAppointmentStatus(id, status) {
  const allowed = ["upcoming", "completed", "cancelled"];
  const normalized = (status || "").toLowerCase();
  if (!allowed.includes(normalized)) {
    console.warn("Invalid status:", status);
    return listAppointments();
  }

  const current = listAppointments();
  const now = new Date().toISOString();

  const updated = current.map((a) =>
    a.id === id
      ? { ...a, status: normalized, updatedAt: now }
      : a
  );

  persist(updated);
  return updated;
}
