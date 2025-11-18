// src/utils/labResultsStorage.js

const STORAGE_KEY = "labResults";

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse lab results from storage", e);
    return [];
  }
}

function saveRaw(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Get all lab results.
 */
export function listLabResults() {
  return loadRaw();
}

/**
 * Get lab results filtered by patientId.
 */
export function listLabResultsByPatient(patientId) {
  return loadRaw().filter((lab) => lab.patientId === patientId);
}

/**
 * Create a new lab result.
 * 
 * data should include:
 * - patientId
 * - patientName (for easy logging / UI)
 * - testName ("Blood Sugar (Fasting)")
 * - resultValue (number or string)
 * - unit ("mg/dL")
 * Optional:
 * - referenceRange ("70–110 mg/dL")
 * - appointmentId
 */
export function createLabResult(data) {
  if (!data || !data.patientId || !data.testName || data.resultValue == null) {
    throw new Error("Missing required lab result fields");
  }

  const now = Date.now();
  const items = loadRaw();

  const newLab = {
    id: crypto.randomUUID(),
    patientId: data.patientId,
    patientName: data.patientName || "",
    appointmentId: data.appointmentId || null,
    testName: data.testName,
    resultValue: data.resultValue,
    unit: data.unit || "",
    referenceRange: data.referenceRange || "",
    status: data.status || "final", // "pending" | "final" | "corrected"
    createdAt: now,
    updatedAt: now,
    isArchived: false,
  };

  const updated = [...items, newLab];
  saveRaw(updated);
  return newLab;
}

/**
 * Update an existing lab result.
 */
export function updateLabResult(id, updates) {
  const items = loadRaw();
  let updatedItem = null;

  const updated = items.map((lab) => {
    if (lab.id !== id) return lab;

    updatedItem = {
      ...lab,
      ...updates,
      updatedAt: Date.now(),
    };
    return updatedItem;
  });

  if (!updatedItem) {
    throw new Error(`Lab result with id ${id} not found`);
  }

  saveRaw(updated);
  return updatedItem;
}

/**
 * Archive a lab result instead of deleting it.
 */
export function archiveLabResult(id) {
  return updateLabResult(id, { isArchived: true });
}

/**
 * Hard delete a lab result.
 */
export function deleteLabResult(id) {
  const items = loadRaw();
  const updated = items.filter((lab) => lab.id !== id);
  saveRaw(updated);
  return updated;
}
