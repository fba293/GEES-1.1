/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';

interface CompactServicesSearchProps {
  onSelectService?: (service: any) => void;
  onViewAllServices?: () => void;
}

export const CompactServicesSearch: React.FC<CompactServicesSearchProps> = ({
  onViewAllServices
}) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden my-8" data-purpose="compact-search-widget">
      <div className="p-3 bg-gradient-to-b from-[#fbfbfe] to-white border-b border-slate-200 transition-all duration-300 relative group/searchbox">
        <div className="relative flex items-center h-14 pl-2.5 pr-3.5 rounded-full bg-white border border-[#e2e4ea] shadow-sm overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center mr-3 shrink-0"> 
            <span className="text-white text-xs font-black">AI</span>
          </div>
          <input 
            className="w-full h-full text-[16px] bg-transparent border-0 focus:outline-none" 
            placeholder="Search services, universities..." 
          />
        </div>
      </div>
      
      {/* Example Filter Buttons - Keeping UI structure as requested */}
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        <button className="p-4 text-left hover:bg-slate-50 transition-colors">
          <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
          <p className="text-sm font-medium">All Destinations</p>
        </button>
        <button className="p-4 text-left hover:bg-slate-50 transition-colors">
          <p className="text-[10px] uppercase font-bold text-slate-400">Field</p>
          <p className="text-sm font-medium">Any Subject</p>
        </button>
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <InteractiveHoverButton 
          text="Find Programs" 
          className="w-full h-10 rounded-full" 
          onClick={() => onViewAllServices?.()}
        />
      </div>
    </section>
  );
};
