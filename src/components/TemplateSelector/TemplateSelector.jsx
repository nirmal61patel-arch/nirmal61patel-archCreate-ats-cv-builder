import React from 'react';
import TemplateCard from './TemplateCard';
import { TEMPLATES } from '../../utils/constants';

const TemplateSelector = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your CV Template
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our ATS-friendly templates designed for IT professionals.
          All templates are optimized for Applicant Tracking Systems.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      <div className="mt-12 bg-blue-50 rounded-xl p-6 max-w-3xl mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">✓ ATS-Optimized Templates</h3>
        <p className="text-sm text-blue-700">
          All templates follow ATS best practices: single-column layout, standard fonts, no images or tables,
          standard section headings, and clean formatting for maximum compatibility with hiring systems.
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;
