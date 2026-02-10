
import React from 'react';
import { Staff } from '../types';

interface StaffProps {
  staff: Staff[];
  onToggleClock: (id: string) => void;
}

const StaffView: React.FC<StaffProps> = ({ staff, onToggleClock }) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Team & Attendance</h2>
        <p className="text-slate-500">Manage employee shifts and status.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(member => (
          <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
                  {member.role === 'Manager' ? '👔' : '☕'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{member.name}</h4>
                  <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">{member.role}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.isClockedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                {member.isClockedIn ? 'Active' : 'Offline'}
              </div>
            </div>

            <div className="flex-1 bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 font-bold uppercase mb-2">Current Shift</p>
              {member.isClockedIn ? (
                <p className="text-slate-800 font-medium">Started at {new Date(member.lastClockIn || Date.now()).toLocaleTimeString()}</p>
              ) : (
                <p className="text-slate-400 italic">Not clocked in</p>
              )}
            </div>

            <button
              onClick={() => onToggleClock(member.id)}
              className={`w-full py-3 rounded-2xl font-bold transition-all shadow-md ${
                member.isClockedIn 
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-rose-100' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {member.isClockedIn ? 'Clock Out' : 'Clock In'}
            </button>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all group">
          <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            +
          </div>
          <p className="font-bold">Add Staff Member</p>
        </button>
      </div>
    </div>
  );
};

export default StaffView;
