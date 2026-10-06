import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Text, 
  Badge, 
  Button, 
  SimpleGrid, 
  Stack 
} from '@chakra-ui/react';
import { 
  HardHat, 
  Boxes, 
  ClipboardList, 
  ShoppingCart, 
  Users, 
  Wallet, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { StructuredResponseData } from '../../../services/chatbot/types';
import { useERP } from '../../../context/ERPContext';

interface Props {
  data: StructuredResponseData;
  onActionClick?: (path: string) => void;
}

export const StructuredResponseView: React.FC<Props> = ({ data, onActionClick }) => {
  const navigate = useNavigate();
  const { activeCompany } = useERP();
  const currency = activeCompany?.currency || 'USD';

  const handleNavigate = (path: string) => {
    if (onActionClick) {
      onActionClick(path);
    } else {
      navigate(path);
    }
  };

  if (!data) return null;

  return (
    <Box mt={3} mb={1}>
      {data.title && (
        <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase" letterSpacing="wider" mb={2}>
          {data.title}
        </Text>
      )}

      {/* 1. PROJECT CARDS */}
      {data.type === 'projects' && data.projects && (
        <Stack gap={2.5}>
          {data.projects.map(p => (
            <Box 
              key={p.id} 
              p={3} 
              bg="#ffffff" 
              border="1px solid #e2e8f0" 
              borderRadius="10px" 
              boxShadow="2xs"
              _hover={{ borderColor: '#93c5fd', boxShadow: 'xs' }}
              transition="all 0.15s ease"
            >
              <Flex justify="space-between" align="start" gap={2}>
                <Box flex="1">
                  <Flex align="center" gap={2}>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                      {p.name}
                    </Text>
                    {p.isBehindSchedule && (
                      <Badge size="xs" colorPalette="red" variant="solid" fontSize="10px">
                        <AlertTriangle size={11} style={{ marginRight: '3px' }} /> Delayed
                      </Badge>
                    )}
                  </Flex>
                  <Text fontSize="11px" color="#64748b" mt={0.5}>
                    {p.client} • {p.location}
                  </Text>
                </Box>
                <Badge 
                  size="xs" 
                  colorPalette={p.status === 'in_progress' ? 'blue' : p.status === 'completed' ? 'green' : 'gray'}
                  variant="subtle"
                >
                  {p.status.replace('_', ' ')}
                </Badge>
              </Flex>

              {/* Progress Bar */}
              <Box mt={2.5}>
                <Flex justify="space-between" align="center" fontSize="10px" color="#64748b" mb={1}>
                  <Text fontWeight="medium">Physical Progress</Text>
                  <Text fontWeight="bold" color={p.progress < 50 ? '#e11d48' : '#2563eb'}>
                    {p.progress}%
                  </Text>
                </Flex>
                <Box w="100%" h="6px" bg="#e2e8f0" borderRadius="full" overflow="hidden">
                  <Box 
                    h="100%" 
                    w={`${Math.min(100, Math.max(0, p.progress))}%`} 
                    bg={p.progress < 50 ? '#ef4444' : '#2563eb'}
                    borderRadius="full"
                    transition="width 0.3s ease"
                  />
                </Box>
              </Box>

              <Flex justify="space-between" align="center" mt={3} pt={2} borderTop="1px solid #f1f5f9">
                <Text fontSize="11px" fontFamily="mono" color="#047857" fontWeight="medium">
                  {currency} {p.budget ? (p.budget / 1000).toFixed(0) + 'k' : '0'} Budget
                </Text>
                <Button 
                  size="xs" 
                  variant="outline" 
                  borderColor="#cbd5e1"
                  color="#2563eb"
                  _hover={{ bg: '#eff6ff', borderColor: '#2563eb' }}
                  onClick={() => handleNavigate(`/projects/${p.id}`)}
                >
                  <HardHat size={12} style={{ marginRight: '4px' }} /> View Project
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      {/* 2. INVENTORY CARDS */}
      {data.type === 'inventory' && data.inventory && (
        <Stack gap={2}>
          {data.inventory.map(item => (
            <Box 
              key={item.id} 
              p={3} 
              bg="#ffffff" 
              border="1px solid #e2e8f0" 
              borderRadius="10px" 
              boxShadow="2xs"
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                    {item.name}
                  </Text>
                  <Text fontSize="10px" fontFamily="mono" color="#64748b">
                    SKU: {item.sku} • Category: {item.category}
                  </Text>
                </Box>
                {item.isLow ? (
                  <Badge size="xs" colorPalette="red" variant="solid" fontSize="10px">
                    Low Stock
                  </Badge>
                ) : (
                  <Badge size="xs" colorPalette="green" variant="subtle">
                    Adequate
                  </Badge>
                )}
              </Flex>

              <Flex justify="space-between" align="center" mt={2} p={2} bg="#f8fafc" borderRadius="6px">
                <Box>
                  <Text fontSize="10px" color="#64748b">Current Stock</Text>
                  <Text fontSize="xs" fontWeight="bold" color={item.isLow ? '#dc2626' : '#0f172a'}>
                    {item.currentStock} {item.unit}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontSize="10px" color="#64748b">Reorder Min</Text>
                  <Text fontSize="xs" fontWeight="bold" color="#64748b">
                    {item.minLevel} {item.unit}
                  </Text>
                </Box>
              </Flex>

              <Flex justify="flex-end" mt={2}>
                <Button 
                  size="xs" 
                  variant="ghost" 
                  color="#2563eb"
                  onClick={() => handleNavigate('/inventory')}
                >
                  <Boxes size={12} style={{ marginRight: '4px' }} /> View in Stores
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      {/* 3. REQUISITION CARDS */}
      {data.type === 'requisitions' && data.requisitions && (
        <Stack gap={2}>
          {data.requisitions.map(r => (
            <Box 
              key={r.id} 
              p={3} 
              bg="#ffffff" 
              border="1px solid #e2e8f0" 
              borderRadius="10px" 
              boxShadow="2xs"
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a" fontFamily="mono">
                    {r.requisitionNo}
                  </Text>
                  <Text fontSize="11px" color="#64748b">
                    {r.projectName} • Req by: {r.requestedBy}
                  </Text>
                </Box>
                <Badge size="xs" colorPalette="orange" variant="subtle">
                  {r.status}
                </Badge>
              </Flex>

              <Flex justify="space-between" align="center" mt={2.5} pt={2} borderTop="1px solid #f1f5f9">
                <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#0f172a">
                  {currency} {r.totalAmount.toLocaleString()}
                </Text>
                <Button 
                  size="xs" 
                  variant="outline" 
                  borderColor="#cbd5e1"
                  color="#2563eb"
                  onClick={() => handleNavigate('/requisitions')}
                >
                  <ClipboardList size={12} style={{ marginRight: '4px' }} /> View Requisition
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      {/* 4. PURCHASE ORDER CARDS */}
      {data.type === 'purchaseOrders' && data.purchaseOrders && (
        <Stack gap={2}>
          {data.purchaseOrders.map(po => (
            <Box 
              key={po.id} 
              p={3} 
              bg="#ffffff" 
              border="1px solid #e2e8f0" 
              borderRadius="10px" 
              boxShadow="2xs"
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a" fontFamily="mono">
                    {po.poNumber}
                  </Text>
                  <Text fontSize="11px" color="#64748b">
                    Vendor: {po.supplierName}
                  </Text>
                </Box>
                <Badge size="xs" colorPalette="blue" variant="subtle">
                  {po.deliveryStatus}
                </Badge>
              </Flex>

              <Flex justify="space-between" align="center" mt={2.5} pt={2} borderTop="1px solid #f1f5f9">
                <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#047857">
                  {currency} {po.totalAmount.toLocaleString()}
                </Text>
                <Button 
                  size="xs" 
                  variant="outline" 
                  borderColor="#cbd5e1"
                  color="#2563eb"
                  onClick={() => handleNavigate('/procurement')}
                >
                  <ShoppingCart size={12} style={{ marginRight: '4px' }} /> View PO
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      {/* 5. EMPLOYEE CARDS */}
      {data.type === 'employees' && data.employees && (
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
          {data.employees.map(e => (
            <Box 
              key={e.id} 
              p={2.5} 
              bg="#ffffff" 
              border="1px solid #e2e8f0" 
              borderRadius="8px"
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                    {e.name}
                  </Text>
                  <Text fontSize="10px" color="#64748b">
                    {e.position} • {e.department}
                  </Text>
                </Box>
                <Badge size="xs" colorPalette="green" variant="subtle" fontSize="9px">
                  {e.status}
                </Badge>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* 6. PAYROLL CARD */}
      {data.type === 'payroll' && data.payroll && (
        <Box 
          p={3.5} 
          bg="#ffffff" 
          border="1px solid #e2e8f0" 
          borderRadius="12px" 
          boxShadow="xs"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="xs" fontWeight="bold" color="#0f172a">
              Monthly Payroll ({data.payroll.monthYear})
            </Text>
            <Badge size="xs" colorPalette="green" variant="solid">
              {data.payroll.status}
            </Badge>
          </Flex>

          <SimpleGrid columns={2} gap={2} p={2.5} bg="#f8fafc" borderRadius="8px" mb={3}>
            <Box>
              <Text fontSize="10px" color="#64748b">Total Gross Pay</Text>
              <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#0f172a">
                {currency} {data.payroll.totalGross.toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text fontSize="10px" color="#64748b">Net Disbursed</Text>
              <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#047857">
                {currency} {data.payroll.totalNet.toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text fontSize="10px" color="#64748b">Staff Enrolled</Text>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                {data.payroll.totalEmployees} Employees
              </Text>
            </Box>
            <Box>
              <Text fontSize="10px" color="#64748b">Deductions & Tax</Text>
              <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#dc2626">
                -{currency} {data.payroll.totalDeductions.toLocaleString()}
              </Text>
            </Box>
          </SimpleGrid>

          <Button 
            size="xs" 
            w="100%" 
            bg="#2563eb" 
            color="white"
            _hover={{ bg: '#1d4ed8' }}
            onClick={() => handleNavigate('/payroll')}
          >
            <Wallet size={12} style={{ marginRight: '4px' }} /> Open Payroll & Ledger
          </Button>
        </Box>
      )}

      {/* 7. METRIC CARDS */}
      {data.type === 'metrics' && data.metrics && (
        <SimpleGrid columns={{ base: 2, sm: 2 }} gap={2}>
          {data.metrics.map((m, idx) => (
            <Box 
              key={idx} 
              p={2.5} 
              bg="#f8fafc" 
              border="1px solid #e2e8f0" 
              borderRadius="8px"
            >
              <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="semibold">
                {m.label}
              </Text>
              <Text fontSize="sm" fontWeight="black" color="#0f172a" mt={0.5}>
                {m.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
