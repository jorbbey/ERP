import React from 'react';
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
  CheckCircle2 
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
    activeRole 
  } = useERP();

  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const pendingReqs = requisitions.filter(r => r.status === 'Pending Review');
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minLevel);

  const canApprove = ['Managing Director', 'Finance Manager', 'Super Admin'].includes(activeRole);

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" boxShadow="xs" border="1px solid #e2e8f0" p={5}>
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={4}>
          <Box>
            <Heading size="lg" color="#0f172a" fontWeight="bold">
              Executive Construction Dashboard
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={1}>
              Real-time site progress, financial CapEx utilization, material requisitions, and plant dispatches for{' '}
              <Text as="span" fontWeight="bold" color="#1e293b">{activeCompany.name}</Text>.
            </Text>
          </Box>
          <Flex gap={2}>
            <Button 
              size="sm" 
              colorPalette="blue" 
              onClick={() => navigate('/requisitions')}
              fontWeight="semibold"
            >
              <PlusCircle size={16} /> New Requisition
            </Button>
            <Button 
              size="sm" 
              bg="#0f172a" 
              color="white" 
              _hover={{ bg: '#1e293b' }}
              onClick={() => navigate('/projects')}
              fontWeight="semibold"
            >
              <HardHat size={16} /> Site Progress
            </Button>
          </Flex>
        </Flex>
      </Card.Root>

      {/* 4 Metric Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        {/* Metric 1 */}
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">
              Active Construction Sites
            </Text>
            <Box p={2} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <HardHat size={20} />
            </Box>
          </Flex>
          <Flex align="baseline" gap={2} mt={3}>
            <Text fontSize="2xl" fontWeight="black" color="#0f172a">
              {activeProjectsCount}
            </Text>
            <Text fontSize="xs" color="#64748b">of {projects.length} total projects</Text>
          </Flex>
          <Flex align="center" gap={1} mt={2} fontSize="xs" color="#16a34a" fontWeight="medium">
            <TrendingUp size={14} /> All sites operational
          </Flex>
        </Card.Root>

        {/* Metric 2 */}
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">
              CapEx Budget Spent
            </Text>
            <Box p={2} bg="#ecfdf5" color="#059669" borderRadius="10px">
              <DollarSign size={20} />
            </Box>
          </Flex>
          <Flex align="baseline" gap={2} mt={3}>
            <Text fontSize="2xl" fontWeight="black" color="#0f172a">
              {activeCompany.currency} {(totalSpent / 1000000).toFixed(2)}M
            </Text>
            <Text fontSize="xs" color="#64748b font-semibold">({budgetUtilization}%)</Text>
          </Flex>
          <Text fontSize="xs" color="#64748b" mt={2}>
            Total CapEx: {activeCompany.currency} {(totalBudget / 1000000).toFixed(1)}M
          </Text>
        </Card.Root>

        {/* Metric 3 */}
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">
              Pending Requisitions
            </Text>
            <Box p={2} bg="#fffbeb" color="#d97706" borderRadius="10px">
              <ClipboardList size={20} />
            </Box>
          </Flex>
          <Flex align="baseline" gap={2} mt={3}>
            <Text fontSize="2xl" fontWeight="black" color="#0f172a">
              {pendingReqs.length}
            </Text>
            <Badge colorPalette="orange" size="xs">Needs Action</Badge>
          </Flex>
          <Text fontSize="xs" color="#64748b" mt={2}>
            {pendingReqs.filter(r => r.priority === 'Urgent').length} site-critical urgent requests
          </Text>
        </Card.Root>

        {/* Metric 4 */}
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">
              Stores & Low Stock
            </Text>
            <Box p={2} bg={lowStockItems.length > 0 ? "#fef2f2" : "#f8fafc"} color={lowStockItems.length > 0 ? "#dc2626" : "#475569"} borderRadius="10px">
              <Boxes size={20} />
            </Box>
          </Flex>
          <Flex align="baseline" gap={2} mt={3}>
            <Text fontSize="2xl" fontWeight="black" color="#0f172a">
              {lowStockItems.length}
            </Text>
            <Badge colorPalette={lowStockItems.length > 0 ? "red" : "green"} size="xs">
              {lowStockItems.length > 0 ? "Below Buffer" : "Optimal"}
            </Badge>
          </Flex>
          <Text fontSize="xs" color="#64748b" mt={2}>
            {inventory.length} total material items monitored
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Middle Row: Projects Tracking & Pending Approvals */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
        {/* Projects (2 columns) */}
        <Card.Root gridColumn={{ lg: 'span 2' }} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="md" color="#0f172a" fontWeight="bold">
                Active Projects Progress & Financials
              </Heading>
              <Text fontSize="xs" color="#64748b">Physical construction % vs Capital consumption</Text>
            </Box>
            <Button 
              size="xs" 
              variant="ghost" 
              colorPalette="blue" 
              onClick={() => navigate('/projects')}
              fontWeight="bold"
            >
              View All <ArrowUpRight size={14} />
            </Button>
          </Flex>

          <Stack gap={4}>
            {projects.slice(0, 3).map((project) => {
              const spentPct = Math.round((project.spent / project.budget) * 100);
              return (
                <Box 
                  key={project.id} 
                  p={4} 
                  borderRadius="12px" 
                  bg="#f8fafc" 
                  border="1px solid #edf2f7"
                  cursor="pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Box>
                      <Flex align="center" gap={2}>
                        <Text fontWeight="bold" fontSize="sm" color="#0f172a">{project.name}</Text>
                        <Badge size="xs" colorPalette="blue" variant="subtle">{project.projectNumber}</Badge>
                      </Flex>
                      <Text fontSize="xs" color="#64748b" mt={0.5}>
                        {project.siteLocation} • Client: {project.clientName}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontWeight="black" fontSize="sm" color="#0f172a">{project.progressPercent}% Complete</Text>
                      <Text fontSize="xs" color="#64748b">
                        {activeCompany.currency} {(project.spent / 1000).toFixed(0)}k of {(project.budget / 1000).toFixed(0)}k
                      </Text>
                    </Box>
                  </Flex>

                  {/* Progress Bars */}
                  <Box mt={3}>
                    <Flex justify="space-between" fontSize="11px" color="#64748b" fontWeight="medium" mb={1}>
                      <Text>Physical Site Progress</Text>
                      <Text>{project.progressPercent}%</Text>
                    </Flex>
                    <Progress.Root value={project.progressPercent} size="sm" colorPalette="blue" borderRadius="full">
                      <Progress.Track bg="#e2e8f0">
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Card.Root>

        {/* Pending Approvals (1 column) */}
        <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #f1f5f9">
              <Flex align="center" gap={2}>
                <Clock size={18} color="#d97706" />
                <Heading size="sm" color="#0f172a" fontWeight="bold">Pending Approvals</Heading>
              </Flex>
              <Badge colorPalette="orange" size="sm">{pendingReqs.length}</Badge>
            </Flex>

            <Stack gap={3} mt={3}>
              {pendingReqs.length === 0 ? (
                <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px', opacity: 0.7 }} />
                  All requisitions have been approved!
                </Box>
              ) : (
                pendingReqs.slice(0, 3).map((req) => (
                  <Box key={req.id} p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{req.requisitionNo}</Text>
                      <Badge size="xs" colorPalette={req.priority === 'Urgent' ? 'red' : 'gray'}>
                        {req.priority}
                      </Badge>
                    </Flex>
                    <Text fontSize="xs" color="#334155" fontWeight="medium" mt={1} lineClamp={1}>
                      {req.projectName}
                    </Text>
                    <Text fontSize="11px" color="#64748b" mt={0.5}>
                      Req: {req.requestedBy} • {activeCompany.currency} {req.totalEstimatedAmount.toLocaleString()}
                    </Text>

                    {canApprove && (
                      <Flex gap={2} mt={2.5}>
                        <Button 
                          size="xs" 
                          colorPalette="green" 
                          flex="1"
                          onClick={() => updateRequisitionStatus(req.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="xs" 
                          variant="outline" 
                          colorPalette="red"
                          onClick={() => updateRequisitionStatus(req.id, 'Rejected')}
                        >
                          Reject
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
            size="sm" 
            mt={4} 
            w="100%" 
            onClick={() => navigate('/requisitions')}
            fontWeight="bold"
          >
            Requisition Workflows →
          </Button>
        </Card.Root>
      </SimpleGrid>

      {/* Bottom Row: Concrete Dispatches & Low Inventory Alerts */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Concrete Batch Dispatches */}
        <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #f1f5f9">
            <Flex align="center" gap={2}>
              <Truck size={18} color="#2563eb" />
              <Heading size="sm" color="#0f172a" fontWeight="bold">Ready-Mix Concrete Dispatches</Heading>
            </Flex>
            <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => navigate('/rmc')}>
              View RMC Hub →
            </Button>
          </Flex>

          <Stack gap={2.5} mt={3}>
            {batchRecords.map((batch) => (
              <Box key={batch.id} p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
                <Flex justify="space-between" align="center">
                  <Box>
                    <Flex align="center" gap={2}>
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{batch.ticketNo}</Text>
                      <Badge size="xs" colorPalette="blue">{batch.mixDesignCode}</Badge>
                      <Text fontSize="xs" color="#64748b">({batch.volumeCuM} m³)</Text>
                    </Flex>
                    <Text fontSize="xs" color="#475569" mt={1}>{batch.clientProject}</Text>
                    <Text fontSize="11px" color="#94a3b8" mt={0.5}>{batch.truckNo} • Dispatched: {batch.batchTime}</Text>
                  </Box>
                  <Box textAlign="right">
                    <Badge colorPalette={batch.status === 'Poured' ? 'green' : 'cyan'} size="sm">
                      {batch.status}
                    </Badge>
                    <Text fontSize="10px" color="#64748b" mt={1} fontFamily="mono">
                      {batch.slumpMeasured}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Card.Root>

        {/* Low Stock Material Warnings */}
        <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" pb={3} borderBottom="1px solid #f1f5f9">
            <Flex align="center" gap={2}>
              <AlertTriangle size={18} color="#ef4444" />
              <Heading size="sm" color="#0f172a" fontWeight="bold">Material Reorder Alerts</Heading>
            </Flex>
            <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => navigate('/inventory')}>
              All Stores →
            </Button>
          </Flex>

          <Stack gap={2.5} mt={3}>
            {lowStockItems.length === 0 ? (
              <Box py={6} textAlign="center" color="#94a3b8" fontSize="xs">
                No materials currently below minimum threshold.
              </Box>
            ) : (
              lowStockItems.map((item) => (
                <Box key={item.id} p={3} bg="#fef2f2" borderRadius="10px" border="1px solid #fee2e2">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#991b1b">{item.name}</Text>
                      <Text fontSize="11px" color="#b91c1c" mt={0.5}>
                        SKU: {item.itemCode} • Location: {item.warehouseLocation}
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
      </SimpleGrid>
    </Stack>
  );
};
