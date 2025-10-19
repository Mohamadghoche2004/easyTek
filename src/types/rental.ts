export interface RentalTableData {
  id: string;
  cdId: string;
  cdName: string;
  renterName: string;
  phoneNumber: string;
  rentedAt: string;
  endDate: string;
  returnedAt: string;
  status: "active" | "returned" | "overdue";
  [key: string]: string | number | boolean;
}
