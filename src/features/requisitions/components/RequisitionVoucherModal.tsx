import React from 'react';
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
import { Requisition } from '../../../types';
import { Printer, X } from 'lucide-react';

interface RequisitionVoucherModalProps {
  requisition: Requisition;
  onClose: () => void;
}

export const RequisitionVoucherModal: React.FC<RequisitionVoucherModalProps> = ({ requisition, onClose }) => {
  const { activeCompany } = useERP();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="white" borderRadius="16px" maxW="700px" w="100%" p={8} boxShadow="2xl" maxH="90vh" overflowY="auto">
        {/* Printable Header */}
        <Flex justify="space-between" align="flex-start" borderBottom="2px solid #0f172a" pb={4} mb={4}>
          <Box>
            <Heading size="md" color="#0f172a" textTransform="uppercase">{activeCompany.name}</Heading>
            <Text fontSize="xs" fontWeight="bold" color="#2563eb">INTERNAL MATERIAL REQUISITION VOUCHER</Text>
            <Text fontSize="10px" color="#64748b">Site Operations & Stores Issuance Authorization</Text>
          </Box>
          <Box textAlign="right">
            <Badge size="sm" colorPalette="blue" fontFamily="mono" fontSize="xs">{requisition.requisitionNo}</Badge>
            <Text fontSize="10px" color="#64748b" mt={1}>Date: {requisition.requisitionDate}</Text>
            <Badge size="xs" colorPalette={requisition.priority === 'Urgent' ? 'red' : 'gray'} mt={1}>
              {requisition.priority}
            </Badge>
          </Box>
        </Flex>

        {/* Requisition Meta Info */}
        <SimpleGrid columns={2} gap={4} fontSize="xs" mb={4} p={3} bg="#f8fafc" borderRadius="10px">
          <Box>
            <Text color="#64748b">Project Name:</Text>
            <Text fontWeight="bold" color="#0f172a">{requisition.projectName}</Text>
            <Text color="#64748b" mt={2}>Trade Section:</Text>
            <Text fontWeight="semibold" color="#0f172a">{requisition.trade || 'General Civil Works'}</Text>
          </Box>
          <Box>
            <Text color="#64748b">Requested By:</Text>
            <Text fontWeight="bold" color="#0f172a">{requisition.requestedBy} ({requisition.department})</Text>
            <Text color="#64748b" mt={2}>Approval Authority:</Text>
            <Text fontWeight="semibold" color="#0f172a">{requisition.approvedBy || 'Pending Executive Review'}</Text>
          </Box>
        </SimpleGrid>

        {/* Line Items */}
        <Table.Root size="sm" variant="outline" mb={4}>
          <Table.Header>
            <Table.Row bg="#f1f5f9">
              <Table.ColumnHeader fontSize="10px">#</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">SKU Code</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Description of Materials</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Unit</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Qty Req.</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Qty To Buy</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Est. Rate</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Total</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {requisition.items.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell fontSize="xs">{idx + 1}</Table.Cell>
                <Table.Cell fontSize="xs" fontFamily="mono">{item.itemCode || 'MAT-GEN'}</Table.Cell>
                <Table.Cell fontSize="xs" fontWeight="semibold">{item.itemName}</Table.Cell>
                <Table.Cell fontSize="xs">{item.unit}</Table.Cell>
                <Table.Cell fontSize="xs" fontWeight="bold">{item.quantityRequired}</Table.Cell>
                <Table.Cell fontSize="xs">{item.quantityToPurchase}</Table.Cell>
                <Table.Cell fontSize="xs">{activeCompany.currency} {item.price.toFixed(2)}</Table.Cell>
                <Table.Cell fontSize="xs" fontWeight="bold">
                  {activeCompany.currency} {(item.value || (item.quantityRequired * item.price)).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Grand Total */}
        <Flex justify="space-between" align="center" p={3} bg="#f8fafc" borderRadius="8px" mb={6} fontSize="xs">
          <Text color="#64748b">Remarks: {requisition.remarks || 'Standard requisition for approved contract package.'}</Text>
          <Box textAlign="right">
            <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Total Requisition Cost</Text>
            <Text fontSize="lg" fontWeight="black" color="#16a34a">
              {activeCompany.currency} {requisition.totalEstimatedAmount.toLocaleString()}
            </Text>
          </Box>
        </Flex>

        {/* Official Signatures */}
        <SimpleGrid columns={3} gap={4} pt={4} borderTop="1px dashed #cbd5e1" textAlign="center" fontSize="xs">
          <Box border="1px dashed #cbd5e1" p={2.5} borderRadius="8px">
            <Text color="#64748b" fontSize="10px">REQUESTED BY:</Text>
            <Text fontWeight="bold" color="#0f172a" mt={3}>{requisition.requestedBy}</Text>
            <Text fontSize="9px" color="#94a3b8">Site Engineer / QS</Text>
          </Box>
          <Box border="1px dashed #cbd5e1" p={2.5} borderRadius="8px">
            <Text color="#64748b" fontSize="10px">CHECKED & VERIFIED BY:</Text>
            <Text fontWeight="bold" color="#0f172a" mt={3}>Stores & Logistics</Text>
            <Text fontSize="9px" color="#94a3b8">Inventory Controller</Text>
          </Box>
          <Box border="1px dashed #cbd5e1" p={2.5} borderRadius="8px">
            <Text color="#64748b" fontSize="10px">APPROVED BY:</Text>
            <Text fontWeight="bold" color="#0f172a" mt={3}>{requisition.approvedBy || 'Pending Signature'}</Text>
            <Text fontSize="9px" color="#94a3b8">Managing Director / PM</Text>
          </Box>
        </SimpleGrid>

        {/* Buttons */}
        <Flex justify="flex-end" gap={2} mt={6}>
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer size={15} /> Print Voucher
          </Button>
          <Button size="sm" colorPalette="blue" onClick={onClose}>
            Close
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
