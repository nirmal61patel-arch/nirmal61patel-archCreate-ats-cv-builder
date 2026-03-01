import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../../context/CVContext';

const TemplateCard = ({ template }) => {
  const { selectedTemplate, setSelectedTemplate } = useCV();
  const navigate = useNavigate();
  const isSelected = selectedTemplate === template.id;

  const handleSelect = () => {
    setSelectedTemplate(template.id);
    navigate('/builder');
  };

  const previewColors = {
    classic: { header: '#1e3a5f', accent: '#1e3a5f' },
    modern: { header: '#2563eb', accent: '#3b82f6' },
    tech: { header: '#0f172a', accent: '#22c55e' },
  };

  const colors = previewColors[template.id] || previewColors.classic;

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      {/* Template Preview */}
      <div className="bg-gray-100 p-4 h-64 flex items-center justify-center">
        <div className="bg-white shadow-md rounded w-36 h-52 p-2 text-left overflow-hidden" style={{ fontSize: '3px', lineHeight: '1.4' }}>
          {/* Name */}
          <div style={{ backgroundColor: colors.header }} className="h-4 rounded mb-1 flex items-center px-1">
            <div className="bg-white opacity-90 h-1.5 w-16 rounded" />
          </div>
          {/* Contact row */}
          <div className="flex gap-1 mb-1">
            <div className="bg-gray-300 h-0.5 flex-1 rounded" />
            <div className="bg-gray-300 h-0.5 flex-1 rounded" />
          </div>
          {/* Sections */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-1">
              <div style={{ backgroundColor: colors.accent }} className="h-1 w-12 rounded mb-0.5 opacity-80" />
              <div className="bg-gray-200 h-0.5 w-full rounded mb-0.5" />
              <div className="bg-gray-200 h-0.5 w-full rounded mb-0.5" />
              <div className="bg-gray-200 h-0.5 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Template Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          {isSelected && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Selected</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
        <button
          onClick={handleSelect}
          className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
          }`}
        >
          {isSelected ? 'Edit CV with this Template' : 'Use This Template'}
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
