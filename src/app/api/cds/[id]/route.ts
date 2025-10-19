import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Cd from '../../../../../models/Cd';

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

    const updated = await Cd.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ error: 'CD not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating CD:', error);
    return NextResponse.json({ error: 'Failed to update CD' }, { status: 500 });
  }
}


