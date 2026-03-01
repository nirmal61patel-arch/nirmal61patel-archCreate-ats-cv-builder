import React from 'react';
import { useCV } from '../../context/CVContext';

const EducationForm = () => {
  const { cvData, updateEducation } = useCV();
  const education = cvData.education || [];

  const addEducation = () => {
    updateEducation([
      ...education,
      { id: Date.now().toString(), degree: '', institution: '', location: '', graduationDate: '', gpa: '', coursework: '' },
    ]);
  };

  const removeEducation = (id) => {
    updateEducation(education.filter((e) => e.id !== id));
  };

  const updateField = (id, field, value) => {
    updateEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const fields = [
    { field: 'degree', label: 'Degree', placeholder: 'Bachelor of Science in Computer Science' },
    { field: 'institution', label: 'Institution', placeholder: 'University of California, Berkeley' },
    { field: 'location', label: 'Location', placeholder: 'Berkeley, CA' },
    { field: 'graduationDate', label: 'Graduation Date', placeholder: 'May 2020' },
    { field: 'gpa', label: 'GPA (optional)', placeholder: '3.8/4.0' },
    { field: 'coursework', label: 'Relevant Coursework (optional)', placeholder: 'Data Structures, Algorithms...' },
  ];

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Education {index + 1}</span>
            <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600 text-sm">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fields.map(({ field, label, placeholder }) => (
              <div key={field} className={field === 'degree' || field === 'coursework' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={edu[field] || ''}
                  onChange={(e) => updateField(edu.id, field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );
};

export default EducationForm;
