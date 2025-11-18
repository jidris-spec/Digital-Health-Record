// src/components/QuickAppointmentForm.jsx
import {
  Paper,
  Stack,
  Typography,
  Tooltip,
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { AddCircleOutline, InfoOutlined } from "@mui/icons-material";

export default function QuickAppointmentForm({
  appt,
  errors,
  saving,
  hasErrors,
  onChange,
  onSubmit,
  patientOptions = [],
}) {
  const saveDisabled = hasErrors || saving;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <AddCircleOutline color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Quick Appointment
        </Typography>
        <Tooltip
          title="Create a fast appointment. You can refine the details later in the patient’s chart."
          arrow
        >
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Fill in the key details now so the patient doesn’t get lost in the schedule.
      </Typography>

      <Box component="form" onSubmit={onSubmit} noValidate>
        <TextField
          select
          fullWidth
          label="Patient"
          value={appt.patient}
          onChange={(e) => onChange("patient", e.target.value)}
          margin="normal"
          helperText={errors.patient || "Select an existing patient from today’s list."}
          error={Boolean(errors.patient)}
        >
          <MenuItem value="">— Choose —</MenuItem>
          {patientOptions.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="datetime-local"
          label="Date & time"
          value={appt.date}
          onChange={(e) => onChange("date", e.target.value)}
          margin="normal"
          helperText={errors.date || "Pick when the appointment starts so nobody is double-booked."}
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
          helperText={errors.reason || "Write a short, clear reason so the doctor knows what to expect."}
          error={Boolean(errors.reason)}
        />

        <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: "center" }}>
          <Tooltip
            arrow
            title={
              saveDisabled
                ? "Fix the highlighted fields before saving the appointment."
                : "Save this appointment to the schedule."
            }
          >
            <span>
              {/* span so disabled button still shows tooltip */}
              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={saveDisabled}
              >
                {saving ? "Saving…" : "Save appointment"}
              </Button>
            </span>
          </Tooltip>

          <Tooltip arrow title="Clear all fields and start over.">
            <Button variant="text" onClick={() => onChange("__reset__", null)}>
              Clear
            </Button>
          </Tooltip>
        </Stack>

        {hasErrors && !saving && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: "block", mt: 1 }}
          >
            Some fields are incomplete or invalid. Fix the ones in red before saving.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
