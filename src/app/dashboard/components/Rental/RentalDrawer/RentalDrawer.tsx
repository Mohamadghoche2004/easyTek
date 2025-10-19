import styled from "@emotion/styled";
import {
  Button,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormHelperText,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import React from "react";

export type RentalFormValues = {
  cdId: string;
  renterName: string;
  phoneNumber: string;
  endDate: string;
  status: "active" | "returned" | "overdue";
};

export default function RentalDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  FilterContent,
  onRefresh,
  mode = "add",
  editId,
  initialValues,
  availableCds = [],
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
  FilterContent: React.ReactNode;
  onRefresh?: () => void;
  mode?: "add" | "edit";
  editId?: string;
  initialValues?: Partial<RentalFormValues>;
  availableCds?: Array<{ id: string; name: string }>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<RentalFormValues>({
    defaultValues: {
      cdId: initialValues?.cdId ?? "",
      renterName: initialValues?.renterName ?? "",
      phoneNumber: initialValues?.phoneNumber ?? "",
      endDate: initialValues?.endDate ?? "",
      status: (initialValues?.status as any) ?? "active",
    },
  });

  // Ensure default values update when opening in edit mode
  React.useEffect(() => {
    if (!isDrawerOpen) return;
    if (mode === "edit" && initialValues) {
      reset({
        cdId: initialValues.cdId ?? "",
        renterName: initialValues.renterName ?? "",
        phoneNumber: initialValues.phoneNumber ?? "",
        endDate: initialValues.endDate ?? "",
        status: (initialValues.status as any) ?? "active",
      });
    }
    if (mode === "add") {
      reset({
        cdId: "",
        renterName: "",
        phoneNumber: "",
        endDate: "",
        status: "active",
      });
    }
  }, [mode, initialValues, isDrawerOpen, reset]);

  const onSubmit = async (values: RentalFormValues) => {
    try {
      const body: any = {
        cd: values.cdId,
        renterName: values.renterName,
        phoneNumber: values.phoneNumber,
        endDate: new Date(values.endDate).toISOString(),
        status: values.status,
      };

      const response = await fetch(
        mode === "edit" && editId ? `/api/rentals/${editId}` : "/api/rentals",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        reset();
        setIsDrawerOpen(false);
        onRefresh?.();
      } else {
        console.error("Failed to save rental");
      }
    } catch (error) {
      console.error("Error saving rental:", error);
    }
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="Rental Drawer"
      anchor="right"
      PaperProps={{
        sx: {
          width: "300px",
          minWidth: "300px",
        },
      }}
    >
      <StyledDrawerHead>
        <h1 className="font-semibold text-lg">
          {mode === "edit" ? "Edit Rental" : "Add Rental"}
        </h1>
        <X onClick={() => setIsDrawerOpen(false)} size={20} />
      </StyledDrawerHead>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDrawerContent>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="cdId"
              rules={{ required: "CD is required" }}
              render={({ field }) => (
                <FormControl size="small" fullWidth error={!!errors.cdId}>
                  <InputLabel>CD</InputLabel>
                  <Select label="CD" {...field}>
                    {availableCds.map((cd) => (
                      <MenuItem key={cd.id} value={cd.id}>
                        {cd.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.cdId && (
                    <FormHelperText>{errors.cdId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <TextField
              label="Renter Name"
              fullWidth
              {...register("renterName", { required: "Renter name is required" })}
              error={!!errors.renterName}
              helperText={errors.renterName?.message}
              size="small"
            />

            <TextField
              label="Phone Number"
              fullWidth
              {...register("phoneNumber", { required: "Phone number is required" })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              size="small"
            />

            <TextField
              size="small"
              type="date"
              label="End Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("endDate", { required: "End date is required" })}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />

            <Controller
              control={control}
              name="status"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl size="small" fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" {...field}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="returned">Returned</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </StyledDrawerContent>
        <StyledDrawerFooter>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={() => setIsDrawerOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="contained"
            color="primary"
          >
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Rental"}
          </Button>
        </StyledDrawerFooter>
      </form>
    </Drawer>
  );
}

export const StyledDrawerHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
`;

export const StyledDrawerContent = styled.div`
  padding: 16px;
`;

export const StyledDrawerFooter = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
`;
