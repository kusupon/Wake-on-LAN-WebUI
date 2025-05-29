'use client';

import React, { useEffect, useState } from 'react';
import { Power, Trash2, Moon, Sun } from 'lucide-react';

interface DeviceInfo {
  name: string;
  macAddress: string;
}

export default function WOLDashboard() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [search, setSearch] = useState('');
  const [newDevice, setNewDevice] = useState({ name: '', macAddress: '' });
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dark-mode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setError('');
    try {
      const res = await fetch('/api/devices');
      if (!res.ok) throw new Error('デバイスの取得に失敗しました');
      const data = await res.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'デバイスリストの読み込みに失敗しました');
    }
  };

  const wakeOnLan = async (deviceName: string) => {
    setMessage('');
    setError('');
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceName)}/wake`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) setMessage(data.message || 'WOLリクエストを送信しました');
      else throw new Error(data.message || 'Wake-on-LANに失敗しました');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'サーバーの接続に失敗しました');
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingDevice(true);
    setMessage('');
    setError('');
    if (!newDevice.name || !newDevice.macAddress) {
      setError('デバイス名とMACアドレスを入力してください');
      setIsAddingDevice(false);
      return;
    }
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'デバイスの追加に失敗しました');
      }
      setMessage('デバイスを追加しました');
      setNewDevice({ name: '', macAddress: '' });
      loadDevices();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'デバイスの追加に失敗しました');
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceName: string) => {
    setMessage('');
    setError('');
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(deviceName)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'デバイスの削除に失敗しました');
      }
      setMessage(`デバイス「${deviceName}」を削除しました`);
      loadDevices();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'デバイスの削除に失敗しました');
    }
  };

  const filteredDevices = Array.isArray(devices)
    ? devices.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.macAddress.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div
      className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 group/design-root overflow-x-hidden"
      style={{ fontFamily: `"Space Grotesk", "Noto Sans", sans-serif` }}
    >
      <header className="flex items-center justify-between border-b border-b-[#e7edf4] dark:border-b-slate-800 px-4 md:px-10 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <div className="flex items-center gap-4 text-[#0d141c] dark:text-white">
          <div className="w-4 h-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">WOL</h2>
        </div>
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7edf4] dark:bg-slate-700 hover:bg-[#d2dbe6] dark:hover:bg-slate-800 text-[#0d141c] dark:text-white transition-colors duration-150 ease-in-out"
          onClick={() => setDarkMode((v) => !v)}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <main className="flex flex-1 justify-center py-4 px-2 sm:px-4 md:px-10">
                <div className="flex flex-col w-full max-w-3xl">
          <div className="flex flex-wrap justify-between gap-3 p-2 sm:p-4">
            <p className="text-[#0d141c] dark:text-white text-[24px] sm:text-[32px] font-bold leading-tight min-w-44">Devices</p>
          </div>
          <div className="px-2 sm:px-4 py-3">
            <label className="flex flex-col min-w-32 h-12 w-full">
              <div className="flex w-full items-stretch rounded-xl h-full">
                <span className="text-[#49719c] flex border-none bg-[#e7edf4] dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                  </svg>
                </span>
                <input
                  placeholder="Search devices"
                  className="form-input w-full min-w-0 flex-1 rounded-xl text-[#0d141c] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] dark:bg-slate-800 focus:border-none h-full placeholder:text-[#49719c] dark:placeholder:text-[#90b4e8] px-4 rounded-l-none placeholder:text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </label>
          </div>
          <div className="px-2 sm:px-4 py-3 overflow-x-auto">
            <div className="flex overflow-hidden rounded-xl border border-[#cedbe8] dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <table className="min-w-[360px] w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <th className="px-2 sm:px-10 py-3 text-left text-[#0d141c] dark:text-white w-[160px] sm:w-[220px] text-xs sm:text-sm font-medium">Name</th>
                    <th className="px-2 sm:px-4 py-3 text-left text-[#0d141c] dark:text-white w-[160px] sm:w-[240px] text-xs sm:text-sm font-medium">MAC Address</th>
                    <th className="px-2 sm:px-4 py-3 text-left w-28 sm:w-40 text-[#49719c] dark:text-[#90b4e8] text-xs sm:text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <tr key={device.name} className="border-t border-t-[#cedbe8] dark:border-t-slate-700">
                        <td className="h-16 px-2 sm:px-10 py-2 text-[#0d141c] dark:text-white text-xs sm:text-sm">{device.name}</td>
                        <td className="h-16 px-2 sm:px-4 py-2 text-[#49719c] dark:text-[#90b4e8] text-xs sm:text-sm">{device.macAddress}</td>
                        <td className="h-16 px-2 sm:px-4 py-2 flex gap-2 items-center">
                          <button
                            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                            onClick={() => wakeOnLan(device.name)}
                            title="Wake"
                            aria-label="Wake"
                          >
                            <Power size={18} className="text-green-600 dark:text-green-400" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                            onClick={() => handleDeleteDevice(device.name)}
                            title="削除"
                            aria-label="削除"
                          >
                            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-400 dark:text-gray-600">No devices found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={handleAddDevice} className="w-full">
            <div className="flex flex-wrap gap-4 px-2 sm:px-4 py-3">
              <label className="flex flex-col min-w-32 flex-1">
                <p className="text-[#0d141c] dark:text-white text-base font-medium pb-2">Device Name</p>
                <input
                  placeholder="Enter device name"
                  className="form-input w-full rounded-xl text-[#0d141c] dark:text-white focus:outline-0 focus:ring-0 border border-[#cedbe8] dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-[#cedbe8] dark:focus:border-slate-700 h-12 placeholder:text-[#49719c] dark:placeholder:text-[#90b4e8] px-4 text-base placeholder:text-sm"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </label>
              <label className="flex flex-col min-w-32 flex-1">
                <p className="text-[#0d141c] dark:text-white text-base font-medium pb-2">MAC Address</p>
                <input
                  placeholder="Enter MAC address"
                  className="form-input w-full rounded-xl text-[#0d141c] dark:text-white focus:outline-0 focus:ring-0 border border-[#cedbe8] dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-[#cedbe8] dark:focus:border-slate-700 h-12 placeholder:text-[#49719c] dark:placeholder:text-[#90b4e8] px-4 text-base placeholder:text-sm"
                  value={newDevice.macAddress}
                  onChange={(e) => setNewDevice({ ...newDevice, macAddress: e.target.value })}
                />
              </label>
            </div>
            <div className="flex px-2 sm:px-4 py-3 justify-end">
              <button
                className={`flex min-w-[84px] max-w-[320px] cursor-pointer items-center justify-center rounded-full h-10 px-4 bg-slate-400 dark:bg-slate-700 hover:bg-slate-600 dark:hover:bg-slate-500 text-white text-sm font-bold tracking-[0.015em] ${isAddingDevice ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isAddingDevice}
              >
                {isAddingDevice ? '追加中...' : 'Add Device'}
              </button>
            </div>
          </form>
          {(message || error) && (
            <div className="flex justify-center pt-2">
              {message && <span className="text-green-500">{message}</span>}
              {error && <span className="text-red-500">{error}</span>}
            </div>
          )}
        </div>
      </main>

      <footer className="flex justify-center">
        <div className="flex max-w-3xl w-full flex-col">
          <footer className="flex flex-col gap-4 px-2 sm:px-5 py-6 sm:py-10 text-center">
            <p className="text-[#49719c] dark:text-[#90b4e8] text-base font-normal leading-normal">
              ©2025 WOL. All rights reserved.
            </p>
          </footer>
        </div>
      </footer>
    </div>
  );
}
