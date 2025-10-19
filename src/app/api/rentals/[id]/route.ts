import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Rental from '../../../../../models/Rental';
import Cd from '../../../../../models/Cd';

// PATCH - Update a rental
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = params.id;
    const body = await request.json();
    
    const updatedRental = await Rental.findByIdAndUpdate(
      id,
      { ...body, strict: false },
      { new: true }
    ).populate('cd', 'name');
    
    if (!updatedRental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }
    
    // If status changed to returned, increase available quantity
    if (body.status === 'returned') {
      await Cd.findByIdAndUpdate(updatedRental.cd, { 
        $inc: { availableQuantity: 1 } 
      });
    }
    
    return NextResponse.json(updatedRental);
  } catch (error) {
    console.error('Error updating rental:', error);
    return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 });
  }
}
