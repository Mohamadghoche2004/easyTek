"use client";

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

export interface CdFilterProps {
  categories: string[];
  category: string;
  availableOnly: boolean;
  onChange: (next: { category: string; availableOnly: boolean }) => void;
  onClear: () => void;
  onClose?: () => void;
}

export default function CdFilter({
  categories,
  category,
  availableOnly,
  onChange,
  onClear,
  onClose,
}: CdFilterProps) {
  const handleApply = () => onClose?.();

  return (
    <Box sx={{ p: 2, minWidth: 280 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        CD Filters
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => onChange({ category: e.target.value, availableOnly })}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={availableOnly}
            onChange={(e) => onChange({ category, availableOnly: e.target.checked })}
            size="small"
          />
        }
        label="Show Available Only"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button size="small" onClick={onClear} color="secondary">
          Clear
        </Button>
        <Button size="small" variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </Box>
    </Box>
  );
}


