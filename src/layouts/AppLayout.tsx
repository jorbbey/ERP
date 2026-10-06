import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Flex, Text, Button, Badge, Stack, NativeSelect } from '@chakra-ui/react';
import { useERP } from '../context/ERPContext';
import { UserRole } from '../types';
import { 
  Building2, 
  LayoutDashboard, 
  HardHat, 
  ClipboardList, 
  Boxes, 
  ShoppingCart, 
  Users, 
  Wallet, 
  Truck, 
  FileText, 
  MessageSquare, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Bell,
  Workflow,
  Sparkles,
  Scale,
  FolderKanban,
  Bot,
  ChevronDown,
  Home,
  CheckCircle2
} from 'lucide-react';
import { FloatingAIAssistant } from '../features/assistant/components/FloatingAIAssistant';

const ROLES: UserRole[] = [
  'Managing Director',
  'Site Engineer',
  'Site Quantity Surveyor',
  'Procurement Officer',
  'Finance Manager',
  'HR Manager',
  'Accountant',
  'Department Head',
  'Staff',
  'Super Admin'
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const { 
    companies, 
    activeCompany, 
    setActiveCompanyId, 
    activeRole, 
    setActiveRole, 
    currentUserName,
    isImpersonating,
    stopImpersonation,
    requisitions,
    inventory,
    leaves,
    salaryAdvances
  } = useERP();

  const pendingReqsCount = requisitions.filter(r => r.status === 'Pending Review' || (r.status as string).includes('Pending')).length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minLevel).length;
  const pendingHRActionsCount = leaves.filter(l => l.status === 'Pending').length + salaryAdvances.filter(a => a.status === 'Pending').length;

  const navGroups = [
    {
      group: 'Core Operations',
      items: [
        { path: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { 
          path: '/assistant', 
          label: 'ERP Assistant', 
          icon: Bot,
          badge: 'AI',
          badgeColor: 'blue'
        },
        { path: '/projects', label: 'Projects & Sites', icon: HardHat }
      ]
    },
    {
      group: 'Supply Chain & Plant',
      items: [
        { 
          path: '/requisitions', 
          label: 'Material Requisitions', 
          icon: ClipboardList,
          badge: pendingReqsCount > 0 ? String(pendingReqsCount) : undefined,
          badgeColor: 'orange'
        },
        { 
          path: '/inventory', 
          label: 'Stores & Inventory', 
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeColor: 'red'
        },
        { path: '/procurement', label: 'Procurement & PO', icon: ShoppingCart },
        { path: '/rmc', label: 'Ready-Mix Concrete', icon: Truck },
        { path: '/equipment', label: 'Plant & Heavy Fleet', icon: Truck }
      ]
    },
    {
      group: 'Human Capital',
      items: [
        { 
          path: '/hr', 
          label: 'HR & Personnel', 
          icon: Users,
          badge: pendingHRActionsCount > 0 ? String(pendingHRActionsCount) : undefined,
          badgeColor: 'purple'
        },
        { path: '/payroll', label: 'Payroll & Remuneration', icon: Wallet }
      ]
    },
    {
      group: 'Finance & Governance',
      items: [
        { path: '/contract-admin', label: 'FIDIC Contracts', icon: FileText },
        { path: '/accounting', label: 'Accounting & Ledger', icon: Scale },
        { path: '/documents', label: 'Documents & Vault', icon: FolderKanban }
      ]
    },
    {
      group: 'System & Portals',
      items: [
        { path: '/workflow', label: 'Approval Workflows', icon: Workflow },
        { path: '/chat', label: 'Team Live Chat', icon: MessageSquare },
        { path: '/portals', label: 'Role Portals Hub', icon: Sparkles },
        { path: '/settings', label: 'ERP Settings', icon: Sliders }
      ]
    }
  ];

  // Helper for current page title
  const allNavItems = navGroups.flatMap(g => g.items);
  const currentNav = allNavItems.find(i => 
    location.pathname === i.path || (i.path !== '/' && location.pathname.startsWith(i.path + '/'))
  );
  const currentTitle = currentNav?.label || 'Overview';

  return (
    <Box minH="100vh" bg="#f8fafc" display="flex" flexDirection="column" color="#0f172a">
      {/* Light Topbar */}
      <Box 
        as="header" 
        position="sticky" 
        top="0" 
        zIndex="100" 
        bg="#ffffff" 
        color="#0f172a" 
        px={{ base: 3, md: 5 }} 
        py={2.5}
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        borderBottom="1px solid #e2e8f0"
      >
        <Flex align="center" justify="space-between" gap={3}>
          {/* Left: Company Brand & Workspace Switcher */}
          <Flex align="center" gap={3}>
            <Box 
              w="38px" 
              h="38px" 
              borderRadius="10px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              bg={activeCompany.themeColor || '#2563eb'}
              color="white"
              boxShadow="0 2px 6px rgba(37, 99, 235, 0.25)"
              flexShrink={0}
            >
              <Building2 size={20} />
            </Box>
            <Box>
              <Flex align="center" gap={2}>
                <Text fontWeight="bold" fontSize="sm" lineHeight="shorter" color="#0f172a">
                  {activeCompany.name}
                </Text>
                <Badge size="xs" colorPalette="blue" variant="subtle" fontSize="10px">
                  {activeCompany.code}
                </Badge>
              </Flex>
              <Text fontSize="11px" color="#64748b" mt="1px">
                Commercial Construction ERP
              </Text>
            </Box>

            {/* Multi-Company Workspace Switcher */}
            <Box ml={2} pl={3} borderLeft="1px solid #e2e8f0" display={{ base: 'none', lg: 'block' }}>
              <NativeSelect.Root size="xs">
                <NativeSelect.Field 
                  aria-label="Select Active Company"
                  value={activeCompany.id} 
                  onChange={(e) => setActiveCompanyId(Number(e.target.value))}
                  bg="#f8fafc" 
                  color="#0f172a" 
                  borderColor="#cbd5e1"
                  fontSize="xs"
                  cursor="pointer"
                  px={2}
                  py={1}
                  fontWeight="medium"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Flex>

          {/* Right Controls: Impersonation, Role Switcher, Notifications, Profile */}
          <Flex align="center" gap={2.5}>
            {/* Impersonation Stop Alert */}
            {isImpersonating && (
              <Button 
                size="xs" 
                colorPalette="yellow" 
                variant="solid"
                onClick={stopImpersonation}
                fontWeight="bold"
              >
                Return to Super Admin
              </Button>
            )}

            {/* Role Switcher */}
            <Flex 
              align="center" 
              gap={1.5} 
              bg="#f8fafc" 
              px={2.5} 
              py={1} 
              borderRadius="8px" 
              border="1px solid #e2e8f0"
            >
              <Text fontSize="xs" color="#64748b" display={{ base: 'none', sm: 'inline' }}>
                Role:
              </Text>
              <NativeSelect.Root size="xs">
                <NativeSelect.Field 
                  aria-label="Active Role"
                  value={activeRole} 
                  onChange={(e) => setActiveRole(e.target.value as UserRole)}
                  bg="transparent" 
                  color="#2563eb" 
                  fontWeight="bold"
                  borderColor="transparent"
                  cursor="pointer"
                  p={0}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Flex>

            {/* Requisitions Bell Alert */}
            <Box 
              position="relative" 
              cursor="pointer" 
              p={2} 
              borderRadius="8px" 
              color="#64748b"
              _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
              onClick={() => navigate('/requisitions')}
              title={`${pendingReqsCount} pending requisitions`}
            >
              <Bell size={18} />
              {pendingReqsCount > 0 && (
                <Box 
                  position="absolute" 
                  top="2px" 
                  right="2px" 
                  bg="#f59e0b" 
                  color="white" 
                  fontSize="10px" 
                  fontWeight="bold"
                  w="16px" 
                  h="16px" 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  boxShadow="0 1px 3px rgba(0,0,0,0.15)"
                >
                  {pendingReqsCount}
                </Box>
              )}
            </Box>

            {/* Public Landing Site Link */}
            <Button
              size="xs"
              variant="outline"
              borderColor="#e2e8f0"
              color="#475569"
              _hover={{ color: '#0f172a', bg: '#f1f5f9', borderColor: '#cbd5e1' }}
              display={{ base: 'none', md: 'inline-flex' }}
              onClick={() => navigate('/landing')}
              title="View Public ERP Portal"
            >
              Public Site
            </Button>

            {/* User Profile Capsule */}
            <Flex align="center" gap={2} pl={2} borderLeft="1px solid #e2e8f0">
              <Box 
                w="32px" 
                h="32px" 
                borderRadius="full" 
                bg="#2563eb" 
                color="white" 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                fontWeight="bold" 
                fontSize="xs"
                boxShadow="0 1px 3px rgba(37,99,235,0.2)"
              >
                {currentUserName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Box>
              <Box display={{ base: 'none', xl: 'block' }}>
                <Text fontSize="xs" fontWeight="semibold" color="#0f172a" lineHeight="1.1">
                  {currentUserName}
                </Text>
                <Text fontSize="10px" color="#64748b">
                  {activeRole}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Main Layout Area */}
      <Flex flex="1" overflow="hidden">
        {/* Light Enterprise Sidebar */}
        <Box 
          as="aside" 
          w={collapsed ? '68px' : '255px'} 
          bg="#ffffff" 
          borderRight="1px solid #e2e8f0" 
          transition="width 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          display="flex"
          flexDirection="column"
          flexShrink={0}
        >
          {/* Collapse Header */}
          <Flex 
            align="center" 
            justify={collapsed ? "center" : "space-between"} 
            px={3.5} 
            py={2.5} 
            borderBottom="1px solid #f1f5f9"
          >
            {!collapsed && (
              <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" letterSpacing="0.06em">
                Navigation Modules
              </Text>
            )}
            <Box 
              as="button" 
              onClick={() => setCollapsed(!collapsed)} 
              p={1.5} 
              borderRadius="6px" 
              color="#64748b" 
              _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
              cursor="pointer"
              title={collapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </Box>
          </Flex>

          {/* Navigation Groups List */}
          <Box flex="1" overflowY="auto" px={2} py={3}>
            <Stack gap={4}>
              {navGroups.map((group, gIdx) => (
                <Box key={gIdx}>
                  {!collapsed && (
                    <Text 
                      fontSize="10px" 
                      fontWeight="bold" 
                      textTransform="uppercase" 
                      color="#94a3b8" 
                      letterSpacing="0.05em" 
                      px={3} 
                      mb={1.5}
                    >
                      {group.group}
                    </Text>
                  )}

                  <Stack gap={0.5}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
                      return (
                        <Box
                          key={item.path}
                          as="button"
                          onClick={() => navigate(item.path)}
                          display="flex"
                          alignItems="center"
                          gap={2.5}
                          w="100%"
                          px={3}
                          py={2}
                          borderRadius="8px"
                          fontSize="xs"
                          fontWeight={isActive ? "bold" : "medium"}
                          color={isActive ? "#1d4ed8" : "#475569"}
                          bg={isActive ? "#eff6ff" : "transparent"}
                          borderLeft={isActive ? "3px solid #2563eb" : "3px solid transparent"}
                          _hover={{ 
                            bg: isActive ? "#eff6ff" : "#f8fafc", 
                            color: isActive ? "#1d4ed8" : "#0f172a" 
                          }}
                          transition="all 0.15s ease"
                          textAlign="left"
                          cursor="pointer"
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon size={16} style={{ flexShrink: 0, color: isActive ? '#2563eb' : '#64748b' }} />
                          {!collapsed && (
                            <Flex justify="space-between" align="center" flex="1" overflow="hidden">
                              <Text truncate>{item.label}</Text>
                              {item.badge && (
                                <Badge 
                                  size="xs" 
                                  colorPalette={item.badgeColor as any} 
                                  variant="solid" 
                                  fontSize="9px" 
                                  px={1.5}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Flex>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Sidebar Footer Info */}
          {!collapsed && (
            <Box m={3} p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
              <Flex align="center" gap={1.5} mb={0.5}>
                <CheckCircle2 size={12} color="#10b981" />
                <Text fontSize="11px" fontWeight="bold" color="#0f172a">
                  Enterprise v4.8
                </Text>
              </Flex>
              <Text fontSize="10px" color="#64748b">
                Production Light Suite
              </Text>
            </Box>
          )}
        </Box>

        {/* Content Area */}
        <Box as="main" flex="1" overflowY="auto" p={{ base: 4, md: 6, lg: 8 }} bg="#f8fafc">
          <Box maxW="1440px" mx="auto">
            {/* Elegant Breadcrumb Header */}
            <Flex align="center" justify="space-between" mb={5} pb={3} borderBottom="1px solid #e2e8f0">
              <Flex align="center" gap={2} fontSize="xs" color="#64748b">
                <Box as="button" onClick={() => navigate('/dashboard')} display="flex" alignItems="center" _hover={{ color: '#0f172a' }}>
                  <Home size={14} style={{ marginRight: '4px' }} />
                  ERP
                </Box>
                <Text color="#cbd5e1">/</Text>
                <Text color="#0f172a" fontWeight="semibold">
                  {currentTitle}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Badge size="xs" colorPalette="gray" variant="outline">
                  Live Synced
                </Badge>
              </Flex>
            </Flex>

            {/* Active Route Content */}
            <Outlet />
          </Box>
        </Box>
      </Flex>

      {/* Floating ERP Assistant Widget */}
      <FloatingAIAssistant />
    </Box>
  );
};
