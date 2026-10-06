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
  FolderKanban
} from 'lucide-react';

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
    salaryAdvances,
    chatMessages
  } = useERP();

  const pendingReqsCount = requisitions.filter(r => r.status === 'Pending Review').length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minLevel).length;
  const pendingHRActionsCount = leaves.filter(l => l.status === 'Pending').length + salaryAdvances.filter(a => a.status === 'Pending').length;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects & Sites', icon: HardHat },
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
    { 
      path: '/hr', 
      label: 'HR & Personnel', 
      icon: Users,
      badge: pendingHRActionsCount > 0 ? String(pendingHRActionsCount) : undefined,
      badgeColor: 'purple'
    },
    { path: '/payroll', label: 'Payroll & Ledger', icon: Wallet },
    { path: '/rmc', label: 'Ready-Mix Concrete', icon: Truck },
    { path: '/equipment', label: 'Plant & Fleet', icon: Truck },
    { path: '/contract-admin', label: 'Contract Admin', icon: FileText },
    { path: '/documents', label: 'Documents & Files', icon: FolderKanban },
    { path: '/accounting', label: 'Accounting & Ledger', icon: Scale },
    { path: '/chat', label: 'Team Live Chat', icon: MessageSquare },
    { path: '/workflow', label: 'Approval Workflows', icon: Workflow },
    { path: '/portals', label: 'Role Portals Hub', icon: Sparkles },
    { path: '/settings', label: 'ERP Settings', icon: Sliders },
  ];

  return (
    <Box minH="100vh" bg="#f8fafc" display="flex" flexDirection="column">
      {/* Topbar */}
      <Box 
        as="header" 
        position="sticky" 
        top="0" 
        zIndex="100" 
        bg="#0f172a" 
        color="white" 
        px={5} 
        py={2.5}
        boxShadow="sm"
        borderBottom="1px solid #1e293b"
      >
        <Flex align="center" justify="space-between" gap={4}>
          {/* Company Brand */}
          <Flex align="center" gap={3}>
            <Box 
              w="38px" 
              h="38px" 
              borderRadius="10px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              bg={activeCompany.themeColor}
              color="white"
              boxShadow="0 2px 8px rgba(0,0,0,0.3)"
            >
              <Building2 size={20} />
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm" lineHeight="shorter" color="white">
                {activeCompany.name}
              </Text>
              <Flex align="center" gap={2} mt="1px">
                <Badge size="xs" colorPalette="cyan" variant="solid" fontSize="10px">
                  {activeCompany.code}
                </Badge>
                <Text fontSize="11px" color="#94a3b8">
                  Construction ERP Suite
                </Text>
              </Flex>
            </Box>

            {/* Multi-Company Workspace Switcher */}
            <Box ml={3} pl={3} borderLeft="1px solid #334155" display={{ base: 'none', md: 'block' }}>
              <NativeSelect.Root size="xs">
                <NativeSelect.Field 
                  aria-label="Select Active Company"
                  value={activeCompany.id} 
                  onChange={(e) => setActiveCompanyId(Number(e.target.value))}
                  bg="#1e293b" 
                  color="white" 
                  borderColor="#475569"
                  fontSize="xs"
                  cursor="pointer"
                  px={2}
                  py={1}
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#0f172a', color: 'white' }}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Flex>

          {/* Right Controls: Role Switcher, Impersonation return, Notifications, Profile */}
          <Flex align="center" gap={3}>
            {/* Impersonation Stop Alert */}
            {isImpersonating && (
              <Button 
                size="xs" 
                colorPalette="yellow" 
                onClick={stopImpersonation}
                fontWeight="bold"
              >
                Return to Super Admin
              </Button>
            )}

            {/* Role Switcher */}
            <Flex align="center" gap={2} bg="#1e293b" px={2.5} py={1} borderRadius="8px" border="1px solid #334155">
              <Text fontSize="xs" color="#94a3b8" display={{ base: 'none', sm: 'inline' }}>
                Role:
              </Text>
              <NativeSelect.Root size="xs">
                <NativeSelect.Field 
                  aria-label="Active Role"
                  value={activeRole} 
                  onChange={(e) => setActiveRole(e.target.value as UserRole)}
                  bg="transparent" 
                  color="#38bdf8" 
                  fontWeight="bold"
                  borderColor="transparent"
                  cursor="pointer"
                  p={0}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r} style={{ background: '#0f172a', color: 'white' }}>
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
              _hover={{ bg: '#1e293b' }}
              onClick={() => navigate('/requisitions')}
              title={`${pendingReqsCount} pending requisitions`}
            >
              <Bell size={18} color="#94a3b8" />
              {pendingReqsCount > 0 && (
                <Box 
                  position="absolute" 
                  top="2px" 
                  right="2px" 
                  bg="#f59e0b" 
                  color="#0f172a" 
                  fontSize="10px" 
                  fontWeight="900"
                  w="16px" 
                  h="16px" 
                  borderRadius="full" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  {pendingReqsCount}
                </Box>
              )}
            </Box>

            {/* User Profile Capsule */}
            <Flex align="center" gap={2.5} pl={2} borderLeft="1px solid #334155">
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
              >
                {currentUserName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Box>
              <Box display={{ base: 'none', lg: 'block' }}>
                <Text fontSize="xs" fontWeight="semibold" color="white" lineHeight="1">
                  {currentUserName}
                </Text>
                <Text fontSize="10px" color="#94a3b8" mt="2px">
                  {activeRole}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Main Layout Area */}
      <Flex flex="1" overflow="hidden">
        {/* Sidebar */}
        <Box 
          as="aside" 
          w={collapsed ? '68px' : '250px'} 
          bg="#0f172a" 
          borderRight="1px solid #1e293b" 
          transition="width 0.2s ease"
          display="flex"
          flexDirection="column"
          flexShrink={0}
        >
          {/* Collapse Header */}
          <Flex align="center" justify={collapsed ? "center" : "space-between"} px={3} py={2.5} borderBottom="1px solid #1e293b">
            {!collapsed && (
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b" letterSpacing="wider">
                Modules
              </Text>
            )}
            <Box 
              as="button" 
              onClick={() => setCollapsed(!collapsed)} 
              p={1} 
              borderRadius="6px" 
              color="#94a3b8" 
              _hover={{ bg: '#1e293b', color: 'white' }}
              cursor="pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Box>
          </Flex>

          {/* Navigation Links */}
          <Box flex="1" overflowY="auto" p={2}>
            <Stack gap={1}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
                return (
                  <Box
                    key={item.path}
                    as="button"
                    onClick={() => navigate(item.path)}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    w="100%"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    fontSize="xs"
                    fontWeight={isActive ? "bold" : "medium"}
                    color={isActive ? "white" : "#94a3b8"}
                    bg={isActive ? "#2563eb" : "transparent"}
                    _hover={{ bg: isActive ? "#2563eb" : "#1e293b", color: "white" }}
                    transition="background 0.15s ease"
                    textAlign="left"
                    cursor="pointer"
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={17} style={{ flexShrink: 0 }} />
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

          {!collapsed && (
            <Box m={3} p={3} bg="#1e293b" borderRadius="10px" border="1px solid #334155">
              <Text fontSize="11px" fontWeight="bold" color="white">
                Construction ERP v3.0
              </Text>
              <Text fontSize="10px" color="#94a3b8" mt={0.5}>
                Chakra UI v3 + React + Vite
              </Text>
            </Box>
          )}
        </Box>

        {/* Content Area */}
        <Box as="main" flex="1" overflowY="auto" p={{ base: 4, md: 6, lg: 8 }}>
          <Box maxW="1400px" mx="auto">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
