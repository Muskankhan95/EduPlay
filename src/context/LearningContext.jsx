import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUserData,
  coursesData,
  badgesData,
  dailyChallengeData,
  notificationsData,
  sampleLessonContent,
  learningPathsData,
  weeklyActivityData,
  skillBreakdownData,
  accuracyHistoryData,
  leaderboardData,
} from '../data/mockData';
import { triggerCelebration, triggerStars } from '../utils/confetti';
import { soundFx } from '../utils/sound';
import {
  getUserProfileAPI,
  getCoursesAPI,
  getBadgesAPI,
  getDailyChallengeAPI,
  getNotificationsAPI,
  addUserXPAPI,
  completeLessonAPI,
  submitDailyChallengeAPI,
  updateUserPreferencesAPI,
  getLearningPathsAPI,
  getWeeklyActivityAPI,
  getSkillBreakdownAPI,
  getAccuracyHistoryAPI,
  getLeaderboardAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  resetDemoDataAPI,
} from '../services/api';

const LearningContext = createContext(null);

export const LearningProvider = ({ children }) => {
  // Load from localStorage or default
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eduplay_user');
    return saved ? JSON.parse(saved) : initialUserData;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('eduplay_courses');
    return saved ? JSON.parse(saved) : coursesData;
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('eduplay_badges');
    return saved ? JSON.parse(saved) : badgesData;
  });

  const [dailyChallenge, setDailyChallenge] = useState(() => {
    const saved = localStorage.getItem('eduplay_daily_challenge');
    return saved ? JSON.parse(saved) : dailyChallengeData;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('eduplay_notifications');
    return saved ? JSON.parse(saved) : notificationsData;
  });
  const [learningPaths, setLearningPaths] = useState(learningPathsData);
  const [weeklyActivity, setWeeklyActivity] = useState(weeklyActivityData);
  const [skillBreakdown, setSkillBreakdown] = useState(skillBreakdownData);
  const [accuracyHistory, setAccuracyHistory] = useState(accuracyHistoryData);
  const [leaderboard, setLeaderboard] = useState(leaderboardData);

  // Modal states
  const [activeLessonModal, setActiveLessonModal] = useState(null); // { course, lesson }
  const [activeChallengeModal, setActiveChallengeModal] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState(null); // { newLevel, title }
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Sync with sound preferences
  useEffect(() => {
    soundFx.enabled = user.preferences?.soundEffects ?? true;
  }, [user.preferences?.soundEffects]);

  // Sync state with backend if available
  useEffect(() => {
    let isMounted = true;
    async function syncWithBackend() {
      try {
        const [
          userRes,
          coursesRes,
          badgesRes,
          challengeRes,
          notifRes,
          pathsRes,
          weeklyRes,
          skillsRes,
          accuracyRes,
          leaderboardRes,
        ] = await Promise.allSettled([
          getUserProfileAPI(),
          getCoursesAPI(),
          getBadgesAPI(),
          getDailyChallengeAPI(),
          getNotificationsAPI(),
          getLearningPathsAPI(),
          getWeeklyActivityAPI(),
          getSkillBreakdownAPI(),
          getAccuracyHistoryAPI(),
          getLeaderboardAPI(),
        ]);
        [
          userRes,
          coursesRes,
          badgesRes,
          challengeRes,
          notifRes,
          pathsRes,
          weeklyRes,
          skillsRes,
          accuracyRes,
          leaderboardRes,
        ].forEach((result) => {
          if (result.status === 'rejected') {
            console.error('An EduPlay backend request failed:', result.reason);
          }
        });

        if (isMounted) {
          if (userRes.status === 'fulfilled' && userRes.value?.success && userRes.value.user) {
            setUser(userRes.value.user);
          }
          if (coursesRes.status === 'fulfilled' && coursesRes.value?.success && coursesRes.value.courses) {
            setCourses(coursesRes.value.courses);
          }
          if (badgesRes.status === 'fulfilled' && badgesRes.value?.success && badgesRes.value.badges) {
            setBadges(badgesRes.value.badges);
          }
          if (challengeRes.status === 'fulfilled' && challengeRes.value?.success && challengeRes.value.challenge) {
            setDailyChallenge(challengeRes.value.challenge);
          }
          if (notifRes.status === 'fulfilled' && notifRes.value?.success && notifRes.value.notifications) {
            setNotifications(notifRes.value.notifications);
          }
          if (pathsRes.status === 'fulfilled' && pathsRes.value?.success && pathsRes.value.learningPaths) {
            setLearningPaths(pathsRes.value.learningPaths);
          }
          if (weeklyRes.status === 'fulfilled' && weeklyRes.value?.success && weeklyRes.value.weeklyActivity) {
            setWeeklyActivity(weeklyRes.value.weeklyActivity);
          }
          if (skillsRes.status === 'fulfilled' && skillsRes.value?.success && skillsRes.value.skillBreakdown) {
            setSkillBreakdown(skillsRes.value.skillBreakdown);
          }
          if (accuracyRes.status === 'fulfilled' && accuracyRes.value?.success && accuracyRes.value.accuracyHistory) {
            setAccuracyHistory(accuracyRes.value.accuracyHistory);
          }
          if (leaderboardRes.status === 'fulfilled' && leaderboardRes.value?.success && leaderboardRes.value.leaderboard) {
            setLeaderboard(leaderboardRes.value.leaderboard);
          }
        }
      } catch (err) {
        console.error('Unable to sync EduPlay data with the backend:', err);
      }
    }

    syncWithBackend();
    return () => { isMounted = false; };
  }, []);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('eduplay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('eduplay_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('eduplay_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('eduplay_daily_challenge', JSON.stringify(dailyChallenge));
  }, [dailyChallenge]);

  useEffect(() => {
    localStorage.setItem('eduplay_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Award XP and check for Level Up
  const addXP = (amount, reason = "Activity Completed", { syncBackend = true } = {}) => {
    soundFx.playSuccess();
    if (user.preferences?.confettiEffects) {
      triggerStars();
    }
    if (syncBackend) {
      addUserXPAPI(amount, reason)
        .then((response) => {
          if (response.user) setUser(response.user);
        })
        .catch((err) => console.error('Unable to save XP to the backend:', err));
    }

    setUser(prev => {
      const newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let newNextXP = prev.nextLevelXP;
      let leveledUp = false;

      if (newXP >= prev.nextLevelXP) {
        newLevel += 1;
        newNextXP = Math.floor(prev.nextLevelXP * 1.35);
        leveledUp = true;
      }

      if (leveledUp) {
        setTimeout(() => {
          soundFx.playLevelUp();
          triggerCelebration();
          setLevelUpModal({
            level: newLevel,
            title: newLevel >= 10 ? "Legendary Grandmaster" : newLevel >= 8 ? "Code Magus" : "Code Conjurer",
          });
        }, 400);

        // Add level up notification
        setNotifications(nPrev => [
          {
            id: `notif-${Date.now()}`,
            title: `Level Up! Reached Level ${newLevel} 🚀`,
            message: `Congratulations! You unlocked new skill paths and reached Level ${newLevel}!`,
            time: "Just now",
            unread: true,
          },
          ...nPrev,
        ]);
      }

      return {
        ...prev,
        currentXP: newXP,
        level: newLevel,
        nextLevelXP: newNextXP,
      };
    });
  };

  // Complete a lesson
  const completeLesson = (courseId, lessonId, xpReward = 60) => {
    addXP(xpReward, "Lesson Completed", { syncBackend: false });
    completeLessonAPI(courseId, lessonId, xpReward)
      .then((response) => {
        if (response.user) setUser(response.user);
        if (response.course) {
          setCourses((previous) => previous.map((course) =>
            course.id === response.course.id ? response.course : course,
          ));
        }
      })
      .catch((err) => console.error('Unable to save lesson completion:', err));

    setCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const updatedCompleted = Math.min(course.totalLessons, course.completedLessons + 1);
        let updatedModules = course.modules;

        if (updatedModules && updatedModules.length > 0) {
          updatedModules = updatedModules.map(module => ({
            ...module,
            lessons: module.lessons.map(l =>
              l.id === lessonId ? { ...l, completed: true, isCurrent: false } : l
            ),
          }));
        }

        return {
          ...course,
          completedLessons: updatedCompleted,
          modules: updatedModules,
        };
      })
    );
  };

  // Submit Daily Challenge
  const submitDailyChallenge = (optionId) => {
    const selected = dailyChallenge.options.find(opt => opt.id === optionId);
    if (!selected) return { success: false };

    submitDailyChallengeAPI(optionId)
      .then((response) => {
        if (response.user) setUser(response.user);
      })
      .catch((err) => console.error('Unable to save daily challenge result:', err));

    if (selected.correct) {
      soundFx.playSuccess();
      triggerCelebration();
      setDailyChallenge(prev => ({ ...prev, completed: true }));

      // Award XP & add streak day
      addXP(dailyChallenge.xpReward, "Daily Challenge Solved", { syncBackend: false });
      setUser(prev => ({
        ...prev,
        dailyStreak: prev.dailyStreak + 1,
      }));

      // Add notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: "Daily Challenge Mastered! 🔥",
          message: `You earned +${dailyChallenge.xpReward} XP and your streak is now ${user.dailyStreak + 1} days!`,
          time: "Just now",
          unread: true,
        },
        ...prev,
      ]);

      return { success: true, explanation: dailyChallenge.explanation };
    } else {
      soundFx.playError();
      return { success: false, explanation: "That's not quite right. Look closely at how the while loop counter increments." };
    }
  };

  // Mark notification read
  const markNotificationRead = (id) => {
    markNotificationReadAPI(id).catch((err) =>
      console.error('Unable to mark notification as read:', err),
    );
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    markAllNotificationsReadAPI().catch((err) =>
      console.error('Unable to mark notifications as read:', err),
    );
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Update preferences
  const updatePreferences = (newPrefs) => {
    updateUserPreferencesAPI(newPrefs)
      .then((response) => {
        if (response.user) setUser(response.user);
      })
      .catch((err) => console.error('Unable to save user preferences:', err));
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPrefs },
    }));
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    resetDemoDataAPI().catch((err) => console.error('Unable to reset demo data:', err));
    localStorage.removeItem('eduplay_user');
    localStorage.removeItem('eduplay_courses');
    localStorage.removeItem('eduplay_badges');
    localStorage.removeItem('eduplay_daily_challenge');
    localStorage.removeItem('eduplay_notifications');
    setUser(initialUserData);
    setCourses(coursesData);
    setBadges(badgesData);
    setDailyChallenge(dailyChallengeData);
    setNotifications(notificationsData);
    soundFx.playSuccess();
  };

  return (
    <LearningContext.Provider
      value={{
        user,
        setUser,
        courses,
        badges,
        dailyChallenge,
        notifications,
        learningPaths,
        weeklyActivity,
        skillBreakdown,
        accuracyHistory,
        leaderboard,
        addXP,
        completeLesson,
        submitDailyChallenge,
        markNotificationRead,
        markAllNotificationsRead,
        updatePreferences,
        resetDemoData,
        // Modals
        activeLessonModal,
        setActiveLessonModal,
        activeChallengeModal,
        setActiveChallengeModal,
        levelUpModal,
        setLevelUpModal,
        searchModalOpen,
        setSearchModalOpen,
        sampleLessonContent,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
