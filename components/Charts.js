"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "./ThemeProvider";

function usePalette() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    axis: { stroke: dark ? "#5b6781" : "#9aa1b0", fontSize: 11 },
    grid: dark ? "#1c2740" : "#e7eaf0",
    legend: dark ? "#93a1b8" : "#525c6e",
  };
}

function TipBox({ active, payload, label, fmt }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-borderlight bg-card/95 px-3 py-2 shadow-card backdrop-blur">
      {label && <p className="mb-1 text-xs font-medium text-ink">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-semibold text-ink">{fmt ? fmt(p.value) : p.value?.toLocaleString?.() ?? p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AreaTrend({ data, x = "label", series, height = 260, fmt }) {
  const { axis, grid } = usePalette();
  // series: [{key, name, color}]
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey={x} tick={axis} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={48} tickFormatter={fmt} />
          <Tooltip content={<TipBox fmt={fmt} />} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#g-${s.key})`}
              dot={false}
              activeDot={{ r: 3.5 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiLine({ data, x = "label", series, height = 260, fmt }) {
  const { axis, grid, legend } = usePalette();
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey={x} tick={axis} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={44} tickFormatter={fmt} />
          <Tooltip content={<TipBox fmt={fmt} />} />
          <Legend wrapperStyle={{ fontSize: 12, color: legend }} iconType="circle" />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 3.5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Bars({ data, x = "label", series, height = 260, fmt, stacked = false, layout = "horizontal" }) {
  const vertical = layout === "vertical";
  const { axis, grid, legend } = usePalette();
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout={layout} margin={{ top: 8, right: 8, left: vertical ? 8 : 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={vertical} horizontal={!vertical} />
          {vertical ? (
            <>
              <XAxis type="number" tick={axis} tickLine={false} axisLine={false} tickFormatter={fmt} />
              <YAxis type="category" dataKey={x} tick={axis} tickLine={false} axisLine={false} width={130} />
            </>
          ) : (
            <>
              <XAxis dataKey={x} tick={axis} tickLine={false} axisLine={false} minTickGap={16} />
              <YAxis tick={axis} tickLine={false} axisLine={false} width={48} tickFormatter={fmt} />
            </>
          )}
          <Tooltip content={<TipBox fmt={fmt} />} cursor={{ fill: "rgba(127,127,127,0.08)" }} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: legend }} iconType="circle" />}
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              radius={vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              stackId={stacked ? "a" : undefined}
              maxBarSize={vertical ? 18 : 46}
            >
              {s.useCellColors &&
                data.map((d, i) => <Cell key={i} fill={d.color || s.color} />)}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Donut({ data, height = 240, fmt, nameKey = "name", dataKey = "value" }) {
  const { legend } = usePalette();
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color || ["#6366f1", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"][i % 6]} />
            ))}
          </Pie>
          <Tooltip content={<TipBox fmt={fmt} />} />
          <Legend wrapperStyle={{ fontSize: 12, color: legend }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
