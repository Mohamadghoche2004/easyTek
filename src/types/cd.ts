export interface CDTableData {
    id: string;
    name: string;
    category: string;
    quantity: number;
    availableQuantity: number;
    status: string;
    pricePerDay: number;
    image: string;
    description: string;
    [key: string]: string | number | boolean;
  }