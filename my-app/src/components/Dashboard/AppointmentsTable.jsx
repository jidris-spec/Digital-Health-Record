import {
  Paper,
  Stack,
  Typography,
  Chip,
  Skeleton,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import {
  CheckCircle,
  InfoOutlined,
  DeleteOutline,
  Cancel as CancelIcon,
  DoneAll,
} from "@mui/icons-material";

export default function AppointmentsTable({
  loading,
  appointments,
  requestDelete,
  onUpdateStatus,
}) {
  function formatDate(raw) {
    if (!raw) return "—";
    try {
      const str =
        typeof raw === "string" && raw.includes(" ") && !raw.includes("T")
          ? raw.replace(" ", "T")
          : raw;

      const d = new Date(str);
      if (Number.isNaN(d.getTime())) return raw;

      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return raw;
    }
  }

  function statusChip(status) {
    const normalized = (status || "").toLowerCase();

    const map = {
      upcoming: { color: "success", label: "Upcoming" },
      scheduled: { color: "success", label: "Scheduled" },
      pending: { color: "warning", label: "Pending" },
      completed: { color: "default", label: "Completed" },
      cancelled: { color: "error", label: "Cancelled" },
    };

    const item = map[normalized] || map["upcoming"];

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
              appointments.map((row) => {
                const patientName =
                  row.patientName || row.patient || "Unknown patient";
                const dateValue = row.dateTime || row.date || "";
                const statusValue = row.status || "upcoming";
                const isCompleted = statusValue === "completed";
                const isCancelled = statusValue === "cancelled";

                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        backgroundColor: "rgba(67, 56, 202, 0.08)",
                      },
                      opacity: isCancelled ? 0.6 : 1,
                    }}
                  >
                    <TableCell sx={{ maxWidth: 140 }}>
                      <Tooltip title={patientName} arrow>
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "140px",
                          }}
                        >
                          {patientName}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell>{formatDate(dateValue)}</TableCell>

                    <TableCell>{statusChip(statusValue)}</TableCell>

                    <TableCell align="right">
                      {/* Mark as completed */}
                      {!isCompleted && !isCancelled && onUpdateStatus && (
                        <Tooltip title="Mark as completed" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              onUpdateStatus(row.id, "completed")
                            }
                          >
                            <DoneAll fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Cancel appointment */}
                      {!isCancelled && onUpdateStatus && (
                        <Tooltip title="Cancel appointment" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              onUpdateStatus(row.id, "cancelled")
                            }
                          >
                            <CancelIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Delete appointment */}
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
                );
              })
            )}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
