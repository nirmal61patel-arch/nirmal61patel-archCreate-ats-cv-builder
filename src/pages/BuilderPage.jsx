import React, { useState } from 'react';
import CVForm from '../components/Form/CVForm';
import CVPreview from '../components/Preview/CVPreview';
import DownloadButton from '../components/Download/DownloadButton';
import { useCV } from '../context/CVContext';
import { TEMPLATES } from '../utils/constants';

const BuilderPage = () => {
  const { selectedTemplate, setSelectedTemplate } = useCV();
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="max-w-full mx-auto">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Template:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Preview
          </button>
        </div>

        <DownloadButton />
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-128px)]">
        {/* Form Panel */}
        <div className={`${activeTab === 'form' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-1/2 border-r border-gray-200 overflow-y-auto bg-gray-50 p-4`}>
          <CVForm />
        </div>

        {/* Preview Panel */}
        <div className={`${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-1/2 overflow-y-auto bg-gray-100 p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-600">Live Preview</h2>
            <span className="text-xs text-gray-400">75% scale</span>
          </div>
          <CVPreview />
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
