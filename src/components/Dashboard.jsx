import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, IconButton, Container, Grid, Paper,
  Box, Tooltip, Alert, Collapse, Button, TextField, MenuItem,
  Snackbar, LinearProgress, List, ListItem, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Chip, Stack, Skeleton, Table, TableBody, TableCell, TableHead, TableRow,
  Zoom
} from "@mui/material";
import {
  Logout, InfoOutlined, CheckCircle, WarningAmber, AddCircleOutline,
  DeleteOutline, Event, Science, People
} from "@mui/icons-material";
import { auth } from "../auth"; // ← from earlier step

// --- Small, self-contained KPI Card component ---
function KpiCard({ icon, label, value, tooltip, color = "primary" }) {
  return (
    <Tooltip title={tooltip} TransitionComponent={Zoom} arrow>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: (t) => t.palette[color].light,
              color: (t) => t.palette[color].contrastText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Tooltip>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // --- Micro “app state” for demo purposes ---
  const [loading, setLoading] = useState(true);
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Form state (simple, no lib to keep it beginner-friendly)
  const [appt, setAppt] = useState({
    patient: "",
    date: "",
    reason: "",
  });

  // Mock data
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);

  // Simulate initial loading (skeletons)
  useEffect(() => {
    const t = setTimeout(() => {
      setAppointments([
        { id: 1, patient: "Jane Doe", date: "2025-11-10 10:30", status: "Scheduled" },
        { id: 2, patient: "John Smith", date: "2025-11-10 14:00", status: "Scheduled" },
      ]);
      setActivity([
        { id: "a1", text: "New lab result uploaded for Jane Doe", type: "lab" },
        { id: "a2", text: "Appointment created with John Smith", type: "appt" },
      ]);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const kpis = useMemo(() => ({
    patients: 24,
    todaysAppts: appointments.length,
    pendingLabs: 3,
  }), [appointments.length]);

  // Basic validation helpers
  const errors = {
    patient: appt.patient === "" ? "Select a patient" : "",
    date: appt.date === "" ? "Pick a date & time" : "",
    reason: appt.reason.length < 5 ? "At least 5 characters" : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  function handleLogout() {
    auth.logout();
    navigate("/", { replace: true });
  }

  // Save appointment (mock) with microinteractions
  function saveAppointment(e) {
    e.preventDefault();
    if (hasErrors) return;

    setSaving(true);
    setTimeout(() => {
      const newRow = {
        id: Math.max(0, ...appointments.map(a => a.id)) + 1,
        patient: appt.patient,
        date: appt.date.replace("T", " "),
        status: "Scheduled",
      };
      setAppointments(prev => [newRow, ...prev]);
      setActivity(prev => [
        { id: crypto.randomUUID(), text: `Appointment created with ${appt.patient}`, type: "appt" },
        ...prev,
      ]);
      setSaving(false);
      setUnsaved(false);
      setSavedMsg("Appointment saved successfully");
      setAppt({ patient: "", date: "", reason: "" });
    }, 900);
  }

  function onChange(field, value) {
    setAppt(a => ({ ...a, [field]: value }));
    setUnsaved(true);
  }

  // Delete with confirm dialog
  function requestDelete(id) {
    setToDeleteId(id);
    setConfirmOpen(true);
  }
  function confirmDelete() {
    setAppointments(prev => prev.filter(a => a.id !== toDeleteId));
    setActivity(prev => [
      { id: crypto.randomUUID(), text: `Appointment deleted (#${toDeleteId})`, type: "warn" },
      ...prev,
    ]);
    setConfirmOpen(false);
    setToDeleteId(null);
  }

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Welcome To Digital Health Record
          </Typography>

          <Tooltip title="Sign out" arrow>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Unsaved changes banner */}
      <Collapse in={unsaved}>
        <Alert
          severity="warning"
          icon={<WarningAmber />}
          sx={{ borderRadius: 0 }}
          action={
            <Button color="inherit" size="small" onClick={() => setUnsaved(false)}>
              Dismiss
            </Button>
          }
        >
          You have unsaved changes. Don’t forget to press <b>Save</b>.
        </Alert>
      </Collapse>

      {/* Linear progress while saving */}
      <Collapse in={saving}>
        <LinearProgress />
      </Collapse>

      <Container sx={{ py: 3 }}>
        {/* KPI Row */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={92} />
            ) : (
              <KpiCard
                icon={<People />}
                label="Patients"
                value={kpis.patients}
                tooltip="Total patients in your panel"
                color="secondary"
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={92} />
            ) : (
              <KpiCard
                icon={<Event />}
                label="Today’s Appointments"
                value={kpis.todaysAppts}
                tooltip="Appointments scheduled for today"
                color="primary"
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={92} />
            ) : (
              <KpiCard
                icon={<Science />}
                label="Pending Labs"
                value={kpis.pendingLabs}
                tooltip="Lab results awaiting review"
                color="success"
              />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Left: Quick Appointment */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <AddCircleOutline color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Quick Appointment
                </Typography>
                <Tooltip
                  title="Create a fast appointment. You can edit details later in the patient’s chart."
                  arrow
                >
                  <InfoOutlined fontSize="small" color="action" />
                </Tooltip>
              </Stack>

              <Box component="form" onSubmit={saveAppointment} noValidate>
                <TextField
                  select
                  fullWidth
                  label="Patient"
                  value={appt.patient}
                  onChange={(e) => onChange("patient", e.target.value)}
                  margin="normal"
                  helperText={errors.patient || "Select an existing patient"}
                  error={Boolean(errors.patient)}
                >
                  {/* In real app, fetch patients. For now: */}
                  <MenuItem value="">— Choose —</MenuItem>
                  <MenuItem value="Jane Doe">Jane Doe</MenuItem>
                  <MenuItem value="John Smith">John Smith</MenuItem>
                  <MenuItem value="Alex Popescu">Alex Popescu</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date & time"
                  value={appt.date}
                  onChange={(e) => onChange("date", e.target.value)}
                  margin="normal"
                  helperText={errors.date || "Pick when the appointment starts"}
                  error={Boolean(errors.date)}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Reason"
                  value={appt.reason}
                  onChange={(e) => onChange("reason", e.target.value)}
                  margin="normal"
                  placeholder="e.g., Follow-up for lab results"
                  helperText={errors.reason || "Be brief but clear"}
                  error={Boolean(errors.reason)}
                />

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={hasErrors || saving}
                  >
                    {saving ? "Saving…" : "Save appointment"}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setAppt({ patient: "", date: "", reason: "" });
                      setUnsaved(false);
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* Right: Appointments table */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Today’s Appointments
                </Typography>
                <Chip
                  label={`${appointments.length}`}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Stack>

              {loading ? (
                <>
                  <Skeleton height={36} />
                  <Skeleton height={36} />
                  <Skeleton height={36} />
                </>
              ) : appointments.length === 0 ? (
                <Alert severity="info" icon={<InfoOutlined />}>
                  No appointments yet. Use <b>Quick Appointment</b> to add one.
                </Alert>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.patient}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={row.status === "Scheduled" ? "success" : "default"}
                            size="small"
                            icon={<CheckCircle fontSize="small" />}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete appointment" arrow>
                            <IconButton
                              color="error"
                              onClick={() => requestDelete(row.id)}
                              size="small"
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>

            {/* Recent Activity */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Activity
                </Typography>
              </Stack>
              {loading ? (
                <>
                  <Skeleton height={24} />
                  <Skeleton height={24} />
                </>
              ) : activity.length === 0 ? (
                <Alert severity="info" icon={<InfoOutlined />}>
                  Nothing here yet. Actions you take will appear as an activity log.
                </Alert>
              ) : (
                <List dense>
                  {activity.map((item, idx) => (
                    <Box key={item.id}>
                      <ListItem>
                        <ListItemText
                          primary={item.text}
                          secondary={
                            item.type === "lab" ? "Lab update" :
                            item.type === "warn" ? "System" :
                            "Appointment"
                          }
                        />
                      </ListItem>
                      {idx < activity.length - 1 && <Divider component="li" />}
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
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
            This action can’t be undone. If this was a mistake, consider cancelling instead of deleting.
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
