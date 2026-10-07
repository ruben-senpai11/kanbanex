'use client';

import React from 'react';
import { X, Filter, Check, RotateCcw } from 'lucide-react';

interface BoardFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  labels: Array<{ id: string; name: string; color: string }>;
  selectedLabelId: string;
  onLabelChange: (id: string) => void;
  onReset: () => void;
}

export function BoardFilterModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  labels = [],
  selectedLabelId,
  onLabelChange,
  onReset,
}: BoardFilterModalProps) {
  if (!isOpen) return null;

  const priorities = [
    { id: '', label: 'Toutes les priorités' },
    { id: 'URGENT', label: '🔴 Urgent' },
    { id: 'HIGH', label: '🟠 Haute' },
    { id: 'MEDIUM', label: '🟡 Moyenne' },
    { id: 'LOW', label: '🔵 Basse' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center pt-24 px-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-4 space-y-4 z-10 text-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900">Filtrer les cartes</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onReset}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Réinitialiser les filtres"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mot-clé */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Recherche par titre
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filtrer par mot-clé..."
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 shadow-2xs"
          />
        </div>

        {/* Priorité */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Priorité
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {priorities.map((p) => (
              <button
                key={p.id}
                onClick={() => onPriorityChange(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                  selectedPriority === p.id
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <span>{p.label}</span>
                {selectedPriority === p.id && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        {labels.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Étiquettes
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onLabelChange('')}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  !selectedLabelId
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toutes
              </button>
              {labels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onLabelChange(selectedLabelId === l.id ? '' : l.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1 transition-all ${
                    selectedLabelId === l.id ? 'ring-2 ring-orange-500 ring-offset-1' : ''
                  }`}
                  style={{
                    backgroundColor: `${l.color}15`,
                    borderColor: `${l.color}60`,
                    color: l.color,
                  }}
                >
                  <span>{l.name}</span>
                  {selectedLabelId === l.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
