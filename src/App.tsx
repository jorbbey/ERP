import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from './theme/provider';
import { ERPProvider } from './context/ERPContext';
import { AppLayout } from './layouts/AppLayout';

import { DashboardPage } from './features/dashboard/DashboardPage';
import { ProjectsPage } from './features/projects/ProjectsPage';
import { ProjectDetailPage } from './features/projects/ProjectDetailPage';
import { ProjectCreatePage } from './features/projects/ProjectCreatePage';
import { RequisitionsPage } from './features/requisitions/RequisitionsPage';
import { InventoryPage } from './features/inventory/InventoryPage';
import { ProcurementPage } from './features/procurement/ProcurementPage';
import { HRPage } from './features/hr/HRPage';
import { PayrollPage } from './features/payroll/PayrollPage';
import { RmcPage } from './features/rmc/RmcPage';
import { ContractAdminPage } from './features/contracts/ContractAdminPage';
import { AccountingPage } from './features/accounting/AccountingPage';
import { ChatPage } from './features/chat/ChatPage';
import { WorkflowPage } from './features/workflow/WorkflowPage';
import { PortalsPage } from './features/portals/PortalsPage';
import { DocumentsPage } from './features/documents/DocumentsPage';
import { EquipmentPage } from './features/equipment/EquipmentPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { LoginPage } from './features/auth/LoginPage';
import { LandingPage } from './features/landing/LandingPage';
import { FeaturesPage } from './features/landing/pages/FeaturesPage';
import { ModulesPage } from './features/landing/pages/ModulesPage';
import { WorkflowPublicPage } from './features/landing/pages/WorkflowPublicPage';
import { BenefitsPage } from './features/landing/pages/BenefitsPage';
import { SecurityPage } from './features/landing/pages/SecurityPage';
import { PreviewPublicPage } from './features/landing/pages/PreviewPublicPage';
import { AIAssistantPage } from './features/assistant/AIAssistantPage';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Unhandled UI Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('erp_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
              !
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Application Workspace Notice</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
              A temporary display or state synchronization anomaly was caught. You can refresh the session or restore system state.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleHardReset}
                style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                Reset App Data
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider>
        <ERPProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/workflows" element={<WorkflowPublicPage />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/preview" element={<PreviewPublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assistant" element={<AIAssistantPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/new" element={<ProjectCreatePage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/requisitions" element={<RequisitionsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/procurement" element={<ProcurementPage />} />
              <Route path="/hr" element={<HRPage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/rmc" element={<RmcPage />} />
              <Route path="/contract-admin" element={<ContractAdminPage />} />
              <Route path="/accounting" element={<AccountingPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/workflow" element={<WorkflowPage />} />
              <Route path="/portals" element={<PortalsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ERPProvider>
    </Provider>
    </ErrorBoundary>
  );
}
