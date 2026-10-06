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
import { useERP } from '../../../context/ERPContext';
import { Waybill } from '../../../types';
import {
  Truck,
  CheckCircle2,
  Printer,
  Search,
  Eye,
  Calendar,
  Building2,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export const WaybillsTab: React.FC = () => {
  const { waybills, markWaybillDelivered, activeCompany, currentUserName, activeRole } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'In Transit' | 'Delivered'>('all');
  const [viewingWaybill, setViewingWaybill] = useState<Waybill | null>(null);
  const [receivingWaybill, setReceivingWaybill] = useState<Waybill | null>(null);
  const [receivingNotes, setReceivingNotes] = useState('All items inspected offloaded in sound physical condition.');

  const canReceive = ['Site Engineer', 'Project Manager', 'Managing Director', 'Super Admin'].includes(activeRole);

  const filteredWaybills = waybills.filter(w => {
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      w.waybillNumber.toLowerCase().includes(q) ||
      (w.requisitionNo && w.requisitionNo.toLowerCase().includes(q)) ||
      w.projectName.toLowerCase().includes(q) ||
      w.carrierName.toLowerCase().includes(q) ||
      w.vehicleNumber.toLowerCase().includes(q) ||
      w.destinationSite.toLowerCase().includes(q) ||
      w.dispatchedBy.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleConfirmReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivingWaybill) return;

    markWaybillDelivered(receivingWaybill.id, currentUserName, receivingNotes);
    setReceivingWaybill(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Stack gap={5}>
      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={3}>
        <Box maxW="380px" w="100%">
          <Flex align="center" bg="white" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
            <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              placeholder="Search waybill #, truck, carrier, or site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: '13px', background: 'transparent', border: 'none', outline: 'none' }}
            />
          </Flex>
        </Box>

        <Flex align="center" gap={1.5}>
          <Text fontSize="xs" color="#64748b" fontWeight="medium">Delivery Status:</Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              bg="white"
              borderColor="#cbd5e1"
            >
              <option value="all">All Delivery Notes</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered & Acknowledged</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Flex>
      </Flex>

      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row bg="#f8fafc">
                <Table.ColumnHeader fontSize="10px">Waybill # & Date</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Requisition Ref</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Destination Project & Site</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Carrier & Vehicle</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Line Items Summary</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Delivery Status</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredWaybills.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py={8} color="#64748b" fontSize="xs">
                    No delivery notes found matching current query.
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredWaybills.map((wb) => (
                  <Table.Row key={wb.id} _hover={{ bg: '#f8fafc' }}>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="bold" fontFamily="mono" color="#0f172a">{wb.waybillNumber}</Text>
                      <Text fontSize="10px" color="#94a3b8">{wb.dispatchDate}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Badge size="xs" variant="subtle" colorPalette="blue" fontFamily="mono">
                        {wb.requisitionNo || 'Direct Site Transfer'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="semibold" color="#0f172a">{wb.projectName}</Text>
                      <Text fontSize="10px" color="#64748b" truncate maxW="180px">{wb.destinationSite}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="medium" color="#334155">{wb.carrierName}</Text>
                      <Text fontSize="10px" color="#94a3b8">{wb.vehicleNumber} {wb.driverPhone ? `• ${wb.driverPhone}` : ''}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      {wb.items.map((i, idx) => (
                        <Text key={idx} color="#475569" fontSize="11px">
                          • {i.itemName}: <Text as="span" fontWeight="bold">{i.quantityDispatched} {i.unit}</Text>
                        </Text>
                      ))}
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Badge
                        size="xs"
                        colorPalette={wb.status === 'Delivered' ? 'green' : 'purple'}
                      >
                        {wb.status === 'Delivered' ? 'DELIVERED AT SITE' : 'IN TRANSIT'}
                      </Badge>
                      {wb.receivedBy && (
                        <Text fontSize="10px" color="#16a34a" mt={0.5}>Received by: {wb.receivedBy}</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" textAlign="right">
                      <Flex justify="flex-end" gap={1}>
                        <Button size="xs" variant="ghost" colorPalette="blue" onClick={() => setViewingWaybill(wb)} title="View Voucher">
                          <Eye size={13} />
                        </Button>
                        {wb.status === 'In Transit' && canReceive && (
                          <Button size="xs" colorPalette="green" onClick={() => setReceivingWaybill(wb)} title="Confirm Receipt">
                            <CheckCircle2 size={13} /> Confirm Receipt
                          </Button>
                        )}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>

      {/* Confirm Receipt Modal */}
      {receivingWaybill && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="480px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Confirm Site Material Delivery
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Waybill: <Text as="span" fontWeight="bold" color="#2563eb">{receivingWaybill.waybillNumber}</Text> • Project: <Text as="span" fontWeight="bold" color="#0f172a">{receivingWaybill.projectName}</Text>
            </Text>

            <form onSubmit={handleConfirmReceipt}>
              <Stack gap={3}>
                <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" fontSize="xs">
                  <Text fontWeight="bold" color="#334155" mb={1}>Materials to Receive:</Text>
                  {receivingWaybill.items.map((i, idx) => (
                    <Flex key={idx} justify="space-between" py={0.5}>
                      <Text>{i.itemName}</Text>
                      <Text fontWeight="bold" color="#16a34a">{i.quantityDispatched} {i.unit}</Text>
                    </Flex>
                  ))}
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Receiving Engineer *</Text>
                  <Input size="sm" value={currentUserName} readOnly bg="#f8fafc" />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Site Inspection & Offloading Remarks</Text>
                  <Input
                    size="sm"
                    value={receivingNotes}
                    onChange={(e) => setReceivingNotes(e.target.value)}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setReceivingWaybill(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="green" type="submit">
                    Acknowledge Delivery
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* View Printable Delivery Note Voucher Modal */}
      {viewingWaybill && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="650px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            {/* Header */}
            <Flex justify="space-between" align="flex-start" borderBottom="2px solid #0f172a" pb={3} mb={4}>
              <Box>
                <Heading size="md" color="#0f172a" textTransform="uppercase">{activeCompany.name}</Heading>
                <Text fontSize="xs" color="#64748b">OFFICIAL MATERIAL WAYBILL & DELIVERY NOTE</Text>
                <Text fontSize="10px" color="#94a3b8">Logistics & Heavy Transport Division</Text>
              </Box>
              <Box textAlign="right">
                <Badge size="sm" colorPalette="blue" fontFamily="mono" fontSize="xs">{viewingWaybill.waybillNumber}</Badge>
                <Text fontSize="10px" color="#64748b" mt={1}>Date: {viewingWaybill.dispatchDate}</Text>
              </Box>
            </Flex>

            {/* Information Grid */}
            <SimpleGrid columns={2} gap={4} fontSize="xs" mb={4} p={3} bg="#f8fafc" borderRadius="10px">
              <Box>
                <Text color="#64748b">Dispatched From:</Text>
                <Text fontWeight="bold" color="#0f172a">{viewingWaybill.sourceWarehouseName}</Text>
                <Text color="#64748b" mt={2}>Carrier / Haulage:</Text>
                <Text fontWeight="bold" color="#0f172a">{viewingWaybill.carrierName} ({viewingWaybill.vehicleNumber})</Text>
              </Box>
              <Box>
                <Text color="#64748b">Destination Project:</Text>
                <Text fontWeight="bold" color="#0f172a">{viewingWaybill.projectName}</Text>
                <Text color="#64748b" mt={2}>Site Drop Point:</Text>
                <Text fontWeight="bold" color="#0f172a">{viewingWaybill.destinationSite}</Text>
              </Box>
            </SimpleGrid>

            {/* Line Items */}
            <Table.Root size="sm" variant="outline" mb={4}>
              <Table.Header>
                <Table.Row bg="#f1f5f9">
                  <Table.ColumnHeader fontSize="10px">Item #</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Material Description</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Dispatched Qty</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Received Qty</Table.ColumnHeader>
                  <Table.ColumnHeader fontSize="10px">Condition</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {viewingWaybill.items.map((i, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell fontSize="xs">{idx + 1}</Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="semibold">{i.itemName}</Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold">{i.quantityDispatched} {i.unit}</Table.Cell>
                    <Table.Cell fontSize="xs">{i.quantityReceived ?? i.quantityDispatched} {i.unit}</Table.Cell>
                    <Table.Cell fontSize="xs"><Badge size="xs" colorPalette="green">{i.condition || 'Sound'}</Badge></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            {/* Signatures */}
            <SimpleGrid columns={3} gap={3} pt={4} borderTop="1px dashed #cbd5e1" textAlign="center" fontSize="xs">
              <Box border="1px dashed #cbd5e1" p={2} borderRadius="8px">
                <Text color="#64748b" fontSize="10px">DISPATCHED BY:</Text>
                <Text fontWeight="bold" color="#0f172a" mt={2}>{viewingWaybill.dispatchedBy}</Text>
                <Text fontSize="9px" color="#94a3b8">Head Storekeeper</Text>
              </Box>
              <Box border="1px dashed #cbd5e1" p={2} borderRadius="8px">
                <Text color="#64748b" fontSize="10px">TRANSPORTER DRIVER:</Text>
                <Text fontWeight="bold" color="#0f172a" mt={2}>{viewingWaybill.carrierName}</Text>
                <Text fontSize="9px" color="#94a3b8">{viewingWaybill.vehicleNumber}</Text>
              </Box>
              <Box border="1px dashed #cbd5e1" p={2} borderRadius="8px">
                <Text color="#64748b" fontSize="10px">RECEIVED ON SITE BY:</Text>
                <Text fontWeight="bold" color="#0f172a" mt={2}>{viewingWaybill.receivedBy || 'Pending Offloading'}</Text>
                <Text fontSize="9px" color="#94a3b8">{viewingWaybill.receivedDate || 'In Transit'}</Text>
              </Box>
            </SimpleGrid>

            {/* Actions */}
            <Flex justify="flex-end" gap={2} mt={5}>
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Printer size={15} /> Print Delivery Note
              </Button>
              <Button size="sm" colorPalette="blue" onClick={() => setViewingWaybill(null)}>
                Close
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
