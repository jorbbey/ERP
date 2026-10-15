import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Flex, Text, Button, Badge, Stack, NativeSelect } from '@chakra-ui/react';
import { useERP } from '../context/ERPContext';
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
  Scale,
  FolderKanban,
  Bot,
  Home,
  CheckCircle2,
  Search,
  Menu,
  X,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { PiShootingStarDuotone } from 'react-icons/pi';
import { FloatingAIAssistant } from '../features/assistant/components/FloatingAIAssistant';
import { EnterpriseSearchModal } from '../components/common/EnterpriseSearchModal';
import { NotificationsPopover } from '../components/common/NotificationsPopover';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { 
    companies, 
    activeCompany, 
    activeRole, 
    currentUserName,
    isImpersonating,
    stopImpersonation,
    requisitions,
    inventory,
    leaves,
    salaryAdvances,
    projects,
    supabaseUser,
    authLoading,
    signOutWithSupabase
  } = useERP();

  // Enforce authentication on all protected ERP routes
  useEffect(() => {
    if (!authLoading && !supabaseUser) {
      navigate('/login?mode=signin', { replace: true });
    }
  }, [authLoading, supabaseUser, navigate]);

  const pendingReqsCount = requisitions.filter(r => r.status === 'Pending Review' || (r.status as string).includes('Pending')).length;
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minLevel).length;
  const pendingHRActionsCount = leaves.filter(l => l.status === 'Pending').length + salaryAdvances.filter(a => a.status === 'Pending').length;

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  interface NavItem {
    path: string;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
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
        { path: '/portals', label: 'Role Portals Hub', icon: PiShootingStarDuotone },
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

  if (authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#f8fafc">
        <Flex direction="column" align="center" gap={3}>
          <Box 
            w="48px" 
            h="48px" 
            borderRadius="12px" 
            bg="#2563eb" 
            color="white" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            boxShadow="0 4px 12px rgba(37,99,235,0.25)"
          >
            <Building2 size={24} />
          </Box>
          <Text fontSize="sm" color="#64748b" fontWeight="medium">
            Verifying account credentials...
          </Text>
        </Flex>
      </Box>
    );
  }

  if (!supabaseUser) {
    return null;
  }

  return (
    <Box minH="100vh" bg="#f8fafc" display="flex" flexDirection="column" color="#0f172a">
      {/* Light Enterprise Topbar */}
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
          {/* Left: Mobile Toggle & Company Brand */}
          <Flex align="center" gap={{ base: 2, sm: 3 }}>
            {/* Mobile Hamburger Menu (STRICTLY HIDDEN ON DESKTOP) */}
            <Box 
              as="button"
              className="app-mobile-menu-toggle md:hidden"
              display={{ base: 'flex', md: 'none' }}
              p={1.5}
              borderRadius="6px"
              color="#64748b"
              _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </Box>

            <Box 
              w="36px" 
              h="36px" 
              borderRadius="10px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              bg={activeCompany.themeColor || '#2563eb'}
              color="white"
              boxShadow="0 2px 6px rgba(37, 99, 235, 0.25)"
              flexShrink={0}
              cursor="pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Building2 size={19} />
            </Box>
            <Box>
              <Flex align="center" gap={1.5}>
                <Text fontWeight="bold" fontSize="sm" lineHeight="shorter" color="#0f172a">
                  {activeCompany.name}
                </Text>
                <Badge size="xs" colorPalette="blue" variant="subtle" fontSize="10px">
                  {activeCompany.code}
                </Badge>
              </Flex>
              <Text fontSize="11px" color="#64748b" mt="1px" display={{ base: 'none', sm: 'block' }}>
                Commercial Construction Suite
              </Text>
            </Box>



            {/* Active Project Quick Switcher */}
            <Box ml={2} pl={3} borderLeft="1px solid #e2e8f0" display={{ base: 'none', xl: 'block' }}>
              <Flex align="center" gap={1.5}>
                <HardHat size={14} color="#ea580c" />
                <NativeSelect.Root size="xs">
                  <NativeSelect.Field 
                    aria-label="Active Construction Project Workspace"
                    value={location.pathname.startsWith('/projects/') ? location.pathname.split('/')[2] : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        navigate(`/projects/${e.target.value}`);
                      }
                    }}
                    bg="#fff7ed" 
                    color="#c2410c" 
                    borderColor="#fed7aa"
                    fontSize="xs"
                    cursor="pointer"
                    px={2}
                    py={1}
                    fontWeight="semibold"
                    maxW="220px"
                  >
                    <option value="">Project: Select Workspace...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.projectNumber}: {p.name}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Flex>
            </Box>
          </Flex>

          {/* Middle: Universal Search Bar Trigger */}
          <Box display={{ base: 'none', md: 'block' }} flex="1" maxW="360px" mx={2}>
            <Button
              variant="outline"
              size="xs"
              w="100%"
              justifyContent="space-between"
              bg="#f8fafc"
              borderColor="#e2e8f0"
              color="#64748b"
              _hover={{ borderColor: '#94a3b8', bg: '#ffffff', color: '#0f172a' }}
              onClick={() => setSearchModalOpen(true)}
              px={3}
              h="32px"
              borderRadius="8px"
            >
              <Flex align="center" gap={2}>
                <Search size={14} color="#64748b" />
                <Text fontSize="xs" fontWeight="normal">Quick Search ERP...</Text>
              </Flex>
              <Badge size="xs" variant="subtle" color="#64748b" fontSize="10px" px={1.5} py={0.5} borderRadius="4px">
                Ctrl+K
              </Badge>
            </Button>
          </Box>

          {/* Right Controls: Impersonation, Role Switcher, Search (mobile), Notifications, Profile */}
          <Flex align="center" gap={2}>
            {/* Mobile Search Button */}
            <Box 
              as="button"
              display={{ base: 'flex', md: 'none' }}
              p={2}
              borderRadius="8px"
              color="#64748b"
              _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search ERP"
            >
              <Search size={18} />
            </Box>

            {/* Impersonation Stop Alert */}
            {isImpersonating && (
              <Button 
                size="xs" 
                colorPalette="yellow" 
                variant="solid"
                onClick={stopImpersonation}
                fontWeight="bold"
              >
                Return to Admin
              </Button>
            )}



            {/* Notifications Alert Bell */}
            <Box 
              position="relative" 
              cursor="pointer" 
              p={2} 
              borderRadius="8px" 
              color="#64748b"
              _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
              onClick={() => setNotificationsOpen(true)}
              title="Operations Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {(pendingReqsCount > 0 || lowStockCount > 0) && (
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
                  {pendingReqsCount + (lowStockCount > 0 ? 1 : 0)}
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
              display={{ base: 'none', lg: 'inline-flex' }}
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
                  {supabaseUser?.email || activeRole}
                </Text>
              </Box>

              <Button
                size="xs"
                variant="ghost"
                color="#64748b"
                _hover={{ bg: '#fef2f2', color: '#b91c1c' }}
                onClick={async () => {
                  await signOutWithSupabase();
                  navigate('/login');
                }}
                title="Sign out of ERP account"
                px={2}
                h="28px"
              >
                <LogOut size={14} style={{ marginRight: '4px' }} />
                <Text fontSize="11px" display={{ base: 'none', lg: 'inline' }}>Sign Out</Text>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Main Layout Area */}
      <Flex flex="1" overflow="hidden">
        {/* Desktop Light Enterprise Sidebar */}
        <Box 
          as="aside" 
          w={collapsed ? '68px' : '255px'} 
          bg="#ffffff" 
          borderRight="1px solid #e2e8f0" 
          transition="width 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          display={{ base: 'none', md: 'flex' }}
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
        </Box>

        {/* Mobile Slide-Over Drawer Navigation */}
        {mobileNavOpen && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(15, 23, 42, 0.45)"
            backdropFilter="blur(2px)"
            zIndex="200"
            onClick={() => setMobileNavOpen(false)}
          >
            <Box
              w="280px"
              maxW="85vw"
              h="100%"
              bg="#ffffff"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              display="flex"
              flexDirection="column"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top */}
              <Flex justify="space-between" align="center" p={4} borderBottom="1px solid #e2e8f0">
                <Flex align="center" gap={2}>
                  <Box w="30px" h="30px" borderRadius="8px" bg="#2563eb" color="white" display="flex" alignItems="center" justifyContent="center">
                    <Building2 size={16} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">{activeCompany.name}</Text>
                    <Text fontSize="10px" color="#64748b">Navigation Menu</Text>
                  </Box>
                </Flex>
                <Box as="button" onClick={() => setMobileNavOpen(false)} p={1} color="#64748b">
                  <X size={18} />
                </Box>
              </Flex>

              {/* Navigation list */}
              <Box flex="1" overflowY="auto" p={3}>
                <Stack gap={4}>
                  {navGroups.map((group, gIdx) => (
                    <Box key={gIdx}>
                      <Text fontSize="10px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" px={2} mb={1}>
                        {group.group}
                      </Text>
                      <Stack gap={1}>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
                          return (
                            <Box
                              key={item.path}
                              as="button"
                              onClick={() => {
                                navigate(item.path);
                                setMobileNavOpen(false);
                              }}
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              w="100%"
                              px={3}
                              py={2.5}
                              borderRadius="8px"
                              fontSize="xs"
                              fontWeight={isActive ? "bold" : "medium"}
                              color={isActive ? "#1d4ed8" : "#475569"}
                              bg={isActive ? "#eff6ff" : "transparent"}
                            >
                              <Flex align="center" gap={2.5}>
                                <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} />
                                <Text>{item.label}</Text>
                              </Flex>
                              {item.badge && (
                                <Badge size="xs" colorPalette={item.badgeColor as any} variant="solid">
                                  {item.badge}
                                </Badge>
                              )}
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Drawer Bottom */}
              <Box p={3} borderTop="1px solid #e2e8f0" bg="#f8fafc">
                <Button 
                  size="xs" 
                  w="100%" 
                  variant="outline" 
                  borderColor="#cbd5e1" 
                  onClick={() => {
                    navigate('/landing');
                    setMobileNavOpen(false);
                  }}
                >
                  Visit Public Landing Page <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Content Area */}
        <Box as="main" flex="1" overflowY="auto" p={{ base: 3, md: 5, lg: 7 }} bg="#f8fafc">
          <Box maxW="1520px" mx="auto">
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


            </Flex>

            {/* Active Route Content */}
            <Outlet />
          </Box>
        </Box>
      </Flex>

      {/* Floating ERP Assistant Widget */}
      <FloatingAIAssistant />

      {/* Enterprise Search & Command Palette Modal */}
      <EnterpriseSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />

      {/* Operations Notifications Popover */}
      <NotificationsPopover 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </Box>
  );
};
