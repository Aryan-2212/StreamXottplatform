import { createBrowserRouter, Navigate } from 'react-router';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import ContentDetail from './pages/ContentDetail';
import VideoPlayer from './pages/VideoPlayer';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import ContinueWatching from './pages/ContinueWatching';
import SeeAll from './pages/SeeAll';
import ProblemSolution from './pages/ProblemSolution';
import LanguagePreferences from './pages/LanguagePreferences';
import AppSettings from './pages/AppSettings';
import ManageSubscription from './pages/ManageSubscription';
import { RouteGuard } from './components/RouteGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RouteGuard />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/discovery',
    element: <Discovery />,
  },
  {
    path: '/content/:id',
    element: <ContentDetail />,
  },
  {
    path: '/player/:id',
    element: <VideoPlayer />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/watchlist',
    element: <Watchlist />,
  },
  {
    path: '/continue-watching',
    element: <ContinueWatching />,
  },
  {
    path: '/see-all/:category',
    element: <SeeAll />,
  },
  {
    path: '/problem-solution',
    element: <ProblemSolution />,
  },
  {
    path: '/settings',
    element: <AppSettings />,
  },
  {
    path: '/settings/languages',
    element: <LanguagePreferences />,
  },
  {
    path: '/subscription',
    element: <ManageSubscription />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);