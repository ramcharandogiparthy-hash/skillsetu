import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PWAProvider } from './context/PWAContext';
import { AppShell } from './components/AppShell';
import { seedDatabaseIfEmpty } from './db/seedData';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { WorkerRegistrationPage } from './pages/WorkerRegistrationPage';
import { WorkerSelfDeclarationPage } from './pages/WorkerSelfDeclarationPage';
import { QualificationMappingPage } from './pages/QualificationMappingPage';
import { AssessorDashboardPage } from './pages/AssessorDashboardPage';
import { PracticalAssessmentPage } from './pages/PracticalAssessmentPage';
import { AIEvidenceSupportPage } from './pages/AIEvidenceSupportPage';
import { FinalResultPage } from './pages/FinalResultPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { OfflineSyncPage } from './pages/OfflineSyncPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AssessmentReportPage } from './pages/AssessmentReportPage';

export function App() {
  useEffect(() => {
    seedDatabaseIfEmpty();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <PWAProvider>
            <Router>
              <AppShell>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/offline-sync" element={<OfflineSyncPage />} />
                  <Route path="/report/:workerId" element={<AssessmentReportPage />} />

                  {/* Worker Flow */}
                  <Route path="/worker/register" element={<WorkerRegistrationPage />} />
                  <Route path="/worker/self-declaration" element={<WorkerSelfDeclarationPage />} />
                  <Route path="/worker/qualification-mapping" element={<QualificationMappingPage />} />
                  <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />

                  {/* Assessor Flow */}
                  <Route path="/assessor/dashboard" element={<AssessorDashboardPage />} />
                  <Route path="/assessor/assessment/:workerId" element={<PracticalAssessmentPage />} />
                  <Route path="/assessor/ai-evidence/:workerId" element={<AIEvidenceSupportPage />} />
                  <Route path="/assessor/final-result/:workerId" element={<FinalResultPage />} />

                  {/* Admin Flow */}
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppShell>
            </Router>
          </PWAProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}


export default App;
