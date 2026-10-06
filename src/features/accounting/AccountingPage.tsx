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
import { useERP } from '../../context/ERPContext';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Scale
} from 'lucide-react';

export const AccountingPage: React.FC = () => {
  const { accountsLedger, activeCompany, payrollRuns, purchaseOrders } = useERP();
  const [activeTab, setActiveTab] = useState<'chart' | 'pnl' | 'balancesheet'>('chart');
  const [filterType, setFilterType] = useState('all');

  const filteredAccounts = accountsLedger.filter(acc => {
    return filterType === 'all' || acc.type.toLowerCase() === filterType.toLowerCase();
  });

  const totalAssets = accountsLedger.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accountsLedger.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = accountsLedger.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accountsLedger.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accountsLedger.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);

  const netOperatingProfit = totalRevenue - totalExpenses;

  return (
    <Box>
      {/* Header Banner */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        gap={4} 
        mb={6}
      >
        <Box>
          <Flex align="center" gap={3}>
            <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px">
              <Wallet size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a">
                General Ledger & Financial Accounting
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Chart of accounts, real-time balance sheet, automated procurement and payroll postings.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex gap={2}>
          <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#334155">
            <FileSpreadsheet size={16} /> Export Trial Balance
          </Button>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} mb={6}>
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Corporate Assets
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
                {activeCompany.currency} {(totalAssets / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <Building2 size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={2}>
            Cash, inventory, plant & site equipment
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Current Liabilities
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#dc2626" mt={1}>
                {activeCompany.currency} {(totalLiabilities / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#fef2f2" color="#dc2626" borderRadius="10px">
              <TrendingDown size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Trade payables & subcontractor retentions
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Total Operating Revenue
              </Text>
              <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
                {activeCompany.currency} {(totalRevenue / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#f0fdf4" color="#16a34a" borderRadius="10px">
              <TrendingUp size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color="#64748b" mt={2}>
            Site billings & concrete sales
          </Text>
        </Card.Root>

        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
                Net Operating Profit
              </Text>
              <Text fontSize="xl" fontWeight="black" color={netOperatingProfit >= 0 ? '#16a34a' : '#dc2626'} mt={1}>
                {activeCompany.currency} {(netOperatingProfit / 1000000).toFixed(2)}M
              </Text>
            </Box>
            <Box p={2.5} bg="#f8fafc" color="#0f172a" borderRadius="10px">
              <Scale size={20} />
            </Box>
          </Flex>
          <Text fontSize="11px" color={netOperatingProfit >= 0 ? '#16a34a' : '#dc2626'} fontWeight="bold" mt={2}>
            {((netOperatingProfit / (totalRevenue || 1)) * 100).toFixed(1)}% Operating Margin
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Tabs */}
      <Flex borderBottom="1px solid #e2e8f0" gap={4} mb={6}>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'chart' ? '#2563eb' : 'transparent'}
          color={activeTab === 'chart' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'chart' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('chart')}
        >
          Chart of Accounts ({accountsLedger.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'pnl' ? '#2563eb' : 'transparent'}
          color={activeTab === 'pnl' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'pnl' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('pnl')}
        >
          Profit & Loss Statement
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'balancesheet' ? '#2563eb' : 'transparent'}
          color={activeTab === 'balancesheet' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'balancesheet' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('balancesheet')}
        >
          Balance Sheet Statement
        </Button>
      </Flex>

      {/* Chart of Accounts */}
      {activeTab === 'chart' && (
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="sm" color="#0f172a">
              General Ledger Accounts
            </Heading>
            <Flex gap={2} align="center">
              <Text fontSize="xs" color="#64748b">Filter Classification:</Text>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  fontSize="xs"
                >
                  <option value="all">All Classifications</option>
                  <option value="asset">Assets</option>
                  <option value="liability">Liabilities</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Operating Expenses</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Flex>
          </Flex>

          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Account Code</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Account Name</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Classification</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Current Balance</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredAccounts.map((acc) => (
                <Table.Row key={acc.id}>
                  <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold" color="#2563eb">
                    {acc.accountCode}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="semibold" color="#0f172a">
                    {acc.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="xs"
                      colorPalette={
                        acc.type === 'Asset' ? 'blue' :
                        acc.type === 'Liability' ? 'red' :
                        acc.type === 'Equity' ? 'purple' :
                        acc.type === 'Revenue' ? 'green' : 'orange'
                      }
                      variant="subtle"
                    >
                      {acc.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" textAlign="right" fontWeight="bold" color="#0f172a">
                    {activeCompany.currency} {acc.balance.toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* P&L View */}
      {activeTab === 'pnl' && (
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={6} maxW="800px" mx="auto">
          <Box textAlign="center" pb={4} borderBottom="1px solid #e2e8f0" mb={4}>
            <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">
              {activeCompany.name}
            </Text>
            <Heading size="md" color="#0f172a" mt={1}>
              Statement of Profit or Loss
            </Heading>
            <Text fontSize="xs" color="#94a3b8">For Current Operating Period (Expressed in {activeCompany.currency})</Text>
          </Box>

          <Stack gap={4} fontSize="xs">
            <Box>
              <Text fontWeight="bold" color="#0f172a" fontSize="sm" mb={2}>1. Operational Revenue</Text>
              {accountsLedger.filter(a => a.type === 'Revenue').map(r => (
                <Flex key={r.id} justify="space-between" py={1.5} borderBottom="1px dashed #e2e8f0">
                  <Text color="#475569">{r.name}</Text>
                  <Text fontWeight="bold" color="#16a34a">{r.balance.toLocaleString()}</Text>
                </Flex>
              ))}
              <Flex justify="space-between" pt={2} fontWeight="bold" color="#0f172a">
                <Text>Total Operating Revenue</Text>
                <Text>{totalRevenue.toLocaleString()}</Text>
              </Flex>
            </Box>

            <Box pt={2}>
              <Text fontWeight="bold" color="#0f172a" fontSize="sm" mb={2}>2. Operating Expenses & Cost of Sales</Text>
              {accountsLedger.filter(a => a.type === 'Expense').map(e => (
                <Flex key={e.id} justify="space-between" py={1.5} borderBottom="1px dashed #e2e8f0">
                  <Text color="#475569">{e.name}</Text>
                  <Text fontWeight="medium" color="#dc2626">({e.balance.toLocaleString()})</Text>
                </Flex>
              ))}
              <Flex justify="space-between" pt={2} fontWeight="bold" color="#0f172a">
                <Text>Total Expenses</Text>
                <Text>({totalExpenses.toLocaleString()})</Text>
              </Flex>
            </Box>

            <Box p={4} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
              <Flex justify="space-between" fontSize="sm" fontWeight="black" color={netOperatingProfit >= 0 ? '#16a34a' : '#dc2626'}>
                <Text>NET OPERATING SURPLUS / (DEFICIT)</Text>
                <Text>{activeCompany.currency} {netOperatingProfit.toLocaleString()}</Text>
              </Flex>
            </Box>
          </Stack>
        </Card.Root>
      )}

      {/* Balance Sheet View */}
      {activeTab === 'balancesheet' && (
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={6} maxW="800px" mx="auto">
          <Box textAlign="center" pb={4} borderBottom="1px solid #e2e8f0" mb={4}>
            <Text fontSize="xs" fontWeight="bold" color="#64748b" textTransform="uppercase">
              {activeCompany.name}
            </Text>
            <Heading size="md" color="#0f172a" mt={1}>
              Statement of Financial Position (Balance Sheet)
            </Heading>
            <Text fontSize="xs" color="#94a3b8">As at Current Date ({activeCompany.currency})</Text>
          </Box>

          <Stack gap={4} fontSize="xs">
            <Box>
              <Text fontWeight="bold" color="#0f172a" fontSize="sm" mb={2}>Assets</Text>
              {accountsLedger.filter(a => a.type === 'Asset').map(a => (
                <Flex key={a.id} justify="space-between" py={1.5} borderBottom="1px dashed #e2e8f0">
                  <Text color="#475569">{a.name}</Text>
                  <Text fontWeight="bold" color="#0f172a">{a.balance.toLocaleString()}</Text>
                </Flex>
              ))}
              <Flex justify="space-between" pt={2} fontWeight="bold" color="#2563eb" fontSize="sm">
                <Text>Total Assets</Text>
                <Text>{totalAssets.toLocaleString()}</Text>
              </Flex>
            </Box>

            <Box pt={2}>
              <Text fontWeight="bold" color="#0f172a" fontSize="sm" mb={2}>Liabilities</Text>
              {accountsLedger.filter(a => a.type === 'Liability').map(l => (
                <Flex key={l.id} justify="space-between" py={1.5} borderBottom="1px dashed #e2e8f0">
                  <Text color="#475569">{l.name}</Text>
                  <Text fontWeight="medium" color="#dc2626">{l.balance.toLocaleString()}</Text>
                </Flex>
              ))}
              <Flex justify="space-between" pt={2} fontWeight="bold" color="#dc2626">
                <Text>Total Liabilities</Text>
                <Text>{totalLiabilities.toLocaleString()}</Text>
              </Flex>
            </Box>

            <Box pt={2}>
              <Text fontWeight="bold" color="#0f172a" fontSize="sm" mb={2}>Equity</Text>
              {accountsLedger.filter(a => a.type === 'Equity').map(eq => (
                <Flex key={eq.id} justify="space-between" py={1.5} borderBottom="1px dashed #e2e8f0">
                  <Text color="#475569">{eq.name}</Text>
                  <Text fontWeight="medium" color="#7c3aed">{eq.balance.toLocaleString()}</Text>
                </Flex>
              ))}
              <Flex justify="space-between" pt={2} fontWeight="bold" color="#7c3aed">
                <Text>Total Equity & Reserves</Text>
                <Text>{totalEquity.toLocaleString()}</Text>
              </Flex>
            </Box>
          </Stack>
        </Card.Root>
      )}
    </Box>
  );
};
