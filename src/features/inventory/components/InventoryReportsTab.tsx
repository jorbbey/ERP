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
import {
  Printer,
  Download,
  AlertTriangle,
  Boxes,
  DollarSign,
  TrendingDown,
  Building2
} from 'lucide-react';

export const InventoryReportsTab: React.FC = () => {
  const { inventory, inventoryCategories, warehouses, activeCompany } = useERP();

  const totalValuation = inventory.reduce((acc, i) => acc + (i.currentStock * i.costPrice), 0);
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minLevel);
  const outOfStockItems = inventory.filter(i => i.currentStock <= 0);

  const handleExportCSV = () => {
    const headers = ['Item Code', 'Item Name', 'Category', 'Unit', 'Current Stock', 'Min Level', 'Cost Price', 'Selling Price', 'Total Valuation', 'Warehouse Location'];
    const rows = inventory.map(i => [
      i.itemCode,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.categoryName}"`,
      i.unit,
      i.currentStock,
      i.minLevel,
      i.costPrice,
      i.sellingPrice,
      (i.currentStock * i.costPrice).toFixed(2),
      `"${i.warehouseLocation}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_valuation_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Stack gap={6}>
      {/* Header Actions */}
      <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
        <Box>
          <Heading size="sm" color="#0f172a">
            Inventory Valuation & Safety Stock Reports
          </Heading>
          <Text fontSize="xs" color="#64748b">
            Financial reconciliation, category capital distribution, and replenishment procurement priorities.
          </Text>
        </Box>

        <Flex gap={2}>
          <Button size="sm" variant="outline" borderColor="#cbd5e1" onClick={handlePrint}>
            <Printer size={15} /> Print Valuation Sheet
          </Button>
          <Button size="sm" colorPalette="blue" onClick={handleExportCSV}>
            <Download size={15} /> Export Inventory CSV
          </Button>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Total Inventory Asset Value
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {totalValuation.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#16a34a" mt={0.5}>Based on weighted direct cost price</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Critical Reorder Deficit
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#dc2626" mt={1}>
            {lowStockItems.length} Materials
          </Text>
          <Text fontSize="11px" color="#dc2626" mt={0.5}>
            {outOfStockItems.length} items completely depleted
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Stocked Storage Facilities
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
            {warehouses.length} Active Yards
          </Text>
          <Text fontSize="11px" color="#64748b" mt={0.5}>Across all project corridors</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Reorder Threshold Watchlist */}
      {lowStockItems.length > 0 && (
        <Card.Root bg="#fffbeb" borderRadius="14px" p={5} border="1px solid #fde68a" boxShadow="xs">
          <Flex align="center" gap={2} mb={3}>
            <AlertTriangle size={18} color="#b45309" />
            <Heading size="sm" color="#92400e">
              Low-Stock Replenishment Urgent Action List
            </Heading>
          </Flex>

          <Table.Root size="sm" variant="outline" bg="white" borderRadius="8px" overflow="hidden">
            <Table.Header>
              <Table.Row bg="#fef3c7">
                <Table.ColumnHeader fontSize="10px">SKU</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Material</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Current Stock</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Min Buffer Limit</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Deficit</Table.ColumnHeader>
                <Table.ColumnHeader fontSize="10px">Storage Location</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {lowStockItems.map(item => (
                <Table.Row key={item.id}>
                  <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">{item.itemCode}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="semibold">{item.name}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#dc2626">
                    {item.currentStock} {item.unit}
                  </Table.Cell>
                  <Table.Cell fontSize="xs">{item.minLevel} {item.unit}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#b45309">
                    {Math.max(0, item.minLevel - item.currentStock)} {item.unit}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">{item.warehouseLocation}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* Valuation by Category Table */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Heading size="sm" color="#0f172a" mb={3}>
          Valuation Breakdown by Category
        </Heading>

        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row bg="#f8fafc">
              <Table.ColumnHeader fontSize="10px">Category Name</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Active SKUs</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Total Quantity Stored</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Total Asset Valuation</Table.ColumnHeader>
              <Table.ColumnHeader fontSize="10px">Portfolio %</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inventoryCategories.map(cat => {
              const items = inventory.filter(i => i.categoryId === cat.id || i.categoryName === cat.name);
              const catVal = items.reduce((acc, i) => acc + (i.currentStock * i.costPrice), 0);
              const totalQty = items.reduce((acc, i) => acc + i.currentStock, 0);
              const share = totalValuation > 0 ? ((catVal / totalValuation) * 100).toFixed(1) : '0';

              return (
                <Table.Row key={cat.id}>
                  <Table.Cell fontSize="xs" fontWeight="semibold" color="#0f172a">
                    {cat.name}
                  </Table.Cell>
                  <Table.Cell fontSize="xs">{items.length} materials</Table.Cell>
                  <Table.Cell fontSize="xs">{totalQty.toLocaleString()} units</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#16a34a">
                    {activeCompany.currency} {catVal.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="medium">
                    {share}%
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card.Root>
    </Stack>
  );
};
