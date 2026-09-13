import React, { useState } from 'react';
import { Navigation } from './components/Navigation.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { TrainCuePage } from './pages/TrainCuePage.jsx';
import { WhatShouldIDoPage } from './pages/WhatShouldIDoPage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ReflectPage } from './pages/ReflectPage.jsx';
import { MyCuePage } from './pages/MyCuePage.jsx';
import { ActivityDetailPage } from './pages/ActivityDetailPage.jsx';
import { CreateActivityPage } from './pages/CreateActivityPage.jsx';
import { CompletionModal } from './components/CompletionModal.jsx';
import { AiAssistantModal } from './components/AiAssistantModal.jsx';
import { StorageService } from './services/storage.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Intent preselected from Home Screen quick buttons
  const [preselectedIntent, setPreselectedIntent] = useState(null);

  // Completion modal state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completionTargetName, setCompletionTargetName] = useState('');

  // Toast alert
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCommitActivity = (activity) => {
    StorageService.setActiveCommitment(activity.id, activity.name);
    showToast(`Committed to: "${activity.name}". You've got this, Sparks! ✨`);
    if (selectedActivity) {
      setSelectedActivity(null);
    }
  };

  const handleOpenCompletionModal = (activityName) => {
    setCompletionTargetName(activityName);
    setIsCompletionModalOpen(true);
  };

  const handleCompleteActivity = (status, feedback, notes) => {
    const active = StorageService.getActiveCommitment();
    const actId = active ? active.activityId : 'manual_activity';

    StorageService.logCompletion({
      activityId: actId,
      activityName: completionTargetName,
      status,
      feedback,
      notes,
    });

    StorageService.clearActiveCommitment();
    setIsCompletionModalOpen(false);

    if (status === 'done') {
      showToast(`Wonderful! Logged "${completionTargetName}" as done! 🎉`);
    } else {
      showToast(`Checked in on "${completionTargetName}". Good decision!`);
    }
  };

  const handleStartProject = (activity) => {
    StorageService.addProject({
      title: `${activity.name} Project`,
      description: `Focused project inspired by ${activity.name}.`,
      tangibleOutcome: activity.leavesSomethingBehind ? 'Finished piece or work' : 'Skill mastery',
      currentStep: 'Plan initial materials & outline',
      steps: [
        { id: `s-${Date.now()}-1`, text: 'Plan initial materials & outline', completed: false },
        { id: `s-${Date.now()}-2`, text: 'First execution session', completed: false },
        { id: `s-${Date.now()}-3`, text: 'Refine and finish artifact', completed: false },
      ],
      status: 'in_progress',
    });
    setSelectedActivity(null);
    setActiveTab('projects');
    showToast(`Started new project for "${activity.name}"!`);
  };

  const handleLaunchWithIntent = (intentId) => {
    setPreselectedIntent(intentId);
    setSelectedActivity(null);
    setIsCreatingActivity(false);
    setActiveTab('recommend');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFDFE] text-[#2D262A] flex flex-col font-sans selection:bg-[#FFD1E3] selection:text-[#9F1239]">
      {/* Navigation Header */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedActivity(null);
          setIsCreatingActivity(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiCompanion={() => setIsAiModalOpen(true)}
      />

      {/* Ephemeral Toast Notification */}
      {toastMessage && (
        <div
          id="cue-toast-banner"
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-[#2D262A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-white/15 animate-in slide-in-from-bottom-3 duration-200"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {selectedActivity ? (
          <ActivityDetailPage
            activity={selectedActivity}
            onBack={() => setSelectedActivity(null)}
            onCommit={handleCommitActivity}
            onStartProject={handleStartProject}
          />
        ) : isCreatingActivity ? (
          <CreateActivityPage
            onBack={() => setIsCreatingActivity(false)}
            onCreated={(newAct) => {
              setIsCreatingActivity(false);
              setSelectedActivity(newAct);
              showToast(`Added "${newAct.name}" to your library! 🌟`);
            }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                onNavigate={(tab) => {
                  setSelectedActivity(null);
                  setIsCreatingActivity(false);
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectActivity={handleSelectActivity}
                onCommitActivity={handleCommitActivity}
                onOpenCompletionModal={handleOpenCompletionModal}
                onLaunchRecommendationWithIntent={handleLaunchWithIntent}
              />
            )}

            {activeTab === 'train' && (
              <TrainCuePage
                onSelectActivity={handleSelectActivity}
                onNavigateToRecommend={() => setActiveTab('recommend')}
              />
            )}

            {activeTab === 'recommend' && (
              <WhatShouldIDoPage
                initialIntent={preselectedIntent}
                onSelectActivity={handleSelectActivity}
                onCommitActivity={handleCommitActivity}
                onOpenCompletionModal={handleOpenCompletionModal}
              />
            )}

            {activeTab === 'explore' && (
              <ExplorePage
                onSelectActivity={handleSelectActivity}
                onCommitActivity={handleCommitActivity}
                onNavigateToCreate={() => setIsCreatingActivity(true)}
              />
            )}

            {activeTab === 'projects' && <ProjectsPage />}

            {activeTab === 'reflect' && <ReflectPage />}

            {activeTab === 'my_cue' && (
              <MyCuePage
                onSelectActivity={handleSelectActivity}
                onCommitActivity={handleCommitActivity}
              />
            )}
          </>
        )}
      </main>

      {/* Activity Completion Check-in Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        activityName={completionTargetName}
        onComplete={handleCompleteActivity}
        onClose={() => setIsCompletionModalOpen(false)}
      />

      {/* Ask Cue Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onNavigateToRecommend={() => {
          setSelectedActivity(null);
          setIsCreatingActivity(false);
          setActiveTab('recommend');
        }}
      />
    </div>
  );
}
