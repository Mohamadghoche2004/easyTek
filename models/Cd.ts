import mongoose, { Schema, Document } from "mongoose";

export interface ICD extends Document {
  name: string;
  category: "PS4" | "PS5" | "XBOX" | "PC";
  quantity: number;
  availableQuantity: number;
  status: "available" | "rented" | "unavailable";
  pricePerDay: number;
  image?: string;
  description?: string;
  deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cdSchema = new Schema<ICD>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["PS4", "PS5", "XBOX", "PC"],
      required: true,
    },
    quantity: { type: Number, default: 1, min: 0 },
    availableQuantity: { type: Number, default: 1, min: 0 },
    status: {
      type: String,
      enum: ["available", "rented", "unavailable"],
      default: "available",
    },
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-update status based on availableQuantity
cdSchema.pre("save", function (next) {
  console.log('Pre-save hook - CD data:', {
    quantity: this.quantity,
    availableQuantity: this.availableQuantity,
    status: this.status
  });
  
  if (this.quantity === 0) {
    this.status = "unavailable";
  } else if (this.availableQuantity === 0) {
    this.status = "rented";
  } else {
    this.status = "available";
  }
  
  console.log('Pre-save hook - Updated status:', this.status);
  next();
});

// Force model refresh to ensure schema changes are applied
if (mongoose.models.CD) {
  delete mongoose.models.CD;
}

export default mongoose.model<ICD>("CD", cdSchema);
