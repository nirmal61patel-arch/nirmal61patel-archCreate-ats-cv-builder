import React, { createContext, useContext, useState } from 'react';
import { sampleData } from '../utils/sampleData';
import { DEFAULT_SECTIONS_ORDER } from '../utils/constants';

const CVContext = createContext(null);

export const CVProvider = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [colorTheme, setColorTheme] = useState('#1e3a5f');
  const [sectionsOrder, setSectionsOrder] = useState(DEFAULT_SECTIONS_ORDER);
  const [cvData, setCvData] = useState(sampleData);

  const updatePersonalInfo = (data) => {
    setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }));
  };

  const updateSummary = (summary) => {
    setCvData(prev => ({ ...prev, summary }));
  };

  const updateSkills = (skills) => {
    setCvData(prev => ({ ...prev, skills }));
  };

  const updateExperience = (experience) => {
    setCvData(prev => ({ ...prev, experience }));
  };

  const updateEducation = (education) => {
    setCvData(prev => ({ ...prev, education }));
  };

  const updateCertifications = (certifications) => {
    setCvData(prev => ({ ...prev, certifications }));
  };

  const updateProjects = (projects) => {
    setCvData(prev => ({ ...prev, projects }));
  };

  return (
    <CVContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate,
        colorTheme,
        setColorTheme,
        sectionsOrder,
        setSectionsOrder,
        cvData,
        updatePersonalInfo,
        updateSummary,
        updateSkills,
        updateExperience,
        updateEducation,
        updateCertifications,
        updateProjects,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within CVProvider');
  return context;
};
