'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Tooltip from '@/components/Tooltip';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊', tooltip: 'Overview of recruitment metrics' },
  { href: '/requisitions', label: 'Requisitions', icon: '📋', tooltip: 'Manage job requisition requests' },
  { href: '/postings', label: 'Job Postings', icon: '🏢', tooltip: 'Published job listings and boards' },
  { href: '/candidates', label: 'Candidates', icon: '👤', tooltip: 'Candidate database and search' },
  { href: '/pipeline', label: 'Pipeline', icon: '🔀', tooltip: 'Visual recruitment pipeline board' },
  { href: '/team', label: 'Team', icon: '👥', tooltip: 'HR team members and roles' },
  { href: '/offers', label: 'Offers', icon: '📨', tooltip: 'Offer letters and e-signatures' },
  { href: '/analytics', label: 'Analytics', icon: '📈', tooltip: 'Reports and hiring metrics' },
  { href: '/audit-logs', label: 'Audit Logs', icon: '📝', tooltip: 'Security and compliance logs' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar-bg text-white rounded-lg shadow-lg"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar-bg z-40 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <span className="text-2xl">🏢</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">HR Platform</h1>
              <p className="text-sidebar-text text-xs">Recruitment Suite</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Tooltip key={item.href} content={item.tooltip} side="right">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-sidebar-active text-sidebar-textActive'
                      : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive'
                  }`}
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive(item.href) && (
                    <span className="ml-auto w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  )}
                </Link>
              </Tooltip>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10">
            <p className="text-xs text-sidebar-text">Powered by Cosmic CMS</p>
          </div>
        </div>
      </aside>
    </>
  );
}