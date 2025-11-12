// src/components/QuickAppointmentForm.jsx
import {
  Paper, Stack, Typography, Tooltip, Box,
  TextField, MenuItem, Button
} from "@mui/material";
import { AddCircleOutline, InfoOutlined } from "@mui/icons-material";

export default function QuickAppointmentForm({
  appt,
  errors,
  saving,
  hasErrors,
  onChange,
  onSubmit,
  patientOptions = []
}) {
  return (
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

      <Box component="form" onSubmit={onSubmit} noValidate>
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
          <MenuItem value="">— Choose —</MenuItem>
          {patientOptions.map((name) => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
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
            onClick={() => onChange("__reset__", null)}
          >
            Clear
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
