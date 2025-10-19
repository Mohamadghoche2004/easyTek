"use client";
import { useState } from "react";
import { LeftSection } from "./components/LeftSection";
import { CdRightSection } from "./components/cdRightSection";
import "./dashboard.css";
import { RentalRightSection } from "./components/rentalRightSection";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<string>("cds");
  return (
    <div className="grid flex-row grid-cols-12">
      <LeftSection selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab === "cds" && <CdRightSection />}
      {selectedTab === "rental" && <RentalRightSection /> }
    </div>
  );
}
