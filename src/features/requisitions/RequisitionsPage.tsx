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
  Input, 
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { Requisition } from '../../types';
import { DispatchRequestsTab } from './components/DispatchRequestsTab';
import { WaybillsTab } from './components/WaybillsTab';
import { RequisitionCreateModal } from './components/RequisitionCreateModal';
import { RequisitionDetailModal } from './components/RequisitionDetailModal';
import { RequisitionVoucherModal } from './components/RequisitionVoucherModal';
import { 
  ClipboardList, 
  Plus, 
  Truck, 
  PackageCheck, 
  Printer, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter,
  Search,
  MessageSquare,
  FileText,
  AlertTriangle,
  Building2
} from 'lucide-react';

export const RequisitionsPage: React.FC = () => {
  const { 
    requisitions, 
    projects, 
    activeCompany, 
    currentUserName, 
    activeRole,
    dispatchRequests,
    waybills
  } = useERP();

  const [mainTab, setMainTab] = useState<'requisitions' | 'dispatch' | 'waybills'>('requisitions');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<Requisition | null>(null);
  const [voucherReq, setVoucherReq] = useState<Requisition | null>(null);

  const pendingCount = requisitions.filter(r => r.status === 'Pending Review').length;
  const approvedCount = requisitions.filter(r => r.status === 'Approved').length;
  const dispatchedCount = requisitions.filter(r => r.status === 'Dispatched' || r.status === 'Delivered').length;
  const totalRequisitionValue = requisitions.reduce((acc, r) => acc + (r.totalEstimatedAmount || 0), 0);

  const filteredRequisitions = requisitions.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesProject = projectFilter === 'All' || String(r.projectId) === projectFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      r.requisitionNo.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.projectName.toLowerCase().includes(q) ||
      r.requestedBy.toLowerCase().includes(q);

    return matchesStatus && matchesProject && matchesSearch;
  });

  const getStatusBadge = (status: Requisition['status']) => {
    switch (status) {
      case 'Approved':
        return <Badge size="xs" colorPalette="green">APPROVED</Badge>;
      case 'Pending Review':
        return <Badge size="xs" colorPalette="orange">PENDING REVIEW</Badge>;
      case 'Dispatched':
        return <Badge size="xs" colorPalette="purple">DISPATCHED</Badge>;
      case 'Delivered':
        return <Badge size="xs" colorPalette="teal">DELIVERED AT SITE</Badge>;
      case 'Rejected':
        return <Badge size="xs" colorPalette="red">REJECTED</Badge>;
      case 'Cancelled':
        return <Badge size="xs" colorPalette="gray">CANCELLED</Badge>;
      default:
        return <Badge size="xs">{status}</Badge>;
    }
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={4}>
          <Box>
            <Flex align="center" gap={3}>
              <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px">
                <ClipboardList size={26} />
              </Box>
              <Box>
                <Heading size="lg" color="#0f172a" fontWeight="bold">
                  Material Requisitions & Site Dispatches
                </Heading>
                <Text fontSize="xs" color="#64748b" mt={0.5}>
                  Site engineer BOQ requisitions, executive review workflow, store gate passes, and transport waybills.
                </Text>
              </Box>
            </Flex>
          </Box>
          <Button size="sm" colorPalette="blue" onClick={() => setShowCreateModal(true)} fontWeight="semibold">
            <Plus size={16} /> Raise Requisition (MR)
          </Button>
        </Flex>
      </Card.Root>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Requisitioned Value</Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {totalRequisitionValue.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#16a34a" mt={0.5}>{requisitions.length} total site submissions</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Awaiting Approval</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <Clock size={20} color="#d97706" />
            <Text fontSize="xl" fontWeight="black" color="#d97706">{pendingCount} Pending</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Executive authorization required</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Ready for Dispatch</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <CheckCircle2 size={20} color="#16a34a" />
            <Text fontSize="xl" fontWeight="black" color="#16a34a">{approvedCount} Approved</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>Queued in warehouse stores</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Active Site Waybills</Text>
          <Flex align="center" gap={1.5} mt={1}>
            <Truck size={20} color="#2563eb" />
            <Text fontSize="xl" fontWeight="black" color="#2563eb">{waybills.length} Delivery Notes</Text>
          </Flex>
          <Text fontSize="11px" color="#94a3b8" mt={0.5}>{dispatchedCount} fulfilled requests</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Main Tabs Navigation */}
      <Flex borderBottom="2px solid #e2e8f0" gap={4} overflowX="auto" pb="1px">
        {[
          { id: 'requisitions', label: `Requisitions Register (${requisitions.length})` },
          { id: 'dispatch', label: `Dispatch Requests Queue (${dispatchRequests.length})` },
          { id: 'waybills', label: `Waybills & Delivery Notes (${waybills.length})` }
        ].map((tab) => (
          <Box
            key={tab.id}
            as="button"
            pb={3}
            fontSize="sm"
            fontWeight={mainTab === tab.id ? 'bold' : 'medium'}
            color={mainTab === tab.id ? '#2563eb' : '#64748b'}
            borderBottom={mainTab === tab.id ? '2px solid #2563eb' : '2px solid transparent'}
            cursor="pointer"
            whiteSpace="nowrap"
            onClick={() => setMainTab(tab.id as any)}
          >
            {tab.label}
          </Box>
        ))}
      </Flex>

      {/* TAB 1: REQUISITIONS REGISTER */}
      {mainTab === 'requisitions' && (
        <Stack gap={4}>
          {/* Search & Filters */}
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
              <Box maxW="380px" w="100%">
                <Flex align="center" bg="#f8fafc" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
                  <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                  <input
                    placeholder="Search requisition #, project, title, or requester..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', fontSize: '13px', background: 'transparent', border: 'none', outline: 'none' }}
                  />
                </Flex>
              </Box>

              <Flex gap={2} flexWrap="wrap" align="center">
                <Flex align="center" gap={1.5}>
                  <Text fontSize="xs" color="#64748b" fontWeight="medium">Status:</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      bg="white"
                      borderColor="#cbd5e1"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Rejected">Rejected</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>

                <Flex align="center" gap={1.5}>
                  <Text fontSize="xs" color="#64748b" fontWeight="medium">Project:</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      bg="white"
                      borderColor="#cbd5e1"
                    >
                      <option value="All">All Projects</option>
                      {projects.map(p => (
                        <option key={p.id} value={String(p.id)}>{p.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Flex>
              </Flex>
            </Flex>
          </Card.Root>

          {/* Table */}
          <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
            <Box overflowX="auto">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="#f8fafc">
                    <Table.ColumnHeader fontSize="10px">Requisition # & Date</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Project & Work Package</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Requested By</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Priority</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Items Breakdown</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Estimated Total</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px">Status</Table.ColumnHeader>
                    <Table.ColumnHeader fontSize="10px" textAlign="right">Actions</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredRequisitions.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={8} textAlign="center" py={8} color="#64748b" fontSize="xs">
                        No material requisitions found matching current criteria.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    filteredRequisitions.map((req) => (
                      <Table.Row key={req.id} _hover={{ bg: '#f8fafc' }}>
                        <Table.Cell fontSize="xs">
                          <Text fontWeight="bold" fontFamily="mono" color="#2563eb">{req.requisitionNo}</Text>
                          <Text fontSize="10px" color="#94a3b8">{req.requisitionDate}</Text>
                        </Table.Cell>
                        <Table.Cell fontSize="xs">
                          <Text fontWeight="semibold" color="#0f172a">{req.title}</Text>
                          <Text fontSize="10px" color="#64748b">{req.projectName}</Text>
                        </Table.Cell>
                        <Table.Cell fontSize="xs">
                          <Text fontWeight="medium" color="#334155">{req.requestedBy}</Text>
                          <Text fontSize="10px" color="#94a3b8">{req.department}</Text>
                        </Table.Cell>
                        <Table.Cell fontSize="xs">
                          <Badge size="xs" colorPalette={req.priority === 'Urgent' ? 'red' : req.priority === 'High' ? 'orange' : 'gray'}>
                            {req.priority}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell fontSize="xs">
                          <Text color="#475569">{req.items.length} materials</Text>
                          <Text fontSize="10px" color="#94a3b8" truncate maxW="150px">
                            {req.items.map(i => `${i.itemName} (${i.quantityRequired})`).join(', ')}
                          </Text>
                        </Table.Cell>
                        <Table.Cell fontSize="xs" fontWeight="bold" color="#16a34a">
                          {activeCompany.currency} {req.totalEstimatedAmount.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell fontSize="xs">
                          {getStatusBadge(req.status)}
                        </Table.Cell>
                        <Table.Cell fontSize="xs" textAlign="right">
                          <Flex justify="flex-end" gap={1}>
                            <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => setSelectedReq(req)} title="Review Requisition">
                              Review
                            </Button>
                            <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => setVoucherReq(req)} title="Print Voucher">
                              <Printer size={13} />
                            </Button>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Root>
        </Stack>
      )}

      {/* TAB 2: DISPATCH REQUESTS */}
      {mainTab === 'dispatch' && (
        <DispatchRequestsTab />
      )}

      {/* TAB 3: WAYBILLS & DELIVERY NOTES */}
      {mainTab === 'waybills' && (
        <WaybillsTab />
      )}

      {/* CREATE REQUISITION MODAL */}
      {showCreateModal && (
        <RequisitionCreateModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* REQUISITION DETAIL & APPROVAL MODAL */}
      {selectedReq && (
        <RequisitionDetailModal
          requisition={selectedReq}
          onClose={() => setSelectedReq(null)}
          onOpenPrintVoucher={(req) => { setSelectedReq(null); setVoucherReq(req); }}
          onOpenDispatch={() => { setSelectedReq(null); setMainTab('dispatch'); }}
        />
      )}

      {/* PRINT VOUCHER MODAL */}
      {voucherReq && (
        <RequisitionVoucherModal
          requisition={voucherReq}
          onClose={() => setVoucherReq(null)}
        />
      )}
    </Stack>
  );
};
