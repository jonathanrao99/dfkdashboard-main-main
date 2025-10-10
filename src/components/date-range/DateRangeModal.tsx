'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type Preset = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear';
type Grain = 'hour' | 'day' | 'month';

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'today',      label: 'Today' },
  { key: 'yesterday',  label: 'Yesterday' },
  { key: 'thisWeek',   label: 'This week' },
  { key: 'lastWeek',   label: 'Last week' },
  { key: 'thisMonth',  label: 'This month' },
  { key: 'lastMonth',  label: 'Last month' },
  { key: 'thisYear',   label: 'This year' },
  { key: 'lastYear',   label: 'Last year' },
];

export type PickerValue = { mode: 'preset'; preset: Preset };

const presetToGrain = (p: Preset): Grain =>
  p === 'thisYear' || p === 'lastYear' ? 'month' : (p === 'today' || p === 'yesterday' ? 'hour' : 'day');

export default function DateRangeModal({
  open, onOpenChange, value, onApply
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: PickerValue;
  onApply: (v: PickerValue, grain: Grain) => void;
}) {
  const [activePreset, setActivePreset] = useState<Preset | 'custom'>(value.mode === 'preset' ? value.preset : 'custom');

  const handlePreset = (p: Preset | 'custom') => {
    setActivePreset(p);
    if (p === 'custom') return;
    onApply({ mode: 'preset', preset: p as Preset }, presetToGrain(p as Preset));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50" />
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-[320px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Select date range</DialogTitle>

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm font-medium">Select date range</div>
          <button className="rounded-md p-1 hover:bg-gray-50" onClick={()=>onOpenChange(false)} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* preset options */}
        <div className="p-3">
          <div className="flex flex-col gap-1">
            {PRESETS.map(p => {
              const active = p.key === activePreset;
              return (
                <button
                  key={p.key}
                  onClick={() => handlePreset(p.key)}
                  className={`w-full text-left text-[13px] px-3 py-2 rounded-lg border transition-colors
                             ${active
                               ? 'bg-[#eaf1ff] border-[#bdd2ff] text-[#0f172a]'
                               : 'bg-white border-[#e5e7eb] hover:bg-gray-50'}`}>
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* actions */}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" className="h-8 px-3" onClick={()=>onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}