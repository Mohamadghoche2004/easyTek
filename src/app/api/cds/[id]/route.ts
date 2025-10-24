import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Cd from "../../../../../models/Cd";

// PATCH - Update an existing CD
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Prevent changing immutable fields inadvertently
    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;

    // Get current CD to check quantities
    const currentCd = await Cd.findById(id);
    if (!currentCd) {
      return NextResponse.json({ error: "CD not found" }, { status: 404 });
    }

    // Calculate new quantities and status
    const newQuantity =
      body.quantity !== undefined ? body.quantity : currentCd.quantity;

    // Calculate new availableQuantity based on quantity change
    const quantityDifference = newQuantity - currentCd.quantity;
    const newAvailableQuantity =
      currentCd.availableQuantity + quantityDifference;

    // Ensure availableQuantity doesn't go below 0 or above quantity
    const finalAvailableQuantity = Math.max(
      0,
      Math.min(newAvailableQuantity, newQuantity)
    );

    // Update the body with calculated values
    body.availableQuantity = finalAvailableQuantity;

    let newStatus = "available";
    if (newQuantity === 0) {
      newStatus = "unavailable";
    } else if (finalAvailableQuantity === 0) {
      newStatus = "rented";
    }

    // Add status to the update body
    body.status = newStatus;

    const updated = await Cd.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating CD:", error);
    return NextResponse.json({ error: "Failed to update CD" }, { status: 500 });
  }
}
