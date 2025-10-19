import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../lib/dbConnect';
import Cd from '../../../../../models/Cd';

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

    const result = await Cd.updateMany(
      { _id: { $in: objectIds } },
      { $set: { deleted: true } },
      { strict: false }
    );
    console.log('Bulk soft delete', { matched: result.matchedCount, modified: result.modifiedCount });
    
    return NextResponse.json({ 
      success: true, 
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error bulk soft-deleting CDs:', error);
    return NextResponse.json({ error: 'Failed to delete CDs' }, { status: 500 });
  }
}
