import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Rental from "../../../../../models/Rental";
import Cd from "../../../../../models/Cd";

// PATCH - Update a rental
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Get the current rental to check for status changes
    const currentRental = await Rental.findById(id);
    if (!currentRental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    // Check if status is being changed
    const isStatusChanged = body.status && body.status !== currentRental.status;

    // Handle status changes and quantity adjustments
    if (isStatusChanged) {
      const cd = await Cd.findById(currentRental.cd);
      if (cd) {
        console.log(
          `Rental ${id}: Status changing from ${currentRental.status} to ${body.status}`
        );

        // If changing FROM returned TO active/overdue: decrease available quantity
        if (
          currentRental.status === "returned" &&
          (body.status === "active" || body.status === "overdue")
        ) {
          // Check if CD has available quantity
          if ((cd.availableQuantity || 0) <= 0) {
            return NextResponse.json(
              {
                error: `Cannot change rental status - CD ${cd.name} has no available quantity`,
              },
              { status: 400 }
            );
          }

          const newAvailableQuantity = (cd.availableQuantity || 0) - 1;
          let newStatus = "available";

          if (newAvailableQuantity === 0) {
            newStatus = "rented";
          } else if (cd.quantity === 0) {
            newStatus = "unavailable";
          }

          await Cd.findByIdAndUpdate(currentRental.cd, {
            $inc: { availableQuantity: -1 },
            $set: { status: newStatus },
          });

          console.log(
            `Decreased quantity for CD ${cd.name}: ${newAvailableQuantity} available`
          );
        }

        // If changing TO returned FROM active/overdue: increase available quantity
        else if (
          (currentRental.status === "active" ||
            currentRental.status === "overdue") &&
          body.status === "returned"
        ) {
          const newAvailableQuantity = (cd.availableQuantity || 0) + 1;
          let newStatus = "available";

          if (newAvailableQuantity === 0) {
            newStatus = "rented";
          } else if (cd.quantity === 0) {
            newStatus = "unavailable";
          }

          await Cd.findByIdAndUpdate(currentRental.cd, {
            $inc: { availableQuantity: 1 },
            $set: { status: newStatus },
          });

          console.log(
            `Increased quantity for CD ${cd.name}: ${newAvailableQuantity} available`
          );
        }
      }
    }

    // Update the rental
    const updatedRental = await Rental.findByIdAndUpdate(
      id,
      { ...body, strict: false },
      { new: true }
    ).populate("cd", "name");

    return NextResponse.json(updatedRental);
  } catch (error) {
    console.error("Error updating rental:", error);
    return NextResponse.json(
      { error: "Failed to update rental" },
      { status: 500 }
    );
  }
}
