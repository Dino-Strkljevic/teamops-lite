import { Card, CardContent, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Frontend scaffold is working.
        </Typography>
      </CardContent>
    </Card>
  );
}