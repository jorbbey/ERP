import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Text, 
  Heading, 
  Button, 
  Badge, 
  SimpleGrid, 
  Card, 
  Table, 
  Input, 
  Progress,
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { 
  ProjectBudget, 
  ProjectScheduleTask, 
  ProjectDelayLog, 
  ProjectSafetyIncident, 
  ProjectRFI, 
  ProjectChangeOrder, 
  ProjectDocument,
  ProjectDailyLog,
  ProjectLabourBudget,
  ProjectMaterialBudget,
  ProjectMilestone,
  ProjectTask,
  ProjectStaffAssignment,
  ProjectStaffHistory,
  ProjectDelayNote,
  ProjectQualityAssurance,
  ProjectInvoice,
  DailySiteReport
} from '../../types';
import { LabourBudgetTab } from './components/LabourBudgetTab';
import { MaterialBudgetTab } from './components/MaterialBudgetTab';
import { StaffManagementTab } from './components/StaffManagementTab';
import { QualityAssuranceTab } from './components/QualityAssuranceTab';
import { FinancialsTab } from './components/FinancialsTab';
import { MilestonesTasksTab } from './components/MilestonesTasksTab';
import { SiteDelaysNotesTab } from './components/SiteDelaysNotesTab';
import { DailyReportsTab } from './components/DailyReportsTab';
import { SiteProcurementTab } from './components/SiteProcurementTab';
import { 
  ArrowLeft, 
  HardHat, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  FileCheck,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Briefcase,
  Layers,
  Activity,
  History,
  TrendingUp,
  Download,
  Eye,
  Percent,
  Check,
  Upload,
  FileCode,
  FileImage,
  FolderKanban,
  AlertCircle,
  X,
  Search,
  Sun
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    updateProject,
    updateProjectProgress, 
    projectBudgets, 
    addBudget, 
    updateBudget,
    deleteBudget, 
    projectSchedules, 
    addScheduleTask, 
    updateScheduleTask,
    updateScheduleTaskFull,
    deleteScheduleTask,
    delayLogs, 
    addDelayLog,
    dailyLogs, 
    addDailyLog,
    safetyIncidents, 
    addSafetyIncident,
    rfis, 
    addRFI,
    resolveRFI,
    changeOrders, 
    addChangeOrder,
    documents,
    addDocument,
    deleteDocument,
    projectActivities,
    activeCompany, 
    currentUserName,
    employees,
    labourBudgets,
    materialBudgets,
    milestones,
    projectTasks,
    projectStaff,
    projectStaffHistory,
    delayNotes,
    qualityAssurance,
    projectInvoices,
    dailySiteReports,
    requisitions,
    purchaseOrders
  } = useERP();

  const project = projects.find(p => p.id === Number(id)) || projects[0];

  const [activeTab, setActiveTab] = useState<
    'overview' | 'boq' | 'dailyLogs' | 'schedule' | 'staff' | 'delays' | 'qa' | 'safety' | 'financials' | 'procurement' | 'rfis' | 'documents' | 'activities'
  >('overview');

  const [boqSubView, setBoqSubView] = useState<'boq' | 'labour' | 'material' | 'variance'>('boq');
  const [dailyLogSubView, setDailyLogSubView] = useState<'logs' | 'reports'>('logs');

  // Modal States
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<ProjectBudget | null>(null);
  const [showAddDailyLogModal, setShowAddDailyLogModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectScheduleTask | null>(null);
  const [showAddDelayModal, setShowAddDelayModal] = useState(false);
  const [showAddSafetyModal, setShowAddSafetyModal] = useState(false);
  const [showAddRFIModal, setShowAddRFIModal] = useState(false);
  const [resolvingRFI, setResolvingRFI] = useState<ProjectRFI | null>(null);
  const [showAddChangeOrderModal, setShowAddChangeOrderModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [previewProjectDoc, setPreviewProjectDoc] = useState<ProjectDocument | null>(null);
  const [deleteProjectDocConfirm, setDeleteProjectDocConfirm] = useState<ProjectDocument | null>(null);
  const [docCategoryFilter, setDocCategoryFilter] = useState('all');
  const [docSearchFilter, setDocSearchFilter] = useState('');

  // Form States - Change Order
  const [changeOrderForm, setChangeOrderForm] = useState({
    title: '',
    description: '',
    amount: 35000,
    status: 'Proposed' as ProjectChangeOrder['status']
  });

  // Filter States
  const [boqCategoryFilter, setBoqCategoryFilter] = useState<string>('all');
  const [boqStatusFilter, setBoqStatusFilter] = useState<string>('all');
  const [boqSearchTerm, setBoqSearchTerm] = useState('');
  const [boqFeedback, setBoqFeedback] = useState<string | null>(null);

  // Form States - Project Edit
  const [projectEditForm, setProjectEditForm] = useState({
    name: project?.name || '',
    clientName: project?.clientName || '',
    consultant: project?.consultant || '',
    contractValue: project?.contractValue || 0,
    budget: project?.budget || 0,
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    siteLocation: project?.siteLocation || '',
    manager: project?.manager || '',
    status: project?.status || 'in_progress',
    progressPercent: project?.progressPercent || 0
  });

  // Form States - New BOQ Line
  const [newBudget, setNewBudget] = useState({
    budgetName: '',
    category: 'Materials' as ProjectBudget['category'],
    unitOfMeasure: 'Tons',
    quantity: 10,
    unitCost: 150,
    supplier: '',
    notes: '',
    status: 'approved' as ProjectBudget['status']
  });

  // Form States - Edit BOQ Line
  const [budgetEditForm, setBudgetEditForm] = useState<Partial<ProjectBudget>>({});

  // Form States - New Daily Log
  const [newDailyLog, setNewDailyLog] = useState({
    weather: 'Sunny & Clear, 30°C',
    completedWork: '',
    manpower: '16 Steel Fixers, 10 Carpenters, 2 Site Foremen',
    equipment: '1x Concrete Boom Pump, 2x Transit Mixers',
    workersOnSite: 28,
    safetyIncident: false,
    safetyNote: 'Full PPE inspection conducted at 07:30 daily briefing.'
  });

  // Form States - New Schedule Task
  const [newTask, setNewTask] = useState({
    taskName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    status: 'planned' as ProjectScheduleTask['status'],
    progressPercent: 0,
    assignedTo: currentUserName,
    notes: ''
  });

  // Form States - Edit Schedule Task
  const [taskEditForm, setTaskEditForm] = useState<Partial<ProjectScheduleTask>>({});

  // Form States - Delay Log
  const [newDelay, setNewDelay] = useState({
    scheduleId: undefined as number | undefined,
    delayDate: new Date().toISOString().split('T')[0],
    delayDays: 3,
    reason: 'Unforeseen Utility Line Relocation',
    details: 'Gas main crossing site access road required clearance from municipal agency.'
  });

  // Form States - Safety Incident
  const [newSafety, setNewSafety] = useState({
    incidentDate: new Date().toISOString().split('T')[0],
    severity: 'Low' as ProjectSafetyIncident['severity'],
    description: '',
    actionTaken: '',
    status: 'Resolved' as ProjectSafetyIncident['status']
  });

  // Form States - RFI
  const [newRFI, setNewRFI] = useState({
    subject: '',
    assignedTo: project?.consultant || 'Consulting Structural Engineer'
  });

  const [rfiResolutionText, setRfiResolutionText] = useState('');

  // Form States - Document
  const [newDoc, setNewDoc] = useState({
    title: '',
    fileName: '',
    category: 'Architectural' as ProjectDocument['category'],
    size: '2.4 MB',
    fileType: 'application/pdf',
    fileData: '',
    description: ''
  });

  if (!project) {
    return (
      <Box p={6}>
        <Text>Project not found.</Text>
        <Button size="sm" onClick={() => navigate('/projects')} mt={2}>
          Back to Projects Catalog
        </Button>
      </Box>
    );
  }

  // Filtered Project-Specific Collections
  const currentBudgets = projectBudgets.filter(b => b.projectId === project.id);
  const currentDailyLogs = dailyLogs
    .filter(l => l.projectId === project.id)
    .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());
  const currentSchedules = projectSchedules
    .filter(s => s.projectId === project.id)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const currentDelays = delayLogs
    .filter(d => d.projectId === project.id)
    .sort((a, b) => new Date(b.delayDate).getTime() - new Date(a.delayDate).getTime());
  const currentSafety = safetyIncidents.filter(s => s.projectId === project.id);
  const currentRFIs = rfis.filter(r => r.projectId === project.id);
  const currentDocs = documents.filter(d => 
    (d.projectId === project.id || (d.relatedType === 'Project' && d.relatedId === project.id)) &&
    (docCategoryFilter === 'all' || d.category === docCategoryFilter) &&
    (d.title.toLowerCase().includes(docSearchFilter.toLowerCase()) || d.fileName.toLowerCase().includes(docSearchFilter.toLowerCase()))
  );
  const currentActivities = projectActivities
    .filter(a => a.projectId === project.id)
    .sort((a, b) => b.id - a.id);
  const currentLabour = labourBudgets.filter(l => l.projectId === project.id);
  const currentMaterials = materialBudgets.filter(m => m.projectId === project.id);
  const currentMilestones = milestones.filter(m => m.projectId === project.id);
  const currentTasks = projectTasks.filter(t => t.projectId === project.id);
  const currentStaff = projectStaff.filter(s => s.projectId === project.id);
  const currentDelayNotes = delayNotes.filter(n => n.projectId === project.id);
  const currentQA = qualityAssurance.filter(q => q.projectId === project.id);
  const currentInvoices = projectInvoices.filter(i => i.projectId === project.id);
  const currentSiteReports = dailySiteReports.filter(r => r.projectId === project.id);
  const currentRequisitions = requisitions.filter(r => r.projectId === project.id || r.projectName === project.name);
  const currentPOs = purchaseOrders.filter(p => p.projectId === project.id || p.projectName === project.name);
  const currentChangeOrders = changeOrders.filter(c => c.projectId === project.id);

  // BOQ Calculations
  const filteredBOQ = currentBudgets.filter(b => {
    const matchesCategory = boqCategoryFilter === 'all' || b.category.toLowerCase() === boqCategoryFilter.toLowerCase();
    const matchesStatus = boqStatusFilter === 'all' || b.status.toLowerCase() === boqStatusFilter.toLowerCase();
    const matchesSearch = b.budgetName.toLowerCase().includes(boqSearchTerm.toLowerCase()) ||
                          (b.supplier && b.supplier.toLowerCase().includes(boqSearchTerm.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalBOQCost = currentBudgets.reduce((acc, b) => acc + (b.quantity * b.unitCost), 0);
  const materialsSubtotal = currentBudgets.filter(b => b.category === 'Materials').reduce((sum, b) => sum + (b.quantity * b.unitCost), 0);
  const labourSubtotal = currentBudgets.filter(b => b.category === 'Labour').reduce((sum, b) => sum + (b.quantity * b.unitCost), 0);
  const subcontractSubtotal = currentBudgets.filter(b => b.category === 'Subcontract').reduce((sum, b) => sum + (b.quantity * b.unitCost), 0);
  const equipmentSubtotal = currentBudgets.filter(b => b.category === 'Equipment').reduce((sum, b) => sum + (b.quantity * b.unitCost), 0);
  const overheadSubtotal = currentBudgets.filter(b => b.category === 'Overhead').reduce((sum, b) => sum + (b.quantity * b.unitCost), 0);

  // Financial Variances
  const budgetVariance = project.budget - project.spent;
  const budgetUtilization = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;

  // Handlers
  const handleOpenEditProject = () => {
    setProjectEditForm({
      name: project.name,
      clientName: project.clientName,
      consultant: project.consultant || '',
      contractValue: project.contractValue,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      siteLocation: project.siteLocation,
      manager: project.manager,
      status: project.status,
      progressPercent: project.progressPercent
    });
    setShowEditProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, {
      ...projectEditForm,
      contractValue: Number(projectEditForm.contractValue),
      budget: Number(projectEditForm.budget),
      progressPercent: Number(projectEditForm.progressPercent)
    });
    setShowEditProjectModal(false);
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.budgetName.trim()) {
      setBoqFeedback('Item name / description is required.');
      return;
    }
    const qty = Number(newBudget.quantity);
    const unitRate = Number(newBudget.unitCost);
    if (isNaN(qty) || qty <= 0) {
      setBoqFeedback('Quantity must be greater than zero.');
      return;
    }
    if (isNaN(unitRate) || unitRate < 0) {
      setBoqFeedback('Unit cost rate cannot be negative.');
      return;
    }

    addBudget({
      projectId: project.id,
      budgetName: newBudget.budgetName.trim(),
      category: newBudget.category,
      unitOfMeasure: newBudget.unitOfMeasure.trim() || 'Units',
      quantity: qty,
      unitCost: unitRate,
      totalCost: qty * unitRate,
      supplier: newBudget.supplier.trim() || undefined,
      notes: newBudget.notes.trim() || undefined,
      status: newBudget.status
    });
    setBoqFeedback(null);
    setShowAddBudgetModal(false);
    setNewBudget({
      budgetName: '',
      category: 'Materials',
      unitOfMeasure: 'Tons',
      quantity: 10,
      unitCost: 150,
      supplier: '',
      notes: '',
      status: 'approved'
    });
  };

  const handleOpenEditBudget = (b: ProjectBudget) => {
    setBoqFeedback(null);
    setEditingBudget(b);
    setBudgetEditForm({
      budgetName: b.budgetName,
      category: b.category,
      unitOfMeasure: b.unitOfMeasure,
      quantity: b.quantity,
      unitCost: b.unitCost,
      supplier: b.supplier || '',
      notes: b.notes || '',
      status: b.status
    });
  };

  const handleSaveEditedBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget) return;
    const qty = Number(budgetEditForm.quantity ?? editingBudget.quantity);
    const rate = Number(budgetEditForm.unitCost ?? editingBudget.unitCost);
    if (isNaN(qty) || qty <= 0) {
      setBoqFeedback('Quantity must be greater than zero.');
      return;
    }
    if (isNaN(rate) || rate < 0) {
      setBoqFeedback('Unit cost rate cannot be negative.');
      return;
    }

    updateBudget(editingBudget.id, {
      ...budgetEditForm,
      quantity: qty,
      unitCost: rate,
      totalCost: qty * rate
    });
    setBoqFeedback(null);
    setEditingBudget(null);
  };

  const handleSyncProgressWithSchedule = () => {
    if (currentSchedules.length === 0) return;
    const avg = Math.round(
      currentSchedules.reduce((acc, task) => acc + task.progressPercent, 0) / currentSchedules.length
    );
    updateProjectProgress(project.id, avg);
  };

  const handleCreateDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDailyLog.completedWork.trim()) return;
    addDailyLog({
      projectId: project.id,
      logDate: new Date().toISOString().split('T')[0],
      weather: newDailyLog.weather,
      completedWork: newDailyLog.completedWork.trim(),
      manpower: newDailyLog.manpower.trim(),
      equipment: newDailyLog.equipment.trim(),
      workersOnSite: Number(newDailyLog.workersOnSite),
      safetyIncident: newDailyLog.safetyIncident,
      safetyNote: newDailyLog.safetyNote.trim() || undefined,
      loggedBy: currentUserName
    });
    setShowAddDailyLogModal(false);
    setNewDailyLog({
      weather: 'Sunny & Clear, 30°C',
      completedWork: '',
      manpower: '16 Steel Fixers, 10 Carpenters, 2 Site Foremen',
      equipment: '1x Concrete Boom Pump, 2x Transit Mixers',
      workersOnSite: 28,
      safetyIncident: false,
      safetyNote: 'Full PPE inspection conducted at 07:30 daily briefing.'
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.taskName.trim()) return;
    addScheduleTask({
      projectId: project.id,
      taskName: newTask.taskName.trim(),
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      status: newTask.status,
      progressPercent: Number(newTask.progressPercent),
      assignedTo: newTask.assignedTo,
      notes: newTask.notes.trim() || undefined
    });
    setShowAddTaskModal(false);
    setNewTask({
      taskName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      status: 'planned',
      progressPercent: 0,
      assignedTo: currentUserName,
      notes: ''
    });
  };

  const handleOpenEditTask = (task: ProjectScheduleTask) => {
    setEditingTask(task);
    setTaskEditForm({
      taskName: task.taskName,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      progressPercent: task.progressPercent,
      assignedTo: task.assignedTo || currentUserName,
      notes: task.notes || ''
    });
  };

  const handleSaveEditedTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    updateScheduleTaskFull(editingTask.id, {
      ...taskEditForm,
      progressPercent: Number(taskEditForm.progressPercent)
    });
    setEditingTask(null);
  };

  const handleCreateDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelay.reason.trim()) return;
    addDelayLog({
      projectId: project.id,
      scheduleId: newDelay.scheduleId,
      delayDate: newDelay.delayDate,
      delayDays: Number(newDelay.delayDays),
      reason: newDelay.reason.trim(),
      details: newDelay.details.trim() || undefined
    });
    setShowAddDelayModal(false);
    setNewDelay({
      scheduleId: undefined,
      delayDate: new Date().toISOString().split('T')[0],
      delayDays: 3,
      reason: 'Unforeseen Utility Line Relocation',
      details: 'Gas main crossing site access road required clearance from municipal agency.'
    });
  };

  const handleCreateSafety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSafety.description.trim()) return;
    addSafetyIncident({
      projectId: project.id,
      incidentDate: newSafety.incidentDate,
      severity: newSafety.severity,
      description: newSafety.description.trim(),
      actionTaken: newSafety.actionTaken.trim(),
      status: newSafety.status
    });
    setShowAddSafetyModal(false);
    setNewSafety({
      incidentDate: new Date().toISOString().split('T')[0],
      severity: 'Low',
      description: '',
      actionTaken: '',
      status: 'Resolved'
    });
  };

  const handleCreateRFI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRFI.subject.trim()) return;
    addRFI({
      projectId: project.id,
      subject: newRFI.subject.trim(),
      submittedBy: currentUserName,
      assignedTo: newRFI.assignedTo.trim(),
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddRFIModal(false);
    setNewRFI({
      subject: '',
      assignedTo: project.consultant || 'Consulting Structural Engineer'
    });
  };

  const handleResolveRFI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingRFI || !rfiResolutionText.trim()) return;
    resolveRFI(resolvingRFI.id, rfiResolutionText.trim());
    setResolvingRFI(null);
    setRfiResolutionText('');
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim()) return;
    addDocument({
      projectId: project.id,
      projectName: project.name,
      title: newDoc.title.trim(),
      fileName: newDoc.fileName.trim() || `${newDoc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      category: newDoc.category,
      size: newDoc.size,
      fileType: newDoc.fileType,
      fileData: newDoc.fileData,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentUserName,
      relatedType: 'Project',
      relatedId: project.id,
      relatedName: project.name,
      version: 'v1.0',
      status: 'Approved',
      description: newDoc.description
    });
    setShowAddDocumentModal(false);
    setNewDoc({
      title: '',
      fileName: '',
      category: 'Architectural',
      size: '2.4 MB',
      fileType: 'application/pdf',
      fileData: '',
      description: ''
    });
  };

  const handleDownloadProjectDoc = (doc: ProjectDocument) => {
    const fileContent = doc.fileData || `Project Technical Document: ${doc.title}\nProject: ${project.name}\nCategory: ${doc.category}\nFile: ${doc.fileName}\nSize: ${doc.size}\nDate: ${doc.uploadDate}\nUploaded By: ${doc.uploadedBy || 'Engineering Office'}`;
    const blob = new Blob([fileContent], { type: doc.fileType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveChangeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeOrderForm.title.trim()) return;
    addChangeOrder({
      projectId: project.id,
      title: changeOrderForm.title.trim(),
      description: changeOrderForm.description.trim(),
      amount: Number(changeOrderForm.amount),
      status: changeOrderForm.status,
      requestedDate: new Date().toISOString().split('T')[0]
    });
    setShowAddChangeOrderModal(false);
    setChangeOrderForm({
      title: '',
      description: '',
      amount: 35000,
      status: 'Proposed'
    });
  };

  return (
    <Stack gap={6}>
      {/* Top Breadcrumb & Actions Bar */}
      <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
        <Button 
          size="sm" 
          variant="outline" 
          borderColor="#cbd5e1" 
          color="#334155" 
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft size={15} /> Back to Projects Catalog
        </Button>

        <Flex gap={2}>
          <Button 
            size="sm" 
            variant="outline" 
            borderColor="#cbd5e1" 
            color="#334155" 
            onClick={() => setShowAddDailyLogModal(true)}
          >
            <Clock size={15} /> Log Site Progress
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            borderColor="#cbd5e1" 
            color="#334155" 
            onClick={() => setShowAddBudgetModal(true)}
          >
            <Plus size={15} /> Add BOQ Item
          </Button>
          <Button 
            size="sm" 
            bg="#2563eb" 
            color="white" 
            _hover={{ bg: '#1d4ed8' }} 
            onClick={handleOpenEditProject}
          >
            <Edit size={15} /> Edit Project
          </Button>
        </Flex>
      </Flex>

      {/* Hero Project Banner */}
      <Card.Root bg="white" borderRadius="18px" p={{ base: 5, md: 6 }} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={4}>
          <Box flex="1">
            <Flex align="center" gap={2.5} mb={1.5}>
              <Badge size="sm" colorPalette="blue" fontFamily="mono" fontSize="11px">
                {project.projectNumber}
              </Badge>
              <Badge 
                size="sm" 
                colorPalette={
                  project.status === 'in_progress' ? 'green' : 
                  project.status === 'completed' ? 'teal' : 
                  project.status === 'planned' ? 'purple' : 'orange'
                }
                variant="solid"
              >
                {project.status.replace('_', ' ')}
              </Badge>
            </Flex>

            <Heading size="xl" color="#0f172a" fontWeight="black" mb={2}>
              {project.name}
            </Heading>

            <Flex align="center" gap={4} fontSize="xs" color="#64748b" flexWrap="wrap">
              <Flex align="center" gap={1.5}>
                <MapPin size={15} color="#94a3b8" /> {project.siteLocation}
              </Flex>
              <Flex align="center" gap={1.5}>
                <Briefcase size={15} color="#94a3b8" /> Client: <Text as="span" fontWeight="bold" color="#0f172a">{project.clientName}</Text>
              </Flex>
              {project.consultant && (
                <Flex align="center" gap={1.5}>
                  <Users size={15} color="#94a3b8" /> Consultant: <Text as="span" fontWeight="semibold" color="#334155">{project.consultant}</Text>
                </Flex>
              )}
              <Flex align="center" gap={1.5}>
                <Calendar size={15} color="#94a3b8" /> {project.startDate} → {project.endDate}
              </Flex>
            </Flex>
          </Box>

          {/* Quick Progress Adjuster */}
          <Box 
            p={4} 
            bg="#f8fafc" 
            borderRadius="14px" 
            border="1px solid #e2e8f0" 
            minW={{ md: '220px' }} 
            textAlign={{ base: 'left', md: 'right' }}
          >
            <Text fontSize="11px" color="#64748b" textTransform="uppercase" fontWeight="bold">
              Physical Progress
            </Text>
            <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={0.5}>
              {project.progressPercent}%
            </Text>
            <Progress.Root value={project.progressPercent} size="sm" colorPalette="blue" my={2}>
              <Progress.Track bg="#cbd5e1" borderRadius="full">
                <Progress.Range borderRadius="full" />
              </Progress.Track>
            </Progress.Root>
            <Flex align="center" justify={{ base: 'flex-start', md: 'flex-end' }} gap={2}>
              <Text fontSize="11px" color="#94a3b8">Adjust %:</Text>
              <Input
                type="number"
                min={0}
                max={100}
                size="xs"
                w="60px"
                textAlign="center"
                value={project.progressPercent}
                onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                bg="white"
                borderRadius="6px"
              />
            </Flex>
            {currentSchedules.length > 0 && (
              <Button
                size="xs"
                variant="subtle"
                colorPalette="blue"
                mt={2}
                w="full"
                fontSize="10px"
                onClick={handleSyncProgressWithSchedule}
                title="Recalculate project completion percentage from average of schedule milestone tasks"
              >
                Sync from Schedule Tasks
              </Button>
            )}
          </Box>
        </Flex>
      </Card.Root>

      {/* Procore-Style Site Operations & Environmental Conditions Strip */}
      <Card.Root bg="#ffffff" borderRadius="14px" p={3.5} border="1px solid #e2e8f0" boxShadow="xs">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
          <Flex align="center" gap={3} p={2.5} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
            <Box p={2} bg="#fff7ed" color="#ea580c" borderRadius="8px">
              <Sun size={18} />
            </Box>
            <Box>
              <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Site Weather & Wind</Text>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">Clear, 29°C • 9 km/h NE</Text>
              <Text fontSize="10px" color="#16a34a">Optimal for Crane & Pour</Text>
            </Box>
          </Flex>

          <Flex align="center" gap={3} p={2.5} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
            <Box p={2} bg="#eff6ff" color="#2563eb" borderRadius="8px">
              <Users size={18} />
            </Box>
            <Box>
              <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Active Field Labor</Text>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">{(project.assignedEngineers?.length || 2) * 8 + 12} Craft Workers Today</Text>
              <Text fontSize="10px" color="#2563eb">Biometrics Checked</Text>
            </Box>
          </Flex>

          <Flex align="center" gap={3} p={2.5} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
            <Box p={2} bg="#f0fdf4" color="#16a34a" borderRadius="8px">
              <ShieldCheck size={18} />
            </Box>
            <Box>
              <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">EHS Safety Record</Text>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">142 Days Zero Lost-Time</Text>
              <Text fontSize="10px" color="#16a34a">PPE Protocol Compliant</Text>
            </Box>
          </Flex>

          <Flex align="center" gap={3} p={2.5} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
            <Box p={2} bg="#fef3c7" color="#d97706" borderRadius="8px">
              <Clock size={18} />
            </Box>
            <Box>
              <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Action Items & Ball-in-Court</Text>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                {currentRFIs.filter(r => r.status === 'Open').length} Open RFIs • {currentRequisitions.filter(r => r.status.includes('Pending')).length} Pending MRs
              </Text>
              <Text fontSize="10px" color="#d97706">Items Requiring Review</Text>
            </Box>
          </Flex>
        </SimpleGrid>
      </Card.Root>

      {/* Financial Variance Overview KPIs */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Agreed Contract Value
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {project.contractValue.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#64748b" mt={1}>
            Client certified baseline lump sum
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Total BOQ Cost / Budget
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
            {activeCompany.currency} {totalBOQCost > 0 ? totalBOQCost.toLocaleString() : project.budget.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#64748b" mt={1}>
            Calculated from {currentBudgets.length} BOQ items
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Actual Direct Spend
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
            {activeCompany.currency} {project.spent.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#64748b" mt={1}>
            {budgetUtilization}% of budget consumed
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Remaining Budget Variance
          </Text>
          <Text fontSize="xl" fontWeight="black" color={budgetVariance >= 0 ? '#16a34a' : '#dc2626'} mt={1}>
            {activeCompany.currency} {budgetVariance.toLocaleString()}
          </Text>
          <Text fontSize="11px" color={budgetVariance >= 0 ? '#16a34a' : '#dc2626'} fontWeight="bold" mt={1}>
            {budgetVariance >= 0 ? 'Within Allocated Limit' : 'Cost Overrun Detected'}
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Tab Navigation */}
      <Flex borderBottom="2px solid #e2e8f0" gap={4} overflowX="auto" pb="1px">
        {[
          { id: 'overview', label: 'Project Info & Specs' },
          { id: 'boq', label: `BOQ & Budgets • ${currentBudgets.length + currentLabour.length + currentMaterials.length}` },
          { id: 'dailyLogs', label: `Daily Site Progress • ${currentDailyLogs.length + currentSiteReports.length}` },
          { id: 'schedule', label: `Schedule & Tasks • ${currentSchedules.length + currentMilestones.length + currentTasks.length}` },
          { id: 'staff', label: `Site Staff & Team • ${currentStaff.length}` },
          { id: 'delays', label: `Delays & EOT • ${currentDelays.length + currentDelayNotes.length}` },
          { id: 'qa', label: `Quality Assurance • ${currentQA.length}` },
          { id: 'safety', label: `Site Safety • ${currentSafety.length}` },
          { id: 'financials', label: `Financials & Billing • ${currentInvoices.length}` },
          { id: 'procurement', label: `Procurement • ${currentRequisitions.length + currentPOs.length}` },
          { id: 'rfis', label: `RFIs & Variations • ${currentRFIs.length + currentChangeOrders.length}` },
          { id: 'documents', label: `Drawings & Documents • ${currentDocs.length}` },
          { id: 'activities', label: `Activity History • ${currentActivities.length}` }
        ].map((tab) => (
          <Box
            key={tab.id}
            as="button"
            pb={3}
            fontSize="xs"
            fontWeight={activeTab === tab.id ? 'bold' : 'medium'}
            color={activeTab === tab.id ? '#2563eb' : '#64748b'}
            borderBottom={activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent'}
            cursor="pointer"
            whiteSpace="nowrap"
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </Box>
        ))}
      </Flex>

      {/* TAB 1: OVERVIEW & PROJECT INFO */}
      {activeTab === 'overview' && (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {/* Project Details Sheet */}
          <Card.Root bg="white" borderRadius="14px" p={6} border="1px solid #e2e8f0">
            <Heading size="sm" color="#0f172a" mb={4} display="flex" alignItems="center" gap={2}>
              <Briefcase size={18} color="#2563eb" /> Project Contract Information
            </Heading>

            <Stack gap={3} fontSize="xs">
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Project Identification Code:</Text>
                <Text fontWeight="bold" fontFamily="mono" color="#0f172a">{project.projectNumber}</Text>
              </Flex>
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Client Organization:</Text>
                <Text fontWeight="semibold" color="#0f172a">{project.clientName}</Text>
              </Flex>
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Engineering Consultant:</Text>
                <Text fontWeight="semibold" color="#0f172a">{project.consultant || 'N/A'}</Text>
              </Flex>
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Physical Site Location:</Text>
                <Text fontWeight="semibold" color="#0f172a">{project.siteLocation}</Text>
              </Flex>
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Lead Project Manager:</Text>
                <Text fontWeight="bold" color="#2563eb">{project.manager}</Text>
              </Flex>
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Contract Start Date:</Text>
                <Text fontWeight="medium" color="#0f172a">{project.startDate}</Text>
              </Flex>
              <Flex justify="space-between" py={2} borderBottom="1px dashed #e2e8f0">
                <Text color="#64748b">Target Completion Date:</Text>
                <Text fontWeight="medium" color="#0f172a">{project.endDate}</Text>
              </Flex>
              <Flex justify="space-between" py={2}>
                <Text color="#64748b">Operational Status:</Text>
                <Badge colorPalette="blue">{project.status.replace('_', ' ')}</Badge>
              </Flex>
            </Stack>
          </Card.Root>

          {/* Assigned Personnel & Engineering Supervision */}
          <Card.Root bg="white" borderRadius="14px" p={6} border="1px solid #e2e8f0">
            <Heading size="sm" color="#0f172a" mb={4} display="flex" alignItems="center" gap={2}>
              <Users size={18} color="#2563eb" /> Assigned Site Engineers & Supervisors
            </Heading>

            <Stack gap={2.5}>
              {project.assignedEngineers.map((eng, idx) => (
                <Flex key={idx} align="center" justify="space-between" p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9">
                  <Flex align="center" gap={3}>
                    <Box w="34px" h="34px" borderRadius="full" bg="#2563eb" color="white" display="flex" alignItems="center" justifyContent="center" fontSize="xs" fontWeight="bold">
                      {eng.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{eng}</Text>
                      <Text fontSize="10px" color="#64748b">Resident Site Engineer</Text>
                    </Box>
                  </Flex>
                  <Badge size="xs" colorPalette="green">On-Site</Badge>
                </Flex>
              ))}
            </Stack>

            {/* Quick Actions Card */}
            <Box mt={6} p={4} bg="#eff6ff" borderRadius="12px" border="1px solid #bfdbfe">
              <Text fontSize="xs" fontWeight="bold" color="#1e40af" mb={1}>
                Site Execution Shortcuts
              </Text>
              <Text fontSize="11px" color="#3b82f6" mb={3}>
                Submit logs, review technical drawings, or draft new BOQ sub-items.
              </Text>
              <Flex gap={2} wrap="wrap">
                <Button size="xs" colorPalette="blue" onClick={() => setShowAddDailyLogModal(true)}>
                  Log Daily Progress
                </Button>
                <Button size="xs" variant="outline" borderColor="#3b82f6" color="#1e40af" onClick={() => setShowAddBudgetModal(true)}>
                  Add BOQ Item
                </Button>
                <Button size="xs" variant="outline" borderColor="#3b82f6" color="#1e40af" onClick={() => setShowAddRFIModal(true)}>
                  Draft RFI
                </Button>
              </Flex>
            </Box>
          </Card.Root>
        </SimpleGrid>
      )}

      {/* TAB 2: BILL OF QUANTITIES (BOQ) */}
      {activeTab === 'boq' && (
        <Stack gap={5}>
          {/* BOQ Category Breakdown Summary */}
          <SimpleGrid columns={{ base: 2, sm: 3, lg: 5 }} gap={3}>
            <Card.Root bg="white" borderRadius="12px" p={3.5} border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Materials</Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                {activeCompany.currency} {materialsSubtotal.toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#94a3b8">Cement, steel, sand</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="12px" p={3.5} border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Labour</Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                {activeCompany.currency} {labourSubtotal.toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#94a3b8">Masons, fixers, helpers</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="12px" p={3.5} border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Subcontract</Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                {activeCompany.currency} {subcontractSubtotal.toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#94a3b8">Specialist trades</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="12px" p={3.5} border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Equipment</Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                {activeCompany.currency} {equipmentSubtotal.toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#94a3b8">Cranes, plant, pumps</Text>
            </Card.Root>

            <Card.Root bg="white" borderRadius="12px" p={3.5} border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Overhead</Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                {activeCompany.currency} {overheadSubtotal.toLocaleString()}
              </Text>
              <Text fontSize="10px" color="#94a3b8">Site safety & setup</Text>
            </Card.Root>
          </SimpleGrid>

          {/* Search, Filter & Add Line Bar */}
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
            <Flex gap={2} flex="1" maxW={{ md: '400px' }}>
              <Input
                size="sm"
                placeholder="Search BOQ items or supplier..."
                value={boqSearchTerm}
                onChange={(e) => setBoqSearchTerm(e.target.value)}
                bg="white"
                borderRadius="8px"
              />
            </Flex>

            <Flex gap={2} align="center" wrap="wrap">
              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b" fontWeight="medium">Category:</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={boqCategoryFilter}
                    onChange={(e) => setBoqCategoryFilter(e.target.value)}
                    bg="white"
                    borderRadius="8px"
                    fontSize="xs"
                  >
                    <option value="all">All Categories</option>
                    <option value="materials">Materials</option>
                    <option value="labour">Labour</option>
                    <option value="subcontract">Subcontract</option>
                    <option value="equipment">Equipment</option>
                    <option value="overhead">Overhead</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b" fontWeight="medium">Status:</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={boqStatusFilter}
                    onChange={(e) => setBoqStatusFilter(e.target.value)}
                    bg="white"
                    borderRadius="8px"
                    fontSize="xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="actual">Actual (Committed)</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Button size="sm" bg="#2563eb" color="white" onClick={() => { setBoqFeedback(null); setShowAddBudgetModal(true); }}>
                <Plus size={15} /> Add BOQ Item
              </Button>
            </Flex>
          </Flex>

          {/* BOQ Table */}
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" overflowX="auto">
            {filteredBOQ.length === 0 ? (
              <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                No Bill of Quantities items match your search or filter.
              </Box>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">Item / Scope</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Category</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="center">Unit</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Qty</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Unit Rate</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Total Cost</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Supplier / Contractor</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredBOQ.map((b) => (
                    <Table.Row key={b.id}>
                      <Table.Cell>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{b.budgetName}</Text>
                        {b.notes && <Text fontSize="10px" color="#64748b">{b.notes}</Text>}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge 
                          size="xs" 
                          colorPalette={
                            b.category === 'Materials' ? 'blue' :
                            b.category === 'Labour' ? 'orange' :
                            b.category === 'Subcontract' ? 'purple' :
                            b.category === 'Equipment' ? 'cyan' : 'gray'
                          }
                          variant="subtle"
                        >
                          {b.category}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="center" color="#64748b">{b.unitOfMeasure}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="semibold" color="#0f172a">{b.quantity.toLocaleString()}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" color="#475569">{activeCompany.currency} {b.unitCost.toLocaleString()}</Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold" color="#2563eb">
                        {activeCompany.currency} {(b.quantity * b.unitCost).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#64748b">{b.supplier || 'Site Direct'}</Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={b.status === 'actual' ? 'green' : b.status === 'approved' ? 'blue' : 'yellow'}>
                          {b.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={1.5}>
                          <Button size="xs" variant="subtle" onClick={() => handleOpenEditBudget(b)} title="Edit BOQ Item">
                            <Edit size={12} />
                          </Button>
                          <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteBudget(b.id)} title="Delete BOQ Item">
                            <Trash2 size={12} />
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}

            {/* Total Footer Banner */}
            <Flex justify="space-between" align="center" p={3.5} mt={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
              <Text fontSize="xs" fontWeight="bold" color="#64748b">
                TOTAL CALCULATED BOQ LINE VALUE ({filteredBOQ.length} Items Displayed)
              </Text>
              <Text fontSize="base" fontWeight="black" color="#2563eb">
                {activeCompany.currency} {filteredBOQ.reduce((sum, b) => sum + (b.quantity * b.unitCost), 0).toLocaleString()}
              </Text>
            </Flex>
          </Card.Root>
        </Stack>
      )}

      {/* TAB 3: DAILY SITE PROGRESS & SITE LOGS */}
      {activeTab === 'dailyLogs' && (
        <Stack gap={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="sm" color="#0f172a">Daily Site Progress Reports</Heading>
              <Text fontSize="xs" color="#64748b">Chronological site engineer reports, weather status, manpower, and plant deployed.</Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={() => setShowAddDailyLogModal(true)}>
              <Plus size={15} /> Log New Daily Report
            </Button>
          </Flex>

          {currentDailyLogs.length === 0 ? (
            <Card.Root bg="white" borderRadius="14px" p={8} textAlign="center" border="1px solid #e2e8f0">
              <Text fontSize="xs" color="#94a3b8">No daily progress reports recorded yet for this site.</Text>
              <Button size="xs" colorPalette="blue" mt={3} onClick={() => setShowAddDailyLogModal(true)}>
                Submit First Daily Report
              </Button>
            </Card.Root>
          ) : (
            <Stack gap={3}>
              {currentDailyLogs.map((log) => (
                <Card.Root key={log.id} bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0">
                  <Flex justify="space-between" align="flex-start" mb={2} flexWrap="wrap" gap={2}>
                    <Box>
                      <Flex align="center" gap={2}>
                        <Text fontSize="sm" fontWeight="bold" color="#0f172a">{log.logDate}</Text>
                        <Badge colorPalette="orange" variant="subtle" fontSize="10px">{log.weather}</Badge>
                      </Flex>
                      <Text fontSize="11px" color="#64748b" mt={0.5}>Submitted by: {log.loggedBy}</Text>
                    </Box>

                    {log.safetyIncident ? (
                      <Badge colorPalette="red" variant="solid">Safety Incident Reported</Badge>
                    ) : (
                      <Badge colorPalette="green" variant="subtle">Zero Incidents</Badge>
                    )}
                  </Flex>

                  <Box p={3.5} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" my={2} fontSize="xs">
                    <Text fontWeight="bold" color="#0f172a" mb={1}>Completed Work Scope:</Text>
                    <Text color="#334155" lineHeight="relaxed">{log.completedWork}</Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3} fontSize="xs" color="#64748b" pt={1}>
                    <Box>
                      <Text fontWeight="bold" color="#475569" fontSize="10px" textTransform="uppercase">Manpower on Site:</Text>
                      <Text color="#0f172a" mt={0.5}>{log.manpower} ({log.workersOnSite} workers)</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#475569" fontSize="10px" textTransform="uppercase">Equipment Active:</Text>
                      <Text color="#0f172a" mt={0.5}>{log.equipment}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#475569" fontSize="10px" textTransform="uppercase">Safety Notes:</Text>
                      <Text color="#0f172a" mt={0.5}>{log.safetyNote || 'Standard PPE compliance.'}</Text>
                    </Box>
                  </SimpleGrid>
                </Card.Root>
              ))}
            </Stack>
          )}
        </Stack>
      )}

      {/* TAB 4: SCHEDULE & DELAYS */}
      {activeTab === 'schedule' && (
        <Stack gap={6}>
          {/* Schedule Tasks */}
          <Box>
            <Flex justify="space-between" align="center" mb={3}>
              <Box>
                <Heading size="sm" color="#0f172a">Project Work Breakdown Schedule</Heading>
                <Text fontSize="xs" color="#64748b">Key milestone phases, target start/finish dates, and percentage completion.</Text>
              </Box>
              <Button size="sm" bg="#2563eb" color="white" onClick={() => setShowAddTaskModal(true)}>
                <Plus size={15} /> Add Task Phase
              </Button>
            </Flex>

            <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" overflowX="auto">
              {currentSchedules.length === 0 ? (
                <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                  No schedule tasks added yet.
                </Box>
              ) : (
                <Table.Root size="sm" striped>
                  <Table.Header bg="#f8fafc">
                    <Table.Row>
                      <Table.ColumnHeader color="#475569">Milestone Task Name</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Start Date</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">End Date</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Progress</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Assigned Engineer</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {currentSchedules.map((task) => (
                      <Table.Row key={task.id}>
                        <Table.Cell>
                          <Text fontSize="xs" fontWeight="bold" color="#0f172a">{task.taskName}</Text>
                          {task.notes && <Text fontSize="10px" color="#64748b">{task.notes}</Text>}
                        </Table.Cell>
                        <Table.Cell fontSize="xs" color="#64748b">{task.startDate}</Table.Cell>
                        <Table.Cell fontSize="xs" color="#64748b">{task.endDate}</Table.Cell>
                        <Table.Cell minW="110px">
                          <Flex justify="space-between" fontSize="10px" mb={1}>
                            <Text color="#64748b">{task.progressPercent}%</Text>
                          </Flex>
                          <Progress.Root value={task.progressPercent} size="xs" colorPalette="blue">
                            <Progress.Track bg="#e2e8f0" borderRadius="full">
                              <Progress.Range borderRadius="full" />
                            </Progress.Track>
                          </Progress.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge 
                            size="xs" 
                            colorPalette={
                              task.status === 'completed' ? 'green' : 
                              task.status === 'in_progress' ? 'blue' : 
                              task.status === 'on_hold' ? 'orange' : 'gray'
                            }
                          >
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell fontSize="xs" color="#334155">{task.assignedTo || project.manager}</Table.Cell>
                        <Table.Cell textAlign="right">
                          <Flex justify="flex-end" gap={1.5}>
                            <Button size="xs" variant="subtle" onClick={() => handleOpenEditTask(task)}>
                              <Edit size={12} />
                            </Button>
                            <Button size="xs" variant="subtle" colorPalette="red" onClick={() => deleteScheduleTask(task.id)}>
                              <Trash2 size={12} />
                            </Button>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Root>
          </Box>

          {/* Project Delay Logs Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={3}>
              <Box>
                <Heading size="sm" color="#0f172a" display="flex" alignItems="center" gap={2}>
                  <AlertTriangle size={18} color="#d97706" /> Site Delay Logs & Extension of Time (EOT)
                </Heading>
                <Text fontSize="xs" color="#64748b">Formal site delays impacting critical path schedule with reasons and impact days.</Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#334155" onClick={() => setShowAddDelayModal(true)}>
                <Plus size={15} /> Record Delay Event
              </Button>
            </Flex>

            <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0">
              {currentDelays.length === 0 ? (
                <Box py={6} textAlign="center" color="#94a3b8" fontSize="xs">
                  Zero delays recorded on this project. Schedule execution is on time.
                </Box>
              ) : (
                <Table.Root size="sm" striped>
                  <Table.Header bg="#f8fafc">
                    <Table.Row>
                      <Table.ColumnHeader color="#475569">Delay Date</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Days Impacted</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Primary Cause / Reason</Table.ColumnHeader>
                      <Table.ColumnHeader color="#475569">Detailed Impact Notes</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {currentDelays.map((del) => (
                      <Table.Row key={del.id}>
                        <Table.Cell fontSize="xs" color="#64748b" fontWeight="semibold">{del.delayDate}</Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette="red" size="xs">+{del.delayDays} Days</Badge>
                        </Table.Cell>
                        <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">{del.reason}</Table.Cell>
                        <Table.Cell fontSize="xs" color="#334155">{del.details || 'N/A'}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </Card.Root>
          </Box>
        </Stack>
      )}

      {/* TAB 5: PROJECT ACTIVITIES & AUDIT HISTORY */}
      {activeTab === 'activities' && (
        <Card.Root bg="white" borderRadius="14px" p={6} border="1px solid #e2e8f0">
          <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
            <History size={18} color="#2563eb" /> Project Audit Log & Event Timeline
          </Heading>
          <Text fontSize="xs" color="#64748b" mb={4}>
            Chronological audit trail of all project modifications, daily logs, BOQ changes, and milestone updates.
          </Text>

          {currentActivities.length === 0 ? (
            <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
              No historical events recorded yet for this project.
            </Box>
          ) : (
            <Stack gap={4}>
              {currentActivities.map((act) => (
                <Flex key={act.id} gap={3} align="flex-start" pb={3} borderBottom="1px dashed #f1f5f9">
                  <Box 
                    w="32px" 
                    h="32px" 
                    borderRadius="full" 
                    bg={
                      act.activityType === 'Progress Update' ? '#eff6ff' :
                      act.activityType === 'BOQ Change' ? '#f0fdf4' :
                      act.activityType === 'Daily Log' ? '#faf5ff' :
                      act.activityType === 'Safety' ? '#fef2f2' : '#f8fafc'
                    }
                    color={
                      act.activityType === 'Progress Update' ? '#2563eb' :
                      act.activityType === 'BOQ Change' ? '#16a34a' :
                      act.activityType === 'Daily Log' ? '#7c3aed' :
                      act.activityType === 'Safety' ? '#dc2626' : '#475569'
                    }
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    flexShrink={0}
                    mt={0.5}
                  >
                    <Activity size={16} />
                  </Box>

                  <Box flex="1">
                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={1}>
                      <Flex align="center" gap={2}>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{act.user}</Text>
                        <Badge size="xs" colorPalette="gray" fontSize="9px">{act.role}</Badge>
                        <Badge size="xs" colorPalette="blue" variant="subtle" fontSize="9px">{act.activityType}</Badge>
                      </Flex>
                      <Text fontSize="10px" color="#94a3b8">{act.timestamp}</Text>
                    </Flex>
                    <Text fontSize="xs" color="#334155" mt={1}>{act.description}</Text>
                  </Box>
                </Flex>
              ))}
            </Stack>
          )}
        </Card.Root>
      )}

      {/* TAB 6: RFIs */}
      {activeTab === 'rfis' && (
        <Stack gap={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="sm" color="#0f172a">Requests for Information (RFIs)</Heading>
              <Text fontSize="xs" color="#64748b">Formal technical clarification requests sent to consulting engineers.</Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={() => setShowAddRFIModal(true)}>
              <Plus size={15} /> Submit New RFI
            </Button>
          </Flex>

          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0">
            {currentRFIs.length === 0 ? (
              <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                No RFIs submitted for this project.
              </Box>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">Date</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Subject / Technical Scope</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Submitted By</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Assigned Consultant</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Action</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentRFIs.map((r) => (
                    <Table.Row key={r.id}>
                      <Table.Cell fontSize="xs" color="#64748b">{r.date}</Table.Cell>
                      <Table.Cell>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{r.subject}</Text>
                        {r.resolution && <Text fontSize="10px" color="#16a34a" mt={0.5}>Resolution: {r.resolution}</Text>}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">{r.submittedBy}</Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">{r.assignedTo}</Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={r.status === 'Resolved' ? 'green' : 'blue'}>
                          {r.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        {r.status !== 'Resolved' ? (
                          <Button size="xs" colorPalette="green" onClick={() => setResolvingRFI(r)}>
                            Resolve
                          </Button>
                        ) : (
                          <Text fontSize="xs" color="#16a34a" fontWeight="bold">Resolved</Text>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Root>
        </Stack>
      )}

      {/* TAB 7: SAFETY & INCIDENTS */}
      {activeTab === 'safety' && (
        <Stack gap={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="sm" color="#0f172a" display="flex" alignItems="center" gap={2}>
                <ShieldCheck size={18} color="#16a34a" /> Site Health & Safety Management
              </Heading>
              <Text fontSize="xs" color="#64748b">Site incident logs, hazard severity rankings, and mandatory corrective actions.</Text>
            </Box>
            <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#334155" onClick={() => setShowAddSafetyModal(true)}>
              <Plus size={15} /> Log Incident
            </Button>
          </Flex>

          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0">
            {currentSafety.length === 0 ? (
              <Box py={8} textAlign="center" color="#16a34a" fontSize="xs" fontWeight="medium">
                Zero safety incidents reported on this site! Excellent HSE compliance.
              </Box>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">Incident Date</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Severity</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Incident Description</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Corrective Action Taken</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentSafety.map((inc) => (
                    <Table.Row key={inc.id}>
                      <Table.Cell fontSize="xs" color="#64748b">{inc.incidentDate}</Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={inc.severity === 'Critical' || inc.severity === 'High' ? 'red' : 'yellow'}>
                          {inc.severity}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#0f172a" fontWeight="medium">{inc.description}</Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">{inc.actionTaken}</Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={inc.status === 'Resolved' ? 'green' : 'orange'}>{inc.status}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Root>
        </Stack>
      )}

      {/* TAB 8: DRAWINGS & DOCUMENTS */}
      {activeTab === 'documents' && (
        <Stack gap={4}>
          <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
            <Box>
              <Heading size="sm" color="#0f172a">Project Technical Drawings & Document Repository</Heading>
              <Text fontSize="xs" color="#64748b">Architectural blueprints, structural calculation sheets, client permits, and site photos.</Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={() => setShowAddDocumentModal(true)}>
              <Plus size={15} /> Upload Project Document
            </Button>
          </Flex>

          {/* Search & Category Filter Toolbar */}
          <Card.Root bg="white" borderRadius="12px" p={3} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', sm: 'row' }} gap={2.5} align={{ base: 'stretch', sm: 'center' }} justify="space-between">
              <Flex align="center" gap={2} bg="#f8fafc" px={3} py={1} borderRadius="8px" border="1px solid #e2e8f0" flex="1" maxW={{ sm: '280px' }}>
                <Search size={14} color="#94a3b8" />
                <Input
                  variant="subtle"
                  size="xs"
                  placeholder="Filter drawings or files..."
                  value={docSearchFilter}
                  onChange={(e) => setDocSearchFilter(e.target.value)}
                />
                {docSearchFilter && (
                  <Box as="button" onClick={() => setDocSearchFilter('')} color="#94a3b8" cursor="pointer">
                    <X size={12} />
                  </Box>
                )}
              </Flex>

              <Flex align="center" gap={2}>
                <Box minW="160px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field value={docCategoryFilter} onChange={(e) => setDocCategoryFilter(e.target.value)}>
                      <option value="all">All Disciplines & Categories</option>
                      <option value="Architectural">Architectural</option>
                      <option value="Structural">Structural</option>
                      <option value="Contract">Contract</option>
                      <option value="Permit">Permit / Statutory</option>
                      <option value="Site Photo">Site Progress Photo</option>
                      <option value="Quality & Testing">Quality & Testing</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
                <Badge size="xs" colorPalette="blue" px={2} py={1}>
                  {currentDocs.length} {currentDocs.length === 1 ? 'file' : 'files'}
                </Badge>
              </Flex>
            </Flex>
          </Card.Root>

          {currentDocs.length === 0 ? (
            <Card.Root bg="white" borderRadius="14px" p={8} border="1px solid #e2e8f0" textAlign="center">
              <FolderKanban size={32} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
              <Text fontSize="sm" fontWeight="medium" color="#64748b">No project files match your query.</Text>
              <Text fontSize="xs" color="#94a3b8" mt={1}>Upload architectural drawings or technical documents using the button above.</Text>
            </Card.Root>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {currentDocs.map((doc) => {
                const isCad = doc.fileName.endsWith('.dwg') || doc.fileName.endsWith('.cad');
                const isImg = doc.fileName.endsWith('.jpg') || doc.fileName.endsWith('.png') || doc.category === 'Site Photo';

                return (
                  <Card.Root key={doc.id} bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs" _hover={{ borderColor: '#93c5fd' }}>
                    <Flex justify="space-between" align="flex-start" mb={2}>
                      <Badge size="xs" colorPalette="blue">{doc.category}</Badge>
                      <Text fontSize="10px" color="#94a3b8">{doc.uploadDate}</Text>
                    </Flex>

                    <Flex align="center" gap={2.5} mb={2}>
                      <Box
                        w="32px"
                        h="32px"
                        borderRadius="8px"
                        bg={isCad ? '#eff6ff' : isImg ? '#f0fdf4' : '#f8fafc'}
                        color={isCad ? '#2563eb' : isImg ? '#16a34a' : '#64748b'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        {isCad ? <FileCode size={16} /> : isImg ? <FileImage size={16} /> : <FileText size={16} />}
                      </Box>
                      <Box flex="1" minW="0">
                        <Heading size="xs" color="#0f172a" truncate title={doc.title}>{doc.title}</Heading>
                        <Text fontSize="11px" fontFamily="mono" color="#64748b" truncate>{doc.fileName}</Text>
                      </Box>
                    </Flex>

                    <Flex justify="space-between" align="center" fontSize="10px" color="#94a3b8" mb={3} pt={1} borderTop="1px dashed #f1f5f9">
                      <Text>Size: <span style={{ fontFamily: 'monospace' }}>{doc.size}</span></Text>
                      <Text>By: {doc.uploadedBy || 'Engineering Desk'}</Text>
                    </Flex>

                    <Flex justify="flex-end" gap={1.5} pt={2} borderTop="1px solid #f1f5f9">
                      <Button size="xs" variant="outline" onClick={() => setPreviewProjectDoc(doc)}>
                        <Eye size={12} /> View
                      </Button>
                      <Button size="xs" colorPalette="blue" onClick={() => handleDownloadProjectDoc(doc)}>
                        <Download size={12} /> Download
                      </Button>
                      <Button size="xs" variant="ghost" colorPalette="red" onClick={() => setDeleteProjectDocConfirm(doc)}>
                        <Trash2 size={12} />
                      </Button>
                    </Flex>
                  </Card.Root>
                );
              })}
            </SimpleGrid>
          )}
        </Stack>
      )}

      {/* MODAL: EDIT PROJECT */}
      {showEditProjectModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Heading size="md" color="#0f172a" mb={1}>Edit Project Details</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Modify contractual parameters, budget allocations, and site dates.</Text>

            <form onSubmit={handleSaveProject}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Name *</Text>
                  <Input size="sm" value={projectEditForm.name} onChange={(e) => setProjectEditForm({ ...projectEditForm, name: e.target.value })} required />
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Client Name *</Text>
                    <Input size="sm" value={projectEditForm.clientName} onChange={(e) => setProjectEditForm({ ...projectEditForm, clientName: e.target.value })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Consultant</Text>
                    <Input size="sm" value={projectEditForm.consultant} onChange={(e) => setProjectEditForm({ ...projectEditForm, consultant: e.target.value })} />
                  </Box>
                </SimpleGrid>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Location</Text>
                  <Input size="sm" value={projectEditForm.siteLocation} onChange={(e) => setProjectEditForm({ ...projectEditForm, siteLocation: e.target.value })} />
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contract Value ({activeCompany.currency})</Text>
                    <Input size="sm" type="number" value={projectEditForm.contractValue} onChange={(e) => setProjectEditForm({ ...projectEditForm, contractValue: Number(e.target.value) })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Target Budget ({activeCompany.currency})</Text>
                    <Input size="sm" type="number" value={projectEditForm.budget} onChange={(e) => setProjectEditForm({ ...projectEditForm, budget: Number(e.target.value) })} />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={projectEditForm.status} onChange={(e) => setProjectEditForm({ ...projectEditForm, status: e.target.value as any })}>
                        <option value="in_progress">In Progress</option>
                        <option value="planned">Planned</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Physical Progress (%)</Text>
                    <Input size="sm" type="number" min={0} max={100} value={projectEditForm.progressPercent} onChange={(e) => setProjectEditForm({ ...projectEditForm, progressPercent: Number(e.target.value) })} />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Start Date</Text>
                    <Input size="sm" type="date" value={projectEditForm.startDate} onChange={(e) => setProjectEditForm({ ...projectEditForm, startDate: e.target.value })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>End Date</Text>
                    <Input size="sm" type="date" value={projectEditForm.endDate} onChange={(e) => setProjectEditForm({ ...projectEditForm, endDate: e.target.value })} />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowEditProjectModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Save Changes</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD BOQ ITEM */}
      {showAddBudgetModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Add Bill of Quantities (BOQ) Item</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Specify quantity, unit of measure, and unit cost rate for live calculation.</Text>

            {boqFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {boqFeedback}
              </Box>
            )}

            <form onSubmit={handleCreateBudget}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Item Name / Description *</Text>
                  <Input size="sm" placeholder="e.g. Ready-Mix Concrete Grade M35" value={newBudget.budgetName} onChange={(e) => setNewBudget({ ...newBudget, budgetName: e.target.value })} required />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={newBudget.category} onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value as any })}>
                        <option value="Materials">Materials</option>
                        <option value="Labour">Labour</option>
                        <option value="Subcontract">Subcontract</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Overhead">Overhead</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit of Measure</Text>
                    <Input size="sm" placeholder="e.g. m³, Tons, Days, Lump Sum" value={newBudget.unitOfMeasure} onChange={(e) => setNewBudget({ ...newBudget, unitOfMeasure: e.target.value })} required />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity *</Text>
                    <Input size="sm" type="number" step="any" min={0} value={newBudget.quantity} onChange={(e) => setNewBudget({ ...newBudget, quantity: Number(e.target.value) })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Cost ({activeCompany.currency}) *</Text>
                    <Input size="sm" type="number" step="any" min={0} value={newBudget.unitCost} onChange={(e) => setNewBudget({ ...newBudget, unitCost: Number(e.target.value) })} required />
                  </Box>
                </SimpleGrid>

                {/* Auto Calculated Preview */}
                <Box p={3} bg="#eff6ff" borderRadius="10px" border="1px solid #bfdbfe">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" fontWeight="bold" color="#1e40af">Calculated Total Line Cost:</Text>
                    <Text fontSize="sm" fontWeight="black" color="#1e40af">
                      {activeCompany.currency} {(newBudget.quantity * newBudget.unitCost).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Supplier / Contractor</Text>
                    <Input size="sm" placeholder="e.g. Continental Steel Mills" value={newBudget.supplier} onChange={(e) => setNewBudget({ ...newBudget, supplier: e.target.value })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Approval Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={newBudget.status} onChange={(e) => setNewBudget({ ...newBudget, status: e.target.value as any })}>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="actual">Actual (Committed)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Specification Notes</Text>
                  <Input size="sm" placeholder="Notes for procurement or QS inspection..." value={newBudget.notes} onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })} />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddBudgetModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Add to BOQ</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: EDIT BOQ ITEM */}
      {editingBudget && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit BOQ Line Item</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update quantity, unit price rate, supplier, or approval status.</Text>

            {boqFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {boqFeedback}
              </Box>
            )}

            <form onSubmit={handleSaveEditedBudget}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Item Name *</Text>
                  <Input size="sm" value={budgetEditForm.budgetName || ''} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, budgetName: e.target.value })} required />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={budgetEditForm.category} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, category: e.target.value as any })}>
                        <option value="Materials">Materials</option>
                        <option value="Labour">Labour</option>
                        <option value="Subcontract">Subcontract</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Overhead">Overhead</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit of Measure</Text>
                    <Input size="sm" value={budgetEditForm.unitOfMeasure || ''} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, unitOfMeasure: e.target.value })} required />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Quantity</Text>
                    <Input size="sm" type="number" step="any" value={budgetEditForm.quantity ?? 0} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, quantity: Number(e.target.value) })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Unit Cost ({activeCompany.currency})</Text>
                    <Input size="sm" type="number" step="any" value={budgetEditForm.unitCost ?? 0} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, unitCost: Number(e.target.value) })} required />
                  </Box>
                </SimpleGrid>

                <Box p={3} bg="#eff6ff" borderRadius="10px" border="1px solid #bfdbfe">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" fontWeight="bold" color="#1e40af">Recalculated Line Total:</Text>
                    <Text fontSize="sm" fontWeight="black" color="#1e40af">
                      {activeCompany.currency} {((budgetEditForm.quantity ?? 0) * (budgetEditForm.unitCost ?? 0)).toLocaleString()}
                    </Text>
                  </Flex>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Supplier</Text>
                    <Input size="sm" value={budgetEditForm.supplier || ''} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, supplier: e.target.value })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={budgetEditForm.status} onChange={(e) => setBudgetEditForm({ ...budgetEditForm, status: e.target.value as any })}>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="actual">Actual (Committed)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setEditingBudget(null)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Update Line</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD DAILY SITE LOG */}
      {showAddDailyLogModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="520px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Log Daily Site Progress Report</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Record daily works, workforce deployment, and plant utilization on site.</Text>

            <form onSubmit={handleCreateDailyLog}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Weather Conditions</Text>
                  <Input size="sm" value={newDailyLog.weather} onChange={(e) => setNewDailyLog({ ...newDailyLog, weather: e.target.value })} required />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Completed Work Scope Today *</Text>
                  <Input size="sm" placeholder="e.g. Poured 45m³ deck slab, verified rebar clearances..." value={newDailyLog.completedWork} onChange={(e) => setNewDailyLog({ ...newDailyLog, completedWork: e.target.value })} required />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Manpower Breakdown</Text>
                    <Input size="sm" value={newDailyLog.manpower} onChange={(e) => setNewDailyLog({ ...newDailyLog, manpower: e.target.value })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Total Headcount</Text>
                    <Input size="sm" type="number" value={newDailyLog.workersOnSite} onChange={(e) => setNewDailyLog({ ...newDailyLog, workersOnSite: Number(e.target.value) })} />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Heavy Plant & Equipment on Site</Text>
                  <Input size="sm" value={newDailyLog.equipment} onChange={(e) => setNewDailyLog({ ...newDailyLog, equipment: e.target.value })} />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Safety & Toolbox Meeting Notes</Text>
                  <Input size="sm" value={newDailyLog.safetyNote} onChange={(e) => setNewDailyLog({ ...newDailyLog, safetyNote: e.target.value })} />
                </Box>

                <Flex align="center" gap={2} p={2.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                  <input
                    type="checkbox"
                    id="siteSafetyCheck"
                    checked={newDailyLog.safetyIncident}
                    onChange={(e) => setNewDailyLog({ ...newDailyLog, safetyIncident: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="siteSafetyCheck" style={{ fontSize: '12px', fontWeight: 'bold', color: newDailyLog.safetyIncident ? '#dc2626' : '#334155' }}>
                    Safety incident or injury reported today
                  </label>
                </Flex>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddDailyLogModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Submit Daily Report</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD SCHEDULE TASK */}
      {showAddTaskModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Add Schedule Task / Phase</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Set milestone duration, assigned engineer, and target status.</Text>

            <form onSubmit={handleCreateTask}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Task Name *</Text>
                  <Input size="sm" placeholder="e.g. Substructure Concrete Piling" value={newTask.taskName} onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })} required />
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Start Date</Text>
                    <Input size="sm" type="date" value={newTask.startDate} onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>End Date</Text>
                    <Input size="sm" type="date" value={newTask.endDate} onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })} required />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Initial Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}>
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Progress %</Text>
                    <Input size="sm" type="number" min={0} max={100} value={newTask.progressPercent} onChange={(e) => setNewTask({ ...newTask, progressPercent: Number(e.target.value) })} />
                  </Box>
                </SimpleGrid>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Engineer</Text>
                  <Input size="sm" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes / Specifications</Text>
                  <Input size="sm" placeholder="Milestone details..." value={newTask.notes} onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })} />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTaskModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Add Task</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: EDIT SCHEDULE TASK */}
      {editingTask && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Edit Schedule Task</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Update progress percentage, status, and milestone dates.</Text>

            <form onSubmit={handleSaveEditedTask}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Task Name *</Text>
                  <Input size="sm" value={taskEditForm.taskName || ''} onChange={(e) => setTaskEditForm({ ...taskEditForm, taskName: e.target.value })} required />
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Start Date</Text>
                    <Input size="sm" type="date" value={taskEditForm.startDate || ''} onChange={(e) => setTaskEditForm({ ...taskEditForm, startDate: e.target.value })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>End Date</Text>
                    <Input size="sm" type="date" value={taskEditForm.endDate || ''} onChange={(e) => setTaskEditForm({ ...taskEditForm, endDate: e.target.value })} />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={taskEditForm.status} onChange={(e) => setTaskEditForm({ ...taskEditForm, status: e.target.value as any })}>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="planned">Planned</option>
                        <option value="on_hold">On Hold</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Progress %</Text>
                    <Input size="sm" type="number" min={0} max={100} value={taskEditForm.progressPercent ?? 0} onChange={(e) => setTaskEditForm({ ...taskEditForm, progressPercent: Number(e.target.value) })} />
                  </Box>
                </SimpleGrid>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Engineer</Text>
                  <Input size="sm" value={taskEditForm.assignedTo || ''} onChange={(e) => setTaskEditForm({ ...taskEditForm, assignedTo: e.target.value })} />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Notes</Text>
                  <Input size="sm" value={taskEditForm.notes || ''} onChange={(e) => setTaskEditForm({ ...taskEditForm, notes: e.target.value })} />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Update Task</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD DELAY LOG */}
      {showAddDelayModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Record Site Delay / EOT</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Document schedule delays with impact days and root cause.</Text>

            <form onSubmit={handleCreateDelay}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Delay Date</Text>
                    <Input size="sm" type="date" value={newDelay.delayDate} onChange={(e) => setNewDelay({ ...newDelay, delayDate: e.target.value })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Days Lost</Text>
                    <Input size="sm" type="number" min={1} value={newDelay.delayDays} onChange={(e) => setNewDelay({ ...newDelay, delayDays: Number(e.target.value) })} required />
                  </Box>
                </SimpleGrid>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Root Cause / Reason *</Text>
                  <Input size="sm" placeholder="e.g. Unseasonable flash flooding, client revision" value={newDelay.reason} onChange={(e) => setNewDelay({ ...newDelay, reason: e.target.value })} required />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Detailed Impact & Mitigation</Text>
                  <Input size="sm" placeholder="Mitigation plan..." value={newDelay.details} onChange={(e) => setNewDelay({ ...newDelay, details: e.target.value })} />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddDelayModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Log Delay</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD SAFETY INCIDENT */}
      {showAddSafetyModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Report Health & Safety Incident</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Record incident details, severity, and mandatory corrective actions.</Text>

            <form onSubmit={handleCreateSafety}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Incident Date</Text>
                    <Input size="sm" type="date" value={newSafety.incidentDate} onChange={(e) => setNewSafety({ ...newSafety, incidentDate: e.target.value })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Severity</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={newSafety.severity} onChange={(e) => setNewSafety({ ...newSafety, severity: e.target.value as any })}>
                        <option value="Low">Low (First Aid)</option>
                        <option value="Medium">Medium (Medical Aid)</option>
                        <option value="High">High (Lost Time)</option>
                        <option value="Critical">Critical (Dangerous Occurrence)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Incident Description *</Text>
                  <Input size="sm" placeholder="Describe circumstances..." value={newSafety.description} onChange={(e) => setNewSafety({ ...newSafety, description: e.target.value })} required />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Corrective / Preventive Action</Text>
                  <Input size="sm" placeholder="Action taken on site..." value={newSafety.actionTaken} onChange={(e) => setNewSafety({ ...newSafety, actionTaken: e.target.value })} />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddSafetyModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Submit Incident Report</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD RFI */}
      {showAddRFIModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Submit Engineering RFI</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Request clarification or approval for structural/architectural detail.</Text>

            <form onSubmit={handleCreateRFI}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>RFI Subject *</Text>
                  <Input size="sm" placeholder="e.g. Beam B-12 reinforcement rebar spacing clash" value={newRFI.subject} onChange={(e) => setNewRFI({ ...newRFI, subject: e.target.value })} required />
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Consultant / Engineer</Text>
                  <Input size="sm" value={newRFI.assignedTo} onChange={(e) => setNewRFI({ ...newRFI, assignedTo: e.target.value })} required />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddRFIModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">Submit RFI</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: RESOLVE RFI */}
      {resolvingRFI && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Resolve Technical RFI</Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>Subject: {resolvingRFI.subject}</Text>

            <form onSubmit={handleResolveRFI}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Consultant Resolution / Instructions *</Text>
                  <Input size="sm" placeholder="e.g. Stamped revised drawing Rev-3 approving 150mm spacing..." value={rfiResolutionText} onChange={(e) => setRfiResolutionText(e.target.value)} required />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setResolvingRFI(null)}>Cancel</Button>
                  <Button size="sm" colorPalette="green" type="submit">Mark Resolved</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: ADD DOCUMENT */}
      {showAddDocumentModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="520px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Upload Project Technical Document</Heading>
              <Box as="button" onClick={() => setShowAddDocumentModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Add drawings, structural calculations, permits, or progress photos to {project.name}.
            </Text>

            <form onSubmit={handleCreateDocument}>
              <Stack gap={3.5}>
                {/* File Drop / Select Area */}
                <Box
                  p={3.5}
                  border="2px dashed #cbd5e1"
                  borderRadius="10px"
                  bg="#f8fafc"
                  textAlign="center"
                  position="relative"
                  _hover={{ borderColor: '#2563eb' }}
                >
                  <Upload size={24} color="#2563eb" style={{ margin: '0 auto 4px auto' }} />
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                    {newDoc.fileName || 'Click or drag file to select'}
                  </Text>
                  <Text fontSize="10px" color="#94a3b8">
                    Supports DWG, DXF, PDF, JPG, PNG (Simulated size: {newDoc.size})
                  </Text>
                  <Input
                    type="file"
                    position="absolute"
                    inset="0"
                    opacity="0"
                    cursor="pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const sizeStr = file.size > 1024 * 1024
                          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(file.size / 1024).toFixed(0)} KB`;
                        const reader = new FileReader();
                        reader.onload = () => {
                          setNewDoc({
                            ...newDoc,
                            fileName: file.name,
                            size: sizeStr,
                            fileType: file.type || 'application/octet-stream',
                            fileData: reader.result as string,
                            title: newDoc.title || file.name.replace(/\.[^/.]+$/, '')
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Document Title *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Pier 1 to 4 Structural Reinforcement Detail"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newDoc.category}
                        onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                      >
                        <option value="Architectural">Architectural</option>
                        <option value="Structural">Structural</option>
                        <option value="Technical Drawing">Technical Drawing</option>
                        <option value="Contract">Contract</option>
                        <option value="Permit">Permit</option>
                        <option value="Site Photo">Site Photo</option>
                        <option value="Quality & Testing">Quality & Testing</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>File Name</Text>
                    <Input
                      size="sm"
                      placeholder="structural_pier_c4.dwg"
                      value={newDoc.fileName}
                      onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Drawing Notes / Description</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Approved with stamp from Ministry Consultant"
                    value={newDoc.description}
                    onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2} pt={2} borderTop="1px solid #f1f5f9">
                  <Button size="sm" variant="outline" onClick={() => setShowAddDocumentModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    <Upload size={14} /> Upload File
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL: PREVIEW PROJECT DOCUMENT */}
      {previewProjectDoc && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.7)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="640px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="flex-start" mb={3} borderBottom="1px solid #e2e8f0" pb={3}>
              <Box>
                <Flex align="center" gap={2}>
                  <Badge size="xs" colorPalette="blue">{previewProjectDoc.category}</Badge>
                  <Badge size="xs" colorPalette="cyan">{previewProjectDoc.version || 'v1.0'}</Badge>
                </Flex>
                <Heading size="md" color="#0f172a" mt={1}>
                  {previewProjectDoc.title}
                </Heading>
                <Text fontSize="xs" fontFamily="mono" color="#64748b">
                  {previewProjectDoc.fileName} • {previewProjectDoc.size}
                </Text>
              </Box>
              <Box as="button" onClick={() => setPreviewProjectDoc(null)} color="#94a3b8" cursor="pointer">
                <X size={20} />
              </Box>
            </Flex>

            {/* Simulated Technical Drawing Canvas */}
            <Box
              bg="#0f172a"
              color="#38bdf8"
              p={6}
              borderRadius="12px"
              mb={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minH="220px"
              border="1px solid #1e293b"
            >
              <Box p={3} bg="rgba(56, 189, 248, 0.1)" borderRadius="full" mb={2}>
                <FileCode size={36} color="#38bdf8" />
              </Box>
              <Text fontSize="sm" fontWeight="bold" color="white">
                Technical Drawing / Specification View
              </Text>
              <Text fontSize="xs" color="#94a3b8" mt={0.5} fontFamily="mono">
                Project: {project.name}
              </Text>
              <Text fontSize="11px" color="#cbd5e1" mt={1}>
                Uploaded by {previewProjectDoc.uploadedBy || 'Engineering Office'} on {previewProjectDoc.uploadDate}
              </Text>
            </Box>

            <Flex justify="space-between" align="center">
              <Button size="sm" variant="outline" onClick={() => setPreviewProjectDoc(null)}>
                Close
              </Button>
              <Button size="sm" bg="#2563eb" color="white" onClick={() => handleDownloadProjectDoc(previewProjectDoc)}>
                <Download size={14} /> Download File ({previewProjectDoc.size})
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* MODAL: DELETE PROJECT DOCUMENT CONFIRMATION */}
      {deleteProjectDocConfirm && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="450px" w="100%" p={6} boxShadow="2xl">
            <Flex align="center" gap={3} mb={3}>
              <Box p={2.5} bg="#fee2e2" color="#dc2626" borderRadius="10px">
                <AlertCircle size={22} />
              </Box>
              <Box>
                <Heading size="sm" color="#0f172a">Delete Technical Document</Heading>
                <Text fontSize="xs" color="#64748b">Are you sure you want to remove this file from the project?</Text>
              </Box>
            </Flex>

            <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" mb={4}>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">{deleteProjectDocConfirm.title}</Text>
              <Text fontSize="11px" fontFamily="mono" color="#64748b">{deleteProjectDocConfirm.fileName} ({deleteProjectDocConfirm.size})</Text>
            </Box>

            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setDeleteProjectDocConfirm(null)}>Cancel</Button>
              <Button
                size="sm"
                bg="#dc2626"
                color="white"
                onClick={() => {
                  deleteDocument(deleteProjectDocConfirm.id);
                  setDeleteProjectDocConfirm(null);
                }}
              >
                Delete File
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
