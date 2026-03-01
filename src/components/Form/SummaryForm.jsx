import React from 'react';
import { useCV } from '../../context/CVContext';

const SummaryForm = () => {
  const { cvData, updateSummary } = useCV();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Professional Summary
      </label>
      <textarea
        value={cvData.summary || ''}
        onChange={(e) => updateSummary(e.target.value)}
        rows={4}
        placeholder="Write a brief professional summary highlighting your key skills, experience, and career goals..."
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
      />
      <p className="text-xs text-gray-400 mt-1">{(cvData.summary || '').length} characters</p>
    </div>
  );
};

export default SummaryForm;
