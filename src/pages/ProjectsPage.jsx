import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  // New project form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tangibleOutcome, setTangibleOutcome] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [stepsInput, setStepsInput] = useState('');

  const loadProjects = () => {
    setProjects(StorageService.getProjects());
  };

  useEffect(() => {
    loadProjects();
    return StorageService.subscribe(loadProjects);
  }, []);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const stepsArray = stepsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `step-${Date.now()}-${idx}`,
        text,
        completed: false,
      }));

    // If a current step was entered, make sure it's first if not in stepsArray
    if (currentStep.trim() && stepsArray.length === 0) {
      stepsArray.push({
        id: `step-${Date.now()}-0`,
        text: currentStep.trim(),
        completed: false,
      });
    }

    StorageService.addProject({
      title: title.trim(),
      description: description.trim(),
      tangibleOutcome: tangibleOutcome.trim() || 'Creative artifact',
      currentStep: currentStep.trim() || (stepsArray[0]?.text || ''),
      steps: stepsArray,
      status: 'in_progress',
    });

    // Reset
    setTitle('');
    setDescription('');
    setTangibleOutcome('');
    setCurrentStep('');
    setStepsInput('');
    setIsCreating(false);
  };

  const handleToggleStep = (project, stepId) => {
    const updatedSteps = (project.steps || []).map((step) => {
      if (step.id === stepId) {
        return { ...step, completed: !step.completed };
      }
      return step;
    });

    const nextIncomplete = updatedSteps.find((s) => !s.completed);
    const allDone = updatedSteps.length > 0 && updatedSteps.every((s) => s.completed);

    StorageService.updateProject(project.id, {
      steps: updatedSteps,
      currentStep: nextIncomplete ? nextIncomplete.text : 'All steps completed!',
      status: allDone ? 'completed' : 'in_progress',
    });
  };

  const handleToggleStatus = (project) => {
    const newStatus = project.status === 'completed' ? 'in_progress' : 'completed';
    StorageService.updateProject(project.id, { status: newStatus });
  };

  const handleDelete = (id) => {
    StorageService.deleteProject(id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE7F6] text-[#7A52B3] text-xs font-black tracking-wider uppercase mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Sparks' Endeavors</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2D262A] tracking-tight">
            My Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E66] mt-1">
            Multi-session endeavors that produce artifacts, manuscripts, or deep skills.
          </p>
        </div>

        {!isCreating && (
          <button
            id="create-project-btn"
            type="button"
            onClick={() => setIsCreating(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#7A52B3] hover:bg-[#5C3D88] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Project Creation Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateProject}
          className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D1C4E9] shadow-sm space-y-5 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#2D262A]">
              Start a New Project
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-[#8A7983] hover:text-[#2D262A] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1">
              Project Title *
            </label>
            <input
              id="project-title-input"
              type="text"
              placeholder="e.g. Illustrated Children's Book, Ceramic Dinner Set"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#D1C4E9] focus:ring-2 focus:ring-[#7A52B3] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1">
              Description
            </label>
            <textarea
              id="project-desc-input"
              placeholder="What are you creating? What is the vision?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#D1C4E9] focus:ring-2 focus:ring-[#7A52B3] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1">
                Tangible Outcome
              </label>
              <input
                id="project-outcome-input"
                type="text"
                placeholder="e.g. 32-page hardcover mockup"
                value={tangibleOutcome}
                onChange={(e) => setTangibleOutcome(e.target.value)}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#D1C4E9] focus:ring-2 focus:ring-[#7A52B3] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1">
                Immediate Next Step
              </label>
              <input
                id="project-next-step-input"
                type="text"
                placeholder="e.g. Character design thumbnail sketches"
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#D1C4E9] focus:ring-2 focus:ring-[#7A52B3] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1">
              Project Milestones / Steps (one per line)
            </label>
            <textarea
              id="project-steps-input"
              placeholder="Outline story beats&#10;Character sketches&#10;Storyboarding&#10;Color studies"
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              rows={3}
              className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#D1C4E9] focus:ring-2 focus:ring-[#7A52B3] focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-bold text-[#6B5E66] hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-project-btn"
              type="submit"
              className="px-5 py-2 bg-[#7A52B3] hover:bg-[#5C3D88] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((proj) => {
            const isCompleted = proj.status === 'completed';
            const steps = proj.steps || [];
            const completedStepsCount = steps.filter((s) => s.completed).length;

            return (
              <div
                key={proj.id}
                id={`project-card-${proj.id}`}
                className={`bg-white rounded-3xl p-6 border transition-all ${
                  isCompleted
                    ? 'border-gray-200 opacity-80'
                    : 'border-[#E2D9F3] shadow-xs hover:border-[#7A52B3]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isCompleted
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-[#EDE7F6] text-[#7A52B3]'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </span>

                      {proj.tangibleOutcome && (
                        <span className="text-[11px] text-[#00897B] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {proj.tangibleOutcome}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`font-display font-bold text-xl ${
                        isCompleted ? 'text-[#8A7983] line-through' : 'text-[#2D262A]'
                      }`}
                    >
                      {proj.title}
                    </h3>

                    {proj.description && (
                      <p className="text-xs text-[#6B5E66] mt-1">{proj.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(proj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'border-gray-200 text-gray-500 hover:bg-gray-100'
                          : 'border-[#7A52B3] text-[#7A52B3] hover:bg-[#EDE7F6]'
                      }`}
                    >
                      {isCompleted ? 'Reopen' : 'Mark Done'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Steps checklist */}
                {steps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#8A7983]">
                      <span>MILESTONES</span>
                      <span>
                        {completedStepsCount} of {steps.length} done
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          onClick={() => handleToggleStep(proj, step.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                            step.completed
                              ? 'bg-gray-50 text-[#8A7983] line-through'
                              : 'bg-[#FAF8FC] text-[#2D262A] hover:bg-[#EDE7F6]'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                          )}
                          <span>{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Zero state when no projects exist */
        <div className="bg-white rounded-3xl p-12 border border-[#EDE7F6] text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-display font-bold text-lg text-[#2D262A]">
            No projects in progress yet
          </h3>
          <p className="text-xs text-[#8A7983] max-w-sm mx-auto">
            Cue starts with a clean slate. When you’re ready to embark on a multi-session creative endeavor or manuscript, add it here.
          </p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-[#7A52B3] text-white text-xs font-bold rounded-xl hover:bg-[#5C3D88] transition-colors cursor-pointer"
          >
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
};
