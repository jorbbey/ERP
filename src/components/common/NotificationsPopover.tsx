import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Badge, Stack, Button } from '@chakra-ui/react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  ClipboardList, 
  Calendar, 
  ShoppingCart, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { requisitions, inventory, leaves, purchaseOrders } = useERP();

  if (!isOpen) return null;

  const pendingReqs = requisitions.filter(r => 
    r.status === 'Pending Review' || (r.status as string).includes('Pending')
  );
  const lowStock = inventory.filter(i => i.currentStock <= i.minLevel);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  const totalCount = pendingReqs.length + lowStock.length + pendingLeaves.length;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="999"
      onClick={onClose}
    >
      <Box
        position="absolute"
        top="58px"
        right={{ base: '12px', md: '120px' }}
        w={{ base: 'calc(100vw - 24px)', sm: '380px' }}
        maxW="400px"
        bg="#ffffff"
        borderRadius="14px"
        boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
        border="1px solid #cbd5e1"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Flex 
          justify="space-between" 
          align="center" 
          px={4} 
          py={3} 
          borderBottom="1px solid #e2e8f0"
          bg="#f8fafc"
        >
          <Flex align="center" gap={2}>
            <Bell size={16} color="#2563eb" />
            <Text fontSize="sm" fontWeight="bold" color="#0f172a">
              Operations Action Center
            </Text>
            {totalCount > 0 && (
              <Badge size="xs" colorPalette="orange" variant="solid">
                {totalCount} New
              </Badge>
            )}
          </Flex>
          <Box 
            as="button" 
            onClick={onClose} 
            p={1} 
            borderRadius="4px" 
            color="#64748b" 
            _hover={{ color: '#0f172a', bg: '#f1f5f9' }}
          >
            <X size={15} />
          </Box>
        </Flex>

        {/* Action Items List */}
        <Box maxH="380px" overflowY="auto" p={2.5}>
          {totalCount === 0 ? (
            <Box py={8} textAlign="center">
              <CheckCircle2 size={28} color="#10b981" style={{ margin: '0 auto 8px' }} />
              <Text fontSize="sm" fontWeight="medium" color="#0f172a">All Workflows Cleared</Text>
              <Text fontSize="xs" color="#64748b" mt={0.5}>No pending requisitions or low inventory warnings.</Text>
            </Box>
          ) : (
            <Stack gap={2}>
              {/* Pending Requisitions */}
              {pendingReqs.slice(0, 3).map(r => (
                <Box
                  key={r.id}
                  as="button"
                  w="100%"
                  textAlign="left"
                  p={2.5}
                  borderRadius="8px"
                  bg="#fffbeb"
                  border="1px solid #fef3c7"
                  _hover={{ bg: '#fef3c7' }}
                  onClick={() => handleNavigate('/requisitions')}
                >
                  <Flex justify="space-between" align="start">
                    <Flex gap={2} align="start">
                      <ClipboardList size={15} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#92400e">
                          Requisition {r.requisitionNo}
                        </Text>
                        <Text fontSize="11px" color="#b45309">
                          Awaiting review from {r.requestedBy} ({r.items.length} items)
                        </Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette="orange">Review</Badge>
                  </Flex>
                </Box>
              ))}

              {/* Low Stock Items */}
              {lowStock.slice(0, 3).map(i => (
                <Box
                  key={i.id}
                  as="button"
                  w="100%"
                  textAlign="left"
                  p={2.5}
                  borderRadius="8px"
                  bg="#fef2f2"
                  border="1px solid #fee2e2"
                  _hover={{ bg: '#fee2e2' }}
                  onClick={() => handleNavigate('/inventory')}
                >
                  <Flex justify="space-between" align="start">
                    <Flex gap={2} align="start">
                      <AlertTriangle size={15} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#991b1b">
                          Critical Stock: {i.name}
                        </Text>
                        <Text fontSize="11px" color="#b91c1c">
                          {i.currentStock} {i.unit} on hand (Min: {i.minLevel})
                        </Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette="red">Reorder</Badge>
                  </Flex>
                </Box>
              ))}

              {/* Pending Leave Requests */}
              {pendingLeaves.slice(0, 2).map(l => (
                <Box
                  key={l.id}
                  as="button"
                  w="100%"
                  textAlign="left"
                  p={2.5}
                  borderRadius="8px"
                  bg="#fdf4ff"
                  border="1px solid #fae8ff"
                  _hover={{ bg: '#fae8ff' }}
                  onClick={() => handleNavigate('/hr')}
                >
                  <Flex justify="space-between" align="start">
                    <Flex gap={2} align="start">
                      <Calendar size={15} color="#9333ea" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#86198f">
                          Leave Request: {l.employeeName}
                        </Text>
                        <Text fontSize="11px" color="#a21caf">
                          {l.leaveType} ({l.daysCount} days) • {l.startDate}
                        </Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette="purple">Approval</Badge>
                  </Flex>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Flex 
          justify="space-between" 
          align="center" 
          px={3.5} 
          py={2} 
          bg="#f8fafc" 
          borderTop="1px solid #e2e8f0"
        >
          <Button 
            size="xs" 
            variant="ghost" 
            color="#2563eb" 
            fontWeight="bold"
            onClick={() => handleNavigate('/workflow')}
          >
            All Workflows <ArrowRight size={12} style={{ marginLeft: '4px' }} />
          </Button>
          <Text fontSize="10px" color="#94a3b8">Real-time sync</Text>
        </Flex>
      </Box>
    </Box>
  );
};
