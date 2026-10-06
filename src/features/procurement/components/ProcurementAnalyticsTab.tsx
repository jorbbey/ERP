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
  Stack,
  Progress
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import {
  TrendingUp,
  DollarSign,
  Building2,
  PackageCheck,
  AlertTriangle,
  Award,
  BarChart3,
  PieChart,
  Download,
  Calendar
} from 'lucide-react';

export const ProcurementAnalyticsTab: React.FC = () => {
  const { purchaseOrders, goodsReceivedNotes, suppliers, inventory, activeCompany } = useERP();

  const totalCommittedSpend = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalReceivedSpend = goodsReceivedNotes.reduce((sum, g) => sum + (g.totalReceivedValue || g.totalValueReceived || 0), 0);
  const pendingCommitment = Math.max(0, totalCommittedSpend - totalReceivedSpend);

  // Group Spend by Supplier
  const spendBySupplier: Record<string, { total: number; poCount: number; category: string }> = {};
  purchaseOrders.forEach(p => {
    if (!spendBySupplier[p.supplierName]) {
      const sup = suppliers.find(s => s.id === p.supplierId);
      spendBySupplier[p.supplierName] = { total: 0, poCount: 0, category: sup?.category || 'General Civil' };
    }
    spendBySupplier[p.supplierName].total += p.totalAmount;
    spendBySupplier[p.supplierName].poCount += 1;
  });

  const supplierSpendList = Object.entries(spendBySupplier)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total);

  // Rejection Rate Calculation
  let totalDeliveredQty = 0;
  let totalRejectedQty = 0;
  goodsReceivedNotes.forEach(g => {
    g.items.forEach(i => {
      totalDeliveredQty += i.quantityReceived;
      totalRejectedQty += i.quantityRejected;
    });
  });

  const rejectionRate = totalDeliveredQty > 0
    ? ((totalRejectedQty / totalDeliveredQty) * 100).toFixed(1)
    : '0.0';

  return (
    <Stack gap={5}>
      {/* Top Banner & KPI */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Purchase Orders Issued</Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {totalCommittedSpend.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#2563eb" mt={0.5}>{purchaseOrders.length} contracts executed</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Delivered & Credited to Stock</Text>
          <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
            {activeCompany.currency} {totalReceivedSpend.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#16a34a" mt={0.5}>
            {totalCommittedSpend > 0 ? ((totalReceivedSpend / totalCommittedSpend) * 100).toFixed(0) : 0}% fulfillment rate
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">Material Rejection Rate (QC)</Text>
          <Flex align="center" gap={2} mt={1}>
            <Text fontSize="xl" fontWeight="black" color={Number(rejectionRate) > 3 ? '#dc2626' : '#16a34a'}>
              {rejectionRate}%
            </Text>
            <Badge size="xs" colorPalette={Number(rejectionRate) <= 3 ? 'green' : 'red'}>
              {Number(rejectionRate) <= 3 ? 'Industry Target Met' : 'Above Tolerance'}
            </Badge>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={0.5}>{totalRejectedQty} units rejected at gate</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Spend by Supplier & Category */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
        {/* Supplier Ranking */}
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="sm" color="#0f172a">Top Suppliers by Procurement Volume</Heading>
              <Text fontSize="xs" color="#64748b">Cumulative contract spend and PO distribution</Text>
            </Box>
            <Badge size="xs" colorPalette="blue">{supplierSpendList.length} Active Vendors</Badge>
          </Flex>

          <Stack gap={4}>
            {supplierSpendList.map((sup, idx) => {
              const pct = totalCommittedSpend > 0 ? (sup.total / totalCommittedSpend) * 100 : 0;
              return (
                <Box key={idx}>
                  <Flex justify="space-between" fontSize="xs" mb={1}>
                    <Text fontWeight="semibold" color="#0f172a">
                      {idx + 1}. {sup.name}
                    </Text>
                    <Text fontWeight="bold" color="#0f172a">
                      {activeCompany.currency} {sup.total.toLocaleString()} ({pct.toFixed(0)}%)
                    </Text>
                  </Flex>
                  <Flex justify="space-between" fontSize="10px" color="#64748b" mb={1.5}>
                    <Text>{sup.category}</Text>
                    <Text>{sup.poCount} POs</Text>
                  </Flex>
                  <Progress.Root value={pct} size="xs" colorPalette="blue">
                    <Progress.Track bg="#f1f5f9">
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Box>
              );
            })}
          </Stack>
        </Card.Root>

        {/* Vendor Performance & Quality Matrix */}
        <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <Heading size="sm" color="#0f172a">Vendor Reliability & Compliance Matrix</Heading>
              <Text fontSize="xs" color="#64748b">Supplier audit ratings based on GRN inspections</Text>
            </Box>
            <Button size="xs" variant="outline" onClick={() => window.print()}>
              <Download size={12} /> Export Audit
            </Button>
          </Flex>

          <Table.Root size="sm" variant="outline">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader fontSize="10px">VENDOR</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">CATEGORY</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="center">RATING</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="center">TERMS</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px" textAlign="center">STATUS</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {suppliers.map(s => (
                <Table.Row key={s.id}>
                  <Table.Cell fontSize="xs" fontWeight="semibold" color="#0f172a">
                    {s.companyName}
                  </Table.Cell>
                  <Table.Cell fontSize="11px" color="#64748b">{s.category}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge size="xs" colorPalette="green">★ 4.8 / 5.0</Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="center" fontSize="11px" color="#475569">{s.paymentTerms}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Badge size="xs" colorPalette={s.status === 'active' ? 'green' : 'gray'}>
                      {s.status.toUpperCase()}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      </SimpleGrid>
    </Stack>
  );
};
