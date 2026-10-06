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
import { AIAssistantPage } from './features/assistant/AIAssistantPage';

export default function App() {
  return (
    <Provider>
      <ERPProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
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
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ERPProvider>
    </Provider>
  );
}
