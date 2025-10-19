import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Rental from '../../../../models/Rental';
import Cd from '../../../../models/Cd';

// GET - Fetch all rentals with CD details
export async function GET() {
  try {
    await dbConnect();
    const rentals = await Rental.find({ deleted: { $ne: true } })
      .populate('cd', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}

// POST - Create a new rental
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Verify CD exists and has available quantity
    const cd = await Cd.findById(body.cd);
    if (!cd) {
      return NextResponse.json({ error: 'CD not found' }, { status: 404 });
    }
    
    // Initialize availableQuantity if it doesn't exist (for existing data)
    if (cd.availableQuantity === undefined) {
      await Cd.findByIdAndUpdate(body.cd, { availableQuantity: cd.quantity });
      cd.availableQuantity = cd.quantity;
    }
    
    console.log('CD before rental:', {
      id: cd._id,
      name: cd.name,
      quantity: cd.quantity,
      availableQuantity: cd.availableQuantity,
      status: cd.status
    });
    
    if (cd.availableQuantity <= 0) {
      return NextResponse.json({ error: 'CD is not available for rental' }, { status: 400 });
    }
    
    const newRental = new Rental(body);
    const savedRental = await newRental.save();
    
    // Decrease available quantity (status will be auto-updated by pre-save hook)
    const updatedCd = await Cd.findByIdAndUpdate(body.cd, { 
      $inc: { availableQuantity: -1 } 
    }, { new: true });
    
    console.log('CD after rental creation:', {
      id: updatedCd?._id,
      name: updatedCd?.name,
      quantity: updatedCd?.quantity,
      availableQuantity: updatedCd?.availableQuantity,
      status: updatedCd?.status
    });
    
    return NextResponse.json(savedRental, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 });
  }
}
