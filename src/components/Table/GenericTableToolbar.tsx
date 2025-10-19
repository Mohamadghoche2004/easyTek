"use client";
import React, { useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { EnhancedTableToolbarProps } from "./type";

// Default filter component
const DefaultFilterComponent = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);

  const handleClearFilters = () => {
    setStatusFilter('all');
    setShowActiveOnly(false);
  };

  return (
    <Box sx={{ p: 2, minWidth: 250 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filter Options
      </Typography>
      
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            size="small"
          />
        }
        label="Show Active Only"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          size="small"
          onClick={handleClearFilters}
          color="secondary"
        >
          Clear
        </Button>
        <Button
          size="small"
          variant="contained"
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default function GenericTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    searchTerm,
    onSearchChange,
    title,
    onAdd,
    onDelete,
    showAdd = true,
    showFilter = true,
    filterComponent,
  } = props;

  // Popover state
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const isFilterOpen = Boolean(filterAnchorEl);
  const filterId = isFilterOpen ? 'filter-popover' : undefined;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          minHeight: "80px !important",
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: "1 1 100%",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={onSearchChange}
            sx={{ maxWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            {showAdd && (
              <Tooltip title={`Add New ${title.slice(0, -1)}`}>
                <IconButton color="primary" onClick={onAdd}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            {showFilter && (
              <>
                <Tooltip title="Filter list">
                  <IconButton 
                    onClick={handleFilterClick}
                    color={isFilterOpen ? "primary" : "default"}
                    aria-describedby={filterId}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
                
                <Popover
                  id={filterId}
                  open={isFilterOpen}
                  anchorEl={filterAnchorEl}
                  onClose={handleFilterClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {filterComponent 
                    ? React.cloneElement(filterComponent as React.ReactElement<{ onClose?: () => void }>, { onClose: handleFilterClose })
                    : <DefaultFilterComponent />
                  }
                </Popover>
              </>
            )}
          </>
        )}
      </Box>
    </Toolbar>
  );
}
