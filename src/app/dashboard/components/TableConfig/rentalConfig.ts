import React from "react";
import { TableConfig } from "@/components/Table/type";
import { RentalTableData } from "@/types/rental";

export const rentalConfig: TableConfig<RentalTableData> = {
  columns: [
    {
      id: "cdName",
      label: "CD Name",
      numeric: false,
      disablePadding: true,
      minWidth: 200,
      maxWidth: 200,
    },
    {
      id: "renterName",
      label: "Renter Name",
      numeric: false,
      disablePadding: false,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      numeric: false,
      disablePadding: false,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      id: "rentedAt",
      label: "Rented At",
      numeric: false,
      disablePadding: false,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      id: "endDate",
      label: "End Date",
      numeric: false,
      disablePadding: false,
      minWidth: 120,
      maxWidth: 150,
    },
    {
      id: "status",
      label: "Status",
      numeric: false,
      disablePadding: false,
      minWidth: 100,
      maxWidth: 120,
      render: (value) => {
        const status = String(value);
        const color = status === "active" ? "#4caf50" : status === "returned" ? "#2196f3" : "#f44336";
        return React.createElement("span", {
          style: { color, fontWeight: "bold" },
          children: status.toUpperCase()
        });
      },
    },
  ],
  title: "Rentals",
  searchFields: [
    "cdName",
    "renterName",
    "phoneNumber",
    "status",
  ],
  defaultOrderBy: "rentedAt",
};
