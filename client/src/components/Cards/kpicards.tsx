// src/components/Cards/KPIcard.tsx
import React from "react";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
};

export default function KPIcard({ title, value, subtitle }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}
