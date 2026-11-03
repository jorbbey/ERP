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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Project } from '../../../types';
import { ShoppingCart, FileText, CheckCircle2, Clock, AlertTriangle, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SiteProcurementTabProps {
  project: Project;
}

export const SiteProcurementTab: React.FC<SiteProcurementTabProps> = ({ project }) => {
  const navigate = useNavigate();
  const { requisitions, purchaseOrders, activeCompany } = useERP();
  const currency = activeCompany?.currency || '₦';

  const currentRequisitions = requisitions.filter(r => r?.projectId === project?.id || (project?.name && r?.projectName === project?.name));
  const currentPOs = purchaseOrders.filter(p => p?.projectId === project?.id || (project?.name && p?.projectName === project?.name));

  const totalReqValue = currentRequisitions.reduce((sum, r) => sum + (Number(r?.totalEstimatedAmount) || 0), 0);
  const totalPOValue = currentPOs.reduce((sum, p) => sum + (Number(p?.totalAmount) || 0), 0);

  const [activeSubTab, setActiveSubTab] = useState<'requisitions' | 'purchaseOrders'>('requisitions');

  return (
    <Stack gap={5}>
      {/* Top Banner KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Site Material Requisitions
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
                {currency} {(totalReqValue ?? 0).toLocaleString()}
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <ShoppingCart size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            {currentRequisitions.length} Requisitions filed for this site
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Committed Purchase Orders
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {currency} {(totalPOValue ?? 0).toLocaleString()}
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <Truck size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            {currentPOs.length} Purchase orders issued
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Pending Delivery / Dispatched
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#d97706" mt={1}>
                {currentRequisitions.filter(r => r.status === 'Dispatched' || r.status === 'Pending Review').length} In Pipeline
              </Text>
            </Box>
            <Box p={2.5} bg="#fffbeb" color="#d97706" borderRadius="10px">
              <Clock size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Store materials in transit to site
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Sub-Tabs Toggle */}
      <Flex bg="#f1f5f9" p={1} borderRadius="10px" gap={1} maxW="380px">
        <Button
          size="xs"
          flex="1"
          bg={activeSubTab === 'requisitions' ? 'white' : 'transparent'}
          color={activeSubTab === 'requisitions' ? '#2563eb' : '#64748b'}
          boxShadow={activeSubTab === 'requisitions' ? 'xs' : 'none'}
          fontWeight={activeSubTab === 'requisitions' ? 'bold' : 'medium'}
          onClick={() => setActiveSubTab('requisitions')}
        >
          <ShoppingCart size={14} /> Material Requisitions ({currentRequisitions.length})
        </Button>
        <Button
          size="xs"
          flex="1"
          bg={activeSubTab === 'purchaseOrders' ? 'white' : 'transparent'}
          color={activeSubTab === 'purchaseOrders' ? '#2563eb' : '#64748b'}
          boxShadow={activeSubTab === 'purchaseOrders' ? 'xs' : 'none'}
          fontWeight={activeSubTab === 'purchaseOrders' ? 'bold' : 'medium'}
          onClick={() => setActiveSubTab('purchaseOrders')}
        >
          <Truck size={14} /> Purchase Orders ({currentPOs.length})
        </Button>
      </Flex>

      {/* VIEW 1: REQUISITIONS */}
      {activeSubTab === 'requisitions' && (
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
            <Box>
              <Heading size="sm" color="#0f172a">Site Material Requisitions</Heading>
              <Text fontSize="xs" color="#64748b">
                Quantity surveyor submissions linked directly to this project site.
              </Text>
            </Box>
            <Button size="sm" bg="#2563eb" color="white" onClick={() => navigate('/requisitions')}>
              Open Requisitions Module
            </Button>
          </Flex>

          {currentRequisitions.length === 0 ? (
            <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
              No store requisitions raised for this site yet.
            </Box>
          ) : (
            <Box overflowX="auto" mx={{ base: -5, sm: 0 }} px={{ base: 5, sm: 0 }}>
            <Table.Root size="sm" striped minW="700px">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Req No</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Date</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Requisition Title</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Requested By</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Estimated Value</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Priority</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentRequisitions.map((req) => (
                  <Table.Row key={req.id}>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                      {req.requisitionNo}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b">
                      {req.requisitionDate}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="medium" color="#0f172a">
                      {req.title}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#334155">
                      {req.requestedBy}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#2563eb" textAlign="right">
                      {req.totalEstimatedAmount !== undefined ? `${currency} ${(Number(req.totalEstimatedAmount) || 0).toLocaleString()}` : 'Unpriced'}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge size="xs" colorPalette={req.priority === 'Urgent' ? 'red' : req.priority === 'High' ? 'orange' : 'gray'}>
                        {req.priority}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap={1.5} wrap="wrap">
                        <Badge
                          size="xs"
                          colorPalette={
                            req.status === 'Delivered' ? 'green' :
                            req.status === 'Dispatched' ? 'purple' :
                            req.status === 'Approved' ? 'blue' :
                            req.status === 'Rejected' ? 'red' : 'yellow'
                          }
                        >
                          {req.status}
                        </Badge>
                        {req.purchaseOrderNo && (
                          <Badge size="xs" colorPalette="purple" variant="subtle">
                            PO: {req.purchaseOrderNo}
                          </Badge>
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={1}>
                        {!req.purchaseOrderNo && (req.status === 'Approved' || req.status === 'Ready for Dispatch' || req.status === 'Pending Review') && (
                          <Button
                            size="xs"
                            colorPalette="purple"
                            variant="subtle"
                            onClick={() => navigate('/procurement', { state: { prefillRequisitionId: req.id } })}
                            title="Generate PO in Procurement"
                          >
                            <ShoppingCart size={11} style={{ marginRight: 2 }} /> Raise PO
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="ghost"
                          colorPalette="blue"
                          onClick={() => navigate('/requisitions')}
                        >
                          View
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Card.Root>
    )}

    {/* VIEW 2: PURCHASE ORDERS */}
    {activeSubTab === 'purchaseOrders' && (
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a">Site Vendor Purchase Orders (POs)</Heading>
            <Text fontSize="xs" color="#64748b">
              Vendor purchase orders allocated and dispatched to this project site.
            </Text>
          </Box>
          <Button size="sm" bg="#2563eb" color="white" onClick={() => navigate('/procurement')}>
            Open Procurement Module
          </Button>
        </Flex>

        {currentPOs.length === 0 ? (
          <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
            No purchase orders committed specifically for this site yet.
          </Box>
        ) : (
          <Box overflowX="auto" mx={{ base: -5, sm: 0 }} px={{ base: 5, sm: 0 }}>
            <Table.Root size="sm" striped minW="700px">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">PO Number</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Supplier</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Order Date</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Expected Delivery</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Total Sum</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {currentPOs.map((po) => (
                  <Table.Row key={po.id}>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                      <Text>{po.poNumber}</Text>
                      {po.requisitionNo && (
                        <Badge size="xs" colorPalette="purple" variant="subtle" mt={0.5}>
                          Req: {po.requisitionNo}
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#0f172a">
                      {po.supplierName}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b">
                      {po.orderDate}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#64748b">
                      {po.expectedDelivery}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#2563eb" textAlign="right">
                      {currency} {(Number(po?.totalAmount) || 0).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="xs"
                        colorPalette={
                          po.status === 'received' ? 'green' :
                          po.status === 'approved' ? 'blue' :
                          po.status === 'pending_approval' ? 'yellow' : 'gray'
                        }
                      >
                        {po.status.replace('_', ' ')}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="blue"
                        onClick={() => navigate('/procurement')}
                      >
                        View PO
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          )}
        </Card.Root>
      )}
    </Stack>
  );
};
