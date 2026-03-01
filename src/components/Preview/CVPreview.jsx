import React from 'react';
import { useCV } from '../../context/CVContext';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import TechTemplate from './templates/TechTemplate';

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  tech: TechTemplate,
};

const CVPreview = () => {
  const { selectedTemplate, colorTheme, cvData, sectionsOrder } = useCV();
  const TemplateComponent = TEMPLATES[selectedTemplate] || ClassicTemplate;

  const orderedCvData = {
    ...cvData,
    _sectionsOrder: sectionsOrder,
  };

  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden">
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden" style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%', minHeight: '800px' }}>
        <TemplateComponent cvData={orderedCvData} colorTheme={colorTheme} />
      </div>
    </div>
  );
};

export default CVPreview;
