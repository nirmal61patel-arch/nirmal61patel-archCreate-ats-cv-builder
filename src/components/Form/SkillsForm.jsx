import React from 'react';
import { useCV } from '../../context/CVContext';

const SkillsForm = () => {
  const { cvData, updateSkills } = useCV();
  const skills = cvData.skills || [];

  const addSkillCategory = () => {
    updateSkills([...skills, { id: Date.now().toString(), category: '', skills: '' }]);
  };

  const removeSkillCategory = (id) => {
    updateSkills(skills.filter((s) => s.id !== id));
  };

  const updateSkillCategory = (id, field, value) => {
    updateSkills(skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.id} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={skill.category}
              onChange={(e) => updateSkillCategory(skill.id, 'category', e.target.value)}
              placeholder="Category (e.g., Programming Languages)"
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="text"
              value={skill.skills}
              onChange={(e) => updateSkillCategory(skill.id, 'skills', e.target.value)}
              placeholder="Skills (comma separated)"
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={() => removeSkillCategory(skill.id)}
            className="text-red-400 hover:text-red-600 p-2 mt-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addSkillCategory}
        className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Add Skill Category
      </button>
    </div>
  );
};

export default SkillsForm;
