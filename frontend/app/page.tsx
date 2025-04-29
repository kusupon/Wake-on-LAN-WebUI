'use client'

import React, { useState, useEffect } from "react";

interface DeviceInfo {
  name: string;
  macAddress: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>('');
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [newMacAddress, setNewMacAddress] = useState<string>('');
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await fetch('/api/devices/list');
      if (!response.ok) {
        throw new Error(`デバイスの取得に失敗しました:${response.status} ${response.statusText}`);
      }
      const data: DeviceInfo[] = await response.json();
      setDevices(data);
    } catch (e) {
      console.error('Failed to load devices:', e);
      setError('デバイスリストの読み込みに失敗しました');
    }
  };

  const wakeOnLan = async () => {
    setMessage('');
    setError('');

    if (!selectedDeviceName) {
      setError('デバイスを選択してください');
      return;
    }

    try {
      const response = await fetch('/api/wake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceName: selectedDeviceName }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Wake-on-Lanに失敗しました');
        console.error('API Error', data);
      }
    } catch (e) {
      setError('サーバーの接続に失敗しました');
      console.error('Fetch Error:', e)
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceName(e.target.value);
  };

  const handleAddDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError('');
    setIsAddingDevice(true); 

    if (!newDeviceName || !newMacAddress) {
      setError('Device name and MAC address are required.');
      setIsAddingDevice(false); 
      return;
    }

    try {
      const response = await fetch('/api/devices/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDeviceName, macAddress: newMacAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || `Failed to add device: ${response.status} ${response.statusText}`);
      }

      setMessage('Device added successfully.');
      setNewDeviceName('');
      setNewMacAddress('');   
      loadDevices(); 
    } catch (e: unknown) {
      console.error('デバイス追加エラー:', e);
      let errorMessage = 'デバイスの追加に失敗しました。';
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      setError(errorMessage || 'デバイスの追加に失敗しました。');
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceNameToDelete: string) => {
    setMessage('');
    setError('');

    if (!deviceNameToDelete) {
      setError('Device name is required for deletion.');
      return;
    }

    try {
      const response = await fetch(`/api/devices/delete/${deviceNameToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete device: ${response.status} ${response.statusText}`);
      }

      setMessage(`Device "${deviceNameToDelete}" deleted successfully.`);
      loadDevices(); 
    } catch (e: unknown) {
      console.error('デバイス削除エラー:', e);
      let errorMessage = 'デバイスの削除に失敗しました。';
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') { 
        errorMessage = e;
      }
      setError(errorMessage || 'デバイスの削除に失敗しました。');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Wake on LAN WebUI</h1>
      <div className="mb-4">
        <label htmlFor="device-select" className="block text-gray-700 text-sm font-bold mb-2">
          デバイスを選択:
        </label>
        <select
          id="device-select"
          value={selectedDeviceName}
          onChange={handleDeviceChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">-- Select Device --</option>
          {devices.map((device) => (
            <option key={device.name} value={device.name}>
              {device.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={wakeOnLan}
        disabled={!selectedDeviceName}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 mb-4"
      >
        Wake Device
      </button>
      <div className="mb-4 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2 text-gray-700">デバイスリスト</h2>
        {devices.length > 0 ? (
          <ul className="border rounded shadow-sm">
            {devices.map((device) => (
              <li key={device.name} className="px-4 py-2 border-b last:border-b-0 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{device.name}</span>
                  <span className="text-gray-500 ml-2">({device.macAddress})</span>
                </div>
                <button
                  onClick={() => handleDeleteDevice(device.name)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm focus:outline-none focus:shadow-outline"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No devices added yet.</p>
        )}
      </div>

      <div className="mb-4 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2 text-gray-700">デバイスを追加</h2>
        <form onSubmit={handleAddDevice} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="deviceName" className="block text-gray-700 text-sm font-bold mb-2">
              デバイス名:
            </label>
            <input
              type="text"
              id="deviceName"
              placeholder="e.g., PC-A"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="macAddress" className="block text-gray-700 text-sm font-bold mb-2">
              MACアドレス:
            </label>
            <input
              type="text"
              id="macAddress"
              placeholder="e.g., 00:11:22:33:44:55"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newMacAddress}
              onChange={(e) => setNewMacAddress(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isAddingDevice ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isAddingDevice} 
            >
              {isAddingDevice ? 'Adding...' : '追加'}
            </button>
          </div>
        </form>
      </div>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}