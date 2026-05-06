import { createBrowserRouter } from 'react-router'
import AppWrapper       from '../AppWrapper'
import RootLayout       from '../layouts/RootLayout'
import AuthLayout       from '../layouts/AuthLayout'
import DashboardLayout  from '../layouts/DashboardLayout'
import ProtectedRoute   from '../components/ProtectedRoute'
import LandingPage      from '../pages/landing/LandingPage'
import LoginPage        from '../pages/auth/LoginPage'
import SignupPage       from '../pages/auth/SignupPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import PricingPage      from '../pages/PricingPage'
import AboutPage        from '../pages/AboutPage'
import BlogPage         from '../pages/BlogPage'

// Modular Dashboard Screens
import DashboardScreen  from '../pages/dashboard/DashboardScreen'
import WorkspacesScreen from '../pages/dashboard/WorkspacesScreen'
import AnalyticsScreen  from '../pages/dashboard/AnalyticsScreen'
import SchedulerScreen  from '../pages/dashboard/SchedulerScreen'
import SettingsScreen   from '../pages/dashboard/SettingsScreen'
import ProfileSetting    from '../pages/dashboard/settings/ProfileSetting'
import SecuritySetting   from '../pages/dashboard/settings/SecuritySetting'
import NotificationSetting from '../pages/dashboard/settings/NotificationSetting'
import AccountSetting from '../pages/dashboard/settings/AccountSetting'

// Workspace Specific Screens
import WsDashboard      from '../pages/dashboard/workspace/WsDashboard'
import WsCreate         from '../pages/dashboard/workspace/WsCreate'
import WsCharacters     from '../pages/dashboard/workspace/WsCharacters'
import WsTrends         from '../pages/dashboard/workspace/WsTrends'
import WsPosts          from '../pages/dashboard/workspace/WsPosts'

const router = createBrowserRouter([
  {
    element: <AppWrapper />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true,     element: <LandingPage /> },
          { path: 'pricing', element: <PricingPage /> },
          { path: 'about',   element: <AboutPage /> },
          { path: 'blog',    element: <BlogPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: 'login',  element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardScreen /> },
              { path: 'workspaces', element: <WorkspacesScreen /> },
              { path: 'analytics', element: <AnalyticsScreen /> },
              { path: 'scheduler', element: <SchedulerScreen /> },
              { 
                path: 'settings', 
                element: <SettingsScreen />,
                children: [
                  { index: true, element: <ProfileSetting /> },
                  { path: 'profile', element: <ProfileSetting /> },
                  { path: 'security', element: <SecuritySetting /> },
                  { path: 'notifications', element: <NotificationSetting /> },
                  { path: 'billing', element: <div className="text-dim p-8">Billing Settings Coming Soon</div> },
                  { path: 'integrations', element: <div className="text-dim p-8">Integrations Settings Coming Soon</div> },
                  { path: 'account', element: <AccountSetting /> },
                ]
              },
              { path: 'workspaces/:wsId', element: <WsDashboard /> },
              { path: 'workspaces/:wsId/create', element: <WsCreate /> },
              { path: 'workspaces/:wsId/characters', element: <WsCharacters /> },
              { path: 'workspaces/:wsId/trends', element: <WsTrends /> },
              { path: 'workspaces/:wsId/posts', element: <WsPosts /> },
            ],
          },
        ],
      },
    ]
  }
])

export default router