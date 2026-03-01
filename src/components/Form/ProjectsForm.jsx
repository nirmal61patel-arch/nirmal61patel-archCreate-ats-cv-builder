import React from 'react';
import { useCV } from '../../context/CVContext';

const ProjectsForm = () => {
  const { cvData, updateProjects } = useCV();
  const projects = cvData.projects || [];

  const addProject = () => {
    updateProjects([
      ...projects,
      { id: Date.now().toString(), name: '', technologies: '', description: '', url: '' },
    ]);
  };

  const removeProject = (id) => {
    updateProjects(projects.filter((p) => p.id !== id));
  };

  const updateField = (id, field, value) => {
    updateProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Project {index + 1}</span>
            <button onClick={() => removeProject(project.id)} className="text-red-400 hover:text-red-600 text-sm">
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {[
              { field: 'name', label: 'Project Name', placeholder: 'Task Manager App', type: 'text' },
              { field: 'technologies', label: 'Technologies Used', placeholder: 'React, Node.js, MongoDB', type: 'text' },
              { field: 'url', label: 'Project URL (optional)', placeholder: 'https://github.com/...', type: 'url' },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={project[field] || ''}
                  onChange={(e) => updateField(project.id, field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={project.description || ''}
                onChange={(e) => updateField(project.id, 'description', e.target.value)}
                rows={3}
                placeholder="Describe the project, its impact, and your role..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addProject}
        className="w-full py-2 px-3 text-sm border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
