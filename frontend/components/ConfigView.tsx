import React, { useState } from 'react';
import { StoreConfig } from '../types';

interface Props {
  config: StoreConfig;
  onSave: (c: StoreConfig) => Promise<void>;
}

const ConfigView: React.FC<Props> = ({ config, onSave }) => {
  const [local, setLocal] = useState(config);

  return (
    <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-black text-slate-800 mb-6">Store Settings</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Store Name</label>
          <input
            value={local.name}
            onChange={e => setLocal({ ...local, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Currency (ISO)</label>
          <input
            value={local.currency}
            onChange={e => setLocal({ ...local, currency: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Tax Rate</label>
          <input
            type="number"
            step="0.01"
            value={local.taxRate}
            onChange={e => setLocal({ ...local, taxRate: +e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold"
          />
        </div>

        <button
          onClick={() => onSave(local)}
          className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-black shadow-lg"
        >
          SAVE SETTINGS
        </button>
      </div>
    </div>
  );
};

export default ConfigView;
