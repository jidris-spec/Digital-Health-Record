// src/components/KpiRow.jsx
import { Grid, Skeleton } from "@mui/material";
import { People, Event, Science } from "@mui/icons-material";
import KpiCard from "./KpiCard.jsx";

export default function KpiRow({ loading, kpis }) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {/* Patients */}
      <Grid size={{ xs: 12, md: 4 }}>
        {loading ? (
          <Skeleton variant="rounded" height={92} />
        ) : (
          <KpiCard
            icon={<People />}
            label="Patients"
            value={kpis.patients}
            tooltip="Total unique patients currently under care"
            color="secondary"
            trend={+2} // example: +2 more than yesterday
          />
        )}
      </Grid>

      {/* Today’s Appointments */}
      <Grid size={{ xs: 12, md: 4 }}>
        {loading ? (
          <Skeleton variant="rounded" height={92} />
        ) : (
          <KpiCard
            icon={<Event />}
            label="Today’s Appointments"
            value={kpis.todaysAppts}
            tooltip="Appointments scheduled for today"
            color="primary"
            trend={-1} // example: 1 fewer than yesterday
          />
        )}
      </Grid>

      {/* Pending Labs */}
      <Grid size={{ xs: 12, md: 4 }}>
        {loading ? (
          <Skeleton variant="rounded" height={92} />
        ) : (
          <KpiCard
            icon={<Science />}
            label="Pending Labs"
            value={kpis.pendingLabs}
            tooltip="Lab results awaiting review"
            color="success"
            trend={+3} // example: 3 more pending labs
          />
        )}
      </Grid>
    </Grid>
  );
}
