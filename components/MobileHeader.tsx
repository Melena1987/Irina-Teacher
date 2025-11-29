import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenMenu }) => {
  return (
    <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
      <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
        IrinaTeacher
      </h1>
      <button onClick={onOpenMenu} className="p-1">
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};