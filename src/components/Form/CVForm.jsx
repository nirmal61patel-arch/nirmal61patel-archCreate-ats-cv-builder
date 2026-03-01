import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useCV } from '../../context/CVContext';
import SectionWrapper from './SectionWrapper';
import PersonalInfoForm from './PersonalInfoForm';
import SummaryForm from './SummaryForm';
import SkillsForm from './SkillsForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import CertificationsForm from './CertificationsForm';
import ProjectsForm from './ProjectsForm';
import ColorThemePicker from '../ColorPicker/ColorThemePicker';

const SECTION_CONFIG = {
  summary: { title: 'Professional Summary', component: SummaryForm },
  skills: { title: 'Technical Skills', component: SkillsForm },
  experience: { title: 'Work Experience', component: ExperienceForm },
  education: { title: 'Education', component: EducationForm },
  certifications: { title: 'Certifications', component: CertificationsForm },
  projects: { title: 'Projects', component: ProjectsForm },
};

const CVForm = () => {
  const { sectionsOrder, setSectionsOrder } = useCV();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionsOrder.indexOf(active.id);
      const newIndex = sectionsOrder.indexOf(over.id);
      setSectionsOrder(arrayMove(sectionsOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {/* Personal Info - always at top */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 text-sm">Personal Information</h3>
        </div>
        <div className="p-4">
          <PersonalInfoForm />
        </div>
      </div>

      {/* Color Picker */}
      <ColorThemePicker />

      {/* Sortable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sectionsOrder.map((sectionId) => {
              const config = SECTION_CONFIG[sectionId];
              if (!config) return null;
              const SectionComponent = config.component;
              return (
                <SectionWrapper key={sectionId} id={sectionId} title={config.title}>
                  <SectionComponent />
                </SectionWrapper>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CVForm;
