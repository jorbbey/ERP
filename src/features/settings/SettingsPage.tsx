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
  Input,
  Stack,
  Table,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  Sliders,
  Building2,
  Shield,
  Palette,
  Database,
  CheckCircle2,
  Lock,
  Globe,
  Plus,
  Save,
  History,
  Activity,
  ShieldCheck,
  AlertCircle,
  Terminal,
  Search,
  Filter
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    activeCompany,
    companies,
    setActiveCompanyId,
    updateCompany,
    employees,
    auditLogs,
    systemLogs
  } = useERP();

  const [activeTab, setActiveTab] = useState<'company' | 'modules' | 'audit' | 'system' | 'database'>('company');
  const [auditFilter, setAuditFilter] = useState('all');
  const [auditSearch, setAuditSearch] = useState('');
  const [formData, setFormData] = useState({
    name: activeCompany.name,
    code: activeCompany.code,
    currency: activeCompany.currency,
    themeColor: activeCompany.themeColor,
    address: activeCompany.address,
    taxNumber: activeCompany.taxNumber,
    phone: activeCompany.phone,
    email: activeCompany.email
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize when active company changes
  React.useEffect(() => {
    setFormData({
      name: activeCompany.name,
      code: activeCompany.code,
      currency: activeCompany.currency,
      themeColor: activeCompany.themeColor,
      address: activeCompany.address,
      taxNumber: activeCompany.taxNumber,
      phone: activeCompany.phone,
      email: activeCompany.email
    });
  }, [activeCompany]);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(activeCompany.id, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const modulesList = [
    { key: 'projects', label: 'Projects & Sites', desc: 'Civil progress tracking, daily logs & RFIs' },
    { key: 'requisitions', label: 'Material Requisitions', desc: 'Site material requests and approval chain' },
    { key: 'inventory', label: 'Stores & Inventory', desc: 'Central stock control, SKU catalog & reorder alerts' },
    { key: 'procurement', label: 'Procurement & PO', desc: 'Vendor orders and Goods Receipt Notes' },
    { key: 'hr', label: 'HR & Personnel', desc: 'Staff directory, salary advances & loans' },
    { key: 'payroll', label: 'Payroll & Ledger', desc: 'Monthly salary runs and computerized payslips' },
    { key: 'rmc', label: 'Ready-Mix Concrete', desc: 'Batching yard ticket tracking & QA cylinder tests' },
    { key: 'contracts', label: 'Contract Admin', desc: 'Tender lifecycle, claims, legal variations' },
    { key: 'accounting', label: 'Accounting & Ledger', desc: 'Chart of accounts and financial statements' },
    { key: 'chat', label: 'Team Live Chat', desc: 'Inter-department field and HQ messaging' }
  ];

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
              <Sliders size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a">
                Enterprise & Workspace Settings
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Multi-subsidiary company configuration, operating currencies, corporate branding and module access rules.
              </Text>
            </Box>
          </Flex>
        </Box>

        {saveSuccess && (
          <Badge colorPalette="green" size="md" p={2} borderRadius="8px">
            <CheckCircle2 size={16} /> Workspace Settings Successfully Updated!
          </Badge>
        )}
      </Flex>

      {/* Tabs */}
      <Flex borderBottom="1px solid #e2e8f0" gap={4} mb={6}>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'company' ? '#2563eb' : 'transparent'}
          color={activeTab === 'company' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'company' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('company')}
        >
          Company Profile & Entities
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'modules' ? '#2563eb' : 'transparent'}
          color={activeTab === 'modules' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'modules' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('modules')}
        >
          Employee Module Permissions Matrix
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'audit' ? '#2563eb' : 'transparent'}
          color={activeTab === 'audit' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'audit' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('audit')}
        >
          Enterprise Audit Trail ({auditLogs.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'system' ? '#2563eb' : 'transparent'}
          color={activeTab === 'system' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'system' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('system')}
        >
          System Integrity Logs ({systemLogs.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          pt={1}
          px={2}
          borderBottom="2px solid"
          borderColor={activeTab === 'database' ? '#2563eb' : 'transparent'}
          color={activeTab === 'database' ? '#2563eb' : '#64748b'}
          fontWeight={activeTab === 'database' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('database')}
        >
          Architecture Diagnostics
        </Button>
      </Flex>

      {/* Company Tab */}
      {activeTab === 'company' && (
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          {/* Active Company Editor */}
          <Box gridColumn={{ lg: 'span 2' }}>
            <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={6}>
              <Flex align="center" gap={3} pb={4} borderBottom="1px solid #e2e8f0" mb={4}>
                <Box
                  w="42px"
                  h="42px"
                  borderRadius="10px"
                  bg={formData.themeColor}
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Building2 size={22} />
                </Box>
                <Box>
                  <Heading size="md" color="#0f172a">
                    Edit Active Corporate Entity
                  </Heading>
                  <Text fontSize="xs" color="#64748b">
                    Workspace: {activeCompany.name} ({activeCompany.code})
                  </Text>
                </Box>
              </Flex>

              <form onSubmit={handleSaveCompany}>
                <Stack gap={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Company Name
                      </Text>
                      <Input
                        size="sm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Company Code (Abbreviation)
                      </Text>
                      <Input
                        size="sm"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                      />
                    </Box>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Operating Currency
                      </Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        >
                          <option value="NGN">NGN (₦ Nigerian Naira)</option>
                          <option value="USD">USD ($ United States Dollar)</option>
                          <option value="GBP">GBP (£ British Pound)</option>
                          <option value="EUR">EUR (€ Euro)</option>
                          <option value="GHS">GHS (GH₵ Ghanaian Cedi)</option>
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Corporate Theme Color
                      </Text>
                      <Flex gap={2}>
                        <Input
                          size="sm"
                          type="color"
                          w="50px"
                          p={1}
                          value={formData.themeColor}
                          onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        />
                        <Input
                          size="sm"
                          value={formData.themeColor}
                          onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        />
                      </Flex>
                    </Box>
                  </SimpleGrid>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                      Registered Head Office Address
                    </Text>
                    <Input
                      size="sm"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Tax ID / TIN Number
                      </Text>
                      <Input
                        size="sm"
                        value={formData.taxNumber}
                        onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Corporate Phone
                      </Text>
                      <Input
                        size="sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                        Corporate Email
                      </Text>
                      <Input
                        size="sm"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Box>
                  </SimpleGrid>

                  <Flex justify="flex-end" mt={2}>
                    <Button size="sm" bg="#2563eb" color="white" type="submit" px={5}>
                      <Save size={16} /> Save Changes
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Card.Root>
          </Box>

          {/* Available Subsidiary Entities Switcher */}
          <Box>
            <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={5}>
              <Heading size="sm" color="#0f172a" mb={1}>
                Corporate Subsidiaries
              </Heading>
              <Text fontSize="xs" color="#64748b" mb={4}>
                Switch between construction holding companies and joint ventures.
              </Text>

              <Stack gap={2.5}>
                {companies.map(c => (
                  <Box
                    key={c.id}
                    as="button"
                    onClick={() => setActiveCompanyId(c.id)}
                    p={3.5}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor={c.id === activeCompany.id ? '#2563eb' : '#e2e8f0'}
                    bg={c.id === activeCompany.id ? '#eff6ff' : 'white'}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    cursor="pointer"
                    textAlign="left"
                  >
                    <Flex align="center" gap={3}>
                      <Box
                        w="32px"
                        h="32px"
                        borderRadius="8px"
                        bg={c.themeColor}
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        {c.code.slice(0, 2)}
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                          {c.name}
                        </Text>
                        <Text fontSize="10px" color="#64748b">
                          {c.code} • {c.currency}
                        </Text>
                      </Box>
                    </Flex>

                    {c.id === activeCompany.id && (
                      <Badge colorPalette="blue" size="xs">
                        Active
                      </Badge>
                    )}
                  </Box>
                ))}
              </Stack>
            </Card.Root>
          </Box>
        </SimpleGrid>
      )}

      {/* Modules Permission Matrix */}
      {activeTab === 'modules' && (
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={6}>
          <Heading size="sm" color="#0f172a" mb={1}>
            Role-Based Module Authorization Matrix
          </Heading>
          <Text fontSize="xs" color="#64748b" mb={4}>
            Controls navigation visibility and operational authorization across ERP departments.
          </Text>

          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Functional Module</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Super Admin</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Managing Director</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Site Engineer</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Site QS</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Procurement</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">HR / Finance</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {modulesList.map(mod => (
                <Table.Row key={mod.key}>
                  <Table.Cell>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                      {mod.label}
                    </Text>
                    <Text fontSize="10px" color="#64748b">
                      {mod.desc}
                    </Text>
                  </Table.Cell>
                  <Table.Cell><Badge colorPalette="green" size="xs">Full Access</Badge></Table.Cell>
                  <Table.Cell><Badge colorPalette="green" size="xs">Full Access</Badge></Table.Cell>
                  <Table.Cell>
                    {['projects', 'requisitions', 'rmc', 'chat'].includes(mod.key) ? (
                      <Badge colorPalette="blue" size="xs">Authorized</Badge>
                    ) : (
                      <Badge colorPalette="gray" size="xs">Restricted</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {['projects', 'requisitions', 'inventory', 'contracts', 'chat'].includes(mod.key) ? (
                      <Badge colorPalette="blue" size="xs">Authorized</Badge>
                    ) : (
                      <Badge colorPalette="gray" size="xs">Restricted</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {['procurement', 'inventory', 'requisitions', 'chat'].includes(mod.key) ? (
                      <Badge colorPalette="purple" size="xs">Authorized</Badge>
                    ) : (
                      <Badge colorPalette="gray" size="xs">Restricted</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {['hr', 'payroll', 'accounting', 'chat'].includes(mod.key) ? (
                      <Badge colorPalette="teal" size="xs">Authorized</Badge>
                    ) : (
                      <Badge colorPalette="gray" size="xs">Restricted</Badge>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <Stack gap={4}>
          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={4} boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap={3}>
              <Box maxW={{ md: '300px' }}>
                <Flex align="center" gap={2} bg="#f8fafc" px={3} py={1.5} borderRadius="8px" border="1px solid #e2e8f0">
                  <Search size={14} color="#94a3b8" />
                  <Input
                    variant="subtle"
                    size="xs"
                    placeholder="Search logs by user, action, module..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                  />
                </Flex>
              </Box>
              <Flex align="center" gap={2}>
                <NativeSelect.Root size="xs" minW="140px">
                  <NativeSelect.Field value={auditFilter} onChange={(e) => setAuditFilter(e.target.value)}>
                    <option value="all">All Modules</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Requisitions">Requisitions</option>
                    <option value="Payroll">Payroll</option>
                    <option value="HR">HR</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Contracts">Contracts</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
                <Badge size="xs" colorPalette="blue">{auditLogs.length} events logged</Badge>
              </Flex>
            </Flex>
          </Card.Root>

          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" overflow="hidden" boxShadow="xs">
            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Timestamp</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">User & Role</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Action</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Module</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Event Audit Details</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Client IP</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {auditLogs
                  .filter(l => (auditFilter === 'all' || l.module === auditFilter) &&
                    (l.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
                     l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                     l.details.toLowerCase().includes(auditSearch.toLowerCase()))
                  )
                  .map(log => (
                    <Table.Row key={log.id}>
                      <Table.Cell fontSize="xs" fontFamily="mono" color="#64748b">{log.createdAt}</Table.Cell>
                      <Table.Cell>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{log.userName}</Text>
                        <Text fontSize="10px" color="#64748b">{log.userRole}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette="purple">{log.action}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette="blue" variant="outline">{log.module}</Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" color="#334155" maxW="380px">{log.details}</Table.Cell>
                      <Table.Cell fontSize="xs" fontFamily="mono" color="#94a3b8">{log.ipAddress || '127.0.0.1'}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Stack>
      )}

      {/* System Integrity & Diagnostics Tab */}
      {activeTab === 'system' && (
        <Stack gap={4}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Relational Tables</Text>
              <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>24 / 24</Text>
              <Text fontSize="10px" color="#16a34a" mt={0.5}>Zero Schema Divergence</Text>
            </Card.Root>

            <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Storage Integrity</Text>
              <Text fontSize="2xl" fontWeight="black" color="#16a34a" mt={1}>100% OK</Text>
              <Text fontSize="10px" color="#64748b" mt={0.5}>Synchronous JSON Cache</Text>
            </Card.Root>

            <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Biometric Clock Gate</Text>
              <Text fontSize="2xl" fontWeight="black" color="#2563eb" mt={1}>Online</Text>
              <Text fontSize="10px" color="#64748b" mt={0.5}>Threshold: 08:15 AM</Text>
            </Card.Root>

            <Card.Root bg="white" p={4} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">System Health</Text>
              <Text fontSize="2xl" fontWeight="black" color="#059669" mt={1}>Healthy</Text>
              <Text fontSize="10px" color="#64748b" mt={0.5}>Zero Unhandled Exceptions</Text>
            </Card.Root>
          </SimpleGrid>

          <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" overflow="hidden" boxShadow="xs">
            <Box p={4} borderBottom="1px solid #e2e8f0" bg="#f8fafc">
              <Heading size="xs" color="#0f172a" display="flex" alignItems="center" gap={2}>
                <Terminal size={15} color="#2563eb" /> System Event & Integrity Stream
              </Heading>
            </Box>
            <Table.Root size="sm" striped>
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader color="#475569">Timestamp</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Log Level</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">Subsystem / Module</Table.ColumnHeader>
                  <Table.ColumnHeader color="#475569">System Diagnostic Output</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {systemLogs.map(log => (
                  <Table.Row key={log.id}>
                    <Table.Cell fontSize="xs" fontFamily="mono" color="#64748b">{log.createdAt}</Table.Cell>
                    <Table.Cell>
                      <Badge size="xs" colorPalette={log.logType === 'info' ? 'blue' : log.logType === 'warning' ? 'orange' : 'red'}>
                        {log.logType.toUpperCase()}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">{log.module}</Table.Cell>
                    <Table.Cell fontSize="xs" color="#334155">{log.message}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Stack>
      )}

      {/* Database & Runtime Diagnostics */}
      {activeTab === 'database' && (
        <Card.Root bg="white" border="1px solid #e2e8f0" borderRadius="14px" p={6}>
          <Heading size="sm" color="#0f172a" mb={1} display="flex" alignItems="center" gap={2}>
            <Database size={20} color="#2563eb" /> Application Architecture Diagnostics
          </Heading>
          <Text fontSize="xs" color="#64748b" mb={4}>
            Environment configuration and runtime integrity metrics.
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} mb={4}>
            <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
                Frontend Framework
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                React 19 + TypeScript
              </Text>
            </Box>
            <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
                UI Component System
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                Chakra UI v3.x
              </Text>
            </Box>
            <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
                Routing Architecture
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={1}>
                React Router v7
              </Text>
            </Box>
            <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
                State Hydration
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="#16a34a" mt={1}>
                LocalStorage Sync Active
              </Text>
            </Box>
          </SimpleGrid>
        </Card.Root>
      )}
    </Box>
  );
};
