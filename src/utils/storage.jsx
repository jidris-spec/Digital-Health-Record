// src/utils/storage.js

// Load appointments from localStorage
export function loadAppts() {
  return read("appointments", []);
}

// Save appointments
export function saveAppts(appointments) {
  write("appointments", appointments);
}

// Load activity
export function loadActivity() {
  return read("activity", []);
}

// Save activity
export function saveActivity(activity) {
  write("activity", activity);
}

function read(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error("Error reading from storage:", e);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing to storage:", e);
  }
}
