import React, { useState } from 'react';
import { FiTrendingUp, FiPieChart, FiActivity } from 'react-icons/fi';

export default function DashboardCharts({ enquiries = [], homepageContent = null }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Dynamically calculate monthly distribution from real enquiries
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group real enquiries by month
  const monthlyCounts = {};
  monthNames.forEach(m => {
    monthlyCounts[m] = { audits: 0, resolved: 0 };
  });

  enquiries.forEach(enq => {
    if (!enq.date) return;
    const d = new Date(enq.date);
    if (!isNaN(d.getTime())) {
      const mName = monthNames[d.getMonth()];
      if (monthlyCounts[mName]) {
        monthlyCounts[mName].audits += 1;
        if (enq.status === 'Completed' || enq.status === 'Scheduled' || enq.status === 'Reviewed') {
          monthlyCounts[mName].resolved += 1;
        }
      }
    }
  });

  // Pick the last 6 months up to current month (or default first 6)
  const currentMonthIdx = new Date().getMonth();
  const last6MonthIndices = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    last6MonthIndices.push(idx);
  }

  const monthlyData = last6MonthIndices.map(idx => {
    const m = monthNames[idx];
    const data = monthlyCounts[m] || { audits: 0, resolved: 0 };
    return {
      month: m,
      audits: data.audits,
      resolved: data.resolved
    };
  });

  // Calculate highest audit count for dynamic scaling (minimum 5)
  const maxVal = Math.max(5, ...monthlyData.map(d => Math.max(d.audits, d.resolved, 1)));

  // Dynamically compute Industry Distribution from enquiries facilityType
  const sectorColorMap = {
    'Hospitality / 5-Star Hotel': 'bg-[#c1121f]',
    'Commercial Shopping Mall': 'bg-amber-500',
    'Corporate Tech Park': 'bg-[#0b1d3a]',
    'Healthcare & Hospitals': 'bg-emerald-600',
    'Industrial & Manufacturing Plant': 'bg-indigo-600',
    'Luxury Residential Estate': 'bg-rose-500'
  };

  const defaultColors = ['bg-[#c1121f]', 'bg-[#0b1d3a]', 'bg-amber-500', 'bg-emerald-600', 'bg-purple-600', 'bg-sky-600'];

  const typeCounts = {};
  enquiries.forEach(enq => {
    const type = enq.facilityType?.trim() || 'General Commercial Facility';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const totalEnquiriesCount = enquiries.length || 1;
  const sortedSectors = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  const sectorData = sortedSectors.length > 0 ? sortedSectors.map(([name, count], index) => ({
    name,
    count: `${count} site${count > 1 ? 's' : ''}`,
    percent: Math.round((count / totalEnquiriesCount) * 100),
    color: sectorColorMap[name] || defaultColors[index % defaultColors.length]
  })) : [
    { name: 'Hospitality & Luxury Hotels', percent: 40, count: '0 sites', color: 'bg-[#c1121f]' },
    { name: 'Commercial IT Parks & BPOs', percent: 30, count: '0 sites', color: 'bg-[#0b1d3a]' },
    { name: 'Shopping Malls & Retail', percent: 20, count: '0 sites', color: 'bg-amber-500' },
    { name: 'Healthcare & Hospitals', percent: 10, count: '0 sites', color: 'bg-emerald-600' }
  ];

  const targetUptime = homepageContent?.uptimeGuarantee || '99.8%';
  const leadAnchorClient = homepageContent?.milestone2 || 'Taj Palace Hotel Lucknow (5-Star)';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Audit Demand Trend (2 Cols) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FiTrendingUp className="text-[#c1121f]" />
                Audit Requests & Service SLA Velocity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly commercial facility health audits & maintenance tickets
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              +28% MoM Growth
            </span>
          </div>

          {/* Custom SVG / Bar Chart Representation */}
          <div className="mt-8">
            <div className="flex items-end justify-between h-48 sm:h-56 gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-200 px-2">
              {monthlyData.map((item, idx) => {
                const heightPercent = Math.round((item.audits / maxVal) * 100);
                const resolvedHeight = Math.round((item.resolved / maxVal) * 100);
                const isHovered = activeTooltip === idx;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setActiveTooltip(idx)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg animate-in fade-in zoom-in duration-150">
                        {item.month}: {item.audits} Inquiries ({item.resolved} Resolved)
                      </div>
                    )}

                    {/* Dual Bars */}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Audits Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-1/2 rounded-t-md bg-[#0b1d3a] group-hover:bg-[#c1121f] transition-all duration-200 relative shadow-sm"
                      ></div>
                      {/* Resolved Bar */}
                      <div
                        style={{ height: `${resolvedHeight}%` }}
                        className="w-1/2 rounded-t-md bg-slate-200 group-hover:bg-slate-300 transition-all duration-200"
                      ></div>
                    </div>

                    <span className="text-[11px] font-black text-slate-600">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#0b1d3a]"></span>
                <span>Audit Enquiries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200"></span>
                <span>SLA Resolved / Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Source: Spartans CRM Telemetry Engine</span>
          <span className="font-bold text-slate-800">Target Uptime: {targetUptime}</span>
        </div>
      </div>

      {/* Sector Mix / Client Footprint Breakdown (1 Col) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FiPieChart className="text-[#0b1d3a]" />
                Industry Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active commercial square footage mix ({totalEnquiriesCount} active {totalEnquiriesCount === 1 ? 'account' : 'accounts'})
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {sectorData.map((sec) => (
              <div key={sec.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{sec.name}</span>
                  <span className="font-black text-slate-900">{sec.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${sec.percent}%` }}
                    className={`h-full rounded-full ${sec.color} transition-all duration-500`}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold text-right">
                  {sec.count} under contract
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-[#c1121f] flex items-center justify-center font-bold text-sm">
            <FiActivity />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900">Lead Anchor Client</div>
            <div className="text-slate-500 text-[11px] font-semibold">{leadAnchorClient}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
