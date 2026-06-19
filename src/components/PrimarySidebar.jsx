import React from 'react';
import { Image, LayoutTemplate, Palette, Type } from 'lucide-react';

const TABS = [
  { id: 'uploads', icon: Image, label: 'Uploads' },
  { id: 'layouts', icon: LayoutTemplate, label: 'Layouts' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'backgrounds', icon: Palette, label: 'Backgrounds' }
];

export default function PrimarySidebar({ activeTab, onTabSelect }) {
  return (
    <div className="primary-sidebar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <div 
            key={tab.id}
            className={`primary-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabSelect(tab.id)}
            title={tab.label}
          >
            <Icon size={24} />
            <span>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}
