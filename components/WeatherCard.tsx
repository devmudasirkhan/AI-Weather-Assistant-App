'use client';
import React from 'react';

interface WeatherCardProps {
  location_name: string;
  country: string;
  temperature_celsius: number;
  condition_text: string;
  condition_code: number;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
}

export default function WeatherCard({
  location_name,
  country,
  temperature_celsius,
  condition_text,
  condition_code,
  humidity,
  wind_kph,
  wind_dir,
}: WeatherCardProps) {
  let bgGradient = 'from-slate-700 to-slate-800';
  let iconColor = 'text-slate-300';
  let borderColor = 'border-slate-600/50';

  if (condition_code === 1000) {
    bgGradient = 'from-yellow-600/30 via-amber-600/30 to-yellow-700/30';
    iconColor = 'text-yellow-400';
    borderColor = 'border-yellow-500/30';
  } else if (condition_code >= 1003 && condition_code <= 1030) {
    bgGradient = 'from-slate-700 to-slate-800';
    iconColor = 'text-slate-300';
    borderColor = 'border-slate-600/50';
  } else if (condition_code >= 1063) {
    bgGradient = 'from-blue-600/30 via-blue-700/30 to-blue-800/30';
    iconColor = 'text-blue-400';
    borderColor = 'border-blue-500/30';
  }

  return (
    <div
      className={`p-5 rounded-2xl bg-gradient-to-br ${bgGradient} shadow-lg border ${borderColor} backdrop-blur-sm transition-transform hover:scale-[1.02] hover:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-100 mb-1">{location_name}, {country}</div>
          <div className="text-sm text-gray-300/80 font-medium">{condition_text}</div>
        </div>
        <div className={`${iconColor} ml-3`}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="text-5xl font-bold text-gray-100 mt-2">{temperature_celsius}°C</div>
      <div className="mt-3 text-sm opacity-80 flex flex-wrap gap-3">
        <span>💧 Humidity: {humidity}%</span>
        <span>💨 Wind: {wind_kph} kph {wind_dir}</span>
      </div>
    </div>
  );
}
