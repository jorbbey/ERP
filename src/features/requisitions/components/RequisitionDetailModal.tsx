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
  FileText,
  HelpCircle,
  Users,
  Check,
  X,
  CornerDownRight
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
    flagRequisitionForClarification,
    provideRequisitionClarification,
    addRequisitionMessage,
    activeCompany,
    currentUserName,
    activeRole,
    employees
  } = useERP();

  const [messageText, setMessageText] = useState('');
  
  // Action modals/states
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagQuery, setFlagQuery] = useState('');

  const [showClarifyInput, setShowClarifyInput] = useState(false);
  const [clarificationResponse, setClarificationResponse] = useState('');

  const [showApproveInput, setShowApproveInput] = useState(false);
  const [approveComment, setApproveComment] = useState('Approved for project site operations.');

  // Check authorization
  const currentEmp = employees.find(e => (e.name || '').toLowerCase() === (currentUserName || '').toLowerCase());
  const isTaggedApprover = Boolean(
    requisition.approvers?.some(a => (a.name || '').toLowerCase() === (currentUserName || '').toLowerCase() || (currentEmp && a.id === currentEmp.id)) ||
    (currentEmp && requisition.approverIds?.includes(currentEmp.id))
  );

  const isRoleAuthorized = ['Managing Director', 'Finance Manager', 'Super Admin', 'Department Head', 'Project Manager'].includes(activeRole);
  const canDecide = isRoleAuthorized || isTaggedApprover;
  const canDispatch = ['Store Officer', 'Head Store Keeper', 'Procurement Officer', 'Managing Director', 'Super Admin'].includes(activeRole);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    updateRequisitionStatus(requisition.id, 'Approved', approveComment.trim() || 'Approved by authorized executive reviewer.');
    setShowApproveInput(false);
  };

  const handleFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagQuery.trim()) return;
    flagRequisitionForClarification(requisition.id, flagQuery.trim());
    setFlagQuery('');
    setShowFlagInput(false);
  };

  const handleClarify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationResponse.trim()) return;
    provideRequisitionClarification(requisition.id, clarificationResponse.trim());
    setClarificationResponse('');
    setShowClarifyInput(false);
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    updateRequisitionStatus(requisition.id, 'Rejected', rejectReason.trim());
    setRejectReason('');
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
      case 'Flagged for Clarification':
        return 'yellow';
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

  const isPending = requisition.status === 'Pending Review';
  const isFlagged = requisition.status === 'Flagged for Clarification';

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={{ base: 2, sm: 4 }}>
      <Box bg="white" borderRadius="16px" maxW="840px" w="100%" p={{ base: 4, sm: 6 }} boxShadow="2xl" maxH="92vh" overflowY="auto">
        {/* Top Header */}
        <Flex justify="space-between" align="flex-start" borderBottom="1px solid #e2e8f0" pb={4} mb={4}>
          <Box>
            <Flex align="center" gap={2} flexWrap="wrap">
              <Badge size="sm" colorPalette="blue" fontFamily="mono">{requisition.requisitionNo}</Badge>
              <Badge size="sm" colorPalette={getStatusColor(requisition.status)} variant="solid">
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

            {/* Tagged Approvers Display */}
            <Flex align="center" gap={1.5} mt={2} flexWrap="wrap">
              <Users size={14} color="#64748b" />
              <Text fontSize="xs" color="#64748b" fontWeight="medium">Tagged Approvers:</Text>
              {requisition.approvers && requisition.approvers.length > 0 ? (
                requisition.approvers.map((a) => (
                  <Badge key={a.id} size="xs" colorPalette="blue" variant="subtle">
                    {a.name} ({a.role})
                  </Badge>
                ))
              ) : (
                <Badge size="xs" colorPalette="gray">Executive Management Board</Badge>
              )}
            </Flex>
          </Box>

          <Flex gap={2}>
            <Button size="xs" variant="outline" borderColor="#cbd5e1" onClick={() => onOpenPrintVoucher(requisition)}>
              <Printer size={14} /> Print Voucher
            </Button>
            <Button size="xs" variant="ghost" onClick={onClose}>
              <X size={16} />
            </Button>
          </Flex>
        </Flex>

        {/* Action / Decision Status Bar */}
        <Card.Root bg="#f8fafc" borderRadius="12px" p={3.5} border="1px solid #e2e8f0" mb={4}>
          <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
            <Box>
              <Text fontSize="11px" fontWeight="bold" color="#64748b" textTransform="uppercase">
                Review & Workflow Decision
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                {isPending && 'Awaiting management review and verification.'}
                {isFlagged && 'Action Required: Clarification requested by reviewing officer.'}
                {requisition.status === 'Approved' && `Approved by ${requisition.approvedBy} on ${requisition.approvalDate}.`}
                {requisition.status === 'Rejected' && `Rejected by management: ${requisition.rejectionReason}`}
                {requisition.status === 'Dispatched' && 'Dispatched from stores for site delivery.'}
              </Text>
            </Box>

            {/* Actions for Authorized Users */}
            <Flex gap={2} flexWrap="wrap">
              {(isPending || isFlagged) && canDecide && (
                <>
                  <Button
                    size="xs"
                    colorPalette="green"
                    onClick={() => {
                      setShowApproveInput(true);
                      setShowFlagInput(false);
                      setShowRejectInput(false);
                    }}
                  >
                    <CheckCircle2 size={14} /> Approve
                  </Button>

                  <Button
                    size="xs"
                    colorPalette="yellow"
                    variant="outline"
                    onClick={() => {
                      setShowFlagInput(true);
                      setShowApproveInput(false);
                      setShowRejectInput(false);
                    }}
                  >
                    <AlertTriangle size={14} /> Flag for Clarification
                  </Button>

                  <Button
                    size="xs"
                    colorPalette="red"
                    variant="outline"
                    onClick={() => {
                      setShowRejectInput(true);
                      setShowApproveInput(false);
                      setShowFlagInput(false);
                    }}
                  >
                    <XCircle size={14} /> Reject
                  </Button>
                </>
              )}

              {isFlagged && (
                <Button
                  size="xs"
                  colorPalette="blue"
                  onClick={() => setShowClarifyInput(true)}
                >
                  <MessageSquare size={14} /> Provide Clarification
                </Button>
              )}

              {requisition.status === 'Approved' && canDispatch && (
                <Button size="xs" colorPalette="purple" onClick={() => onOpenDispatch(requisition)}>
                  <Truck size={14} /> Prepare Site Dispatch
                </Button>
              )}
            </Flex>
          </Flex>

          {/* Prompt: Flag for Clarification */}
          {showFlagInput && (
            <Box mt={3} p={3.5} bg="#fffbeb" borderRadius="8px" border="1px solid #fde68a">
              <Flex align="center" gap={1.5} mb={1}>
                <AlertTriangle size={14} color="#d97706" />
                <Text fontSize="xs" fontWeight="bold" color="#b45309">
                  Flag Requisition for Clarification
                </Text>
              </Flex>
              <Text fontSize="11px" color="#92400e" mb={2}>
                State the question or missing details for the requester. This will not approve or reject the request, but requests a response before decisions are finalized.
              </Text>
              <form onSubmit={handleFlag}>
                <Flex gap={2}>
                  <Input
                    size="sm"
                    placeholder="e.g. Please clarify exact concrete mix grade and pier cap pour schedule..."
                    value={flagQuery}
                    onChange={(e) => setFlagQuery(e.target.value)}
                    bg="white"
                    required
                  />
                  <Button size="sm" colorPalette="yellow" type="submit">Submit Flag</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowFlagInput(false)}>Cancel</Button>
                </Flex>
              </form>
            </Box>
          )}

          {/* Prompt: Provide Clarification */}
          {showClarifyInput && (
            <Box mt={3} p={3.5} bg="#eff6ff" borderRadius="8px" border="1px solid #bfdbfe">
              <Flex align="center" gap={1.5} mb={1}>
                <MessageSquare size={14} color="#2563eb" />
                <Text fontSize="xs" fontWeight="bold" color="#1e40af">
                  Submit Clarification Response
                </Text>
              </Flex>
              <Text fontSize="11px" color="#1e3a8a" mb={2}>
                Provide the requested explanations or technical notes. This will return the requisition status to Pending Review.
              </Text>
              <form onSubmit={handleClarify}>
                <Flex gap={2}>
                  <Input
                    size="sm"
                    placeholder="e.g. Specification confirmed as Grade 42.5N per structural drawing S-04 revision B."
                    value={clarificationResponse}
                    onChange={(e) => setClarificationResponse(e.target.value)}
                    bg="white"
                    required
                  />
                  <Button size="sm" colorPalette="blue" type="submit">Send Response</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowClarifyInput(false)}>Cancel</Button>
                </Flex>
              </form>
            </Box>
          )}

          {/* Prompt: Confirm Approval with Remarks */}
          {showApproveInput && (
            <Box mt={3} p={3.5} bg="#f0fdf4" borderRadius="8px" border="1px solid #bbf7d0">
              <Flex align="center" gap={1.5} mb={1}>
                <CheckCircle2 size={14} color="#16a34a" />
                <Text fontSize="xs" fontWeight="bold" color="#166534">
                  Confirm Executive Approval
                </Text>
              </Flex>
              <form onSubmit={handleApprove}>
                <Flex gap={2}>
                  <Input
                    size="sm"
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                    bg="white"
                  />
                  <Button size="sm" colorPalette="green" type="submit">Confirm Approval</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowApproveInput(false)}>Cancel</Button>
                </Flex>
              </form>
            </Box>
          )}

          {/* Prompt: Rejection */}
          {showRejectInput && (
            <Box mt={3} p={3.5} bg="#fef2f2" borderRadius="8px" border="1px solid #fecaca">
              <Flex align="center" gap={1.5} mb={1}>
                <XCircle size={14} color="#dc2626" />
                <Text fontSize="xs" fontWeight="bold" color="#b91c1c">
                  State Reason for Rejection *
                </Text>
              </Flex>
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
                  <Button size="sm" variant="ghost" onClick={() => setShowRejectInput(false)}>Cancel</Button>
                </Flex>
              </form>
            </Box>
          )}
        </Card.Root>

        {/* Active Flag Alert Banner if currently flagged */}
        {isFlagged && (
          <Box p={3.5} mb={4} bg="#fefce8" border="1px solid #fef08a" borderRadius="10px">
            <Flex align="flex-start" gap={2}>
              <AlertTriangle size={18} color="#ca8a04" style={{ flexShrink: 0, marginTop: '2px' }} />
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#854d0e">
                  Flagged for Clarification by {requisition.flaggedBy || 'Reviewer'} ({requisition.flaggedDate || 'Pending'}):
                </Text>
                <Text fontSize="xs" color="#a16207" mt={0.5}>
                  "{requisition.flagReason}"
                </Text>
              </Box>
            </Flex>
          </Box>
        )}

        {/* Requested Items Table */}
        <Flex justify="space-between" align="center" mb={2}>
          <Heading size="xs" color="#334155" textTransform="uppercase">
            Requested Material & Works Line Items ({requisition.items.length})
          </Heading>
          {requisition.supplier && (
            <Text fontSize="xs" color="#64748b">
              Supplier / Source: <Text as="span" fontWeight="bold" color="#0f172a">{requisition.supplier}</Text>
            </Text>
          )}
        </Flex>

        <Box overflowX="auto" mb={4}>
          <Table.Root size="sm" variant="outline" minW="600px">
            <Table.Header>
              <Table.Row bg="#f8fafc">
                <Table.ColumnHeader fontSize="10px">SKU / Type</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Item or Service Description</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Unit</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Req Qty</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Dispatched</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Est. Rate</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Total Value</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {requisition.items.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell fontSize="xs">
                    {item.inventoryItemId ? (
                      <Badge size="xs" colorPalette="blue" fontFamily="mono">{item.itemCode || 'MAT'}</Badge>
                    ) : (
                      <Badge size="xs" colorPalette="purple">CUSTOM / SERVICE</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell fontSize="xs">
                    <Text fontWeight="semibold" color="#0f172a">{item.itemName}</Text>
                    {item.description && (
                      <Text fontSize="10px" color="#64748b">{item.description}</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell fontSize="xs">{item.unit}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold">{item.quantityRequired}</Table.Cell>
                  <Table.Cell fontSize="xs" color={item.quantityDispatched ? '#16a34a' : '#94a3b8'}>
                    {item.quantityDispatched || 0}
                  </Table.Cell>
                  <Table.Cell fontSize="xs">
                    {item.price !== undefined && item.price !== null && !isNaN(Number(item.price))
                      ? `${activeCompany.currency} ${(Number(item.price) || 0).toFixed(2)}`
                      : <Text as="span" color="#94a3b8">Unpriced</Text>}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color={item.value ? '#16a34a' : '#94a3b8'}>
                    {item.value !== undefined && item.value !== null
                      ? `${activeCompany.currency} ${item.value.toLocaleString()}`
                      : 'Unpriced'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Financial Summary & Technical Purpose */}
        <Flex justify="space-between" align="center" p={3.5} bg="#f8fafc" borderRadius="10px" mb={4} fontSize="xs" border="1px solid #e2e8f0">
          <Box maxW="500px">
            <Text color="#64748b" fontWeight="bold">Purpose / Site Remarks:</Text>
            <Text color="#0f172a" mt={0.5}>{requisition.remarks || 'Standard project site work package allocation.'}</Text>
          </Box>
          <Box textAlign="right">
            <Text color="#64748b" textTransform="uppercase" fontSize="10px">Total Estimated Requisition</Text>
            <Text fontSize="lg" fontWeight="black" color={requisition.totalEstimatedAmount ? '#16a34a' : '#64748b'}>
              {requisition.totalEstimatedAmount
                ? `${activeCompany.currency} ${requisition.totalEstimatedAmount.toLocaleString()}`
                : 'Unpriced Requisition'}
            </Text>
          </Box>
        </Flex>

        {/* Approval Activity Timeline */}
        <Card.Root bg="white" borderRadius="12px" p={4} border="1px solid #e2e8f0" mb={4}>
          <Heading size="xs" color="#334155" textTransform="uppercase" mb={3} display="flex" alignItems="center" gap={1.5}>
            <ShieldCheck size={16} color="#2563eb" /> Approval Activity Audit Timeline
          </Heading>

          <Stack gap={2.5}>
            {requisition.approvalHistory?.map((step) => {
              const isApprove = step.action === 'Approved';
              const isFlag = step.action === 'Flagged for Clarification';
              const isClarify = step.action === 'Clarification Provided';
              const isReject = step.action === 'Rejected';

              return (
                <Flex key={step.id} justify="space-between" align="flex-start" fontSize="xs" py={1.5} borderBottom="1px dashed #f1f5f9">
                  <Box>
                    <Flex align="center" gap={1.5}>
                      <Badge
                        size="xs"
                        colorPalette={
                          isApprove ? 'green' :
                          isFlag ? 'yellow' :
                          isClarify ? 'blue' :
                          isReject ? 'red' : 'gray'
                        }
                      >
                        {step.action}
                      </Badge>
                      <Text fontWeight="semibold" color="#0f172a">
                        By {step.actorName} ({step.actorRole})
                      </Text>
                    </Flex>
                    {step.comments && (
                      <Text fontSize="11px" color="#475569" mt={0.5} pl={1}>
                        "{step.comments}"
                      </Text>
                    )}
                  </Box>
                  <Text fontSize="10px" color="#94a3b8" whiteSpace="nowrap" fontFamily="mono">
                    {step.timestamp}
                  </Text>
                </Flex>
              );
            })}
          </Stack>
        </Card.Root>

        {/* Dedicated Temporary Group Discussion Conversation */}
        <Card.Root bg="white" borderRadius="12px" p={4} border="1px solid #e2e8f0">
          <Flex justify="space-between" align="center" mb={2}>
            <Flex align="center" gap={2}>
              <MessageSquare size={16} color="#2563eb" />
              <Heading size="xs" color="#0f172a" textTransform="uppercase">
                Dedicated Requisition Coordination Chat ({requisition.messages?.length || 0})
              </Heading>
            </Flex>
            <Badge size="xs" colorPalette="blue">
              Linked to {requisition.requisitionNo}
            </Badge>
          </Flex>

          <Text fontSize="11px" color="#64748b" mb={3}>
            Direct dialogue between requester ({requisition.requestedBy}) and designated approvers.
          </Text>

          <Stack gap={2} maxH="180px" overflowY="auto" mb={3} p={2.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
            {(!requisition.messages || requisition.messages.length === 0) ? (
              <Text fontSize="xs" color="#94a3b8" textAlign="center" py={2}>
                No messages posted yet. Post notes or queries below.
              </Text>
            ) : (
              requisition.messages.map((m) => {
                const isSys = m.isSystemEvent || m.userName === 'Apex System' || m.role === 'System Notification';
                return (
                  <Box
                    key={m.id}
                    bg={isSys ? '#f0f9ff' : 'white'}
                    p={2.5}
                    borderRadius="8px"
                    border={`1px solid ${isSys ? '#bae6fd' : '#e2e8f0'}`}
                    fontSize="xs"
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontWeight="bold" color={isSys ? '#0369a1' : '#0f172a'}>
                        {m.userName} <Badge size="xs" colorPalette={isSys ? 'cyan' : 'blue'} ml={1}>{m.role}</Badge>
                      </Text>
                      <Text fontSize="10px" color="#94a3b8">{m.createdAt}</Text>
                    </Flex>
                    <Text color="#334155">{m.message}</Text>
                  </Box>
                );
              })
            )}
          </Stack>

          <form onSubmit={handleSendMessage}>
            <Flex gap={2}>
              <Input
                size="sm"
                placeholder="Post a query, site delivery update, or note to this group..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button size="sm" colorPalette="blue" type="submit">
                <Send size={14} /> Send Note
              </Button>
            </Flex>
          </form>
        </Card.Root>
      </Box>
    </Box>
  );
};
