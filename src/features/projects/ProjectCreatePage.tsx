import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  SimpleGrid,
  Card,
  Stack,
  NativeSelect,
  Badge
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  HardHat,
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    addProject,
    employees,
    customers,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const isAuthorized = ['Managing Director', 'Project Manager', 'Super Admin'].includes(activeRole);

  const [form, setForm] = useState({
    projectNumber: `PRJ-2026-0${projects.length + 5}`,
    name: '',
    clientId: customers[0]?.id || 1,
    clientName: customers[0]?.companyName || 'IHVN / Federal Highway Agency',
    clientContactPerson: customers[0]?.contactPerson || '',
    clientEmail: customers[0]?.email || '',
    clientPhone: customers[0]?.phone || '',
    clientAddress: customers[0]?.address || '',
    consultant: '',
    projectType: 'Civil Infrastructure',
    description: '',
    siteLocation: '',
    contractValue: 1500000,
    budget: 1350000,
    contractDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    expectedCompletionDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'in_progress' as const,
    manager: currentUserName,
    assignedEngineers: [currentUserName]
  });

  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handleCustomerChange = (customerId: number) => {
    const cust = customers.find(c => c.id === customerId);
    if (cust) {
      setForm(prev => ({
        ...prev,
        clientId: cust.id,
        clientName: cust.companyName,
        clientContactPerson: cust.contactPerson,
        clientEmail: cust.email,
        clientPhone: cust.phone,
        clientAddress: cust.address || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFeedback({ type: 'error', message: 'Project title is required.' });
      return;
    }
    if (!form.siteLocation.trim()) {
      setFeedback({ type: 'error', message: 'Site physical location is required.' });
      return;
    }
    if (form.contractValue <= 0) {
      setFeedback({ type: 'error', message: 'Contract value must be greater than zero.' });
      return;
    }
    if (form.budget <= 0) {
      setFeedback({ type: 'error', message: 'Project budget must be greater than zero.' });
      return;
    }

    addProject({
      projectNumber: form.projectNumber.trim(),
      name: form.name.trim(),
      clientId: form.clientId,
      clientName: form.clientName.trim(),
      clientContactPerson: form.clientContactPerson.trim() || undefined,
      clientEmail: form.clientEmail.trim() || undefined,
      clientPhone: form.clientPhone.trim() || undefined,
      clientAddress: form.clientAddress.trim() || undefined,
      consultant: form.consultant.trim() || undefined,
      projectType: form.projectType,
      description: form.description.trim() || undefined,
      contractValue: Number(form.contractValue),
      budget: Number(form.budget),
      contractDate: form.contractDate,
      startDate: form.startDate,
      endDate: form.endDate,
      expectedCompletionDate: form.expectedCompletionDate,
      siteLocation: form.siteLocation.trim(),
      status: form.status,
      manager: form.manager,
      assignedEngineers: form.assignedEngineers,
      companyId: activeCompany.id
    });

    setFeedback({ type: 'success', message: 'Project successfully created! Redirecting to projects catalog...' });
    setTimeout(() => {
      navigate('/projects');
    }, 800);
  };

  return (
    <Box maxW="1100px" mx="auto">
      {/* Header & Breadcrumb */}
      <Flex align="center" justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Button
            size="sm"
            variant="outline"
            borderColor="#cbd5e1"
            color="#334155"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft size={16} /> Back to Projects
          </Button>
          <Box>
            <Heading size="lg" color="#0f172a" fontWeight="bold">
              Register New Construction Project
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Full project onboarding form with client specifications, contractual financials, and schedule timeline.
            </Text>
          </Box>
        </Flex>

        <Badge size="md" colorPalette={isAuthorized ? 'green' : 'orange'} variant="subtle">
          Role: {activeRole}
        </Badge>
      </Flex>

      {/* Permission Warning */}
      {!isAuthorized && (
        <Card.Root bg="#fffbeb" border="1px solid #fde68a" p={4} mb={6} borderRadius="12px">
          <Flex gap={3} align="center">
            <AlertCircle size={20} color="#d97706" />
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#92400e">
                Limited Permission Notice
              </Text>
              <Text fontSize="11px" color="#b45309">
                Creating new projects usually requires Project Manager or Managing Director privileges. Changes made will update local session state.
              </Text>
            </Box>
          </Flex>
        </Card.Root>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <Card.Root
          bg={feedback.type === 'error' ? '#fef2f2' : '#f0fdf4'}
          border="1px solid"
          borderColor={feedback.type === 'error' ? '#fecaca' : '#bbf7d0'}
          p={4}
          mb={6}
          borderRadius="12px"
        >
          <Flex gap={2} align="center">
            {feedback.type === 'error' ? (
              <AlertCircle size={18} color="#dc2626" />
            ) : (
              <CheckCircle2 size={18} color="#16a34a" />
            )}
            <Text fontSize="xs" fontWeight="bold" color={feedback.type === 'error' ? '#b91c1c' : '#15803d'}>
              {feedback.message}
            </Text>
          </Flex>
        </Card.Root>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <Stack gap={6}>
          {/* Section 1: Basic Project Identifiers */}
          <Card.Root bg="white" borderRadius="16px" p={6} border="1px solid #e2e8f0" boxShadow="xs">
            <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
              <HardHat size={18} color="#2563eb" /> Project Identity & Classification
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              System project number, official title, and construction domain.
            </Text>

            <Stack gap={4}>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Project Code / Number *
                  </Text>
                  <Input
                    size="sm"
                    fontFamily="mono"
                    fontWeight="bold"
                    value={form.projectNumber}
                    onChange={(e) => setForm({ ...form, projectNumber: e.target.value })}
                    required
                  />
                  <Text fontSize="10px" color="#94a3b8" mt={1}>Auto-generated serial code</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Project Type / Domain *
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    >
                      <option value="Civil Infrastructure">Civil Infrastructure</option>
                      <option value="Highway & Bridges">Highway & Bridges</option>
                      <option value="Commercial Building">Commercial Building</option>
                      <option value="Industrial & Warehousing">Industrial & Warehousing</option>
                      <option value="Residential Estate">Residential Estate</option>
                      <option value="Maritime & Harbor">Maritime & Harbor</option>
                      <option value="Ready-Mix Site Plant">Ready-Mix Site Plant</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Operational Status
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    >
                      <option value="in_progress">In Progress (Active Site)</option>
                      <option value="planned">Planned (Tender / Pre-Start)</option>
                      <option value="on_hold">On Hold (Pending Clearance)</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </SimpleGrid>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                  Project Title / Contract Name *
                </Text>
                <Input
                  size="sm"
                  placeholder="e.g. Marina Wharf Expansion & Structural Jetty Reconstruction"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                  Physical Site Location / Address *
                </Text>
                <Input
                  size="sm"
                  placeholder="e.g. Kilometer 14, Lekki-Epe Expressway, Coastal Corridor"
                  value={form.siteLocation}
                  onChange={(e) => setForm({ ...form, siteLocation: e.target.value })}
                  required
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                  Project Scope & Technical Description
                </Text>
                <Input
                  size="sm"
                  placeholder="Summary of engineering works, structural quantities, and client deliverables..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Box>
            </Stack>
          </Card.Root>

          {/* Section 2: Client & Consultant Information */}
          <Card.Root bg="white" borderRadius="16px" p={6} border="1px solid #e2e8f0" boxShadow="xs">
            <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
              <Building2 size={18} color="#2563eb" /> Client & Engineering Consultant
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Customer organization, primary contract liaison, and supervising consulting engineers.
            </Text>

            <Stack gap={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Select Registered Client / Customer
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.clientId}
                      onChange={(e) => handleCustomerChange(Number(e.target.value))}
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.companyName} ({c.customerCode})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Client Name (Display) *
                  </Text>
                  <Input
                    size="sm"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    required
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Client Liaison Person
                  </Text>
                  <Input
                    size="sm"
                    placeholder="Engr. Representative"
                    value={form.clientContactPerson}
                    onChange={(e) => setForm({ ...form, clientContactPerson: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Client Contact Email
                  </Text>
                  <Input
                    size="sm"
                    type="email"
                    placeholder="contracts@client.org"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Client Contact Phone
                  </Text>
                  <Input
                    size="sm"
                    placeholder="+234..."
                    value={form.clientPhone}
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  />
                </Box>
              </SimpleGrid>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                  Supervising Consultant Engineer
                </Text>
                <Input
                  size="sm"
                  placeholder="e.g. Arup / Foster & Partners / Mott MacDonald"
                  value={form.consultant}
                  onChange={(e) => setForm({ ...form, consultant: e.target.value })}
                />
              </Box>
            </Stack>
          </Card.Root>

          {/* Section 3: Financial Parameters */}
          <Card.Root bg="white" borderRadius="16px" p={6} border="1px solid #e2e8f0" boxShadow="xs">
            <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
              <DollarSign size={18} color="#16a34a" /> Contract Financials & Budget Allocation
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Agreed client contract value, baseline cost budget, and expected profit margin in {activeCompany.currency}.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                  Agreed Contract Value ({activeCompany.currency}) *
                </Text>
                <Input
                  size="sm"
                  type="number"
                  step="any"
                  min={1}
                  value={form.contractValue}
                  onChange={(e) => setForm({ ...form, contractValue: Number(e.target.value) })}
                  required
                />
                <Text fontSize="10px" color="#64748b" mt={1}>Lump sum certified contract value</Text>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                  Target Budget / Cost Ceiling ({activeCompany.currency}) *
                </Text>
                <Input
                  size="sm"
                  type="number"
                  step="any"
                  min={1}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                  required
                />
                <Text fontSize="10px" color="#64748b" mt={1}>Direct project delivery budget</Text>
              </Box>

              <Box p={3} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
                  Projected Gross Margin
                </Text>
                <Text fontSize="lg" fontWeight="black" color={form.contractValue - form.budget >= 0 ? '#16a34a' : '#dc2626'} mt={1}>
                  {activeCompany.currency} {(form.contractValue - form.budget).toLocaleString()}
                </Text>
                <Text fontSize="11px" color="#64748b">
                  {form.contractValue > 0 ? Math.round(((form.contractValue - form.budget) / form.contractValue) * 100) : 0}% contract margin
                </Text>
              </Box>
            </SimpleGrid>
          </Card.Root>

          {/* Section 4: Schedule Dates & Staff Assignment */}
          <Card.Root bg="white" borderRadius="16px" p={6} border="1px solid #e2e8f0" boxShadow="xs">
            <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
              <Calendar size={18} color="#2563eb" /> Schedule Dates & Resident Engineers
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Contract signature date, site possession date, expected completion date, and lead site engineers.
            </Text>

            <Stack gap={4}>
              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Contract Award Date
                  </Text>
                  <Input
                    size="sm"
                    type="date"
                    value={form.contractDate}
                    onChange={(e) => setForm({ ...form, contractDate: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Site Commencement Date *
                  </Text>
                  <Input
                    size="sm"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Expected Completion Date *
                  </Text>
                  <Input
                    size="sm"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value, expectedCompletionDate: e.target.value })}
                    required
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Lead Project Manager *
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.manager}
                      onChange={(e) => setForm({ ...form, manager: e.target.value })}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} ({emp.position})
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1.5}>
                    Resident Site Engineer
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={form.assignedEngineers[0] || currentUserName}
                      onChange={(e) => setForm({ ...form, assignedEngineers: [e.target.value] })}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} — {emp.role}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </SimpleGrid>
            </Stack>
          </Card.Root>

          {/* Form Actions */}
          <Flex justify="flex-end" gap={3} pt={2} pb={6}>
            <Button
              size="md"
              variant="outline"
              borderColor="#cbd5e1"
              color="#334155"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </Button>
            <Button
              size="md"
              bg="#2563eb"
              color="white"
              _hover={{ bg: '#1d4ed8' }}
              type="submit"
              fontWeight="bold"
            >
              <HardHat size={18} /> Register & Launch Project
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};
