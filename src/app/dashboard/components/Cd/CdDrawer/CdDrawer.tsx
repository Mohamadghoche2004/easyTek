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
} from "@mui/material";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import Image from "next/image";
import { StyledUploadZone } from "@/components/StyledUploadZone/StyledUploadZone";
import { uploadToSupabase } from "../../../../../../lib/uploadToSupabase";

export type CdFormValues = {
  name: string;
  category: "PS4" | "PS5" | "XBOX" | "PC";
  pricePerDay: number;
  quantity: number;
  status: "available" | "rented" | "unavailable";
  description: string;
  image?: File | null;
};

export default function CdDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  onRefresh,
  mode = "add",
  editId,
  initialValues,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
  onRefresh?: () => void;
  mode?: "add" | "edit";
  editId?: string;
  initialValues?: Partial<CdFormValues> & { imageUrl?: string };
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<CdFormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
      category: (initialValues?.category as "PS4" | "PS5" | "XBOX" | "PC") ?? "PS5",
      pricePerDay: initialValues?.pricePerDay ?? 0,
      quantity: initialValues?.quantity ?? 1,
      status: (initialValues?.status as "available" | "rented" | "unavailable") ?? "available",
      description: initialValues?.description ?? "",
      image: null,
    },
  });
  // Ensure default values update when opening in edit mode
  React.useEffect(() => {
    if (!isDrawerOpen) return;
    if (mode === "edit" && initialValues) {
      reset({
        name: initialValues.name ?? "",
        category: (initialValues.category as "PS4" | "PS5" | "XBOX" | "PC") ?? "PS5",
        pricePerDay: initialValues.pricePerDay ?? 0,
        quantity: initialValues.quantity ?? 1,
        status: (initialValues.status as "available" | "rented" | "unavailable") ?? "available",
        description: initialValues.description ?? "",
        image: null,
      });
    }
    if (mode === "add") {
      reset({
        name: "",
        category: "PS5",
        pricePerDay: 0,
        quantity: 1,
        status: "available",
        description: "",
        image: null,
      });
    }
  }, [mode, initialValues, isDrawerOpen, reset]);

  const selectedFile = watch("image");
  const [currentImageUrl, setCurrentImageUrl] = React.useState<string>(initialValues?.imageUrl ?? "");

  React.useEffect(() => {
    if (isDrawerOpen) {
      setCurrentImageUrl(initialValues?.imageUrl ?? "");
    }
  }, [isDrawerOpen, initialValues?.imageUrl]);

  const onFileSelect = (file: File) =>
    setValue("image", file, { shouldDirty: true });
  const onRemoveFile = () => setValue("image", null, { shouldDirty: true });

  const onSubmit = async (values: CdFormValues) => {
    try {
      console.log('Form values:', values);
      
      // 1) Upload image to Supabase if present
      let imageUrl = "";
      if (values.image) {
        const file = values.image;
        imageUrl = await uploadToSupabase(file, { folder: "cds" });
      }

      const body: {
        name: string;
        category: string;
        pricePerDay: number;
        quantity: number;
        status: string;
        description: string;
        image: string;
      } = {
        name: values.name,
        category: values.category,
        pricePerDay: Number(values.pricePerDay),
        quantity: Number(values.quantity),
        status: values.status,
        description: values.description,
        image: imageUrl || currentImageUrl || "",
      };
      
      console.log('Sending to API:', body);
      const response = await fetch(
        mode === "edit" && editId ? `/api/cds/${editId}` : "/api/cds",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        reset();
        setIsDrawerOpen(false);
        onRefresh?.(); // Trigger refresh after successful create/update
      } else {
        console.error("Failed to save CD");
      }
    } catch (error) {
      console.error("Error saving CD:", error);
    }
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="CD Drawer"
      anchor="right"
      PaperProps={{
        sx: {
          width: "300px",
          minWidth: "300px",
        },
      }}
    >
      <StyledDrawerHead>
        <h1 className="font-semibold text-lg">{mode === "edit" ? "Edit CD" : "Add CD"}</h1>
        <X onClick={() => setIsDrawerOpen(false)} size={20} />
      </StyledDrawerHead>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <StyledDrawerContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
            />

            <Controller
              control={control}
              name="category"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category" {...field}>
                    <MenuItem value="PS4">PS4</MenuItem>
                    <MenuItem value="PS5">PS5</MenuItem>
                    <MenuItem value="XBOX">XBOX</MenuItem>
                    <MenuItem value="PC">PC</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              size="small"
              type="number"
              label="Price Per Day"
              fullWidth
              inputProps={{ min: 0 }}
              {...register("pricePerDay", {
                required: true,
                valueAsNumber: true,
              })}
            />

            <TextField
              size="small"
              type="number"
              label="Total Quantity"
              fullWidth
              inputProps={{ min: 0 }}
              {...register("quantity", { required: true, valueAsNumber: true })}
            />

            <Controller
              control={control}
              name="status"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" {...field}>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="rented">Rented</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              size="small"
              label="Description"
              fullWidth
              multiline
              minRows={3}
              {...register("description")}
            />

          {currentImageUrl && !selectedFile && (
            <div style={{ marginTop: 8 }}>
              <Image
                src={currentImageUrl}
                alt="Current"
                width={300}
                height={200}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button size="small" variant="outlined" onClick={() => setCurrentImageUrl("")}>Remove image</Button>
              </div>
            </div>
          )}

          <StyledUploadZone
            title={currentImageUrl && !selectedFile ? "Replace Image" : "CD Image"}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile as File | null}
            onRemoveFile={onRemoveFile}
            accept="image/*"
            supportedFormats="JPG, PNG, GIF"
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
            {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Add CD"}
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
