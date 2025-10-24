"use client";
import { GenericTable } from "@/components/Table";
import { useEffect, useMemo, useState } from "react";
import { cdConfig } from "./TableConfig/cdConfig";
import { CDTableData } from "@/types/cd";
import CdFilter from "./Filters/CdFilter";
import { Drawer } from "@mui/material";
import CdDrawer from "./Cd/CdDrawer/CdDrawer";

// Type for raw MongoDB data
interface MongoCD {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity?: number;
  status: string;
  pricePerDay: number;
  image: string;
  description?: string;
  isDeletable?: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export function CdRightSection() {
  const [cds, setCds] = useState<CDTableData[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [editItem, setEditItem] = useState<CDTableData | null>(null);
  const fetchData = async () => {
    const result = await fetch("/api/cds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: MongoCD[] = await result.json();
    // Transform MongoDB data to CDTableData format
    const transformedData: CDTableData[] = data.map((cd: MongoCD) => ({
      id: String(cd._id),
      name: cd.name,
      category: cd.category,
      quantity: cd.quantity,
      availableQuantity:
        cd.availableQuantity !== undefined ? cd.availableQuantity : cd.quantity, // fallback for existing data
      status: cd.status,
      pricePerDay: cd.pricePerDay,
      image: cd.image,
      description: cd.description || "",
      isDeletable: cd.isDeletable !== undefined ? cd.isDeletable : true, // fallback for existing data
    }));
    setCds(transformedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  // Distinct categories for the filter select
  const categories = useMemo(
    () => Array.from(new Set(cds.map((c) => c.category))).sort(),
    [cds]
  );

  // Apply filters locally before passing to table
  const filteredCds = useMemo(() => {
    return cds.filter((cd) => {
      if (availableOnly && cd.status !== "available") return false;
      if (categoryFilter !== "all" && cd.category !== categoryFilter)
        return false;
      return true;
    });
  }, [cds, availableOnly, categoryFilter]);

  // Render filter popover content using external component
  const FilterContent = ({ onClose }: { onClose?: () => void }) => (
    <CdFilter
      categories={categories}
      category={categoryFilter}
      availableOnly={availableOnly}
      onChange={({ category, availableOnly }) => {
        setCategoryFilter(category);
        setAvailableOnly(availableOnly);
      }}
      onClear={() => {
        setCategoryFilter("all");
        setAvailableOnly(false);
      }}
      onClose={onClose}
    />
  );
  return (
    <div className="col-span-12 lg:col-span-10 px-10 lg:p-10">
      <GenericTable
        data={filteredCds}
        config={{
          ...cdConfig,
          showFilter: true,
          filterComponent: <FilterContent />,
          onAdd: () => {
            setDrawerMode("add");
            setEditItem(null);
            setIsDrawerOpen(true);
          },
          onEdit: (item) => {
            const cd = item as CDTableData;
            setDrawerMode("edit");
            setEditItem(cd);
            setIsDrawerOpen(true);
          },
          onDelete: async (ids) => {
            try {
              const response = await fetch("/api/cds/bulk-delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
              });

              const result = await response.json();
            } catch (error) {
              console.error("Error deleting CDs:", error);
              alert("Failed to delete CDs. Please try again.");
            }
          },
        }}
      />
      <CdDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        onRefresh={refreshData}
        mode={drawerMode}
        editId={editItem?.id as string | undefined}
        initialValues={
          editItem
            ? {
                name: editItem.name,
                category: editItem.category as "PS4" | "PS5" | "XBOX" | "PC",
                pricePerDay: editItem.pricePerDay,
                quantity: editItem.quantity,
                status: editItem.status as
                  | "available"
                  | "rented"
                  | "unavailable",
                description: editItem.description,
                imageUrl: editItem.image,
              }
            : undefined
        }
      />
    </div>
  );
}
