import React from 'react';
import { useCV } from '../../context/CVContext';

const PersonalInfoForm = () => {
  const { cvData, updatePersonalInfo } = useCV();
  const { personalInfo } = cvData;

  const handleChange = (e) => {
    updatePersonalInfo({ [e.target.name]: e.target.value });
  };

  const fields = [
    { name: 'fullName', label: 'Full Name *', placeholder: 'Alex Johnson', type: 'text' },
    { name: 'jobTitle', label: 'Job Title', placeholder: 'Senior Full Stack Developer', type: 'text' },
    { name: 'email', label: 'Email *', placeholder: 'alex@email.com', type: 'email' },
    { name: 'phone', label: 'Phone *', placeholder: '+1 (555) 234-5678', type: 'tel' },
    { name: 'location', label: 'Location', placeholder: 'San Francisco, CA', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', type: 'url' },
    { name: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...', type: 'url' },
    { name: 'portfolio', label: 'Portfolio/Website', placeholder: 'https://yoursite.com', type: 'url' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((field) => (
        <div key={field.name} className={field.name === 'fullName' || field.name === 'jobTitle' ? 'sm:col-span-2' : ''}>
          <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={personalInfo[field.name] || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      ))}
    </div>
  );
};

export default PersonalInfoForm;
