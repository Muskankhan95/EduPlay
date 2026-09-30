export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const getAuthHeaders = () => {
  const token = localStorage.getItem('eduplay_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${response.status})`);
  }
  return data;
}

const post = (path, body) => request(path, {
  method: 'POST',
  body: JSON.stringify(body),
});

const put = (path, body) => request(path, {
  method: 'PUT',
  body: JSON.stringify(body),
});

const saveAuthResponse = (data) => {
  if (data.token) localStorage.setItem('eduplay_token', data.token);
  return data;
};

export const loginAPI = (email, password) =>
  post('/auth/login', { email, password }).then(saveAuthResponse);

export const demoLoginAPI = () =>
  post('/auth/demo-login', {}).then(saveAuthResponse);

export const registerAPI = (payload) =>
  post('/auth/register', payload).then(saveAuthResponse);

export const forgotPasswordAPI = (email) =>
  post('/auth/forgot-password', { email });

export const getMeAPI = () => request('/auth/me');

export const getUserProfileAPI = (userId) =>
  request(`/user/profile${userId ? `/${encodeURIComponent(userId)}` : ''}`);

export const updateUserProfileAPI = (profileData) =>
  put('/user/profile', profileData);

export const updateUserPreferencesAPI = (preferences) =>
  put('/user/preferences', preferences);

export const addUserXPAPI = (amount, reason) =>
  post('/user/add-xp', { amount, reason });

export const incrementStreakAPI = () =>
  post('/user/streak', {});

export const resetDemoDataAPI = () =>
  post('/user/reset-demo', {});

export const getCoursesAPI = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ).toString();
  return request(`/courses${query ? `?${query}` : ''}`);
};

export const getCourseByIdAPI = (courseId) =>
  request(`/courses/${encodeURIComponent(courseId)}`);

export const enrollCourseAPI = (courseId) =>
  post(`/courses/${encodeURIComponent(courseId)}/enroll`, {});

export const completeLessonAPI = (courseId, lessonId, xpReward = 60) =>
  post(`/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/complete`, { xpReward });

export const completeQuizAPI = (payload) =>
  post('/quiz/complete', payload);

export const getAdaptiveRecommendationsAPI = () =>
  request('/quiz/adaptive-recommendations');

export const getQuizHistoryAPI = () =>
  request('/quiz/history');

export const getTargetBlasterDataAPI = () =>
  request('/games/target-blaster');

export const getDailyChallengeAPI = () =>
  request('/daily-challenge');

export const submitDailyChallengeAPI = (optionId) =>
  post('/daily-challenge/submit', { optionId });

export const getLeaderboardAPI = (league = 'Diamond') =>
  request(`/leaderboard?league=${encodeURIComponent(league)}`);

export const getBadgesAPI = () =>
  request('/badges');

export const unlockBadgeAPI = (badgeId) =>
  post(`/badges/${encodeURIComponent(badgeId)}/unlock`, {});

export const getAnalyticsOverviewAPI = () =>
  request('/analytics');

export const getWeeklyActivityAPI = () =>
  request('/analytics/weekly');

export const getSkillBreakdownAPI = () =>
  request('/analytics/skills');

export const getAccuracyHistoryAPI = () =>
  request('/analytics/accuracy');

export const getLearningPathsAPI = () =>
  request('/learning-paths');

export const getNotificationsAPI = () =>
  request('/notifications');

export const markNotificationReadAPI = (notifId) =>
  put(`/notifications/${encodeURIComponent(notifId)}/read`, {});

export const markAllNotificationsReadAPI = () =>
  put('/notifications/read-all', {});
