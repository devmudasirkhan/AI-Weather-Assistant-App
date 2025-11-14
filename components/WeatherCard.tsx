'use client';
import React from 'react';

export default function WeatherCard({
  location_name,
  temperature_celsius,
  condition_text,
  condition_code,
}: {
  location_name: string;
  temperature_celsius: number;
  condition_text: string;
  condition_code: number;
}) {
  let bg = 'bg-slate-200';
  if (condition_code === 1000) bg = 'bg-yellow-200';
  else if (condition_code >= 1003 && condition_code <= 1030) bg = 'bg-slate-200';
  else if (condition_code >= 1063) bg = 'bg-blue-300';

  return (
    <div
      className={`p-4 rounded-xl shadow-inner border border-white/30 backdrop-blur-md ${bg}`}
    >
      <div className="text-xl font-bold">{location_name}</div>
      <div className="text-4xl font-semibold mt-1">{temperature_celsius}°C</div>
      <div className="text-sm opacity-80 mt-1">{condition_text}</div>
    </div>
  );
}
