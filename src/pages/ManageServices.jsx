import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { showToast } from '../utils/alerts';
import { FiTool, FiCheckCircle, FiEdit2, FiLayers, FiShield, FiCpu, FiExternalLink, FiLoader, FiSave } from 'react-icons/fi';

export default function ManageServices() {
  const [activeTab, setActiveTab] = useState('rm');
  const [isSaving, setIsSaving] = useState(false);

  // Hard Services (R&M)
  const [rmServices, setRmServices] = useState([
    {
      id: 'rm-1',
      title: 'HVAC & Chiller Plants Overhaul',
      tag: 'Critical Climate Control',
      summary: 'Comprehensive descaling, vibration harmonics telemetry, and central AHU filter overhauls for uninterrupted comfort.',
      scope: 'Chiller descaling, refrigerant leak scans, compressor overhauls, BMS dampers'
    },
    {
      id: 'rm-2',
      title: 'Electrical & Power Infrastructure',
      tag: 'High-Tension & Low-Tension',
      summary: 'Infrared thermography, transformer oil DGA analysis, DG synchronization, and LT/HT switchgear preventive overhauls.',
      scope: 'Panel thermography, relay calibration, DG load banks, Earth pit resistance testing'
    },
    {
      id: 'rm-3',
      title: 'Plumbing & Hydro-Pneumatics (PHE)',
      tag: 'Water Pumping Networks',
      summary: 'Hydro-pneumatic booster pump maintenance, STPs/WTPs biological balance audits, and high-pressure desilting.',
      scope: 'Pressure vessel calibration, STP DO level monitoring, sensorized flush valves'
    },
    {
      id: 'rm-4',
      title: 'Fire & Life Safety Compliance',
      tag: 'NBC 2016 Certified',
      summary: 'Fire hydrant flow tests, smoke detector sensitivity loops, sprinkler line pressure tests, and statutory NOC renewals.',
      scope: 'Jockey pump auto-starts, diesel engine fire pumps, suppression systems'
    }
  ]);

  // Integrated FM Services (Soft + Tech)
  const [ifmServices, setIfmServices] = useState([
    {
      id: 'ifm-1',
      title: 'Corporate Mechanized Housekeeping',
      tag: 'Deep Sanitation & IAQ',
      summary: 'Hospital-grade surface sanitization, micro-fiber dust control, and automated floor scrubbers for high-traffic environments.',
      scope: 'Ride-on auto scrubbers, carpet injection-extraction, single-disc buffing'
    },
    {
      id: 'ifm-2',
      title: 'Façade Access & High-Rise Glass Maintenance',
      tag: 'Rope Access & BMU',
      summary: 'Certified rope-access spider-men and cradle BMU teams for exterior structural glass and ACP restoration.',
      scope: 'Anchor point testing, safety harnesses, hydrophobic glass coating'
    },
    {
      id: 'ifm-3',
      title: 'Vigyani.ai Smart IoT Energy Telemetry',
      tag: 'AI-Powered Anomaly Detection',
      summary: 'Continuous acoustic, thermal, and current harmonic monitoring directly on critical plant machinery.',
      scope: 'IoT vibration sensors, cloud dashboard, automated work orders'
    }
  ]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Service portfolio details saved successfully!', 'success');
    }, 600);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FiTool className="text-[#c1121f]" />
              Manage Service Content
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure Hard Services (R&M) & Integrated FM modules according to the DigiCoders Proposal.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('rm')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rm' ? 'bg-white text-[#0b1d3a] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hard Services (R&M)
            </button>
            <button
              onClick={() => setActiveTab('ifm')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ifm' ? 'bg-white text-[#0b1d3a] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Integrated FM (Soft + AI)
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === 'rm' ? rmServices : ifmServices).map((svc, index) => (
              <div
                key={svc.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-[#c1121f] transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#c1121f]">
                    Service Module #{index + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {svc.tag}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={svc.title}
                    onChange={(e) => {
                      const updated = (activeTab === 'rm' ? [...rmServices] : [...ifmServices]);
                      updated[index].title = e.target.value;
                      activeTab === 'rm' ? setRmServices(updated) : setIfmServices(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Presentation Summary / Value Prop
                  </label>
                  <textarea
                    rows={2}
                    value={svc.summary}
                    onChange={(e) => {
                      const updated = (activeTab === 'rm' ? [...rmServices] : [...ifmServices]);
                      updated[index].summary = e.target.value;
                      activeTab === 'rm' ? setRmServices(updated) : setIfmServices(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Core Technical Scope Points
                  </label>
                  <input
                    type="text"
                    value={svc.scope}
                    onChange={(e) => {
                      const updated = (activeTab === 'rm' ? [...rmServices] : [...ifmServices]);
                      updated[index].scope = e.target.value;
                      activeTab === 'rm' ? setRmServices(updated) : setIfmServices(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1d3a] text-white text-xs font-black shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              {isSaving ? (
                <FiLoader className="text-base animate-spin text-[#c1121f]" />
              ) : (
                <FiCheckCircle className="text-base" />
              )}
              <span>{isSaving ? 'Updating Portfolio...' : 'Update Service Portfolio'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
