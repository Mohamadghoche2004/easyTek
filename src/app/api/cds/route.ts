import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Cd from '../../../../models/Cd';
import Rental from '../../../../models/Rental';

// GET - Fetch all CDs
export async function GET() {
  try {
    await dbConnect();
    const cds = await Cd.find({ deleted: { $ne: true } });
    
    // Calculate isDeletable for each CD
    const cdsWithDeletableStatus = await Promise.all(
      cds.map(async (cd) => {
        // Check if CD has any active rentals
        const activeRentals = await Rental.countDocuments({
          cd: cd._id,
          status: { $in: ['active', 'overdue'] },
          deleted: { $ne: true }
        });
        
        // CD is deletable if it has no active rentals
        const isDeletable = activeRentals === 0;
        
        return {
          ...cd.toObject(),
          isDeletable
        };
      })
    );
    
    return NextResponse.json(cdsWithDeletableStatus);
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
    
    // Set availableQuantity equal to quantity (since it's not provided in the form)
    body.availableQuantity = body.quantity;
    
    // Calculate status based on quantities
    let status = "available";
    if (body.quantity === 0) {
      status = "unavailable";
    } else if (body.availableQuantity === 0) {
      status = "rented";
    }
    body.status = status;
    
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
