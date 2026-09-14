import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { TrainCuePage } from './pages/TrainCuePage.jsx';
import { WhatShouldIDoPage } from './pages/WhatShouldIDoPage.jsx';
import { MyPlanPage } from './pages/MyPlanPage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ReflectPage } from './pages/ReflectPage.jsx';
import { MyCuePage } from './pages/MyCuePage.jsx';
import { ActivityDetailPage } from './pages/ActivityDetailPage.jsx';
import { CreateActivityPage } from './pages/CreateActivityPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { CompletionModal } from './components/CompletionModal.jsx';
import { AiAssistantModal } from './components/AiAssistantModal.jsx';
import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());
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

  useEffect(() => {
    return AuthService.subscribe((user) => {
      setCurrentUser(user);
    });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommitActivity = (activity) => {
    StorageService.addPlan(activity);
    showToast(`Saved "${activity.name}" to My Plan! ✨`);
    setSelectedActivity(null);
    setIsCreatingActivity(false);
    setActiveTab('my_plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompletionModal = (activityName) => {
    setCompletionTargetName(activityName);
    setIsCompletionModalOpen(true);
  };

  const handleCompleteActivity = (status, feedback, notes) => {
    const plans = StorageService.getPlans();
    const active = plans.find((p) => p.status === 'in_progress') || plans.find((p) => p.status === 'pending');
    const actName = completionTargetName || active?.activity?.name || 'Activity';

    if (active) {
      StorageService.completePlan(active.id, { feedback, notes });
    } else {
      StorageService.recordLog({
        activityId: 'activity-done',
        activityName: actName,
        status,
        feedback,
        notes,
      });
    }

    setIsCompletionModalOpen(false);

    if (status === 'done') {
      showToast(`Wonderful! Logged "${actName}" as completed! 🎉`);
    } else {
      showToast(`Checked in on "${actName}". Good decision!`);
    }
  };

  const handleLaunchWithIntent = (intentId) => {
    setPreselectedIntent(intentId);
    setSelectedActivity(null);
    setIsCreatingActivity(false);
    setActiveTab('recommend');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // If no user session, show honest login page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDFE] text-[#2D262A] flex flex-col font-sans selection:bg-[#FFD1E3] selection:text-[#9F1239]">
      {/* Navigation Header */}
      <Navigation
        activeTab={activeTab === 'up_next' ? 'my_plan' : activeTab}
        onTabChange={(tab) => {
          setSelectedActivity(null);
          setIsCreatingActivity(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiCompanion={() => setIsAiModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
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
            onNavigateToUpNext={() => {
              setSelectedActivity(null);
              setActiveTab('my_plan');
            }}
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
                  setActiveTab(tab === 'up_next' ? 'my_plan' : tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectActivity={handleSelectActivity}
                onCommitActivity={handleCommitActivity}
                onOpenCompletionModal={handleOpenCompletionModal}
                onLaunchRecommendationWithIntent={handleLaunchWithIntent}
              />
            )}

            {(activeTab === 'my_plan' || activeTab === 'up_next') && (
              <MyPlanPage
                onNavigate={(tab) => {
                  setSelectedActivity(null);
                  setIsCreatingActivity(false);
                  setActiveTab(tab === 'up_next' ? 'my_plan' : tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectActivity={handleSelectActivity}
                onOpenCompletionModal={handleOpenCompletionModal}
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
