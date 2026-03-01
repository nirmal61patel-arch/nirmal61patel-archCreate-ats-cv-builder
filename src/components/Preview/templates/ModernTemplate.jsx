import React from 'react';

const ModernTemplate = ({ cvData, colorTheme }) => {
  const { personalInfo, summary, skills, experience, education, certifications, projects } = cvData;

  return (
    <div
      id="cv-preview"
      className="bg-white"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', lineHeight: '1.5', padding: '32px' }}
    >
      {/* Header with accent */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 2px 0' }}>
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        {personalInfo?.jobTitle && (
          <p style={{ fontSize: '14px', color: colorTheme, fontWeight: '600', margin: '0 0 10px 0' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '10px', color: '#555', borderTop: `2px solid ${colorTheme}`, paddingTop: '8px' }}>
          {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo?.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>💻 {personalInfo.github}</span>}
          {personalInfo?.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
        </div>
      </div>

      {summary && (
        <ModernSection title="Professional Summary" color={colorTheme}>
          <p style={{ margin: 0, color: '#444' }}>{summary}</p>
        </ModernSection>
      )}

      {skills && skills.length > 0 && (
        <ModernSection title="Technical Skills" color={colorTheme}>
          {skills.map((skill, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{skill.category}: </span>
              <span style={{ color: '#555' }}>{skill.skills}</span>
            </div>
          ))}
        </ModernSection>
      )}

      {experience && experience.length > 0 && (
        <ModernSection title="Work Experience" color={colorTheme}>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#1a1a1a' }}>{exp.jobTitle}</span>
                <span style={{ color: colorTheme, fontWeight: '600', fontSize: '10px' }}>
                  {exp.startDate} - {exp.isPresent ? 'Present' : exp.endDate}
                </span>
              </div>
              <div style={{ color: '#555', marginBottom: '4px' }}>
                {exp.company}{exp.location ? ` | ${exp.location}` : ''}
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  {exp.bullets.filter(b => b).map((bullet, bi) => (
                    <li key={bi} style={{ marginBottom: '2px', color: '#444' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ModernSection>
      )}

      {education && education.length > 0 && (
        <ModernSection title="Education" color={colorTheme}>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px' }}>{edu.degree}</strong>
                <span style={{ color: colorTheme, fontWeight: '600', fontSize: '10px' }}>{edu.graduationDate}</span>
              </div>
              <div style={{ color: '#555' }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
              {edu.gpa && <div style={{ color: '#666' }}>GPA: {edu.gpa}</div>}
              {edu.coursework && <div style={{ color: '#666' }}>Relevant Coursework: {edu.coursework}</div>}
            </div>
          ))}
        </ModernSection>
      )}

      {certifications && certifications.length > 0 && (
        <ModernSection title="Certifications" color={colorTheme}>
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{cert.name}</strong>
                <span style={{ color: colorTheme, fontWeight: '600', fontSize: '10px' }}>
                  {cert.dateObtained}{cert.expirationDate ? ` - ${cert.expirationDate}` : ''}
                </span>
              </div>
              <div style={{ color: '#555' }}>{cert.organization}</div>
            </div>
          ))}
        </ModernSection>
      )}

      {projects && projects.length > 0 && (
        <ModernSection title="Projects" color={colorTheme}>
          {projects.map((project, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12px' }}>{project.name}</strong>
                {project.url && <span style={{ color: colorTheme, fontSize: '10px' }}>{project.url}</span>}
              </div>
              {project.technologies && (
                <div style={{ color: colorTheme, fontWeight: '600', fontSize: '10px' }}>
                  {project.technologies}
                </div>
              )}
              {project.description && <p style={{ margin: '2px 0 0 0', color: '#444' }}>{project.description}</p>}
            </div>
          ))}
        </ModernSection>
      )}
    </div>
  );
};

const ModernSection = ({ title, color, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', paddingLeft: '8px', borderLeft: `3px solid ${color}` }}>
      {title}
    </h2>
    {children}
  </div>
);

export default ModernTemplate;
