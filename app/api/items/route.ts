import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();

    // TODO: Add validation and save logic here
    // For now, simulate success response with the received data and a generated id
    const createdItem = {
      id: 1, // Use fixed id to avoid hydration mismatch
      ...itemData,
    };

    return NextResponse.json({ success: true, item: createdItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}
