import {
  Paper, Stack, Typography, Chip, Skeleton, Alert,
  Table, TableHead, TableBody, TableRow, TableCell,
  Tooltip, IconButton, Box
} from "@mui/material";
import { CheckCircle, InfoOutlined, DeleteOutline } from "@mui/icons-material";

export default function AppointmentsTable({
  loading,
  appointments,
  requestDelete
}) {
  function formatDate(str) {
    try {
      const d = new Date(str.replace(" ", "T"));
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return str;
    }
  }

  // Better status color system
  function statusChip(status) {
    const map = {
      Scheduled: { color: "success", label: "Scheduled" },
      Pending: { color: "warning", label: "Pending" },
      Completed: { color: "default", label: "Completed" },
      Cancelled: { color: "error", label: "Cancelled" },
    };

    const item = map[status] || map["Scheduled"];

    return (
      <Tooltip title={`Status: ${item.label}`} arrow>
        <Chip
          label={item.label}
          color={item.color}
          size="small"
          icon={<CheckCircle fontSize="small" />}
        />
      </Tooltip>
    );
  }

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
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Alert severity="info" icon={<InfoOutlined />}>
                    No appointments yet. Use <b>Quick Appointment</b> to add one.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: "rgba(67, 56, 202, 0.08)",
                    },
                  }}
                >
                  <TableCell sx={{ maxWidth: 140 }}>
                    <Tooltip title={row.patient} arrow>
                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "140px",
                        }}
                      >
                        {row.patient}
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>{formatDate(row.date)}</TableCell>

                  <TableCell>{statusChip(row.status)}</TableCell>

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
              ))
            )}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
