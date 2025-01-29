import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface DeviceInfo {
  name: string;
  macAddress: string;
}

const DEVICES_JSON_PATH = path.join(process.cwd(), 'public', 'devices.json');

export async function POST(req: Request) {
  try {
    const { name, macAddress } = await req.json();

    if (!name || !macAddress) {
      return NextResponse.json({ message: 'Device name and MAC address are required.' }, { status: 400 });
    }

    const fileContent = await fs.readFile(DEVICES_JSON_PATH, 'utf-8');
    const devices: DeviceInfo[] = JSON.parse(fileContent);

    // 同じ名前のデバイスが既に存在するかチェック
    if (devices.some((device) => device.name === name)) {
      return NextResponse.json({ message: 'Device with the same name already exists.' }, { status: 400 });
    }

    const newDevice: DeviceInfo = { name, macAddress };
    devices.push(newDevice);

    // JSON ファイルを上書き
    await fs.writeFile(DEVICES_JSON_PATH, JSON.stringify(devices, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Device added successfully.', device: newDevice }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding device:', error);
    return NextResponse.json(
      { message: 'Failed to add device.', error: error.message },
      { status: 500 }
    );
  }
}