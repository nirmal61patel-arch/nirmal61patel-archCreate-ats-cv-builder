import React from 'react';
import { useCV } from '../../context/CVContext';

const ExperienceForm = () => {
  const { cvData, updateExperience } = useCV();
  const experience = cvData.experience || [];

  const addExperience = () => {
    updateExperience([
      ...experience,
      {
        id: Date.now().toString(),
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isPresent: false,
        bullets: [''],
      },
    ]);
  };

  const removeExperience = (id) => {
    updateExperience(experience.filter((e) => e.id !== id));
  };

  const updateField = (id, field, value) => {
    updateExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const addBullet = (id) => {
    updateExperience(
      experience.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
    );
  };

  const removeBullet = (id, index) => {
    updateExperience(
      experience.map((e) =>
        e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
      )
    );
  };

  const updateBullet = (id, index, value) => {
    updateExperience(
      experience.map((e) =>
        e.id === id
          ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) }
          : e
      )
    );
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, expIndex) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Position {expIndex + 1}</span>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { field: 'jobTitle', label: 'Job Title', placeholder: 'Senior Developer' },
              { field: 'company', label: 'Company', placeholder: 'Tech Corp' },
              { field: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={exp[field] || ''}
                  onChange={(e) => updateField(exp.id, field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="text"
                value={exp.startDate || ''}
                onChange={(e) => updateField(exp.id, 'startDate', e.target.value)}
                placeholder="Jan 2021"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={exp.endDate || ''}
                  onChange={(e) => updateField(exp.id, 'endDate', e.target.value)}
                  placeholder="Dec 2023"
                  disabled={exp.isPresent}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100"
                />
                <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={exp.isPresent || false}
                    onChange={(e) => updateField(exp.id, 'isPresent', e.target.checked)}
                    className="rounded"
                  />
                  Present
                </label>
              </div>
            </div>
          </div>

          {/* Bullets */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Responsibilities / Achievements</label>
            <div className="space-y-2">
              {(exp.bullets || []).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2 items-start">
                  <span className="text-gray-400 mt-2 text-xs">•</span>
                  <textarea
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, bulletIndex, e.target.value)}
                    placeholder="Describe your achievement or responsibility..."
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                  <button
                    onClick={() => removeBullet(exp.id, bulletIndex)}
                    className="text-red-400 hover:text-red-600 mt-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addBullet(exp.id)}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700"
            >
              + Add bullet point
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Add Work Experience
      </button>
    </div>
  );
};

export default ExperienceForm;
