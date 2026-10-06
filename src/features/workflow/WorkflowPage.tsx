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
  Table,
  Stack,
  Progress
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  Workflow,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ClipboardList,
  ShoppingCart,
  DollarSign,
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';

export const WorkflowPage: React.FC = () => {
  const {
    requisitions,
    updateRequisitionStatus,
    purchaseOrders,
    updatePOStatus,
    salaryAdvances,
    decideSalaryAdvance,
    activeRole,
    activeCompany
  } = useERP();

  const [activeTab, setActiveTab] = useState<'pending' | 'matrix' | 'completed'>('pending');

  const pendingReqs = requisitions.filter(r => r.status === 'Pending Review');
  const pendingPOs = purchaseOrders.filter(p => p.status === 'pending_approval');
  const pendingAdvances = salaryAdvances.filter(a => a.status === 'Pending');

  const totalPendingActions = pendingReqs.length + pendingPOs.length + pendingAdvances.length;

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
              <Workflow size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a">
                Enterprise Approval Workflows
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Multi-tier sign-off matrices for site requisitions, purchase orders, salary advances, and budgets.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex align="center" gap={2} bg="#eff6ff" px={3.5} py={2} borderRadius="12px" border="1px solid #bfdbfe">
          <Clock size={16} color="#2563eb" />
          <Text fontSize="xs" fontWeight="bold" color="#1e40af">
            {totalPendingActions} Actions Requiring Review
          </Text>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Flex borderBottom="1px solid #e2e8f0" gap={4} mb={6}>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'pending' ? '#2563eb' : 'transparent'}
          color={activeTab === 'pending' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'pending' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('pending')}
        >
          Pending My Approval ({totalPendingActions})
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'matrix' ? '#2563eb' : 'transparent'}
          color={activeTab === 'matrix' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'matrix' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('matrix')}
        >
          Authorization Matrices
        </Button>
      </Flex>

      {/* Pending Items Tab */}
      {activeTab === 'pending' && (
        <Stack gap={6}>
          {/* Requisitions Pending */}
          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
            <Flex justify="space-between" align="center" mb={4}>
              <Flex align="center" gap={2}>
                <ClipboardList size={20} color="#2563eb" />
                <Heading size="sm" color="#0f172a">
                  Site Material Requisitions ({pendingReqs.length})
                </Heading>
              </Flex>
              <Badge colorPalette="orange" variant="subtle">Tier 1: MD / QS Approval</Badge>
            </Flex>

            {pendingReqs.length === 0 ? (
              <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                All site requisitions have been approved or dispatched.
              </Box>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">Req Code</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Project / Site</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Requester</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Materials Scope</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Est. Cost</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {pendingReqs.map(r => (
                    <Table.Row key={r.id}>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#2563eb">
                        {r.requisitionNo}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#0f172a" fontWeight="medium">
                        {r.projectName}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#64748b">
                        {r.requestedBy} ({r.department})
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">
                        {r.title} ({r.items.length} line items)
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold" color="#0f172a">
                        {activeCompany.currency} {r.totalEstimatedAmount.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={2}>
                          <Button
                            size="xs"
                            colorPalette="green"
                            onClick={() => updateRequisitionStatus(r.id, 'Approved')}
                          >
                            <CheckCircle2 size={13} /> Approve
                          </Button>
                          <Button
                            size="xs"
                            colorPalette="red"
                            variant="subtle"
                            onClick={() => updateRequisitionStatus(r.id, 'Rejected')}
                          >
                            <XCircle size={13} /> Reject
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Root>

          {/* Purchase Orders Pending */}
          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
            <Flex justify="space-between" align="center" mb={4}>
              <Flex align="center" gap={2}>
                <ShoppingCart size={20} color="#7c3aed" />
                <Heading size="sm" color="#0f172a">
                  Purchase Orders ({pendingPOs.length})
                </Heading>
              </Flex>
              <Badge colorPalette="purple" variant="subtle">Tier 2: Finance & MD Signoff</Badge>
            </Flex>

            {pendingPOs.length === 0 ? (
              <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                No purchase orders pending approval.
              </Box>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">PO Number</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Vendor / Supplier</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Delivery Date</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Payment Terms</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Total Value</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {pendingPOs.map(po => (
                    <Table.Row key={po.id}>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#7c3aed">
                        {po.poNumber}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#0f172a" fontWeight="medium">
                        {po.supplierName}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#64748b">
                        {po.expectedDelivery}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">
                        {po.paymentTerms}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold" color="#0f172a">
                        {activeCompany.currency} {po.totalAmount.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={2}>
                          <Button
                            size="xs"
                            colorPalette="green"
                            onClick={() => updatePOStatus(po.id, 'approved')}
                          >
                            <CheckCircle2 size={13} /> Authorize PO
                          </Button>
                          <Button
                            size="xs"
                            colorPalette="red"
                            variant="subtle"
                            onClick={() => updatePOStatus(po.id, 'cancelled')}
                          >
                            <XCircle size={13} /> Decline
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Root>

          {/* Salary Advances Pending */}
          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
            <Flex justify="space-between" align="center" mb={4}>
              <Flex align="center" gap={2}>
                <DollarSign size={20} color="#16a34a" />
                <Heading size="sm" color="#0f172a">
                  Staff Salary Advances ({pendingAdvances.length})
                </Heading>
              </Flex>
              <Badge colorPalette="green" variant="subtle">Tier 3: HR & Accounts Approval</Badge>
            </Flex>

            {pendingAdvances.length === 0 ? (
              <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
                No employee salary advances pending review.
              </Box>
            ) : (
              <Table.Root size="sm" striped>
                <Table.Header bg="#f8fafc">
                  <Table.Row>
                    <Table.ColumnHeader color="#475569">Employee</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Reason</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569">Deduction Month</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Amount</Table.ColumnHeader>
                    <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {pendingAdvances.map(adv => (
                    <Table.Row key={adv.id}>
                      <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                        {adv.employeeName}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155">
                        {adv.reason}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#64748b">
                        {adv.deductionMonth}
                      </Table.Cell>
                      <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold" color="#16a34a">
                        {activeCompany.currency} {adv.amount.toLocaleString()}
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={2}>
                          <Button
                            size="xs"
                            colorPalette="green"
                            onClick={() => decideSalaryAdvance(adv.id, 'Approved')}
                          >
                            <CheckCircle2 size={13} /> Approve
                          </Button>
                          <Button
                            size="xs"
                            colorPalette="red"
                            variant="subtle"
                            onClick={() => decideSalaryAdvance(adv.id, 'Rejected')}
                          >
                            <XCircle size={13} /> Reject
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Card.Root>
        </Stack>
      )}

      {/* Approval Matrix Tab */}
      {activeTab === 'matrix' && (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
            <Heading size="sm" color="#0f172a" mb={3} display="flex" alignItems="center" gap={2}>
              <ClipboardList size={18} color="#2563eb" /> Requisition Authorization Chain
            </Heading>
            <Stack gap={3} fontSize="xs">
              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
                <Text fontWeight="bold" color="#0f172a">Step 1: Site Quantity Surveyor / Site Engineer</Text>
                <Text color="#64748b" mt={0.5}>Initiates BOQ-checked requisition with required quantities and specifications.</Text>
              </Box>
              <Flex justify="center"><ArrowRight size={16} color="#94a3b8" /></Flex>
              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
                <Text fontWeight="bold" color="#0f172a">Step 2: Stores & Inventory Controller</Text>
                <Text color="#64748b" mt={0.5}>Validates stock on hand at main warehouse; marks items to dispatch or purchase.</Text>
              </Box>
              <Flex justify="center"><ArrowRight size={16} color="#94a3b8" /></Flex>
              <Box p={3} bg="#eff6ff" borderRadius="10px" border="1px solid #bfdbfe">
                <Text fontWeight="bold" color="#1e40af">Step 3: Managing Director / Project Director</Text>
                <Text color="#3b82f6" mt={0.5}>Final financial release authorization before dispatch waybill or vendor PO issue.</Text>
              </Box>
            </Stack>
          </Card.Root>

          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
            <Heading size="sm" color="#0f172a" mb={3} display="flex" alignItems="center" gap={2}>
              <ShoppingCart size={18} color="#7c3aed" /> Procurement & PO Signoff Limits
            </Heading>
            <Stack gap={3} fontSize="xs">
              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
                <Text fontWeight="bold" color="#0f172a">Up to ₦500,000</Text>
                <Text color="#64748b" mt={0.5}>Procurement Officer approval with verified supplier quotation.</Text>
              </Box>
              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
                <Text fontWeight="bold" color="#0f172a">₦500,000 – ₦5,000,000</Text>
                <Text color="#64748b" mt={0.5}>Requires Finance Manager and Procurement Head joint clearance.</Text>
              </Box>
              <Box p={3} bg="#faf5ff" borderRadius="10px" border="1px solid #e9d5ff">
                <Text fontWeight="bold" color="#6b21a8">Above ₦5,000,000 (Major Subcontracts & CapEx)</Text>
                <Text color="#7c3aed" mt={0.5}>Managing Director and Board approval required.</Text>
              </Box>
            </Stack>
          </Card.Root>
        </SimpleGrid>
      )}
    </Box>
  );
};
