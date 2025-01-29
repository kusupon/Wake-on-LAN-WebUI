import wol from 'wol';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises'; 

// デバイス情報の型定義
interface DeviceInfo {
  name: string;
  macAddress: string;
}

const DEVICES_JSON_PATH = path.join(process.cwd(), 'public', 'devices.json');

export async function POST(req: Request) {
  const { deviceName } = await req.json(); 

  if (!deviceName) {
    return NextResponse.json({ message: 'Device name is required.' }, { status: 400 });
  }

  try {
    const fileContent = await fs.readFile(DEVICES_JSON_PATH, 'utf-8');
    const devices: DeviceInfo[] = JSON.parse(fileContent);

    const selectedDevice = devices.find((device) => device.name === deviceName);

    if (!selectedDevice) {
      return NextResponse.json({ message: 'Device not found.' }, { status: 404 });
    }

    const macAddress = selectedDevice.macAddress;

    await wol.wake(macAddress);
    return NextResponse.json({ message: `Wake-on-LAN packet sent to ${deviceName} successfully.` }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending WOL packet:', error);
    return NextResponse.json(
      { message: 'Failed to send Wake-on-LAN packet.', error: error.message },
      { status: 500 }
    );
  }
}