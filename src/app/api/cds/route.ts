import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Cd from '../../../../models/Cd';

// GET - Fetch all CDs
export async function GET() {
  try {
    await dbConnect();
    const cds = await Cd.find({ deleted: { $ne: true } });
    return NextResponse.json(cds);
  } catch (error) {
    console.error('Error fetching CDs:', error);
    return NextResponse.json({ error: 'Failed to fetch CDs' }, { status: 500 });
  }
}

// POST - Create a new CD
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Ensure availableQuantity is set if not provided
    if (body.availableQuantity === undefined) {
      body.availableQuantity = body.quantity;
    }
    
    console.log('Creating CD with data:', body);
    
    const newCd = new Cd(body);
    const savedCd = await newCd.save();
    
    console.log('CD created successfully:', {
      id: savedCd._id,
      name: savedCd.name,
      quantity: savedCd.quantity,
      availableQuantity: savedCd.availableQuantity,
      status: savedCd.status
    });
    
    return NextResponse.json(savedCd, { status: 201 });
  } catch (error) {
    console.error('Error creating CD:', error);
    return NextResponse.json({ error: 'Failed to create CD' }, { status: 500 });
  }
}
