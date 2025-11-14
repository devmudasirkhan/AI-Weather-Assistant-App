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
      className={`
    p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${bgGradient} shadow-lg border ${borderColor} backdrop-blur-sm
    transition-transform hover:scale-[1.02] hover:shadow-xl
    max-w-full sm:max-w-md
  `}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex-1">
          <div className="text-base sm:text-lg font-bold text-gray-100 mb-1">
            {location_name}, {country}
          </div>
          <div className="text-xs sm:text-sm text-gray-300/80 font-medium">{condition_text}</div>
        </div>
        <div className={`${iconColor} ml-2 sm:ml-3`}>
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
            {/* svg path */}
          </svg>
        </div>
      </div>

      <div className="text-3xl sm:text-5xl font-bold text-gray-100 mt-2">{temperature_celsius}°C</div>

      <div className="mt-2 sm:mt-3 text-xs sm:text-sm opacity-80 flex flex-wrap gap-2 sm:gap-3">
        <span>💧 Humidity: {humidity}%</span>
        <span>💨 Wind: {wind_kph} kph {wind_dir}</span>
      </div>
    </div>
  );
}
