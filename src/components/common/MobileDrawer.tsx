import React from 'react';
import { UserRole } from '../../types/index.ts';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string, payload?: any) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onOpenSearch?: () => void;
  onRoleChange?: (role: UserRole) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 transition-opacity duration-300 animate-fadeIn pointer-events-auto"
      onClick={onClose}
      aria-hidden="true"
    />
  );
};

export default MobileDrawer;
