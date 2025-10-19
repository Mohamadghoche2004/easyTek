import mongoose, { Schema, Document } from "mongoose";

export interface IRental extends Document {
  cd: mongoose.Types.ObjectId;
  renterName: string;
  phoneNumber: string;
  rentedAt: Date;
  endDate: Date;
  returnedAt?: Date;
  status: "active" | "returned" | "overdue";
  deleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRental>(
  {
    cd: { type: Schema.Types.ObjectId, ref: "CD", required: true },
    renterName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    rentedAt: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    returnedAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "returned", "overdue"],
      default: "active",
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-mark as overdue when saving if the end date has passed
rentalSchema.pre("save", function (next) {
  if (!this.returnedAt && this.endDate < new Date()) {
    this.status = "overdue";
  }
  next();
});

export default mongoose.models.Rental || mongoose.model<IRental>("Rental", rentalSchema);
