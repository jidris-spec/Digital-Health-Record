// src/pages/PatientsList.jsx
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Dashboard/Navbar.jsx";
import { loadPatients } from "../utils/storage.jsx";

export default function PatientsList() {
  const navigate = useNavigate();
  const patients = loadPatients();

  return (
    <>
      {/* Breadcrumbs: Dashboard / Patients */}
      <Navbar breadcrumbs={["Dashboard", "Patients"]} />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Patients
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/patients/new")}
            >
              + Add Patient
            </Button>
          </Stack>

          {patients.length === 0 ? (
            <Alert severity="info">
              No patients added yet. Use <b>Add Patient</b> to register someone.
            </Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date of birth</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((p) => (
                  <TableRow
                    key={p.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/patients/${p.id}`)}
                  >
                    <TableCell>{p.fullName}</TableCell>
                    <TableCell>{p.dob}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    <TableCell>{p.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </>
  );
}
