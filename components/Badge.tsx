import React from 'react';

interface BadgeProps { 
  label: string; 
  icon: React.ReactNode; 
  color: 'blue' | 'purple' | 'emerald';
}

export const Badge: React.FC<BadgeProps> = ({ label, icon, color }) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[color]}`}>
      {icon} {label}
    </span>
  );
};