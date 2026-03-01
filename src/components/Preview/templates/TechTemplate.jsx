import React from 'react';

const TechTemplate = ({ cvData, colorTheme }) => {
  const { personalInfo, summary, skills, experience, education, certifications, projects } = cvData;

  return (
    <div
      id="cv-preview"
      className="bg-white"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', lineHeight: '1.4', padding: '32px' }}
    >
      {/* Header */}
      <div style={{ backgroundColor: colorTheme, color: 'white', padding: '16px 20px', marginBottom: '20px', borderRadius: '4px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 2px 0' }}>
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        {personalInfo?.jobTitle && (
          <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 8px 0' }}>{personalInfo.jobTitle}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '10px', opacity: 0.85 }}>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>{personalInfo.github}</span>}
          {personalInfo?.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Skills first for tech template */}
      {skills && skills.length > 0 && (
        <TechSection title="Technical Skills" color={colorTheme}>
          <div style={{ display: 'grid', gap: '4px' }}>
            {skills.map((skill, i) => (
              <div key={i}>
                <span style={{ fontWeight: 'bold', color: colorTheme }}>{skill.category}: </span>
                <span style={{ color: '#444' }}>{skill.skills}</span>
              </div>
            ))}
          </div>
        </TechSection>
      )}

      {summary && (
        <TechSection title="Professional Summary" color={colorTheme}>
          <p style={{ margin: 0, color: '#444' }}>{summary}</p>
        </TechSection>
      )}

      {experience && experience.length > 0 && (
        <TechSection title="Work Experience" color={colorTheme}>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '12px', color: '#1a1a1a' }}>{exp.jobTitle}</strong>
                  <span style={{ color: '#555' }}> | {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                </div>
                <span style={{ color: colorTheme, fontWeight: '600', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {exp.startDate} - {exp.isPresent ? 'Present' : exp.endDate}
                </span>
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
        </TechSection>
      )}

      {projects && projects.length > 0 && (
        <TechSection title="Projects" color={colorTheme}>
          {projects.map((project, i) => (
            <div key={i} style={{ marginBottom: '10px', borderLeft: `2px solid ${colorTheme}`, paddingLeft: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12px', color: '#1a1a1a' }}>{project.name}</strong>
                {project.url && <span style={{ color: colorTheme, fontSize: '10px' }}>{project.url}</span>}
              </div>
              {project.technologies && (
                <div style={{ color: colorTheme, fontWeight: '600', fontSize: '10px', margin: '2px 0' }}>
                  [{project.technologies}]
                </div>
              )}
              {project.description && <p style={{ margin: '2px 0 0 0', color: '#444' }}>{project.description}</p>}
            </div>
          ))}
        </TechSection>
      )}

      {certifications && certifications.length > 0 && (
        <TechSection title="Certifications" color={colorTheme}>
          {certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong>{cert.name}</strong>
                <span style={{ color: '#555' }}> — {cert.organization}</span>
              </div>
              <span style={{ color: colorTheme, fontWeight: '600', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {cert.dateObtained}{cert.expirationDate ? ` - ${cert.expirationDate}` : ''}
              </span>
            </div>
          ))}
        </TechSection>
      )}

      {education && education.length > 0 && (
        <TechSection title="Education" color={colorTheme}>
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
        </TechSection>
      )}
    </div>
  );
};

const TechSection = ({ title, color, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: color, padding: '4px 8px', marginBottom: '8px', display: 'inline-block', borderRadius: '2px' }}>
      {title}
    </h2>
    {children}
  </div>
);

export default TechTemplate;
