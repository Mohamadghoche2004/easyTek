import React from "react";
import { styled, Paper, Typography, Box, IconButton } from "@mui/material";
import { X, CloudArrowUp, Image as ImageIcon } from "phosphor-react";
import { useCallback, useState } from "react";
import NextImage from "next/image";

export function StyledUploadZone({
  onFileSelect,
  selectedFile,
  onRemoveFile,
  accept = "image/*",
  maxSizeMB = 5,
  supportedFormats = "JPG, PNG, GIF",
  title = "Upload Image",
  dragText = "Drag & drop an image here, or click to select",
  previewHeight = 200,
}: {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onRemoveFile: () => void;
  accept?: string;
  maxSizeMB?: number;
  supportedFormats?: string;
  title?: string;
  dragText?: string;
  previewHeight?: number;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generate preview when selectedFile changes
  React.useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, [selectedFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];
        if (file.type.match(accept.replace("*", ".*"))) {
          onFileSelect(file);
        }
      }
    },
    [accept, onFileSelect]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.match(accept.replace("*", ".*"))) {
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    onRemoveFile();
    setImagePreview(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <StyledTypography>{title}</StyledTypography>

      {!imagePreview ? (
        <StyledDropZone
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            document.getElementById("styled-upload-input")?.click()
          }
          sx={{
            border: dragOver ? "2px dashed #1976d2" : "2px dashed #e0e0e0",
            backgroundColor: dragOver ? "#f5f5f5" : "transparent",
            "&:hover": {
              borderColor: "#1976d2",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <CloudArrowUp size={34} color="#666" style={{ marginBottom: 8 }} />
          <Typography variant="body2" color="textSecondary">
            {dragText}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Supports: {supportedFormats} (Max {maxSizeMB}MB)
          </Typography>
          <input
            id="styled-upload-input"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </StyledDropZone>
      ) : (
        <StyledPreviewContainer>
          <StyledImagePreview>
            <NextImage
              src={imagePreview}
              alt="Preview"
              width={400}
              height={previewHeight}
              style={{
                width: "100%",
                height: `${previewHeight}px`,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <StyledRemoveButton onClick={handleRemoveFile}>
              <X size={16} />
            </StyledRemoveButton>
          </StyledImagePreview>
          <StyledFileInfo>
            <ImageIcon size={16} />
            <Typography variant="body2" color="textSecondary">
              {selectedFile?.name}
            </Typography>
          </StyledFileInfo>
        </StyledPreviewContainer>
      )}
    </Box>
  );
}

export const StyledTypography = styled("p")({
  fontSize: "14px",
  fontWeight: "semibold",
  margin: "0 0 8px 0",
});

export const StyledDropZone = styled(Paper)({
  borderRadius: 8,
  padding: 24,
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: 120,
  justifyContent: "center",
});

export const StyledPreviewContainer = styled(Paper)({
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: 16,
  position: "relative",
});

export const StyledImagePreview = styled(Box)({
  position: "relative",
  display: "inline-block",
  width: "100%",
});

export const StyledRemoveButton = styled(IconButton)({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "white",
  width: 32,
  height: 32,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});

export const StyledFileInfo = styled(Box)({
  marginTop: 8,
  display: "flex",
  alignItems: "center",
  gap: 8,
});
