// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Dashboard/Navbar.jsx";
import KpiRow from "../components/Dashboard/KpiRow.jsx";
import QuickAppointmentForm from "../components/Dashboard/QuickAppointmentForm.jsx";
import AppointmentsTable from "../components/Dashboard/AppointmentsTable.jsx";
import RecentActivity from "../components/Dashboard/RecentActivity.jsx";

import {
  loadAppts,
  saveAppts,
  loadActivity,
  saveActivity,
  loadPatients,
} from "../utils/storage.jsx";

import {
  Container,
  Collapse,
  Alert,
  Snackbar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Stack,
  Button,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Dashboard() {
  // --- App state ---
  const [loading, setLoading] = useState(true);
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [labPatientId, setLabPatientId] = useState(""); // 👈 independent lab patient selector

  // Form state (appointments)
  const [appt, setAppt] = useState({ patient: "", date: "", reason: "" });

  // Data
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);

  // Load from localStorage (or seed once)
  useEffect(() => {
    const existingAppts = loadAppts();
    const existingAct = loadActivity();
    const existingPatients = loadPatients();

    if (existingPatients.length) {
      setPatients(existingPatients);
    }

    if (existingAppts.length || existingAct.length) {
      setAppointments(existingAppts);
      setActivity(existingAct);
      setLoading(false);
      return;
    }

    const seedAppts = [
      {
        id: 1,
        patient: "Jane Doe",
        date: "2025-11-10 10:30",
        status: "Scheduled",
      },
      {
        id: 2,
        patient: "John Smith",
        date: "2025-11-10 14:00",
        status: "Scheduled",
      },
    ];
    const seedAct = [
      {
        id: crypto.randomUUID(),
        text: "New lab result uploaded for Jane Doe",
        type: "lab",
        patientId: null,
        patientName: "Jane Doe",
      },
      {
        id: crypto.randomUUID(),
        text: "Appointment created with John Smith",
        type: "appt",
      },
    ];

    setAppointments(seedAppts);
    setActivity(seedAct);
    saveAppts(seedAppts);
    saveActivity(seedAct);
    setLoading(false);
  }, []);

  // 🔁 autosave
  useEffect(() => {
    if (!loading) saveAppts(appointments);
  }, [appointments, loading]);

  useEffect(() => {
    if (!loading) saveActivity(activity);
  }, [activity, loading]);

  // KPIs (dynamic)
  const kpis = useMemo(() => {
    const todayISO = new Date().toISOString().slice(0, 10);
    const isToday = (dateStr) => {
      if (!dateStr) return false;
      return dateStr.replace("T", " ").slice(0, 10) === todayISO;
    };

    const uniquePatients = new Set(
      patients
        .map((p) => (p.fullName || "").trim())
        .filter(Boolean)
    ).size;

    const todaysAppts = appointments.filter((a) => isToday(a.date)).length;
    const pendingLabs = activity.filter((x) => x.type === "lab").length;

    return { patients: uniquePatients, todaysAppts, pendingLabs };
  }, [patients, appointments, activity]);

  // Patient dropdown options (appointments form)
  const patientOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        patients
          .map((p) => (p.fullName || "").trim())
          .filter(Boolean)
      )
    );
    return names;
  }, [patients]);

  const hasPatients = patients.length > 0;

  // Validation
  const errors = useMemo(
    () => ({
      patient: appt.patient === "" ? "Select a patient" : "",
      date: appt.date === "" ? "Pick a date & time" : "",
      reason: appt.reason.length < 5 ? "At least 5 characters" : "",
    }),
    [appt]
  );

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  // Handlers
  function saveAppointment(e) {
    e.preventDefault();
    if (hasErrors) {
      setSavedMsg("Please fix the errors before saving.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newRow = {
        id: Math.max(0, ...appointments.map((a) => a.id)) + 1,
        patient: appt.patient,
        date: appt.date.replace("T", " "),
        status: "Scheduled",
      };
      setAppointments((prev) => [newRow, ...prev]);
      setActivity((prev) => [
        {
          id: crypto.randomUUID(),
          text: `Appointment created with ${appt.patient}`,
          type: "appt",
        },
        ...prev,
      ]);
      setSaving(false);
      setUnsaved(false);
      setSavedMsg("Appointment saved successfully");
      setAppt({ patient: "", date: "", reason: "" });
    }, 900);
  }

  function onChange(field, value) {
    if (field === "__reset__") {
      setAppt({ patient: "", date: "", reason: "" });
      setUnsaved(false);
      return;
    }
    setAppt((a) => ({ ...a, [field]: value }));
    setUnsaved(true);
  }

  function requestDelete(id) {
    setToDeleteId(id);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    setAppointments((prev) => prev.filter((a) => a.id !== toDeleteId));
    setActivity((prev) => [
      {
        id: crypto.randomUUID(),
        text: `Appointment deleted (#${toDeleteId})`,
        type: "warn",
      },
      ...prev,
    ]);
    setConfirmOpen(false);
    setToDeleteId(null);
  }

  // Labs UX — now linked via labPatientId, NOT the appointment form
  function addLabResult() {
    if (!labPatientId) {
      setSavedMsg("Select a patient for the lab result first.");
      return;
    }

    const selectedPatient = patients.find((p) => p.id === labPatientId);
    if (!selectedPatient) {
      setSavedMsg("Selected patient not found. Try again.");
      return;
    }

    const item = {
      id: crypto.randomUUID(),
      text: `New lab result uploaded for ${selectedPatient.fullName}`,
      type: "lab",
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      createdAt: new Date().toISOString(),
    };

    setActivity((prev) => [item, ...prev]);
  }

  function markLabReviewed(id) {
    setActivity((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <>
      {/* Dashboard = no breadcrumbs */}
      <Navbar />

      {/* Unsaved changes banner */}
      <Collapse in={unsaved}>
        <Alert
          severity="warning"
          sx={{ borderRadius: 0 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setUnsaved(false)}
            >
              Dismiss
            </Button>
          }
        >
          You have unsaved changes in the appointment form. Don’t forget to
          press <b>Save</b>.
        </Alert>
      </Collapse>

      {/* Linear progress while saving */}
      <Collapse in={saving}>
        <LinearProgress />
      </Collapse>

      <Container sx={{ py: 3 }}>
        <KpiRow loading={loading} kpis={kpis} />

        {/* Lab actions card with independent patient selector */}
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              select
              size="small"
              label="Lab patient"
              value={labPatientId}
              onChange={(e) => setLabPatientId(e.target.value)}
              sx={{ minWidth: 220 }}
              disabled={!hasPatients}
            >
              <MenuItem value="">Select patient</MenuItem>
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.fullName || "Unnamed patient"}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              color="success"
              onClick={addLabResult}
              disabled={!hasPatients}
            >
              + Add Lab Result
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              Link lab results directly to a patient. These will appear in their
              <b> Lab History</b> on the profile page and count toward Pending
              Labs.
            </Typography>
          </Stack>
        </Paper>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={5}>
            {!hasPatients && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No patients in the system yet. Go to{" "}
                <b>Patients → Add Patient</b> before creating appointments or lab
                results.
              </Alert>
            )}

            <QuickAppointmentForm
              appt={appt}
              errors={errors}
              saving={saving}
              hasErrors={hasErrors}
              onChange={onChange}
              onSubmit={saveAppointment}
              patientOptions={patientOptions}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <AppointmentsTable
              loading={loading}
              appointments={appointments}
              requestDelete={requestDelete}
            />
            <RecentActivity
              loading={loading}
              activity={activity}
              onMarkReviewed={markLabReviewed}
            />
          </Grid>
        </Grid>
      </Container>

      {/* “Saved!” microinteraction */}
      <Snackbar
        open={!!savedMsg}
        autoHideDuration={1800}
        onClose={() => setSavedMsg("")}
        message={savedMsg}
      />

      {/* Confirm delete dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete appointment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action can’t be undone. If this was a mistake, consider
            cancelling instead of deleting.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
