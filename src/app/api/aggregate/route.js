import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const folderPath = path.join(process.cwd(), 'public', 'data');
  const jsonFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.json'));
  console.log(jsonFiles.length)
  let aggregatedData = [];

  jsonFiles.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    aggregatedData.push(jsonData.features[0]); // Aggregate data here
  });

  return NextResponse.json(aggregatedData); // Return aggregated data
}
