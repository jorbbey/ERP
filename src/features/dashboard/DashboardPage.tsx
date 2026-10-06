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
  Progress,
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { 
  HardHat, 
  ClipboardList, 
  Boxes, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Truck, 
  PlusCircle, 
  ArrowUpRight, 
  CheckCircle2,
  Users,
  Building2,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Bot,
  ExternalLink,
  Layers,
  Check,
  X
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeCompany, 
    projects, 
    requisitions, 
    inventory, 
    batchRecords, 
    updateRequisitionStatus, 
    activeRole,
    employees,
    equipment,
    purchaseOrders,
    accountsLedger
  } = useERP();

  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'supply' | 'financials'>('all');

  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalContract = projects.reduce((acc, p) => acc + (p.contractValue || p.budget || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const pendingReqs = requisitions.filter(r => r.status === 'Pending Review' || (r.status as string).includes('Pending'));
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minLevel);
  const openPOs = purchaseOrders.filter(po => po.status !== 'received' && po.status !== 'cancelled');

  const canApprove = ['Managing Director', 'Finance Manager', 'Super Admin'].includes(activeRole);
  const currency = activeCompany?.currency || 'USD';

  return (
    <Stack gap={6}>
      {/* 1. Executive Operations Banner */}
      <Card.Root bg="#ffffff" borderRadius="16px" boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)" border="1px solid #e2e8f0" p={{ base: 4, md: 6 }}>
        <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ lg: 'center' }} gap={4}>
          <Box>
            <Flex align="center" gap={2.5} mb={1}>
              <Box p={1.5} bg="#eff6ff" color="#2563eb" borderRadius="8px">
                <Building2 size={20} />
              </Box>
              <Heading size="lg" color="#0f172a" fontWeight="bold">
                Executive Construction Command Center
              </Heading>
              <Badge size="sm" colorPalette="blue" variant="solid">
                {activeCompany.code}
              </Badge>
            </Flex>
            <Text fontSize="xs" color="#64748b" maxW="720px">
              Real-time site execution, physical milestone progress, CapEx consumption, stores replenishment, and plant batching across active holdings.
            </Text>
          </Box>

          {/* Quick Action Launchpad */}
          <Flex gap={2} wrap="wrap">
            <Button 
              size="sm" 
              bg="#2563eb" 
              color="white"
              _hover={{ bg: '#1d4ed8' }}
              onClick={() => navigate('/requisitions')}
              fontWeight="semibold"
            >
              <PlusCircle size={15} style={{ marginRight: '4px' }} /> New Requisition
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              borderColor="#cbd5e1"
              color="#0f172a"
              _hover={{ bg: '#f8fafc', borderColor: '#94a3b8' }}
              onClick={() => navigate('/projects')}
              fontWeight="semibold"
            >
              <HardHat size={15} style={{ marginRight: '4px' }} /> All Projects
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              borderColor="#cbd5e1"
              color="#2563eb"
              _hover={{ bg: '#eff6ff', borderColor: '#93c5fd' }}
              onClick={() => navigate('/assistant')}
              fontWeight="semibold"
            >
              <Bot size={15} style={{ marginRight: '4px' }} /> AI Assistant
            </Button>
          </Flex>
        </Flex>
      </Card.Root>

      {/* 2. Primary KPI Tiles (6-Card Grid) */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 6 }} gap={3.5}>
        {/* Tile 1: Active Civil Sites */}
        <Card.Root bg="#ffffff" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="0.04em">
              Active Sites
            </Text>
            <Box p={1.5} bg="#eff6ff" color="#2563eb" borderRadius="8px">
              <HardHat size={16} />
            </Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={2}>
            {activeProjectsCount}
          </Text>
          <Flex align="center" justify="space-between" mt={1}>
            <Text fontSize="11px" color="#64748b">of {projects.length} portfolios</Text>
            <Badge size="xs" colorPalette="green" variant="subtle">On Track</Badge>
          </Flex>
        </Card.Root>

        {/* Tile 2: CapEx Contract Book */}
        <Card.Root bg="#ffffff" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="0.04em">
              Contract Book
            </Text>
            <Box p={1.5} bg="#ecfdf5" color="#059669" borderRadius="8px">
              <DollarSign size={16} />
            </Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#059669" mt={2}>
            {currency} {(totalContract / 1000000).toFixed(1)}M
          </Text>
          <Flex align="center" justify="space-between" mt={1}>
            <Text fontSize="11px" color="#64748b">{currency} {(totalSpent / 1000000).toFixed(1)}M Spent</Text>
            <Text fontSize="11px" fontWeight="bold" color="#059669">{budgetUtilization}%</Text>
          </Flex>
        </Card.Root>

        {/* Tile 3: Pending Requisitions */}
        <Card.Root bg="#ffffff" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="0.04em">
              Pending Reqs
            </Text>
            <Box p={1.5} bg="#fffbeb" color="#d97706" borderRadius="8px">
              <ClipboardList size={16} />
            </Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#d97706" mt={2}>
            {pendingReqs.length}
          </Text>
          <Flex align="center" justify="space-between" mt={1}>
            <Text fontSize="11px" color="#64748b">
              {pendingReqs.filter(r => r.priority === 'Urgent').length} Urgent
            </Text>
            <Badge size="xs" colorPalette="orange" variant="solid">Needs Sign-off</Badge>
          </Flex>
        </Card.Root>

        {/* Tile 4: Store Buffer & Low Stock */}
        <Card.Root bg="#ffffff" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="0.04em">
              Low Stock Alerts
            </Text>
            <Box p={1.5} bg={lowStockItems.length > 0 ? "#fef2f2" : "#f8fafc"} color={lowStockItems.length > 0 ? "#dc2626" : "#64748b"} borderRadius="8px">
              <Boxes size={16} />
            </Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color={lowStockItems.length > 0 ? "#dc2626" : "#0f172a"} mt={2}>
            {lowStockItems.length}
          </Text>
          <Flex align="center" justify="space-between" mt={1}>
            <Text fontSize="11px" color="#64748b">{inventory.length} total SKUs</Text>
            <Badge size="xs" colorPalette={lowStockItems.length > 0 ? "red" : "green"} variant="subtle">
              {lowStockItems.length > 0 ? "Replenish" : "Optimal"}
            </Badge>
          </Flex>
        </Card.Root>

        {/* Tile 5: Plant Fleet Telematics */}
        <Card.Root bg="#ffffff" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="0.04em">
              Heavy Plant
            </Text>
            <Box p={1.5} bg="#fef3c7" color="#d97706" borderRadius="8px">
              <Truck size={16} />
            </Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={2}>
            {equipment?.length || 24}
          </Text>
          <Flex align="center" justify="space-between" mt={1}>
            <Text fontSize="11px" color="#64748b">Plant Assets</Text>
            <Badge size="xs" colorPalette="blue" variant="subtle">94% Active</Badge>
          </Flex>
        </Card.Root>

        {/* Tile 6: Verified Workforce */}
        <Card.Root bg="#ffffff" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="0.04em">
              Site Workforce
            </Text>
            <Box p={1.5} bg="#f3e8ff" color="#7c3aed" borderRadius="8px">
              <Users size={16} />
            </Box>
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={2}>
            {employees.length}
          </Text>
          <Flex align="center" justify="space-between" mt={1}>
            <Text fontSize="11px" color="#64748b">Personnel</Text>
            <Badge size="xs" colorPalette="purple" variant="subtle">Biometric</Badge>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* 3. Middle Core Row: Active Civil Projects & Approval Chain */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
        {/* Active Projects (2 Columns on lg) */}
        <Card.Root gridColumn={{ lg: 'span 2' }} bg="#ffffff" borderRadius="16px" p={{ base: 4, md: 5 }} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md" color="#0f172a" fontWeight="bold">
                Civil Infrastructure Projects Execution
              </Heading>
              <Text fontSize="xs" color="#64748b">Physical milestone completion vs. target contract budget</Text>
            </Box>
            <Button 
              size="xs" 
              variant="ghost" 
              color="#2563eb"
              onClick={() => navigate('/projects')}
              fontWeight="bold"
            >
              Open Projects Catalog <ArrowUpRight size={13} style={{ marginLeft: '4px' }} />
            </Button>
          </Flex>

          <Stack gap={3.5}>
            {projects.slice(0, 4).map((project) => {
              const spentPct = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
              return (
                <Box 
                  key={project.id} 
                  p={4} 
                  borderRadius="12px" 
                  bg="#f8fafc" 
                  border="1px solid #e2e8f0"
                  cursor="pointer"
                  _hover={{ borderColor: '#93c5fd', bg: '#ffffff', boxShadow: 'xs' }}
                  transition="all 0.15s ease"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <Flex justify="space-between" align="start" mb={2}>
                    <Box>
                      <Flex align="center" gap={2}>
                        <Text fontWeight="bold" fontSize="sm" color="#0f172a">
                          {project.name}
                        </Text>
                        <Badge size="xs" colorPalette="blue" variant="subtle">
                          {project.projectNumber}
                        </Badge>
                      </Flex>
                      <Text fontSize="xs" color="#64748b" mt={0.5}>
                        {project.siteLocation} • Client: {project.clientName}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Flex align="center" gap={2} justify="flex-end">
                        <Text fontWeight="black" fontSize="sm" color="#0f172a">
                          {project.progressPercent}%
                        </Text>
                        <Badge size="xs" colorPalette={project.status === 'in_progress' ? 'blue' : 'green'}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </Flex>
                      <Text fontSize="xs" fontFamily="mono" color="#059669" mt={0.5}>
                        {currency} {(project.spent / 1000).toFixed(0)}k / {(project.budget / 1000).toFixed(0)}k Budget
                      </Text>
                    </Box>
                  </Flex>

                  {/* Progress Gauge */}
                  <Box mt={2.5}>
                    <Flex justify="space-between" fontSize="10px" color="#64748b" mb={1}>
                      <Text>Milestone Progress</Text>
                      <Text>{project.progressPercent}% Target</Text>
                    </Flex>
                    <Box w="100%" h="6px" bg="#e2e8f0" borderRadius="full" overflow="hidden">
                      <Box 
                        h="100%" 
                        w={`${project.progressPercent}%`} 
                        bg={project.progressPercent < 45 ? '#ef4444' : '#2563eb'}
                        borderRadius="full"
                      />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Card.Root>

        {/* Pending Approval Chain (1 Column on lg) */}
        <Card.Root bg="#ffffff" borderRadius="16px" p={{ base: 4, md: 5 }} border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #e2e8f0">
              <Flex align="center" gap={2}>
                <Clock size={16} color="#d97706" />
                <Heading size="sm" color="#0f172a" fontWeight="bold">Pending Approvals</Heading>
              </Flex>
              <Badge colorPalette="orange" size="sm" variant="solid">
                {pendingReqs.length}
              </Badge>
            </Flex>

            <Stack gap={3} mt={3}>
              {pendingReqs.length === 0 ? (
                <Box py={8} textAlign="center" color="#64748b" fontSize="xs">
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                  All material requisitions have been approved!
                </Box>
              ) : (
                pendingReqs.slice(0, 3).map((req) => (
                  <Box key={req.id} p={3.5} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a" fontFamily="mono">
                        {req.requisitionNo}
                      </Text>
                      <Badge size="xs" colorPalette={req.priority === 'Urgent' ? 'red' : 'gray'}>
                        {req.priority}
                      </Badge>
                    </Flex>
                    <Text fontSize="xs" color="#334155" fontWeight="semibold" mt={1} lineClamp={1}>
                      {req.projectName}
                    </Text>
                    <Text fontSize="11px" color="#64748b" mt={0.5}>
                      Req: {req.requestedBy} • {currency} {req.totalEstimatedAmount.toLocaleString()}
                    </Text>

                    {canApprove && (
                      <Flex gap={2} mt={2.5}>
                        <Button 
                          size="xs" 
                          bg="#10b981"
                          color="white"
                          _hover={{ bg: '#059669' }}
                          flex="1"
                          onClick={() => updateRequisitionStatus(req.id, 'Approved')}
                        >
                          <Check size={12} style={{ marginRight: '3px' }} /> Approve
                        </Button>
                        <Button 
                          size="xs" 
                          variant="outline" 
                          borderColor="#fca5a5"
                          color="#dc2626"
                          _hover={{ bg: '#fef2f2' }}
                          onClick={() => updateRequisitionStatus(req.id, 'Rejected')}
                        >
                          <X size={12} style={{ marginRight: '3px' }} /> Reject
                        </Button>
                      </Flex>
                    )}
                  </Box>
                ))
              )}
            </Stack>
          </Box>

          <Button 
            variant="outline" 
            borderColor="#cbd5e1"
            size="sm" 
            mt={4} 
            w="100%" 
            onClick={() => navigate('/requisitions')}
            fontWeight="bold"
            color="#0f172a"
          >
            Manage Requisition Chain →
          </Button>
        </Card.Root>
      </SimpleGrid>

      {/* 4. Bottom Operations Matrix: RMC Batches, Low Stock, Activity Feed */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {/* Ready-Mix Concrete Dispatches */}
        <Card.Root bg="#ffffff" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #e2e8f0">
            <Flex align="center" gap={2}>
              <Truck size={17} color="#2563eb" />
              <Heading size="sm" color="#0f172a" fontWeight="bold">Ready-Mix Concrete Dispatches</Heading>
            </Flex>
            <Button size="xs" variant="ghost" color="#2563eb" onClick={() => navigate('/rmc')}>
              View RMC →
            </Button>
          </Flex>

          <Stack gap={2.5} mt={3}>
            {batchRecords.slice(0, 3).map((batch) => (
              <Box key={batch.id} p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Flex align="center" gap={2}>
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{batch.ticketNo}</Text>
                      <Badge size="xs" colorPalette="blue">{batch.mixDesignCode}</Badge>
                      <Text fontSize="xs" color="#64748b">({batch.volumeCuM} m³)</Text>
                    </Flex>
                    <Text fontSize="xs" color="#334155" mt={0.5}>{batch.clientProject}</Text>
                    <Text fontSize="10px" color="#64748b">{batch.truckNo} • {batch.batchTime}</Text>
                  </Box>
                  <Box textAlign="right">
                    <Badge colorPalette={batch.status === 'Poured' ? 'green' : 'cyan'} size="xs" variant="solid">
                      {batch.status}
                    </Badge>
                    <Text fontSize="10px" color="#64748b" mt={1} fontFamily="mono">
                      Slump: {batch.slumpMeasured}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Card.Root>

        {/* Material Reorder Alerts */}
        <Card.Root bg="#ffffff" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #e2e8f0">
            <Flex align="center" gap={2}>
              <AlertTriangle size={17} color="#ef4444" />
              <Heading size="sm" color="#0f172a" fontWeight="bold">Material Reorder Alerts</Heading>
            </Flex>
            <Button size="xs" variant="ghost" color="#2563eb" onClick={() => navigate('/inventory')}>
              All Stores →
            </Button>
          </Flex>

          <Stack gap={2.5} mt={3}>
            {lowStockItems.length === 0 ? (
              <Box py={8} textAlign="center" color="#64748b" fontSize="xs">
                <CheckCircle2 size={28} color="#10b981" style={{ margin: '0 auto 6px' }} />
                No materials currently below minimum reorder thresholds.
              </Box>
            ) : (
              lowStockItems.slice(0, 3).map((item) => (
                <Box key={item.id} p={3} bg="#fef2f2" borderRadius="10px" border="1px solid #fee2e2">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#991b1b">{item.name}</Text>
                      <Text fontSize="10px" color="#b91c1c">
                        Code: {item.itemCode} • {item.warehouseLocation}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="xs" fontWeight="bold" color="#b91c1c">
                        {item.currentStock} {item.unit}
                      </Text>
                      <Text fontSize="10px" color="#ef4444">
                        Min: {item.minLevel} {item.unit}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))
            )}
          </Stack>
        </Card.Root>

        {/* Recent Operational Timeline */}
        <Card.Root bg="#ffffff" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #e2e8f0">
            <Flex align="center" gap={2}>
              <Activity size={17} color="#2563eb" />
              <Heading size="sm" color="#0f172a" fontWeight="bold">Field Activity Trail</Heading>
            </Flex>
            <Badge size="xs" colorPalette="green" variant="solid">Live Log</Badge>
          </Flex>

          <Stack gap={3} mt={3}>
            <Flex gap={2.5} align="start">
              <Box w="8px" h="8px" borderRadius="full" bg="#2563eb" mt={1.5} flexShrink={0} />
              <Box flex="1">
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">Bridge Extension Flyover</Text>
                <Text fontSize="10px" color="#64748b">Daily site log filed: 24 workers, weather 28°C clear.</Text>
                <Text fontSize="9px" color="#94a3b8">10 mins ago</Text>
              </Box>
            </Flex>

            <Flex gap={2.5} align="start">
              <Box w="8px" h="8px" borderRadius="full" bg="#10b981" mt={1.5} flexShrink={0} />
              <Box flex="1">
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">GRN #GRN-2026-08 Matched</Text>
                <Text fontSize="10px" color="#64748b">45 Tonnes Rebar received at Central Depot.</Text>
                <Text fontSize="9px" color="#94a3b8">45 mins ago</Text>
              </Box>
            </Flex>

            <Flex gap={2.5} align="start">
              <Box w="8px" h="8px" borderRadius="full" bg="#f59e0b" mt={1.5} flexShrink={0} />
              <Box flex="1">
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">RMC Batch Dispatched</Text>
                <Text fontSize="10px" color="#64748b">Mixer truck TRK-04 departed with 8m³ C35.</Text>
                <Text fontSize="9px" color="#94a3b8">1 hour ago</Text>
              </Box>
            </Flex>
          </Stack>
        </Card.Root>
      </SimpleGrid>
    </Stack>
  );
};
