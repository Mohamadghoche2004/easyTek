export function LeftSection({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  return (
    <div className="col-span-12 lg:col-span-2 p-10 flex flex-row lg:flex-col gap-5 ">
      <h5
        className={`styled-tab w-full cursor-pointer ${
          selectedTab === "cds" ? "bg-primary text-blue-500" : ""
        }`}
        onClick={() => setSelectedTab("cds")}
      >
        Cds
      </h5>
      <h5
        className={`styled-tab w-full cursor-pointer ${
          selectedTab === "rental" ? "bg-primary text-blue-500" : ""
        }`}
        onClick={() => setSelectedTab("rental")}
      >
        Rental
      </h5>
    </div>
  );
}
