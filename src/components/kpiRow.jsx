// src/components/KpiRow.jsx
import { Grid, Skeleton } from "@mui/material";
import { People, Event, Science } from "@mui/icons-material";
import KpiCard from "./kpiCard.jsx";

export default function KpiRow({ loading, kpis }) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {/* Patients */}
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

      {/* Today’s Appointments */}
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

      {/* Pending Labs */}
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
  );
}
