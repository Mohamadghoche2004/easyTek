"use client";
import { GenericTable } from "@/components/Table";
import { useEffect, useMemo, useState } from "react";
import { rentalConfig } from "./TableConfig/rentalConfig";
import { RentalTableData } from "@/types/rental";
import RentalFilter from "./Filters/RentalFilter";
import { Drawer } from "@mui/material";
import RentalDrawer from "./Rental/RentalDrawer/RentalDrawer";

// Type for raw MongoDB data
interface MongoRental {
  _id: string;
  cd: {
    _id: string;
    name: string;
  };
  renterName: string;
  phoneNumber: string;
  rentedAt: string;
  endDate: string;
  returnedAt?: string;
  status: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

// Type for available CDs
interface AvailableCD {
  id: string;
  name: string;
}

// Type for CD data from API
interface ApiCD {
  _id: string;
  name: string;
  availableQuantity?: number;
  quantity: number;
}

export function RentalRightSection() {
  const [rentals, setRentals] = useState<RentalTableData[]>([]);
  const [availableCds, setAvailableCds] = useState<AvailableCD[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [editItem, setEditItem] = useState<RentalTableData | null>(null);
  const fetchData = async () => {
    // Fetch rentals
    const rentalsResult = await fetch("/api/rentals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const rentalsData: MongoRental[] = await rentalsResult.json();

    // Transform MongoDB data to RentalTableData format
    const transformedRentals: RentalTableData[] = rentalsData.map(
      (rental: MongoRental) => ({
        id: String(rental._id),
        cdId: String(rental.cd._id),
        cdName: rental.cd.name,
        renterName: rental.renterName,
        phoneNumber: rental.phoneNumber,
        rentedAt: new Date(rental.rentedAt).toISOString().split("T")[0],
        endDate: new Date(rental.endDate).toISOString().split("T")[0],
        returnedAt: rental.returnedAt
          ? new Date(rental.returnedAt).toISOString().split("T")[0]
          : "",
        status: rental.status as "active" | "returned" | "overdue",
      })
    );
    setRentals(transformedRentals);

    // Fetch available CDs for the dropdown
    const cdsResult = await fetch("/api/cds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const cdsData: ApiCD[] = await cdsResult.json();
    const availableCdsData: AvailableCD[] = cdsData
      .filter((cd: ApiCD) => (cd.availableQuantity !== undefined ? cd.availableQuantity : cd.quantity) > 0)
      .map((cd: ApiCD) => ({
        id: String(cd._id),
        name: cd.name,
      }));
    setAvailableCds(availableCdsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh available CDs when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      const refreshAvailableCds = async () => {
        const cdsResult = await fetch("/api/cds", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const cdsData: ApiCD[] = await cdsResult.json();
        const availableCdsData: AvailableCD[] = cdsData
          .filter((cd: ApiCD) => (cd.availableQuantity !== undefined ? cd.availableQuantity : cd.quantity) > 0)
          .map((cd: ApiCD) => ({
            id: String(cd._id),
            name: cd.name,
          }));
        setAvailableCds(availableCdsData);
      };
      refreshAvailableCds();
    }
  }, [isDrawerOpen]);

  const refreshData = () => {
    fetchData();
  };

  // Apply filters locally before passing to table
  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      if (showActiveOnly && rental.status !== "active") return false;
      if (statusFilter !== "all" && rental.status !== statusFilter)
        return false;
      return true;
    });
  }, [rentals, showActiveOnly, statusFilter]);

  // Render filter popover content using external component
  const FilterContent = ({ onClose }: { onClose?: () => void }) => (
    <RentalFilter
      statusFilter={statusFilter}
      showActiveOnly={showActiveOnly}
      onChange={({ statusFilter, showActiveOnly }) => {
        setStatusFilter(statusFilter);
        setShowActiveOnly(showActiveOnly);
      }}
      onClear={() => {
        setStatusFilter("all");
        setShowActiveOnly(false);
      }}
      onClose={onClose}
    />
  );
  return (
    <div className="col-span-12 lg:col-span-10 px-10 lg:p-10">
      <GenericTable
        data={filteredRentals}
        config={{
          ...rentalConfig,
          showFilter: true,
          filterComponent: <FilterContent />,
          onAdd: () => {
            setDrawerMode("add");
            setEditItem(null);
            setIsDrawerOpen(true);
          },
          onEdit: (item) => {
            const rental = item as RentalTableData;
            setDrawerMode("edit");
            setEditItem(rental);
            setIsDrawerOpen(true);
          },
          onDelete: async (ids) => {
            await fetch("/api/rentals/bulk-delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids }),
            });
            refreshData();
          },
        }}
      />
      <RentalDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        onRefresh={refreshData}
        mode={drawerMode}
        editId={editItem?.id as string | undefined}
        availableCds={availableCds}
        initialValues={
          editItem
            ? {
                cdId: editItem.cdId,
                renterName: editItem.renterName,
                phoneNumber: editItem.phoneNumber,
                endDate: editItem.endDate,
                status: editItem.status as "active" | "returned" | "overdue",
              }
            : undefined
        }
      />
    </div>
  );
}
