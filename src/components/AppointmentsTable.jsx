// src/components/AppointmentsTable.jsx
import {
  Paper, Stack, Typography, Chip, Skeleton, Alert,
  Table, TableHead, TableBody, TableRow, TableCell,
  Tooltip, IconButton
} from "@mui/material";
import { CheckCircle, InfoOutlined, DeleteOutline } from "@mui/icons-material";

export default function AppointmentsTable({
  loading,
  appointments,
  requestDelete
}) {
  return (
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
  );
}
