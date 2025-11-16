// src/pages/AddPatient.jsx
import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Snackbar,
} from "@mui/material";
import Navbar from "../components/Dashboard/Navbar.jsx";
import { loadPatients, savePatients } from "../utils/storage.jsx";

export default function AddPatient() {
  const [patient, setPatient] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function onChange(field, value) {
    setPatient((p) => ({ ...p, [field]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (!patient.fullName || !patient.dob || !patient.gender) {
      setMessage("Name, date of birth and gender are required.");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const list = loadPatients();
      const newPatient = {
        ...patient,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      savePatients([newPatient, ...list]);
      setSaving(false);
      setMessage("Patient added successfully");

      // reset form
      setPatient({
        fullName: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
    }, 700);
  }

  return (
    <>
      
      <Navbar breadcrumbs={["Dashboard", "Patients", "Add Patient"]} />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Add New Patient
          </Typography>

          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              label="Full Name"
              fullWidth
              value={patient.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              required
            />

            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={patient.dob}
              onChange={(e) => onChange("dob", e.target.value)}
              required
            />

            <TextField
              select
              label="Gender"
              fullWidth
              value={patient.gender}
              onChange={(e) => onChange("gender", e.target.value)}
              required
            >
              <MenuItem value="">— Select —</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <TextField
              label="Phone Number"
              fullWidth
              value={patient.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />

            <TextField
              label="Email"
              fullWidth
              value={patient.email}
              onChange={(e) => onChange("email", e.target.value)}
            />

            <TextField
              label="Address"
              fullWidth
              value={patient.address}
              onChange={(e) => onChange("address", e.target.value)}
            />

            <TextField
              label="Notes"
              fullWidth
              multiline
              minRows={2}
              value={patient.notes}
              onChange={(e) => onChange("notes", e.target.value)}
            />

            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving…" : "Add Patient"}
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Snackbar
        open={!!message}
        autoHideDuration={1800}
        onClose={() => setMessage("")}
        message={message}
      />
    </>
  );
}
