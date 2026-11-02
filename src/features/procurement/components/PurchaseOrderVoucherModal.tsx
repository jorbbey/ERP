import React from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Table,
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { PurchaseOrder } from '../../../types';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PurchaseOrderVoucherModalProps {
  po: PurchaseOrder;
  onClose: () => void;
}

export const PurchaseOrderVoucherModal: React.FC<PurchaseOrderVoucherModalProps> = ({ po, onClose }) => {
  const { activeCompany } = useERP();
  const currency = activeCompany?.currency || '₦';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.65)" zIndex="1200" display="flex" alignItems="center" justifyContent="center" p={{ base: 2, sm: 4 }}>
      <Box bg="white" borderRadius="16px" maxW="780px" w="100%" p={{ base: 4, sm: 6, md: 8 }} boxShadow="2xl" maxH="90vh" overflowY="auto">
        {/* Printable Header */}
        <Flex justify="space-between" align="flex-start" borderBottom="2px solid #0f172a" pb={4} mb={4} flexWrap="wrap" gap={2}>
          <Box>
            <Heading size="md" color="#0f172a" textTransform="uppercase">{activeCompany?.name || 'APEX CONSTRUCTION & CIVIL ENGINEERING'}</Heading>
            <Text fontSize="xs" fontWeight="bold" color="#2563eb">OFFICIAL PURCHASE ORDER & VENDOR CONTRACT</Text>
            <Text fontSize="10px" color="#64748b">Procurement, Logistics & Supply Chain Authorization</Text>
          </Box>
          <Box textAlign={{ base: 'left', sm: 'right' }}>
            <Badge size="sm" colorPalette="blue" fontFamily="mono" fontSize="xs">{po.poNumber}</Badge>
            <Text fontSize="10px" color="#64748b" mt={1}>Order Date: {po.orderDate}</Text>
            <Badge size="xs" colorPalette={po.status === 'approved' ? 'green' : po.status === 'received' ? 'cyan' : 'orange'} mt={1}>
              {po.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </Box>
        </Flex>

        {/* PO Meta Info */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} fontSize="xs" mb={4} p={3.5} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
          <Box>
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b">Vendor / Supplier:</Text>
            <Text fontWeight="bold" color="#0f172a" fontSize="sm">{po.supplierName}</Text>
            <Text color="#475569">{po.supplierAddress || 'Commercial Industrial Zone, Lagos'}</Text>
            <Text color="#64748b" mt={1}>Tel: {po.supplierPhone || '+234 803 555 0192'}</Text>
            <Text color="#64748b">Payment Terms: <Text as="span" fontWeight="semibold" color="#0f172a">{po.paymentTerms}</Text></Text>
          </Box>
          <Box>
            <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#64748b">Delivery Site / Destination:</Text>
            <Text fontWeight="bold" color="#0f172a" fontSize="sm">{po.projectName || 'Central Civil Stores'}</Text>
            <Text color="#475569">{po.deliveryAddress || 'Site Receiving Gate 2, Main Storage Yard'}</Text>
            <Text color="#64748b" mt={1}>Expected Delivery: <Text as="span" fontWeight="semibold" color="#2563eb">{po.expectedDelivery}</Text></Text>
            {po.requisitionNo && (
              <Flex align="center" gap={1.5} mt={1}>
                <Text fontSize="10px" color="#64748b">Originating Requisition:</Text>
                <Badge size="xs" colorPalette="purple">{po.requisitionNo}</Badge>
              </Flex>
            )}
          </Box>
        </SimpleGrid>

        {/* Items Schedule */}
        <Box mb={4} overflowX="auto" border="1px solid #e2e8f0" borderRadius="10px">
          <Table.Root size="sm" variant="outline" minW="650px">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader fontSize="10px" w="40px">#</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Item Specification</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Qty</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="center">Unit</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Unit Rate ({currency})</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Tax %</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="right">Line Total ({currency})</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {po.items.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell fontSize="xs">{idx + 1}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="medium">
                    {item.description}
                    {item.itemCode && <Text as="span" fontSize="10px" color="#64748b" ml={1}>({item.itemCode})</Text>}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold">{(Number(item.quantity) || 0).toLocaleString()}</Table.Cell>
                  <Table.Cell fontSize="xs" textAlign="center">{item.unit || 'Units'}</Table.Cell>
                  <Table.Cell fontSize="xs" textAlign="right">{(Number(item.unitPrice) || 0).toLocaleString()}</Table.Cell>
                  <Table.Cell fontSize="xs" textAlign="right">{item.taxPercent || 0}%</Table.Cell>
                  <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold">{(Number(item.total) || 0).toLocaleString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Financial Summary */}
        <Flex justify="flex-end" mb={4}>
          <Box w={{ base: '100%', sm: '300px' }} fontSize="xs" p={3} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
            <Flex justify="space-between" py={1} borderBottom="1px solid #edf2f7">
              <Text color="#64748b">Subtotal Net Amount:</Text>
              <Text fontWeight="semibold">{currency} {(Number(po.subtotal) || Number(po.totalAmount) || 0).toLocaleString()}</Text>
            </Flex>
            {Boolean(po.discountAmount && po.discountAmount > 0) && (
              <Flex justify="space-between" py={1} borderBottom="1px solid #edf2f7" color="#16a34a">
                <Text>Commercial Discount:</Text>
                <Text>- {currency} {(Number(po.discountAmount) || 0).toLocaleString()}</Text>
              </Flex>
            )}
            {Boolean(po.taxAmount && po.taxAmount > 0) && (
              <Flex justify="space-between" py={1} borderBottom="1px solid #edf2f7">
                <Text color="#64748b">Value Added Tax (VAT):</Text>
                <Text fontWeight="semibold">+ {currency} {(Number(po.taxAmount) || 0).toLocaleString()}</Text>
              </Flex>
            )}
            <Flex justify="space-between" py={1.5} borderTop="2px solid #0f172a" fontSize="sm" fontWeight="black" color="#0f172a" mt={1}>
              <Text>TOTAL COMMITTED VALUE:</Text>
              <Text color="#2563eb">{currency} {(Number(po.totalAmount) || 0).toLocaleString()}</Text>
            </Flex>
          </Box>
        </Flex>

        {/* Quality Terms & Instructions */}
        <Box p={3} mb={5} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe" fontSize="10px" color="#1e40af">
          <Text fontWeight="bold" mb={0.5}>Commercial & Site Inspection Conditions:</Text>
          <Text>
            1. All delivered materials must conform to Nigerian Industrial Standards (NIS/BS) specifications and site QA testing.
            2. Goods Received Note (GRN) signed by authorized site receiving clerk is required for invoice clearance and 3-way payment matching.
            3. Quotation reference must be quoted on delivery waybills. Deliveries received Mon-Sat 08:00 - 17:00.
          </Text>
        </Box>

        {/* Approval Signatures & Stamp */}
        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4} pt={4} borderTop="1px solid #cbd5e1" textAlign="center" fontSize="xs">
          <Box>
            <Box h="40px" borderBottom="1px dashed #94a3b8" mb={2} display="flex" alignItems="flex-end" justifyContent="center">
              <Text fontSize="10px" color="#64748b" fontStyle="italic">Procurement Officer</Text>
            </Box>
            <Text fontWeight="bold" color="#0f172a">Originating Buyer</Text>
            <Text fontSize="10px" color="#64748b">Procurement Dept</Text>
          </Box>
          <Box>
            <Box h="40px" borderBottom="1px dashed #94a3b8" mb={2} display="flex" alignItems="flex-end" justifyContent="center">
              {po.status === 'approved' || po.status === 'received' ? (
                <Flex align="center" gap={1} color="#16a34a">
                  <CheckCircle2 size={13} />
                  <Text fontSize="10px" fontWeight="bold">{po.approvedBy || 'Managing Director'}</Text>
                </Flex>
              ) : (
                <Text fontSize="10px" color="#d97706" fontStyle="italic">Pending Executive Signoff</Text>
              )}
            </Box>
            <Text fontWeight="bold" color="#0f172a">Executive Authorizer</Text>
            <Text fontSize="10px" color="#64748b">Managing Director / CFO</Text>
          </Box>
          <Box>
            <Box h="40px" borderBottom="1px dashed #94a3b8" mb={2} display="flex" alignItems="flex-end" justifyContent="center">
              <Text fontSize="10px" color="#94a3b8" fontStyle="italic">Vendor Rep Signature & Stamp</Text>
            </Box>
            <Text fontWeight="bold" color="#0f172a">Supplier Acceptance</Text>
            <Text fontSize="10px" color="#64748b">{po.supplierName}</Text>
          </Box>
        </SimpleGrid>

        {/* Modal Actions */}
        <Flex justify="flex-end" gap={2} mt={6} pt={3} borderTop="1px solid #f1f5f9">
          <Button size="sm" variant="outline" onClick={onClose}>
            <X size={14} /> Close
          </Button>
          <Button size="sm" colorPalette="blue" onClick={handlePrint}>
            <Printer size={14} /> Print / Export Official PO
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
