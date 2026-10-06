import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Text, 
  Heading, 
  Button, 
  Badge, 
  SimpleGrid, 
  Card, 
  Input, 
  Table, 
  Progress,
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { Project, ProjectDailyLog } from '../../types';
import { 
  HardHat, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Sun, 
  ShieldCheck, 
  CheckCircle, 
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Edit,
  LayoutGrid,
  List,
  Filter,
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    addProject, 
    updateProject,
    dailyLogs, 
    addDailyLog, 
    activeCompany, 
    currentUserName,
    employees
  } = useERP();

  const [activeTab, setActiveTab] = useState<'projects' | 'dailyLogs'>('projects');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'value' | 'date'>('date');

  // Modal States
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // Form Validation & Feedback
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Project Form State
  const [projectForm, setProjectForm] = useState({
    projectNumber: `PRJ-2026-0${projects.length + 4}`,
    name: '',
    clientId: 1,
    clientName: '',
    consultant: '',
    projectType: 'Infrastructure',
    description: '',
    contractValue: 1500000,
    budget: 1500000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2027-12-31',
    siteLocation: '',
    status: 'in_progress' as Project['status'],
    manager: currentUserName,
    assignedEngineers: [currentUserName]
  });

  // Edit Project Form State
  const [editForm, setEditForm] = useState<Partial<Project>>({});

  // New Daily Log State
  const [newLog, setNewLog] = useState({
    projectId: projects[0]?.id || 1,
    weather: 'Clear, 28°C',
    completedWork: '',
    manpower: '18 Workers, 2 Foremen, 4 Operators',
    equipment: '1x Hydraulic Excavator, 2x Transit Concrete Mixers',
    workersOnSite: 24,
    safetyIncident: false,
    loggedBy: currentUserName
  });

  // Client and Manager Options
  const uniqueClients = Array.from(new Set(projects.map(p => p.clientName).filter(Boolean)));
  const uniqueManagers = Array.from(new Set(projects.map(p => p.manager).filter(Boolean)));

  // Filtering & Sorting
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.siteLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.consultant && p.consultant.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesClient = clientFilter === 'all' || p.clientName === clientFilter;
    const matchesManager = managerFilter === 'all' || p.manager === managerFilter;
    return matchesSearch && matchesStatus && matchesClient && matchesManager;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'progress') return b.progressPercent - a.progressPercent;
    if (sortBy === 'value') return b.contractValue - a.contractValue;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // KPI Calculations
  const totalContractValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progressPercent, 0) / projects.length)
    : 0;

  const handleOpenAddModal = () => {
    setProjectForm({
      projectNumber: `PRJ-2026-0${projects.length + 4}`,
      name: '',
      clientId: 1,
      clientName: '',
      consultant: '',
      projectType: 'Infrastructure',
      description: '',
      contractValue: 1500000,
      budget: 1500000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      siteLocation: '',
      status: 'in_progress',
      manager: currentUserName,
      assignedEngineers: [currentUserName]
    });
    setFormFeedback(null);
    setShowAddProjectModal(true);
  };

  const handleOpenEditModal = (p: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProject(p);
    setEditForm({
      projectNumber: p.projectNumber,
      name: p.name,
      clientName: p.clientName,
      consultant: p.consultant || '',
      projectType: p.projectType || 'Infrastructure',
      description: p.description || '',
      contractValue: p.contractValue,
      budget: p.budget,
      startDate: p.startDate,
      endDate: p.endDate,
      siteLocation: p.siteLocation,
      status: p.status,
      manager: p.manager,
      progressPercent: p.progressPercent,
      assignedEngineers: [...p.assignedEngineers]
    });
    setFormFeedback(null);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.clientName.trim() || !projectForm.siteLocation.trim()) {
      setFormFeedback({ type: 'error', message: 'Please complete all required fields (Name, Client, and Site Location).' });
      return;
    }

    addProject({
      projectNumber: projectForm.projectNumber.trim(),
      name: projectForm.name.trim(),
      clientId: projectForm.clientId,
      clientName: projectForm.clientName.trim(),
      consultant: projectForm.consultant.trim(),
      projectType: projectForm.projectType,
      description: projectForm.description,
      contractValue: Number(projectForm.contractValue),
      budget: Number(projectForm.budget),
      startDate: projectForm.startDate,
      endDate: projectForm.endDate,
      siteLocation: projectForm.siteLocation.trim(),
      status: projectForm.status,
      manager: projectForm.manager,
      assignedEngineers: projectForm.assignedEngineers
    });

    setFormFeedback({ type: 'success', message: 'Project successfully registered!' });
    setTimeout(() => {
      setShowAddProjectModal(false);
      setFormFeedback(null);
    }, 600);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (!editForm.name?.trim() || !editForm.clientName?.trim()) {
      setFormFeedback({ type: 'error', message: 'Project name and client name cannot be empty.' });
      return;
    }

    updateProject(editingProject.id, {
      ...editForm,
      contractValue: Number(editForm.contractValue),
      budget: Number(editForm.budget),
      progressPercent: Number(editForm.progressPercent)
    });

    setFormFeedback({ type: 'success', message: 'Project successfully updated!' });
    setTimeout(() => {
      setEditingProject(null);
      setFormFeedback(null);
    }, 600);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.completedWork.trim()) return;
    addDailyLog({
      ...newLog,
      projectId: Number(newLog.projectId),
      logDate: new Date().toISOString().split('T')[0]
    });
    setShowAddLogModal(false);
    setNewLog({
      projectId: projects[0]?.id || 1,
      weather: 'Clear, 28°C',
      completedWork: '',
      manpower: '18 Workers, 2 Foremen, 4 Operators',
      equipment: '1x Hydraulic Excavator, 2x Transit Concrete Mixers',
      workersOnSite: 24,
      safetyIncident: false,
      loggedBy: currentUserName
    });
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'in_progress':
        return <Badge colorPalette="blue" variant="solid">In Progress</Badge>;
      case 'completed':
        return <Badge colorPalette="green" variant="solid">Completed</Badge>;
      case 'planned':
        return <Badge colorPalette="purple" variant="subtle">Planned</Badge>;
      case 'on_hold':
        return <Badge colorPalette="orange" variant="subtle">On Hold</Badge>;
      case 'cancelled':
        return <Badge colorPalette="red" variant="subtle">Cancelled</Badge>;
      default:
        return <Badge colorPalette="gray">{status}</Badge>;
    }
  };

  return (
    <Box>
      {/* Top Header */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        gap={4} 
        mb={6}
      >
        <Box>
          <Flex align="center" gap={3}>
            <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px">
              <HardHat size={26} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a">
                Construction Projects & Sites
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Civil contracts portfolio, site daily logs, schedule milestones, and bill of quantities.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex gap={2}>
          <Button 
            size="sm" 
            variant="outline" 
            borderColor="#cbd5e1" 
            color="#334155" 
            onClick={() => setShowAddLogModal(true)}
          >
            <Sun size={16} /> Log Daily Progress
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            borderColor="#2563eb"
            color="#2563eb"
            _hover={{ bg: '#eff6ff' }}
            onClick={() => navigate('/projects/new')}
          >
            <FileText size={16} /> Full Create Form
          </Button>
          <Button 
            size="sm" 
            bg="#2563eb" 
            color="white" 
            _hover={{ bg: '#1d4ed8' }} 
            onClick={handleOpenAddModal}
          >
            <Plus size={16} /> Quick Add
          </Button>
        </Flex>
      </Flex>

      {/* KPI Overview Metrics */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} mb={6}>
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4} boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Portfolio Value
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {activeCompany.currency} {(totalContractValue / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <DollarSign size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            {projects.length} Total Projects Registered
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4} boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Active Construction Sites
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {activeProjectsCount} Active
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <HardHat size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Sites under physical execution
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4} boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Budget vs Actual Spend
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {activeCompany.currency} {(totalSpent / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <TrendingUp size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Allocated: {activeCompany.currency} {(totalBudget / 1000000).toFixed(2)}M
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4} boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Avg. Physical Completion
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {avgProgress}%
              </Text>
            </Box>
            <Box p={2.5} bg="#faf5ff" color="#7c3aed" borderRadius="10px">
              <CheckCircle size={20} />
            </Box>
          </Flex>
          <Progress.Root value={avgProgress} size="sm" colorPalette="blue" mt={2}>
            <Progress.Track bg="#e2e8f0">
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </Card.Root>
      </SimpleGrid>

      {/* Tabs */}
      <Flex borderBottom="1px solid #e2e8f0" gap={4} mb={6}>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'projects' ? '#2563eb' : 'transparent'}
          color={activeTab === 'projects' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'projects' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('projects')}
        >
          Projects Catalog ({projects.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'dailyLogs' ? '#2563eb' : 'transparent'}
          color={activeTab === 'dailyLogs' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'dailyLogs' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('dailyLogs')}
        >
          Daily Site Progress Reports ({dailyLogs.length})
        </Button>
      </Flex>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <Box>
          {/* Search, Filter & Layout Controls */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={3} justify="space-between" align={{ md: 'center' }} mb={5}>
            <Flex gap={2} flex="1" maxW={{ md: '450px' }}>
              <Box position="relative" flex="1">
                <Input
                  size="sm"
                  placeholder="Search by project name, number, client, consultant, or site..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  borderColor="#cbd5e1"
                  borderRadius="8px"
                  pl={9}
                />
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="#94a3b8">
                  <Search size={16} />
                </Box>
              </Box>
            </Flex>

            <Flex gap={2} align="center" wrap="wrap">
              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b" fontWeight="medium">Status:</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    bg="white"
                    borderColor="#cbd5e1"
                    borderRadius="8px"
                    fontSize="xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="in_progress">In Progress</option>
                    <option value="planned">Planned</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b" fontWeight="medium">Client:</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    bg="white"
                    borderColor="#cbd5e1"
                    borderRadius="8px"
                    fontSize="xs"
                  >
                    <option value="all">All Clients</option>
                    {uniqueClients.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b" fontWeight="medium">Manager:</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={managerFilter}
                    onChange={(e) => setManagerFilter(e.target.value)}
                    bg="white"
                    borderColor="#cbd5e1"
                    borderRadius="8px"
                    fontSize="xs"
                  >
                    <option value="all">All Managers</option>
                    {uniqueManagers.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b" fontWeight="medium">Sort:</Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    bg="white"
                    borderColor="#cbd5e1"
                    borderRadius="8px"
                    fontSize="xs"
                  >
                    <option value="date">Start Date</option>
                    <option value="progress">Progress %</option>
                    <option value="value">Contract Value</option>
                    <option value="name">Project Name</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>

              <Flex bg="#f1f5f9" p={0.5} borderRadius="8px" border="1px solid #cbd5e1">
                <Box
                  as="button"
                  p={1.5}
                  borderRadius="6px"
                  bg={viewMode === 'cards' ? 'white' : 'transparent'}
                  color={viewMode === 'cards' ? '#2563eb' : '#64748b'}
                  boxShadow={viewMode === 'cards' ? 'xs' : 'none'}
                  onClick={() => setViewMode('cards')}
                  title="Grid Cards View"
                  cursor="pointer"
                >
                  <LayoutGrid size={16} />
                </Box>
                <Box
                  as="button"
                  p={1.5}
                  borderRadius="6px"
                  bg={viewMode === 'table' ? 'white' : 'transparent'}
                  color={viewMode === 'table' ? '#2563eb' : '#64748b'}
                  boxShadow={viewMode === 'table' ? 'xs' : 'none'}
                  onClick={() => setViewMode('table')}
                  title="Table List View"
                  cursor="pointer"
                >
                  <List size={16} />
                </Box>
              </Flex>
            </Flex>
          </Flex>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={8} textAlign="center">
              <Box maxW="400px" mx="auto">
                <Box w="50px" h="50px" bg="#f1f5f9" color="#64748b" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={3}>
                  <HardHat size={26} />
                </Box>
                <Heading size="sm" color="#0f172a" mb={1}>
                  No Projects Found
                </Heading>
                <Text fontSize="xs" color="#64748b" mb={4}>
                  No civil projects match your search query "{searchTerm}" or selected status filter.
                </Text>
                <Button size="xs" variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                  Clear Filters
                </Button>
              </Box>
            </Card.Root>
          )}

          {/* Grid View */}
          {viewMode === 'cards' && filteredProjects.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
              {filteredProjects.map((project) => (
                <Card.Root 
                  key={project.id} 
                  bg="white" 
                  border="1px solid #e2e8f0" 
                  borderRadius="16px" 
                  p={5}
                  boxShadow="xs"
                  _hover={{ borderColor: '#93c5fd', transform: 'translateY(-2px)' }}
                  transition="all 0.15s ease"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <Box>
                    <Flex justify="space-between" align="flex-start" mb={2}>
                      <Badge variant="subtle" colorPalette="blue" fontSize="10px">
                        {project.projectNumber}
                      </Badge>
                      {getStatusBadge(project.status)}
                    </Flex>

                    <Heading size="md" color="#0f172a" mb={1}>
                      {project.name}
                    </Heading>

                    <Text fontSize="xs" color="#64748b" mb={3} display="flex" alignItems="center" gap={1.5}>
                      <Briefcase size={14} color="#64748b" /> Client: <Text as="span" fontWeight="semibold" color="#334155">{project.clientName}</Text>
                    </Text>

                    {project.consultant && (
                      <Text fontSize="xs" color="#64748b" mb={3}>
                        Consultant: <Text as="span" color="#334155">{project.consultant}</Text>
                      </Text>
                    )}

                    <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" mb={4} fontSize="xs">
                      <Flex justify="space-between" mb={1.5}>
                        <Text color="#64748b">Contract Value:</Text>
                        <Text fontWeight="bold" color="#2563eb">
                          {activeCompany.currency} {project.contractValue.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" mb={1.5}>
                        <Text color="#64748b">Target Budget:</Text>
                        <Text fontWeight="semibold" color="#0f172a">
                          {activeCompany.currency} {project.budget.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color="#64748b">Actual Spent:</Text>
                        <Text fontWeight="semibold" color="#16a34a">
                          {activeCompany.currency} {project.spent.toLocaleString()}
                        </Text>
                      </Flex>
                    </Box>

                    {/* Progress Bar */}
                    <Box mb={4}>
                      <Flex justify="space-between" fontSize="11px" mb={1.5}>
                        <Text color="#64748b" fontWeight="medium">Physical Execution</Text>
                        <Text fontWeight="bold" color="#0f172a">{project.progressPercent}%</Text>
                      </Flex>
                      <Progress.Root value={project.progressPercent} size="sm" colorPalette="blue">
                        <Progress.Track bg="#e2e8f0" borderRadius="full">
                          <Progress.Range borderRadius="full" />
                        </Progress.Track>
                      </Progress.Root>
                    </Box>

                    <Stack gap={1.5} fontSize="xs" color="#64748b" mb={3}>
                      <Flex align="center" gap={2}>
                        <MapPin size={14} color="#94a3b8" />
                        <Text truncate>{project.siteLocation}</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Calendar size={14} color="#94a3b8" />
                        <Text>{project.startDate} → {project.endDate}</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Users size={14} color="#94a3b8" />
                        <Text>Lead: {project.manager}</Text>
                      </Flex>
                    </Stack>
                  </Box>

                  {/* Actions Bar */}
                  <Flex justify="space-between" align="center" pt={3} borderTop="1px solid #f1f5f9">
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor="#cbd5e1"
                      color="#334155"
                      onClick={(e) => handleOpenEditModal(project, e)}
                    >
                      <Edit size={13} /> Edit
                    </Button>
                    <Button 
                      size="xs" 
                      colorPalette="blue"
                      onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                    >
                      Manage Project <ArrowUpRight size={13} />
                    </Button>
                  </Flex>
                </Card.Root>
              ))}
            </SimpleGrid>
          )}

          {/* Table View */}
          {viewMode === 'table' && filteredProjects.length > 0 && (
            <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4} overflowX="auto">
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">Project Code</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Project Name & Site</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Client & Consultant</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Contract Value</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Budget</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Progress</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredProjects.map((project) => (
                    <Table.Row key={project.id} _hover={{ bg: '#f8fafc' }} cursor="pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#2563eb">
                        {project.projectNumber}
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{project.name}</Text>
                        <Text fontSize="10px" color="#64748b" display="flex" alignItems="center" gap={1}>
                          <MapPin size={11} /> {project.siteLocation}
                        </Text>
                      </Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Text fontWeight="medium" color="#334155">{project.clientName}</Text>
                        {project.consultant && <Text fontSize="10px" color="#94a3b8">{project.consultant}</Text>}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold" color="#2563eb">
                        {activeCompany.currency} {project.contractValue.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="medium" color="#0f172a">
                        {activeCompany.currency} {project.budget.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell minW="110px">
                        <Flex justify="space-between" fontSize="10px" mb={1}>
                          <Text color="#64748b">{project.progressPercent}%</Text>
                        </Flex>
                        <Progress.Root value={project.progressPercent} size="xs" colorPalette="blue">
                          <Progress.Track bg="#e2e8f0" borderRadius="full">
                            <Progress.Range borderRadius="full" />
                          </Progress.Track>
                        </Progress.Root>
                      </Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(project.status)}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={2}>
                          <Button 
                            size="xs" 
                            variant="subtle" 
                            onClick={(e) => handleOpenEditModal(project, e)}
                          >
                            <Edit size={12} />
                          </Button>
                          <Button 
                            size="xs" 
                            colorPalette="blue"
                            onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                          >
                            Open
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card.Root>
          )}
        </Box>
      )}

      {/* Daily Logs Tab */}
      {activeTab === 'dailyLogs' && (
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="sm" color="#0f172a">
                Site Progress & Daily Weather Logs
              </Heading>
              <Text fontSize="xs" color="#64748b">
                Field engineer daily reports, workforce headcounts, equipment deployment, and work milestones.
              </Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={() => setShowAddLogModal(true)}>
              <Plus size={16} /> New Daily Entry
            </Button>
          </Flex>

          <Stack gap={4}>
            {dailyLogs.map((log) => {
              const p = projects.find(proj => proj.id === log.projectId);
              return (
                <Card.Root key={log.id} bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Box>
                      <Flex align="center" gap={2}>
                        <Badge colorPalette="blue" variant="subtle" fontSize="10px">
                          {p ? p.projectNumber : `Project #${log.projectId}`}
                        </Badge>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                          {p?.name}
                        </Text>
                      </Flex>
                      <Text fontSize="11px" color="#64748b" mt={0.5}>
                        Date: <Text as="span" fontWeight="semibold" color="#334155">{log.logDate}</Text> • Weather: <Text as="span" color="#d97706" fontWeight="medium">{log.weather}</Text>
                      </Text>
                    </Box>

                    {log.safetyIncident ? (
                      <Badge colorPalette="red" variant="solid">Safety Incident Reported</Badge>
                    ) : (
                      <Badge colorPalette="green" variant="subtle">Zero Incidents</Badge>
                    )}
                  </Flex>

                  <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" my={3} fontSize="xs">
                    <Text fontWeight="bold" color="#0f172a" mb={1}>Work Execution Summary:</Text>
                    <Text color="#334155">{log.completedWork}</Text>
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} fontSize="xs" color="#64748b">
                    <Box>
                      <Text fontWeight="bold" color="#475569" fontSize="10px" textTransform="uppercase">Manpower Deployed:</Text>
                      <Text color="#0f172a" mt={0.5}>{log.manpower} ({log.workersOnSite} on site)</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#475569" fontSize="10px" textTransform="uppercase">Heavy Equipment:</Text>
                      <Text color="#0f172a" mt={0.5}>{log.equipment}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color="#475569" fontSize="10px" textTransform="uppercase">Submitted By:</Text>
                      <Text color="#0f172a" mt={0.5}>{log.loggedBy}</Text>
                    </Box>
                  </SimpleGrid>
                </Card.Root>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <Box 
          position="fixed" 
          inset="0" 
          bg="rgba(15, 23, 42, 0.6)" 
          zIndex="1000" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Box>
                <Heading size="md" color="#0f172a" mb={1}>
                  Register New Construction Project
                </Heading>
                <Text fontSize="xs" color="#64748b">
                  Define contract parameters, client organization, target budget, and lead site engineers.
                </Text>
              </Box>
              <Button
                size="xs"
                variant="outline"
                borderColor="#2563eb"
                color="#2563eb"
                onClick={() => {
                  setShowAddProjectModal(false);
                  navigate('/projects/new');
                }}
              >
                Open Full Form →
              </Button>
            </Flex>

            {formFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg={formFeedback.type === 'error' ? '#fef2f2' : '#f0fdf4'} border="1px solid" borderColor={formFeedback.type === 'error' ? '#fecaca' : '#bbf7d0'} fontSize="xs" color={formFeedback.type === 'error' ? '#b91c1c' : '#166534'}>
                {formFeedback.message}
              </Box>
            )}

            <form onSubmit={handleCreateProject}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Code *</Text>
                    <Input
                      size="sm"
                      value={projectForm.projectNumber}
                      onChange={(e) => setProjectForm({ ...projectForm, projectNumber: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Initial Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={projectForm.status}
                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                      >
                        <option value="in_progress">In Progress</option>
                        <option value="planned">Planned</option>
                        <option value="on_hold">On Hold</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Title / Contract Name *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Marina Wharf Expansion & Jetty Reconstruction"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Type</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={projectForm.projectType}
                        onChange={(e) => setProjectForm({ ...projectForm, projectType: e.target.value })}
                      >
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Description / Scope of Work</Text>
                  <Input
                    size="sm"
                    placeholder="Brief architectural and structural scope summary..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Client Organization *</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Federal Ministry of Transport"
                      value={projectForm.clientName}
                      onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Consulting Engineer</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Mott MacDonald Consult"
                      value={projectForm.consultant}
                      onChange={(e) => setProjectForm({ ...projectForm, consultant: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Physical Location / Address *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Sector 4, Port Expressway, Lagos"
                    value={projectForm.siteLocation}
                    onChange={(e) => setProjectForm({ ...projectForm, siteLocation: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contract Value ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={projectForm.contractValue}
                      onChange={(e) => setProjectForm({ ...projectForm, contractValue: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Total Budget ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Commencement Date</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={projectForm.startDate}
                      onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Completion Target</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={projectForm.endDate}
                      onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Lead Project Manager</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={projectForm.manager}
                      onChange={(e) => setProjectForm({ ...projectForm, manager: e.target.value })}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} ({emp.position})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddProjectModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Register Project
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <Box 
          position="fixed" 
          inset="0" 
          bg="rgba(15, 23, 42, 0.6)" 
          zIndex="1000" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">
                Edit Project: {editingProject.projectNumber}
              </Heading>
              <Badge colorPalette="blue">{editForm.status}</Badge>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Update project parameters, contract financials, schedule dates and physical status.
            </Text>

            {formFeedback && (
              <Box p={3} mb={3} borderRadius="8px" bg={formFeedback.type === 'error' ? '#fef2f2' : '#f0fdf4'} border="1px solid" borderColor={formFeedback.type === 'error' ? '#fecaca' : '#bbf7d0'} fontSize="xs" color={formFeedback.type === 'error' ? '#b91c1c' : '#166534'}>
                {formFeedback.message}
              </Box>
            )}

            <form onSubmit={handleUpdateProject}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Name *</Text>
                    <Input
                      size="sm"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Type</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={editForm.projectType || 'Infrastructure'}
                        onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                      >
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Project Description / Scope of Work</Text>
                  <Input
                    size="sm"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Client Name *</Text>
                    <Input
                      size="sm"
                      value={editForm.clientName || ''}
                      onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Consultant</Text>
                    <Input
                      size="sm"
                      value={editForm.consultant || ''}
                      onChange={(e) => setEditForm({ ...editForm, consultant: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Location</Text>
                  <Input
                    size="sm"
                    value={editForm.siteLocation || ''}
                    onChange={(e) => setEditForm({ ...editForm, siteLocation: e.target.value })}
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contract Value ({activeCompany.currency})</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={editForm.contractValue ?? 0}
                      onChange={(e) => setEditForm({ ...editForm, contractValue: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Target Budget ({activeCompany.currency})</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={editForm.budget ?? 0}
                      onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                      >
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
                    <Input
                      size="sm"
                      type="number"
                      min={0}
                      max={100}
                      value={editForm.progressPercent ?? 0}
                      onChange={(e) => setEditForm({ ...editForm, progressPercent: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Start Date</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={editForm.startDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>End Date</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={editForm.endDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setEditingProject(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Changes
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Add Daily Log Modal */}
      {showAddLogModal && (
        <Box 
          position="fixed" 
          inset="0" 
          bg="rgba(15, 23, 42, 0.6)" 
          zIndex="1000" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="520px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Log Daily Site Progress
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Submit daily field report for engineering supervision and client tracking.
            </Text>

            <form onSubmit={handleCreateLog}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Site Project</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={newLog.projectId}
                      onChange={(e) => setNewLog({ ...newLog, projectId: Number(e.target.value) })}
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.projectNumber} — {p.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Weather Conditions</Text>
                  <Input
                    size="sm"
                    value={newLog.weather}
                    onChange={(e) => setNewLog({ ...newLog, weather: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Completed Work Scope Today *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Cast 40m³ foundation footing on Grid B; installed column shuttering"
                    value={newLog.completedWork}
                    onChange={(e) => setNewLog({ ...newLog, completedWork: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Manpower Breakdown</Text>
                    <Input
                      size="sm"
                      value={newLog.manpower}
                      onChange={(e) => setNewLog({ ...newLog, manpower: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Headcount on Site</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={newLog.workersOnSite}
                      onChange={(e) => setNewLog({ ...newLog, workersOnSite: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Heavy Plant & Equipment Deployed</Text>
                  <Input
                    size="sm"
                    value={newLog.equipment}
                    onChange={(e) => setNewLog({ ...newLog, equipment: e.target.value })}
                  />
                </Box>

                <Flex align="center" gap={2} p={2.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                  <input
                    type="checkbox"
                    id="safetyCheck"
                    checked={newLog.safetyIncident}
                    onChange={(e) => setNewLog({ ...newLog, safetyIncident: e.target.checked })}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="safetyCheck" style={{ fontSize: '12px', fontWeight: 'bold', color: newLog.safetyIncident ? '#dc2626' : '#334155' }}>
                    Safety incident or near-miss occurred on site today
                  </label>
                </Flex>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddLogModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Site Report
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};
