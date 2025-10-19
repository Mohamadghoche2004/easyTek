import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Divider,
} from "@mui/material";

interface RentalFilterProps {
  statusFilter: string;
  showActiveOnly: boolean;
  onChange: (filters: { statusFilter: string; showActiveOnly: boolean }) => void;
  onClear: () => void;
  onClose?: () => void;
}

export default function RentalFilter({
  statusFilter,
  showActiveOnly,
  onChange,
  onClear,
  onClose,
}: RentalFilterProps) {
  const handleStatusChange = (value: string) => {
    onChange({ statusFilter: value, showActiveOnly });
  };

  const handleActiveOnlyChange = (value: boolean) => {
    onChange({ statusFilter, showActiveOnly: value });
  };

  const handleClearFilters = () => {
    onClear();
  };

  const handleApplyFilters = () => {
    onClose?.();
  };

  return (
    <Box sx={{ p: 2, minWidth: 300 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Rental Filters
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="returned">Returned</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={showActiveOnly}
            onChange={(e) => handleActiveOnlyChange(e.target.checked)}
            size="small"
          />
        }
        label="Show Active Rentals Only"
        sx={{ mb: 1, pl: "4px" }}
      />

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          size="small"
          onClick={handleClearFilters}
          color="secondary"
          className="cancel-button"
        >
          Clear All
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleApplyFilters}
          className="orange-button"
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
}
