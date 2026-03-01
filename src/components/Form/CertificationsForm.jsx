import React from 'react';
import { useCV } from '../../context/CVContext';

const CertificationsForm = () => {
  const { cvData, updateCertifications } = useCV();
  const certifications = cvData.certifications || [];

  const addCert = () => {
    updateCertifications([
      ...certifications,
      { id: Date.now().toString(), name: '', organization: '', dateObtained: '', expirationDate: '' },
    ]);
  };

  const removeCert = (id) => {
    updateCertifications(certifications.filter((c) => c.id !== id));
  };

  const updateField = (id, field, value) => {
    updateCertifications(certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Certification {index + 1}</span>
            <button onClick={() => removeCert(cert.id)} className="text-red-400 hover:text-red-600 text-sm">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { field: 'name', label: 'Certification Name', placeholder: 'AWS Certified Solutions Architect', span: true },
              { field: 'organization', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
              { field: 'dateObtained', label: 'Date Obtained', placeholder: 'Mar 2022' },
              { field: 'expirationDate', label: 'Expiration Date (optional)', placeholder: 'Mar 2025' },
            ].map(({ field, label, placeholder, span }) => (
              <div key={field} className={span ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={cert[field] || ''}
                  onChange={(e) => updateField(cert.id, field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={addCert}
        className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;
