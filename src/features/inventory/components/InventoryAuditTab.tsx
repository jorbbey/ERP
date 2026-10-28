import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Card,
  Table,
  Input,
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { InventoryItemChange, InventoryItem } from '../../../types';
import {
  History,
  Search,
  FileCode,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';

import { StockHistoryReportModal } from './StockHistoryReportModal';

export const InventoryAuditTab: React.FC = () => {
  const { inventoryItemChanges, inventory } = useERP();

  const [selectedItemId, setSelectedItemId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemForDossier, setSelectedItemForDossier] = useState<InventoryItem | null>(null);

  const activeItem = inventory.find(i => i.id === Number(selectedItemId));

  const filteredLogs = inventoryItemChanges.filter(log => {
    const matchesItem = selectedItemId === 'all' || log.itemId === Number(selectedItemId);
    const matchesSearch =
      log.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.changeReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.changedBy && log.changedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesItem && matchesSearch;
  });

  return (
    <Stack gap={5}>
      {selectedItemForDossier && (
        <StockHistoryReportModal
          item={selectedItemForDossier}
          onClose={() => setSelectedItemForDossier(null)}
        />
      )}

      {/* Audit Banner */}
      <Card.Root bg="#f8fafc" borderRadius="14px" p={4} border="1px solid #e2e8f0">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
          <Box>
            <Flex align="center" gap={2}>
              <History size={18} color="#2563eb" />
              <Heading size="xs" color="#0f172a" textTransform="uppercase">
                Stock Governance & Forensic Audit Trail
              </Heading>
            </Flex>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Tracks all material movements, purchase intakes, site issues, revaluations, and specification changes.
            </Text>
          </Box>
          <Flex gap={2}>
            {activeItem && (
              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => setSelectedItemForDossier(activeItem)}
                fontWeight="semibold"
              >
                <History size={14} /> View {activeItem.itemCode} Stock Dossier
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedItemForDossier(inventory[0] || null)}
            >
              <FileCode size={14} /> Full Stock History Report
            </Button>
          </Flex>
        </Flex>
      </Card.Root>

      <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={3}>
        <Box maxW="380px" w="100%">
          <Flex align="center" bg="white" px={3} py={1.5} borderRadius="10px" border="1px solid #cbd5e1">
            <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              placeholder="Search audit trail, SKU, reason, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: '13px', background: 'transparent', border: 'none', outline: 'none' }}
            />
          </Flex>
        </Box>

        <Flex align="center" gap={1.5}>
          <Text fontSize="xs" color="#64748b" fontWeight="medium">Filter by SKU:</Text>
          <NativeSelect.Root size="sm">
            <NativeSelect.Field
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              bg="white"
              borderColor="#cbd5e1"
            >
              <option value="all">All Items Audit History</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.itemCode} - {item.name}</option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Flex>
      </Flex>

      <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline" minW="750px">
            <Table.Header>
              <Table.Row bg="#f8fafc">
                <Table.ColumnHeader fontSize="10px">Timestamp</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Material SKU</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">User / Actor</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Action & Reason</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Prior Snapshot (Before)</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">New Snapshot (After)</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredLogs.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center" py={8} color="#64748b" fontSize="xs">
                    No change records found matching current query.
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredLogs.map(log => (
                  <Table.Row key={log.id} _hover={{ bg: '#f8fafc' }}>
                    <Table.Cell fontSize="xs" color="#64748b" whiteSpace="nowrap">
                      {log.changedAt}
                    </Table.Cell>
                    <Table.Cell fontSize="xs">
                      <Text fontWeight="semibold" color="#0f172a">{log.itemName}</Text>
                      <Badge size="xs" variant="outline" fontFamily="mono">{log.itemCode}</Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="medium" color="#334155">
                      {log.changedBy || 'System'}
                    </Table.Cell>
                    <Table.Cell fontSize="xs" color="#0f172a" maxW="220px">
                      <Text>{log.changeReason}</Text>
                    </Table.Cell>
                    <Table.Cell fontSize="11px" fontFamily="mono" color="#64748b" maxW="160px">
                      <Box bg="#f8fafc" p={1.5} borderRadius="6px" border="1px solid #e2e8f0" truncate>
                        {log.beforeData}
                      </Box>
                    </Table.Cell>
                    <Table.Cell fontSize="11px" fontFamily="mono" color="#166534" maxW="160px">
                      <Box bg="#f0fdf4" p={1.5} borderRadius="6px" border="1px solid #bbf7d0" truncate>
                        {log.afterData}
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>
    </Stack>
  );
};
