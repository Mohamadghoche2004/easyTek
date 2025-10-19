"use client";
import { useState, useEffect } from "react";
import { LeftSection } from "./components/LeftSection";
import { CdRightSection } from "./components/cdRightSection";
import "./dashboard.css";
import { RentalRightSection } from "./components/rentalRightSection";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<string>("cds");
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <div className="grid flex-row grid-cols-12">
        <LeftSection
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        {selectedTab === "cds" && <CdRightSection />}
        {selectedTab === "rental" && <RentalRightSection />}
      </div>
      <div className="grid grid-cols-12">
      <div className="flex flex-col gap-2 col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-2 px-6">
        <div className="text-sm text-gray-600">Welcome, {user?.email}</div>
        <Button
          variant="outlined"
          size="small"
          onClick={logout}
          className="text-xs"
        >
          Logout
        </Button>
      </div>
      </div>
    </>
  );
}
