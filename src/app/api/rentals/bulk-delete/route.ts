import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Rental from '../../../../../models/Rental';
import Cd from '../../../../../models/Cd';
import mongoose from 'mongoose';

// POST - Bulk soft-delete rentals by IDs
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
    }

    // Cast incoming ids to ObjectId, skip invalid ones
    const objectIds = (ids as string[])
      .filter((id) => typeof id === 'string' && mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (objectIds.length === 0) {
      return NextResponse.json({ error: 'No valid IDs provided' }, { status: 400 });
    }

    // Get rentals before deleting to restore available quantities
    const rentalsToDelete = await Rental.find({ _id: { $in: objectIds } });
    
    const result = await Rental.updateMany(
      { _id: { $in: objectIds } },
      { $set: { deleted: true } },
      { strict: false }
    );
    
    // Restore available quantity for each deleted rental
    for (const rental of rentalsToDelete) {
      await Cd.findByIdAndUpdate(rental.cd, { 
        $inc: { availableQuantity: 1 } 
      });
    }
    
    console.log('Bulk soft delete rentals', { matched: result.matchedCount, modified: result.modifiedCount });
    
    return NextResponse.json({ 
      success: true, 
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error bulk soft-deleting rentals:', error);
    return NextResponse.json({ error: 'Failed to delete rentals' }, { status: 500 });
  }
}
