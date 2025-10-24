import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../lib/dbConnect';
import Cd from '../../../../../models/Cd';
import Rental from '../../../../../models/Rental';

// POST - Bulk soft-delete CDs by IDs
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

    // Check which CDs have active rentals (not deletable)
    const cdsWithActiveRentals = await Promise.all(
      objectIds.map(async (cdId) => {
        const activeRentals = await Rental.countDocuments({
          cd: cdId,
          status: { $in: ['active', 'overdue'] },
          deleted: { $ne: true }
        });
        return {
          cdId,
          hasActiveRentals: activeRentals > 0
        };
      })
    );

    // Separate deletable and non-deletable CDs
    const deletableIds = cdsWithActiveRentals
      .filter(cd => !cd.hasActiveRentals)
      .map(cd => cd.cdId);
    
    const nonDeletableIds = cdsWithActiveRentals
      .filter(cd => cd.hasActiveRentals)
      .map(cd => cd.cdId);

    let result = { matchedCount: 0, modifiedCount: 0 };
    
    // Only delete CDs that are deletable
    if (deletableIds.length > 0) {
      result = await Cd.updateMany(
        { _id: { $in: deletableIds } },
        { $set: { deleted: true } },
        { strict: false }
      );
    }

    console.log('Bulk soft delete', { 
      matched: result.matchedCount, 
      modified: result.modifiedCount,
      skipped: nonDeletableIds.length,
      skippedIds: nonDeletableIds
    });
    
    return NextResponse.json({ 
      success: true, 
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      skippedCount: nonDeletableIds.length,
      skippedIds: nonDeletableIds.map(id => id.toString()),
      message: nonDeletableIds.length > 0 
        ? `Some CDs could not be deleted because they have active rentals` 
        : 'All selected CDs were deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk soft-deleting CDs:', error);
    return NextResponse.json({ error: 'Failed to delete CDs' }, { status: 500 });
  }
}
