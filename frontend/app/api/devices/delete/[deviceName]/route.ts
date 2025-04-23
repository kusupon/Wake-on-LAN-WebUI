import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface DeviceInfo {
  name: string;
  macAddress: string;
}

const DEVICES_JSON_PATH = path.join(process.cwd(), 'public', 'devices.json');

export async function DELETE(req: Request, { params }: { params: Promise<{ deviceName: string }> }) {
  const deviceName = (await params).deviceName;

  if (!deviceName) {
    return NextResponse.json({ message: 'Device name is required for deletion.' }, { status: 400 });
  }

  try {
    const fileContent = await fs.readFile(DEVICES_JSON_PATH, 'utf-8');
    const devices: DeviceInfo[] = JSON.parse(fileContent);

    const updatedDevices = devices.filter((device) => device.name !== deviceName);

    if (updatedDevices.length === devices.length) {
      return NextResponse.json({ message: 'Device not found for deletion.' }, { status: 404 });
    }

    await fs.writeFile(DEVICES_JSON_PATH, JSON.stringify(updatedDevices, null, 2), 'utf-8');

    return NextResponse.json({ message: `Device "${deviceName}" deleted successfully.` }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { message: 'Failed to delete device.', error },
      { status: 500 }
    );
  }
}