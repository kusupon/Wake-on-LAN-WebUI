import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface DeviceInfo {
  name: string;
  macAddress: string;
}

const DEVICES_JSON_PATH = path.join(process.cwd(), 'public', 'devices.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(DEVICES_JSON_PATH, 'utf-8');
    const devices: DeviceInfo[] = JSON.parse(fileContent);
    return NextResponse.json(devices, { status: 200 });
  } catch (error: unknown) {
    console.error('Error loading devices:', error);
    return NextResponse.json(
      { message: 'Failed to load device list.', error },
      { status: 500 }
    );
  }
}