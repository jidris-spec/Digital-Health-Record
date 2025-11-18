// src/utils/activityStorage.js

const STORAGE_KEY = "activityLog";
const MAX_ITEMS = 50; // keep last 50 events

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse activity from storage", e);
    return [];
  }
}

function saveRaw(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Get all activity items (newest first).
 */
export function listActivity() {
  return loadRaw();
}

/**
 * Add a new activity item.
 * 
 * message is required.
 * 
 * Example:
 * addActivity({
 *   message: "New appointment for John Doe on 20 Nov, 10:00",
 *   type: "APPOINTMENT_CREATED",
 *   entityType: "appointment",
 *   entityId: someId,
 * });
 */
export function addActivity({
  message,
  type = null,
  entityType = null,
  entityId = null,
}) {
  if (!message) return listActivity();

  const items = loadRaw();

  const newItem = {
    id: crypto.randomUUID(),
    message,
    type,
    entityType,
    entityId,
    createdAt: Date.now(),
  };

  const updated = [newItem, ...items].slice(0, MAX_ITEMS);
  saveRaw(updated);
  return updated;
}

/**
 * Delete a single activity item by id.
 */
export function deleteActivity(id) {
  const items = loadRaw().filter((item) => item.id !== id);
  saveRaw(items);
  return items;
}

/**
 * Clear all activity items.
 */
export function clearActivity() {
  saveRaw([]);
  return [];
}
