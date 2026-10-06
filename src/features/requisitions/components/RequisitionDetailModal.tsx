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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Requisition, RequisitionItem } from '../../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  MessageSquare,
  Truck,
  Send,
  User,
  ShieldCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface RequisitionDetailModalProps {
  requisition: Requisition;
  onClose: () => void;
  onOpenPrintVoucher: (req: Requisition) => void;
  onOpenDispatch: (req: Requisition) => void;
}

export const RequisitionDetailModal: React.FC<RequisitionDetailModalProps> = ({
  requisition,
  onClose,
  onOpenPrintVoucher,
  onOpenDispatch
}) => {
  const {
    updateRequisitionStatus,
    addRequisitionMessage,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [messageText, setMessageText] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const canApprove = ['Managing Director', 'Finance Manager', 'Super Admin', 'Project Manager'].includes(activeRole);
  const canDispatch = ['Store Officer', 'Head Store Keeper', 'Procurement Officer', 'Managing Director', 'Super Admin'].includes(activeRole);

  const handleApprove = () => {
    updateRequisitionStatus(requisition.id, 'Approved', 'Approved by authorized executive management.');
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    updateRequisitionStatus(requisition.id, 'Rejected', rejectReason.trim());
    setShowRejectInput(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    addRequisitionMessage(requisition.id, messageText.trim());
    setMessageText('');
  };

  const getStatusColor = (status: Requisition['status']) => {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Pending Review':
        return 'orange';
      case 'Dispatched':
        return 'purple';
      case 'Delivered':
        return 'teal';
      case 'Rejected':
      case 'Cancelled':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="white" borderRadius="16px" maxW="780px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
        {/* Top Header */}
        <Flex justify="space-between" align="flex-start" borderBottom="1px solid #e2e8f0" pb={4} mb={4}>
          <Box>
            <Flex align="center" gap={2}>
              <Badge size="sm" colorPalette="blue" fontFamily="mono">{requisition.requisitionNo}</Badge>
              <Badge size="sm" colorPalette={getStatusColor(requisition.status)}>
                {requisition.status.toUpperCase()}
              </Badge>
              <Badge size="xs" colorPalette={requisition.priority === 'Urgent' ? 'red' : 'gray'}>
                {requisition.priority} PRIORITY
              </Badge>
            </Flex>
            <Heading size="md" color="#0f172a" mt={2}>{requisition.title}</Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Project: <Text as="span" fontWeight="bold" color="#2563eb">{requisition.projectName}</Text> • Requested by: <Text as="span" fontWeight="semibold" color="#0f172a">{requisition.requestedBy}</Text> ({requisition.department})
            </Text>
          </Box>

          <Flex gap={2}>
            <Button size="xs" variant="outline" borderColor="#cbd5e1" onClick={() => onOpenPrintVoucher(requisition)}>
              <Printer size={14} /> Print Voucher
            </Button>
            <Button size="xs" variant="ghost" onClick={onClose}>Close</Button>
          </Flex>
        </Flex>

        {/* Approval / Workflow Action Bar */}
        <Flex justify="space-between" align="center" bg="#f8fafc" p={3} borderRadius="10px" border="1px solid #e2e8f0" mb={4} flexWrap="wrap" gap={2}>
          <Box>
            <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase">Workflow Action State</Text>
            <Text fontSize="xs" fontWeight="semibold" color="#0f172a">
              {requisition.status === 'Pending Review' ? 'Awaiting Management Verification' : `Current Status: ${requisition.status}`}
            </Text>
          </Box>

          <Flex gap={2}>
            {requisition.status === 'Pending Review' && canApprove && (
              <>
                <Button size="xs" colorPalette="red" variant="outline" onClick={() => setShowRejectInput(true)}>
                  <XCircle size={14} /> Reject Request
                </Button>
                <Button size="xs" colorPalette="green" onClick={handleApprove}>
                  <CheckCircle2 size={14} /> Executive Approve
                </Button>
              </>
            )}

            {requisition.status === 'Approved' && canDispatch && (
              <Button size="xs" colorPalette="purple" onClick={() => onOpenDispatch(requisition)}>
                <Truck size={14} /> Prepare Site Dispatch
              </Button>
            )}
          </Flex>
        </Flex>

        {/* Rejection Input Box if triggered */}
        {showRejectInput && (
          <Box p={4} mb={4} bg="#fef2f2" borderRadius="10px" border="1px solid #fecaca">
            <Text fontSize="xs" fontWeight="bold" color="#b91c1c" mb={1}>State Reason for Rejection *</Text>
            <form onSubmit={handleReject}>
              <Flex gap={2}>
                <Input
                  size="sm"
                  placeholder="e.g. Current stock at Central Yard suffices for this operation"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  bg="white"
                  required
                />
                <Button size="sm" colorPalette="red" type="submit">Confirm Rejection</Button>
                <Button size="sm" variant="outline" onClick={() => setShowRejectInput(false)}>Cancel</Button>
              </Flex>
            </form>
          </Box>
        )}

        {/* Line Items Table */}
        <Heading size="xs" color="#334155" textTransform="uppercase" mb={2}>
          Requested Material Line Items ({requisition.items.length})
        </Heading>
        <Table.Root size="sm" variant="outline" mb={4}>
          <Table.Header>
            <Table.Row bg="#f8fafc">
              <Table.ColumnHeader fontSize="10px">SKU</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Description</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Unit</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Req Qty</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">In Stock</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">To Buy</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Est. Rate</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Total Value</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {requisition.items.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">{item.itemCode || 'MAT-GEN'}</Table.Cell>
                <Table.Cell fontSize="xs" fontWeight="semibold">{item.itemName}</Table.Cell>
                <Table.Cell fontSize="xs">{item.unit}</Table.Cell>
                <Table.Cell fontSize="xs" fontWeight="bold">{item.quantityRequired}</Table.Cell>
                <Table.Cell fontSize="xs" color="#16a34a">{item.quantityInStock}</Table.Cell>
                <Table.Cell fontSize="xs" color="#d97706">{item.quantityToPurchase}</Table.Cell>
                <Table.Cell fontSize="xs">{activeCompany.currency} {item.price.toFixed(2)}</Table.Cell>
                <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                  {activeCompany.currency} {(item.value || (item.quantityRequired * item.price)).toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Financial Summary & Remarks */}
        <Flex justify="space-between" align="center" p={3} bg="#f8fafc" borderRadius="10px" mb={4} fontSize="xs">
          <Box maxW="450px">
            <Text color="#64748b" fontWeight="bold">Site Technical Remarks:</Text>
            <Text color="#0f172a" mt={0.5}>{requisition.remarks || 'Standard work package bill of materials.'}</Text>
          </Box>
          <Box textAlign="right">
            <Text color="#64748b" textTransform="uppercase" fontSize="10px">Total Estimated Commitment</Text>
            <Text fontSize="lg" fontWeight="black" color="#16a34a">
              {activeCompany.currency} {requisition.totalEstimatedAmount.toLocaleString()}
            </Text>
          </Box>
        </Flex>

        {/* Approval History Log */}
        {requisition.approvalHistory && requisition.approvalHistory.length > 0 && (
          <Box mb={4} p={3} borderRadius="10px" border="1px solid #e2e8f0" bg="#f8fafc">
            <Heading size="xs" color="#334155" textTransform="uppercase" mb={2}>
              Approval & Audit Timeline
            </Heading>
            <Stack gap={2}>
              {requisition.approvalHistory.map((step) => (
                <Flex key={step.id} justify="space-between" fontSize="xs" py={1} borderBottom="1px dashed #e2e8f0">
                  <Box>
                    <Text fontWeight="semibold" color="#0f172a">
                      {step.action}: <Text as="span" fontWeight="normal" color="#64748b">{step.comments || 'No remarks'}</Text>
                    </Text>
                    <Text fontSize="10px" color="#94a3b8">By {step.actorName} ({step.actorRole}) • {step.level}</Text>
                  </Box>
                  <Text fontSize="10px" color="#94a3b8" whiteSpace="nowrap">{step.timestamp}</Text>
                </Flex>
              ))}
            </Stack>
          </Box>
        )}

        {/* Threaded Discussion / Messages */}
        <Box borderTop="1px solid #e2e8f0" pt={4}>
          <Flex align="center" gap={2} mb={3}>
            <MessageSquare size={16} color="#2563eb" />
            <Heading size="xs" color="#0f172a" textTransform="uppercase">
              Requisition Discussion & Coordination Thread ({requisition.messages?.length || 0})
            </Heading>
          </Flex>

          <Stack gap={2} maxH="160px" overflowY="auto" mb={3} p={2} bg="#f8fafc" borderRadius="8px">
            {(!requisition.messages || requisition.messages.length === 0) ? (
              <Text fontSize="xs" color="#94a3b8" textAlign="center" py={2}>
                No messages posted yet. Post coordination notes below.
              </Text>
            ) : (
              requisition.messages.map((m) => (
                <Box key={m.id} bg="white" p={2.5} borderRadius="8px" border="1px solid #e2e8f0" fontSize="xs">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="bold" color="#0f172a">
                      {m.userName} <Badge size="xs" colorPalette="blue" ml={1}>{m.role}</Badge>
                    </Text>
                    <Text fontSize="10px" color="#94a3b8">{m.createdAt}</Text>
                  </Flex>
                  <Text color="#334155">{m.message}</Text>
                </Box>
              ))
            )}
          </Stack>

          <form onSubmit={handleSendMessage}>
            <Flex gap={2}>
              <Input
                size="sm"
                placeholder="Post a query or delivery clarification note to this requisition thread..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button size="sm" colorPalette="blue" type="submit">
                <Send size={14} /> Send Note
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
