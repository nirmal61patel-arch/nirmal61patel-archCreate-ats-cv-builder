import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCV } from '../../context/CVContext';
import { generatePDF } from '../../utils/pdfGenerator';
import ClassicTemplate from '../Preview/templates/ClassicTemplate';
import ModernTemplate from '../Preview/templates/ModernTemplate';
import TechTemplate from '../Preview/templates/TechTemplate';
import ReactDOM from 'react-dom/client';

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  tech: TechTemplate,
};

const DownloadButton = () => {
  const { selectedTemplate, colorTheme, cvData } = useCV();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const { personalInfo } = cvData;
    const firstName = personalInfo?.fullName?.split(' ')[0] || 'CV';
    const lastName = personalInfo?.fullName?.split(' ').slice(1).join('_') || '';
    const fileName = lastName ? `${firstName}_${lastName}_CV.pdf` : `${firstName}_CV.pdf`;

    setIsGenerating(true);

    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.id = 'pdf-render-container';
      document.body.appendChild(tempDiv);

      const TemplateComponent = TEMPLATES[selectedTemplate] || TEMPLATES.classic;
      const root = ReactDOM.createRoot(tempDiv);
      root.render(<TemplateComponent cvData={cvData} colorTheme={colorTheme} />);

      await new Promise((resolve) => setTimeout(resolve, 500));

      await generatePDF('cv-preview', fileName);
      toast.success(`PDF downloaded as ${fileName}`);

      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
};

export default DownloadButton;
