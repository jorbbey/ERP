import React, { useState } from 'react';
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
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { ContractAdminContract, ContractAdminEvent } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Scale
} from 'lucide-react';

export const ContractAdminPage: React.FC = () => {
  const {
    contracts,
    contractEvents,
    addContract,
    addContractEvent,
    activeCompany,
    currentUserName
  } = useERP();

  const [activeTab, setActiveTab] = useState<'contracts' | 'events' | 'documents'>('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractAdminContract | null>(null);

  // New Contract Form State
  const [newContract, setNewContract] = useState({
    contractNumber: `CNT-2026-${String(contracts.length + 101).padStart(3, '0')}`,
    title: '',
    clientName: '',
    contractorName: activeCompany.name,
    procurementRoute: 'Open tender',
    status: 'opportunity' as ContractAdminContract['status'],
    estimatedValue: 5000000,
    awardedValue: 0,
    bidDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    awardDate: '',
    commencementDate: '',
    completionDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    description: ''
  });

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    contractId: contracts[0]?.id || 1,
    eventType: 'Variation' as ContractAdminEvent['eventType'],
    eventDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPortfolioValue = contracts.reduce((sum, c) => sum + (c.awardedValue || c.estimatedValue), 0);
  const activeContractsCount = contracts.filter(c => c.status === 'active' || c.status === 'awarded').length;
  const tenderingCount = contracts.filter(c => c.status === 'tendering' || c.status === 'under_evaluation' || c.status === 'opportunity').length;

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContract.title || !newContract.clientName) return;

    addContract({
      contractNumber: newContract.contractNumber,
      title: newContract.title,
      clientName: newContract.clientName,
      contractorName: newContract.contractorName,
      procurementRoute: newContract.procurementRoute,
      status: newContract.status,
      estimatedValue: Number(newContract.estimatedValue),
      awardedValue: Number(newContract.awardedValue),
      bidDeadline: newContract.bidDeadline,
      awardDate: newContract.awardDate,
      commencementDate: newContract.commencementDate,
      completionDate: newContract.completionDate,
      description: newContract.description
    });

    setShowAddContractModal(false);
    setNewContract({
      contractNumber: `CNT-2026-${String(contracts.length + 102).padStart(3, '0')}`,
      title: '',
      clientName: '',
      contractorName: activeCompany.name,
      procurementRoute: 'Open tender',
      status: 'opportunity',
      estimatedValue: 5000000,
      awardedValue: 0,
      bidDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      awardDate: '',
      commencementDate: '',
      completionDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      description: ''
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.notes) return;

    addContractEvent({
      contractId: Number(newEvent.contractId),
      eventType: newEvent.eventType,
      eventDate: newEvent.eventDate,
      notes: newEvent.notes
    });

    setShowAddEventModal(false);
    setNewEvent({
      contractId: contracts[0]?.id || 1,
      eventType: 'Variation',
      eventDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const getStatusBadge = (status: ContractAdminContract['status']) => {
    switch (status) {
      case 'active':
        return <Badge colorPalette="green" variant="solid">Active</Badge>;
      case 'awarded':
        return <Badge colorPalette="blue" variant="solid">Awarded</Badge>;
      case 'tendering':
        return <Badge colorPalette="purple" variant="subtle">Tendering</Badge>;
      case 'under_evaluation':
        return <Badge colorPalette="cyan" variant="subtle">Under Eval</Badge>;
      case 'opportunity':
        return <Badge colorPalette="yellow" variant="subtle">Opportunity</Badge>;
      case 'completed':
        return <Badge colorPalette="teal" variant="solid">Completed</Badge>;
      default:
        return <Badge colorPalette="gray">{status}</Badge>;
    }
  };

  return (
    <Box>
      {/* Header Banner */}
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
              <FileText size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a">
                Contract Administration
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Lifecycle tracking for tenders, legal contracts, client variations, claims, and compliance.
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
            onClick={() => setShowAddEventModal(true)}
          >
            <Clock size={16} /> Log Variation / Event
          </Button>
          <Button 
            size="sm" 
            bg="#2563eb" 
            color="white" 
            _hover={{ bg: '#1d4ed8' }} 
            onClick={() => setShowAddContractModal(true)}
          >
            <Plus size={16} /> New Contract
          </Button>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} mb={6}>
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Portfolio Value
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {activeCompany.currency} {(totalPortfolioValue / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <TrendingUp size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Across all pipeline & active engagements
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Active Execution
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {activeContractsCount} Contracts
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <CheckCircle2 size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Currently generating active site billings
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Tendering Pipeline
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#7c3aed" mt={1}>
                {tenderingCount} Bids
              </Text>
            </Box>
            <Box p={2.5} bg="#faf5ff" color="#7c3aed" borderRadius="10px">
              <FileCheck size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Bids under preparation or evaluation
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Contract Variations
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#d97706" mt={1}>
                {contractEvents.length} Events
              </Text>
            </Box>
            <Box p={2.5} bg="#fffbeb" color="#d97706" borderRadius="10px">
              <Scale size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Architectural variations, claims & EOTs
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Tabs Bar */}
      <Flex borderBottom="1px solid #e2e8f0" gap={4} mb={6}>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'contracts' ? '#2563eb' : 'transparent'}
          color={activeTab === 'contracts' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'contracts' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('contracts')}
        >
          Contracts Catalog ({contracts.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'events' ? '#2563eb' : 'transparent'}
          color={activeTab === 'events' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'events' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('events')}
        >
          Variations & Legal Events ({contractEvents.length})
        </Button>
      </Flex>

      {/* Contracts Tab */}
      {activeTab === 'contracts' && (
        <Box>
          {/* Filters & Search */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={3} mb={4} justify="space-between">
            <Flex gap={2} flex="1" maxW={{ md: '450px' }}>
              <Box position="relative" flex="1">
                <Input
                  size="sm"
                  placeholder="Search by contract name, code, or client..."
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

            <Flex gap={2} align="center">
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
                  <option value="opportunity">Opportunity</option>
                  <option value="tendering">Tendering</option>
                  <option value="under_evaluation">Under Evaluation</option>
                  <option value="awarded">Awarded</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Flex>
          </Flex>

          {/* Contracts Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {filteredContracts.map((contract) => (
              <Card.Root
                key={contract.id}
                bg="white"
                border="1px solid #e2e8f0"
                borderRadius="14px"
                p={5}
                boxShadow="xs"
                _hover={{ borderColor: '#93c5fd', transform: 'translateY(-2px)' }}
                transition="all 0.15s ease"
              >
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Badge variant="subtle" colorPalette="blue" fontSize="10px">
                    {contract.contractNumber}
                  </Badge>
                  {getStatusBadge(contract.status)}
                </Flex>

                <Heading size="sm" color="#0f172a" mb={1}>
                  {contract.title}
                </Heading>

                <Text fontSize="xs" color="#64748b" mb={3} display="flex" alignItems="center" gap={1.5}>
                  <Building2 size={14} /> Client: <Text as="span" fontWeight="semibold" color="#334155">{contract.clientName}</Text>
                </Text>

                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" mb={3} fontSize="xs">
                  <Flex justify="space-between" mb={1.5}>
                    <Text color="#64748b">Procurement Route:</Text>
                    <Text fontWeight="semibold" color="#0f172a">{contract.procurementRoute}</Text>
                  </Flex>
                  <Flex justify="space-between" mb={1.5}>
                    <Text color="#64748b">Contract Value:</Text>
                    <Text fontWeight="bold" color="#2563eb">
                      {activeCompany.currency} {(contract.awardedValue || contract.estimatedValue).toLocaleString()}
                    </Text>
                  </Flex>
                  {contract.commencementDate && (
                    <Flex justify="space-between">
                      <Text color="#64748b">Term:</Text>
                      <Text color="#334155">{contract.commencementDate} → {contract.completionDate || 'TBD'}</Text>
                    </Flex>
                  )}
                </Box>

                {contract.description && (
                  <Text fontSize="xs" color="#64748b" lineClamp={2} mb={3}>
                    {contract.description}
                  </Text>
                )}

                <Flex justify="space-between" align="center" pt={3} borderTop="1px solid #f1f5f9">
                  <Text fontSize="11px" color="#94a3b8">
                    Contractor: {contract.contractorName || activeCompany.name}
                  </Text>
                  <Button
                    size="xs"
                    variant="subtle"
                    colorPalette="blue"
                    onClick={() => setSelectedContract(contract)}
                  >
                    View Details
                  </Button>
                </Flex>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Events / Variations Tab */}
      {activeTab === 'events' && (
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
          <Heading size="sm" color="#0f172a" mb={4}>
            Official Contract Variations, Instructions & Event Logs
          </Heading>

          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Event Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Contract</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Type</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Official Notes / Variation Scope</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contractEvents.map((evt) => {
                const parentContract = contracts.find(c => c.id === evt.contractId);
                return (
                  <Table.Row key={evt.id}>
                    <Table.Cell fontSize="xs" color="#64748b" fontWeight="medium">
                      {evt.eventDate}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                      {parentContract ? parentContract.contractNumber : `CNT #${evt.contractId}`}
                      <Text fontSize="10px" color="#64748b" fontWeight="normal">
                        {parentContract?.title}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        colorPalette={
                          evt.eventType === 'Variation' ? 'purple' :
                          evt.eventType === 'Extension of Time' ? 'yellow' :
                          evt.eventType === 'Payment Application' ? 'green' : 'blue'
                        }
                        size="xs"
                        variant="subtle"
                      >
                        {evt.eventType}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#334155">
                      {evt.notes}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* Add Contract Modal */}
      {showAddContractModal && (
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
          <Box bg="white" borderRadius="16px" maxW="580px" w="100%" p={6} boxShadow="xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Add New Contract Record
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Register a public tender, client contract, or direct subcontract award.
            </Text>

            <form onSubmit={handleCreateContract}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contract Reference</Text>
                    <Input
                      size="sm"
                      value={newContract.contractNumber}
                      onChange={(e) => setNewContract({ ...newContract, contractNumber: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Procurement Route</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newContract.procurementRoute}
                        onChange={(e) => setNewContract({ ...newContract, procurementRoute: e.target.value })}
                      >
                        <option value="Open tender">Open tender</option>
                        <option value="Selective tendering">Selective tendering</option>
                        <option value="Design & Build">Design & Build</option>
                        <option value="Direct Negotiation">Direct Negotiation</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Contract Title</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Civil Construction of Marina Wharf Jetty"
                    value={newContract.title}
                    onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Client Entity</Text>
                    <Input
                      size="sm"
                      placeholder="e.g. Federal Ministry of Transport"
                      value={newContract.clientName}
                      onChange={(e) => setNewContract({ ...newContract, clientName: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Initial Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newContract.status}
                        onChange={(e) => setNewContract({ ...newContract, status: e.target.value as any })}
                      >
                        <option value="opportunity">Opportunity</option>
                        <option value="tendering">Tendering</option>
                        <option value="under_evaluation">Under Evaluation</option>
                        <option value="awarded">Awarded</option>
                        <option value="active">Active</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Estimated Value ({activeCompany.currency})</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={newContract.estimatedValue}
                      onChange={(e) => setNewContract({ ...newContract, estimatedValue: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Awarded Value ({activeCompany.currency})</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={newContract.awardedValue}
                      onChange={(e) => setNewContract({ ...newContract, awardedValue: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Brief Scope & Description</Text>
                  <Input
                    size="sm"
                    placeholder="Provide overview of contract deliverables, milestones, or retention clauses..."
                    value={newContract.description}
                    onChange={(e) => setNewContract({ ...newContract, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddContractModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Save Contract
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Add Variation / Event Modal */}
      {showAddEventModal && (
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
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Log Contract Variation / Formal Event
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Record client site instructions, variation orders, or time extensions.
            </Text>

            <form onSubmit={handleCreateEvent}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Contract</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={newEvent.contractId}
                      onChange={(e) => setNewEvent({ ...newEvent, contractId: Number(e.target.value) })}
                    >
                      {contracts.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.contractNumber} — {c.title}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Event Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newEvent.eventType}
                        onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value as any })}
                      >
                        <option value="Variation">Variation Order</option>
                        <option value="Instruction">Engineer Instruction</option>
                        <option value="Extension of Time">Extension of Time</option>
                        <option value="Payment Application">Interim Payment Cert</option>
                        <option value="Claim">Contractor Claim</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Date Recorded</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Details & Financial/Time Impact</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Additional subgrade reinforcement requested by client engineer, +₦4.5M"
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddEventModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Log Event
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Selected Contract Detail Modal */}
      {selectedContract && (
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
          <Box bg="white" borderRadius="16px" maxW="600px" w="100%" p={6} boxShadow="xl">
            <Flex justify="space-between" align="center" mb={3}>
              <Badge colorPalette="blue" size="sm">{selectedContract.contractNumber}</Badge>
              {getStatusBadge(selectedContract.status)}
            </Flex>

            <Heading size="md" color="#0f172a" mb={1}>{selectedContract.title}</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Client: {selectedContract.clientName}</Text>

            <SimpleGrid columns={2} gap={3} p={4} bg="#f8fafc" borderRadius="12px" mb={4} fontSize="xs">
              <Box>
                <Text color="#64748b" textTransform="uppercase" fontSize="10px" fontWeight="bold">Procurement Route</Text>
                <Text fontWeight="bold" color="#0f172a">{selectedContract.procurementRoute}</Text>
              </Box>
              <Box>
                <Text color="#64748b" textTransform="uppercase" fontSize="10px" fontWeight="bold">Awarded Value</Text>
                <Text fontWeight="bold" color="#16a34a">
                  {activeCompany.currency} {(selectedContract.awardedValue || selectedContract.estimatedValue).toLocaleString()}
                </Text>
              </Box>
              <Box>
                <Text color="#64748b" textTransform="uppercase" fontSize="10px" fontWeight="bold">Commencement Date</Text>
                <Text fontWeight="medium" color="#334155">{selectedContract.commencementDate || 'Pending'}</Text>
              </Box>
              <Box>
                <Text color="#64748b" textTransform="uppercase" fontSize="10px" fontWeight="bold">Completion Target</Text>
                <Text fontWeight="medium" color="#334155">{selectedContract.completionDate || 'Pending'}</Text>
              </Box>
            </SimpleGrid>

            {selectedContract.description && (
              <Box mb={4}>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Scope Summary</Text>
                <Text fontSize="xs" color="#64748b" bg="#f1f5f9" p={3} borderRadius="8px">
                  {selectedContract.description}
                </Text>
              </Box>
            )}

            <Flex justify="flex-end">
              <Button size="sm" onClick={() => setSelectedContract(null)}>
                Close
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};
