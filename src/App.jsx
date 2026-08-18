import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import MainLayout from './components/layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetails from './pages/ServiceDetails'
import Careers from './pages/Careers'
import CareerDetails from './pages/CareerDetails'
import Projects from './pages/Projects'
import ProjectsByCategory from './pages/ProjectsByCategory'
import PlansByCategory from './pages/PlansByCategory'
import ProjectDetails from './pages/ProjectDetails'
import Plans from './pages/Plans'
import AboutUs from './pages/AboutUs'
import Favorites from './pages/Favorites'
import PaymentResult from './pages/PaymentResult'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import DataNotFound from './pages/DataNotFound'
import ServiceNotFound from './pages/ServiceNotFound'
import ProjectNotFoundPage from './pages/ProjectNotFound'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ContactUs from './pages/ContactUs'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import OverviewPage from './pages/dashboard/OverviewPage'
import ProjectsDashboardPage from './pages/dashboard/ProjectsDashboardPage'
import CareersDashboardPage from './pages/dashboard/CareersDashboardPage'
import ApplicationsDashboardPage from './pages/dashboard/ApplicationsDashboardPage'
import ContactDashboardPage from './pages/dashboard/ContactDashboardPage'
import PaymentsDashboardPage from './pages/dashboard/PaymentsDashboardPage'
import ServicesDashboardPage from './pages/dashboard/ServicesDashboardPage'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:serviceId" element={<ServiceDetails />} />
          <Route path="services/*" element={<ServiceNotFound />} />
          <Route path="careers" element={<Careers />} />
          <Route path="careers/:careerId" element={<CareerDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/category/:category" element={<ProjectsByCategory />} />
          <Route path="projects/:slug" element={<ProjectDetails />} />
          <Route path="projects/*" element={<ProjectNotFoundPage />} />
          <Route path="plans" element={<Plans />} />
          <Route path="plans/category/:category" element={<PlansByCategory />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="payment/result" element={<PaymentResult />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="data/*" element={<DataNotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN', 'COMPANY_WORKER', 'ENGINEER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="projects" element={<ProjectsDashboardPage />} />
          <Route path="services" element={<ServicesDashboardPage />} />
          <Route path="careers" element={<CareersDashboardPage />} />
          <Route path="applications" element={<ApplicationsDashboardPage />} />
          <Route path="contact" element={<ContactDashboardPage />} />
          <Route path="payments" element={<PaymentsDashboardPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
