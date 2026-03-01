import React from 'react';

const ClassicTemplate = ({ cvData, colorTheme }) => {
  const { personalInfo, summary, skills, experience, education, certifications, projects } = cvData;

  return (
    <div
      id="cv-preview"
      className="bg-white font-sans text-gray-900"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', lineHeight: '1.4', padding: '32px' }}
    >
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${colorTheme}`, paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: colorTheme, margin: '0 0 4px 0' }}>
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        {personalInfo?.jobTitle && (
          <p style={{ fontSize: '13px', color: '#555', margin: '0 0 8px 0' }}>{personalInfo.jobTitle}</p>
        )}
        <div style={{ fontSize: '10px', color: '#666', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>{personalInfo.github}</span>}
          {personalInfo?.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {summary && (
        <Section title="Professional Summary" color={colorTheme}>
          <p style={{ margin: 0 }}>{summary}</p>
        </Section>
      )}

      {skills && skills.length > 0 && (
        <Section title="Technical Skills" color={colorTheme}>
          {skills.map((skill, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <strong>{skill.category}:</strong> {skill.skills}
            </div>
          ))}
        </Section>
      )}

      {experience && experience.length > 0 && (
        <Section title="Work Experience" color={colorTheme}>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '12px' }}>{exp.jobTitle}</strong>
                  <span style={{ color: '#555' }}> — {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                </div>
                <span style={{ color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {exp.startDate} - {exp.isPresent ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  {exp.bullets.filter(b => b).map((bullet, bi) => (
                    <li key={bi} style={{ marginBottom: '2px' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {education && education.length > 0 && (
        <Section title="Education" color={colorTheme}>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '12px' }}>{edu.degree}</strong>
                <span style={{ color: '#666' }}>{edu.graduationDate}</span>
              </div>
              <div style={{ color: '#555' }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
              {edu.gpa && <div>GPA: {edu.gpa}</div>}
              {edu.coursework && <div style={{ color: '#666' }}>Relevant Coursework: {edu.coursework}</div>}
            </div>
          ))}
        </Section>
      )}

      {certifications && certifications.length > 0 && (
        <Section title="Certifications" color={colorTheme}>
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{cert.name}</strong>
                <span style={{ color: '#666' }}>{cert.dateObtained}{cert.expirationDate ? ` - ${cert.expirationDate}` : ''}</span>
              </div>
              <div style={{ color: '#555' }}>{cert.organization}</div>
            </div>
          ))}
        </Section>
      )}

      {projects && projects.length > 0 && (
        <Section title="Projects" color={colorTheme}>
          {projects.map((project, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <strong style={{ fontSize: '12px' }}>{project.name}</strong>
                {project.url && <span style={{ color: '#666', fontSize: '10px' }}>{project.url}</span>}
              </div>
              {project.technologies && (
                <div style={{ color: '#555' }}><em>Technologies: {project.technologies}</em></div>
              )}
              {project.description && <p style={{ margin: '2px 0 0 0' }}>{project.description}</p>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, color, children }) => (
  <div style={{ marginBottom: '16px' }}>
    <h2 style={{ fontSize: '13px', fontWeight: 'bold', color, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${color}`, paddingBottom: '3px', marginBottom: '8px' }}>
      {title}
    </h2>
    {children}
  </div>
);

export default ClassicTemplate;
