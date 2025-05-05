import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Replace with real data fetching logic
    const categories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Home Appliances' },
      { id: 3, name: 'Toys and Games' },
      { id: 4, name: 'Sport' },
      { id: 5, name: 'Health and Beauty Products' },
      { id: 6, name: 'Clothing' },
      { id: 7, name: 'Pet Supplies' },
      { id: 8, name: 'Medical Instrument' },
      { id: 9, name: 'Travel Gear' },
      { id: 10, name: 'Craft and Hobby Supplies' },
      { id: 11, name: 'Books' },
      { id: 12, name: 'Furniture' },
      { id: 13, name: 'Gardening Supplies' },
      { id: 14, name: 'Office Supplies' },
      { id: 15, name: 'Automotive' },
      { id: 16, name: 'Jewelry' },
      { id: 17, name: 'Video Games' },
      { id: 18, name: 'Outdoor Gear' },
      { id: 19, name: 'Kitchen Accessories' },
      { id: 20, name: 'Seasonal Items' },
    ];

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, categories: [], error: 'Failed to fetch categories' }, { status: 500 });
  }
}
