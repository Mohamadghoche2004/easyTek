import React from "react";
import { TableConfig } from "@/components/Table/type";
import { CDTableData } from "@/types/cd";

// Define CD data structure for table display

export const cdConfig: TableConfig<CDTableData> = {
  columns: [
    {
      id: "image",
      label: "Image",
      numeric: false,
      disablePadding: false,
      minWidth: 100,
      maxWidth: 150,
      render: (value) => {
        const src = typeof value === 'string' && value.trim() ? value : undefined;
        return src
          ? React.createElement("img", { src, alt: "CD Image", className: "w-8 h-10" })
          : null;
      },
    },
    {
      id: "name",
      label: "Title",
      numeric: false,
      disablePadding: true,
      minWidth: 200,
      maxWidth: 200,
    },
    {
      id: "category",
      label: "Category",
      numeric: false,
      disablePadding: false,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      id: "quantity",
      label: "Total Quantity",
      numeric: true,
      align: "left",
      disablePadding: false,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      id: "availableQuantity",
      label: "Available",
      numeric: true,
      align: "left",
      disablePadding: false,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      id: "status",
      label: "Status",
      numeric: false,
      disablePadding: false,
      minWidth: 100,
      maxWidth: 150,
    },
    {
      id: "pricePerDay",
      label: "Price Per Day",
      numeric: true,
      disablePadding: false,
      minWidth: 150,
      align: "left",
      maxWidth: 150,
    },

    {
      id: "description",
      label: "Description",
      numeric: false,
      disablePadding: false,
      minWidth: 200,
      maxWidth: 200,
    },
  ],
  title: "CDs",
  searchFields: [
    "name",
    "category",
    "quantity",
    "status",
    "pricePerDay",
    "image",
    "description",
  ],
  defaultOrderBy: "name",
};
