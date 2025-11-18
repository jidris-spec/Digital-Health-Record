// src/pages/PatientsList.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Search,
  ArrowUpward,
  ArrowDownward,
  PersonAdd,
  Edit,
} from "@mui/icons-material";

import Navbar from "../components/Dashboard/Navbar.jsx";
import { listPatients, updatePatient } from "../utils/patientsStorage.jsx";

export default function PatientsList() {
  const navigate = useNavigate();

  // Load once when component mounts, but allow updates
  const [patients, setPatients] = useState(() => listPatients());

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name" | "createdAt"
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const crumbs = ["Dashboard", "Patients"];

  function handleSort(column) {
    if (sortBy === column) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    let data = [...patients];

    if (term) {
      data = data.filter((p) => {
        const name = (p.fullName || "").toLowerCase();
        const email = (p.email || "").toLowerCase();
        const phone = (p.phone || "").toLowerCase();
        return (
          name.includes(term) ||
          email.includes(term) ||
          phone.includes(term)
        );
      });
    }

    data.sort((a, b) => {
      if (sortBy === "name") {
        const an = (a.fullName || "").toLowerCase();
        const bn = (b.fullName || "").toLowerCase();
        if (an < bn) return sortDir === "asc" ? -1 : 1;
        if (an > bn) return sortDir === "asc" ? 1 : -1;
        return 0;
      }

      if (sortBy === "createdAt") {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDir === "asc" ? ad - bd : bd - ad;
      }

      return 0;
    });

    return data;
  }, [patients, search, sortBy, sortDir]);

  function sortIcon(column) {
    if (sortBy !== column) return null;
    return sortDir === "asc" ? (
      <ArrowUpward fontSize="inherit" />
    ) : (
      <ArrowDownward fontSize="inherit" />
    );
  }

  function goToProfile(id) {
    if (!id) return;
    navigate(`/patients/${id}`);
  }

  function handleAddPatient() {
    navigate("/patients/add");
  }

  // --- Edit patient logic ---

  function openEditDialog(patient) {
    if (!patient || !patient.id) return;

    setEditingId(patient.id);
    setEditForm({
      fullName: patient.fullName || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
    });
    setEditOpen(true);
  }

  function closeEditDialog() {
    setEditOpen(false);
    setEditingId(null);
  }

  function handleEditChange(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEditSave(e) {
    e.preventDefault();
    if (!editingId) return;

    const updatedList = updatePatient(editingId, {
      fullName: editForm.fullName,
      gender: editForm.gender,
      phone: editForm.phone,
      email: editForm.email,
      address: editForm.address,
    });

    setPatients(updatedList);
    closeEditDialog();
  }

  const patientCount = patients.length;

  return (
    <>
      <Navbar breadcrumbs={crumbs} />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          {/* Header row: title + actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Patients
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <TextField
                size="small"
                placeholder="Search by name, phone, email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 220 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleAddPatient}
              >
                Add Patient
              </Button>
            </Stack>
          </Stack>

          {/* Summary chip */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={`${patientCount} total`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {search && (
              <Chip
                label={`${filtered.length} matching`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Empty state */}
          {patientCount === 0 ? (
            <Alert severity="info">
              No patients added yet. Use <b>Add Patient</b> to create your first
              record.
            </Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("name")}
                    >
                      <span>Name</span>
                      {sortIcon("name")}
                    </Stack>
                  </TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="flex-end"
                      alignItems="center"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleSort("createdAt")}
                    >
                      <span>Created</span>
                      {sortIcon("createdAt")}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Alert severity="info">
                        No patients match your search. Try a different name or
                        clear the search box.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => {
                    const createdLabel = p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <TableRow
                        key={p.id}
                        hover
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                        }}
                        onClick={() => goToProfile(p.id)}
                      >
                        <TableCell>
                          {p.fullName || "Unnamed patient"}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {p.gender || "—"}
                        </TableCell>
                        <TableCell>{p.phone || "—"}</TableCell>
                        <TableCell>{p.email || "—"}</TableCell>
                        <TableCell align="right">{createdLabel}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit patient" arrow>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation(); // don't trigger row click
                                openEditDialog(p);
                              }}
                            >
                              <Edit fontSize="small" />
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
      </Container>

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent dividers>
          <Stack component="form" spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={editForm.fullName}
              onChange={(e) => handleEditChange("fullName", e.target.value)}
            />
            <TextField
              label="Gender"
              fullWidth
              value={editForm.gender}
              onChange={(e) => handleEditChange("gender", e.target.value)}
              placeholder="male / female / other"
            />
            <TextField
              label="Phone"
              fullWidth
              value={editForm.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              value={editForm.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />
            <TextField
              label="Address"
              fullWidth
              value={editForm.address}
              onChange={(e) => handleEditChange("address", e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
