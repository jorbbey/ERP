import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Card,
  Stack,
  Input,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  Building2,
  HardHat,
  Boxes,
  ClipboardList,
  ShoppingCart,
  Users,
  Wallet,
  Scale,
  Truck,
  FileText,
  MessageSquare,
  FolderKanban,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Layers,
  Lock,
  Database,
  Activity,
  Check,
  Menu,
  X,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCheck,
  FileCode,
  MapPin,
  ChevronDown,
  Globe2,
  CheckCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCompany, projects, employees, requisitions, inventory } = useERP();

  // Navigation scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demo Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    projectVolume: '$5M - $25M',
    role: 'Managing Director / CEO'
  });

  // Interactive Dashboard Preview Tab
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'projects' | 'procurement' | 'fleet' | 'financials'>('overview');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setShowDemoModal(false);
    }, 2500);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const modulesList = [
    {
      key: 'projects',
      path: '/projects',
      name: 'Civil Projects & Sites',
      icon: HardHat,
      color: '#2563eb',
      desc: 'Milestones, daily engineer logs, RFIs, BOQ quantity takeoff, delay claims and CAD drawing repository.'
    },
    {
      key: 'requisitions',
      path: '/requisitions',
      name: 'Material Requisitions',
      icon: ClipboardList,
      color: '#f59e0b',
      desc: 'Multi-stage site approval chain, waybills, storekeeper verification and automated stock reservation.'
    },
    {
      key: 'inventory',
      path: '/inventory',
      name: 'Stores & Central Inventory',
      icon: Boxes,
      color: '#ef4444',
      desc: 'Multi-warehouse stock control, SKU tracking, reorder alert thresholds and material adjustments.'
    },
    {
      key: 'procurement',
      path: '/procurement',
      name: 'Procurement & Purchase Orders',
      icon: ShoppingCart,
      color: '#8b5cf6',
      desc: 'Vendor comparative quotes, purchase orders (PO), Goods Received Notes (GRN) and 3-way matching.'
    },
    {
      key: 'hr',
      path: '/hr',
      name: 'HR, Staff & Attendance',
      icon: Users,
      color: '#10b981',
      desc: 'Employee dossiers, biometric attendance terminals, leave management, recruitment and salary advances.'
    },
    {
      key: 'payroll',
      path: '/payroll',
      name: 'Payroll & Remuneration',
      icon: Wallet,
      color: '#059669',
      desc: 'Tax deductions, pension schedules, salary slips, multi-currency processing and direct bank exports.'
    },
    {
      key: 'rmc',
      path: '/rmc',
      name: 'Ready-Mix Concrete (RMC)',
      icon: Truck,
      color: '#0284c7',
      desc: 'Mix designs, automated batch tickets, slump quality inspection logs and transit mixer tracking.'
    },
    {
      key: 'equipment',
      path: '/equipment',
      name: 'Plant, Machinery & Fleet',
      icon: Truck,
      color: '#d97706',
      desc: 'Heavy equipment telematics, preventive maintenance schedules, diesel fuel logs and machine hours.'
    },
    {
      key: 'contract-admin',
      path: '/contract-admin',
      name: 'FIDIC Contracts Administration',
      icon: FileText,
      color: '#6366f1',
      desc: 'Variation orders, interim payment certificates (IPC), retention funds and formal contractor claims.'
    },
    {
      key: 'documents',
      path: '/documents',
      name: 'Document Vault & Technical Drawings',
      icon: FolderKanban,
      color: '#ec4899',
      desc: 'Architectural blueprints, site safety permits, version control and secure digital asset archives.'
    },
    {
      key: 'accounting',
      path: '/accounting',
      name: 'General Accounting Ledger',
      icon: Scale,
      color: '#475569',
      desc: 'Double-entry books, chart of accounts, profit & loss, project cost allocations and trial balances.'
    },
    {
      key: 'workflow',
      path: '/workflow',
      name: 'Multi-Tier Approval Engine',
      icon: Workflow,
      color: '#3b82f6',
      desc: 'Role-based authority limits, sequential QS/PM/MD signing hierarchies and transparent audit trails.'
    }
  ];

  return (
    <Box minH="100vh" bg="#ffffff" color="#0f172a" fontFamily="sans-serif">
      {/* 1. NAVBAR (Sticky Light Header) */}
      <Box
        as="header"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="1000"
        transition="all 0.2s ease"
        bg={isScrolled ? 'rgba(255, 255, 255, 0.96)' : '#ffffff'}
        backdropFilter={isScrolled ? 'blur(10px)' : 'none'}
        borderBottom="1px solid"
        borderColor={isScrolled ? '#e2e8f0' : 'transparent'}
        boxShadow={isScrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.05)' : 'none'}
      >
        <Flex
          maxW="1280px"
          mx="auto"
          align="center"
          justify="space-between"
          px={{ base: 4, md: 8 }}
          h="70px"
        >
          {/* Logo & ERP Name */}
          <Flex align="center" gap={3} cursor="pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Box
              w="38px"
              h="38px"
              borderRadius="10px"
              bg="#2563eb"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 2px 6px rgba(37, 99, 235, 0.3)"
            >
              <Building2 size={22} />
            </Box>
            <Box>
              <Flex align="center" gap={2}>
                <Text fontSize="lg" fontWeight="extrabold" color="#0f172a" letterSpacing="-0.02em">
                  APEX CONSTRUCT
                </Text>
                <Badge size="xs" colorPalette="blue" variant="solid" fontSize="10px">
                  ERP
                </Badge>
              </Flex>
              <Text fontSize="10px" color="#64748b" fontWeight="medium" letterSpacing="0.04em">
                COMMERCIAL ENTERPRISE SUITE
              </Text>
            </Box>
          </Flex>

          {/* Desktop Navigation Links */}
          <Flex align="center" gap={8} display={{ base: 'none', lg: 'flex' }}>
            <Box as="button" onClick={() => scrollToSection('features')} fontSize="sm" fontWeight="medium" color="#475569" _hover={{ color: '#2563eb' }} cursor="pointer">
              Features
            </Box>
            <Box as="button" onClick={() => scrollToSection('modules')} fontSize="sm" fontWeight="medium" color="#475569" _hover={{ color: '#2563eb' }} cursor="pointer">
              Modules
            </Box>
            <Box as="button" onClick={() => scrollToSection('workflow')} fontSize="sm" fontWeight="medium" color="#475569" _hover={{ color: '#2563eb' }} cursor="pointer">
              Workflow
            </Box>
            <Box as="button" onClick={() => scrollToSection('benefits')} fontSize="sm" fontWeight="medium" color="#475569" _hover={{ color: '#2563eb' }} cursor="pointer">
              Benefits
            </Box>
            <Box as="button" onClick={() => scrollToSection('preview')} fontSize="sm" fontWeight="medium" color="#475569" _hover={{ color: '#2563eb' }} cursor="pointer">
              Dashboard
            </Box>
            <Box as="button" onClick={() => scrollToSection('security')} fontSize="sm" fontWeight="medium" color="#475569" _hover={{ color: '#2563eb' }} cursor="pointer">
              Security
            </Box>
          </Flex>

          {/* Right Action CTAs */}
          <Flex align="center" gap={3}>
            <Button
              size="sm"
              variant="outline"
              borderColor="#cbd5e1"
              color="#0f172a"
              _hover={{ bg: '#f8fafc', borderColor: '#94a3b8' }}
              onClick={() => navigate('/login')}
              fontWeight="semibold"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              bg="#2563eb"
              color="white"
              _hover={{ bg: '#1d4ed8' }}
              onClick={() => navigate('/dashboard')}
              fontWeight="semibold"
              boxShadow="0 2px 6px rgba(37, 99, 235, 0.25)"
            >
              Launch Software <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </Button>

            {/* Mobile Hamburger Menu Toggle */}
            <Box
              as="button"
              display={{ base: 'flex', lg: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              p={2}
              borderRadius="8px"
              color="#0f172a"
              _hover={{ bg: '#f1f5f9' }}
              cursor="pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Box>
          </Flex>
        </Flex>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <Box bg="#ffffff" borderBottom="1px solid #e2e8f0" px={5} py={4} display={{ base: 'block', lg: 'none' }} boxShadow="md">
            <Stack gap={3}>
              <Box as="button" textAlign="left" py={2} fontSize="sm" fontWeight="semibold" color="#0f172a" onClick={() => scrollToSection('features')}>
                Core Capabilities
              </Box>
              <Box as="button" textAlign="left" py={2} fontSize="sm" fontWeight="semibold" color="#0f172a" onClick={() => scrollToSection('modules')}>
                ERP Modules (12)
              </Box>
              <Box as="button" textAlign="left" py={2} fontSize="sm" fontWeight="semibold" color="#0f172a" onClick={() => scrollToSection('workflow')}>
                Operational Workflow
              </Box>
              <Box as="button" textAlign="left" py={2} fontSize="sm" fontWeight="semibold" color="#0f172a" onClick={() => scrollToSection('benefits')}>
                Enterprise Benefits
              </Box>
              <Box as="button" textAlign="left" py={2} fontSize="sm" fontWeight="semibold" color="#0f172a" onClick={() => scrollToSection('preview')}>
                Live Dashboard Preview
              </Box>
              <Box as="button" textAlign="left" py={2} fontSize="sm" fontWeight="semibold" color="#0f172a" onClick={() => scrollToSection('security')}>
                Security & RBAC
              </Box>
              <Button size="sm" w="100%" bg="#2563eb" color="white" onClick={() => navigate('/dashboard')}>
                Launch Live Software
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      {/* 2. HERO SECTION */}
      <Box pt={{ base: '105px', md: '135px' }} pb={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)">
        <Box maxW="1280px" mx="auto">
          {/* Top Pill / Badge */}
          <Flex justify="center" mb={5}>
            <Flex
              align="center"
              gap={2}
              bg="#eff6ff"
              border="1px solid #bfdbfe"
              borderRadius="full"
              px={3.5}
              py={1.5}
              boxShadow="0 1px 3px rgba(37,99,235,0.08)"
            >
              <Box w="8px" h="8px" borderRadius="full" bg="#10b981" />
              <Text fontSize="xs" fontWeight="semibold" color="#1e40af">
                Commercial Construction & Engineering Operating System
              </Text>
              <Badge size="xs" colorPalette="blue" variant="solid" fontSize="10px">
                v4.8 Certified
              </Badge>
            </Flex>
          </Flex>

          {/* Headline */}
          <Box textAlign="center" maxW="980px" mx="auto" mb={6}>
            <Heading
              size={{ base: '2xl', md: '4xl', lg: '5xl' }}
              fontWeight="black"
              lineHeight="1.15"
              letterSpacing="-0.03em"
              color="#0f172a"
            >
              One Platform to Run Your Entire Construction Business.
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'xl' }}
              color="#475569"
              mt={5}
              maxW="820px"
              mx="auto"
              lineHeight="relaxed"
            >
              Unify civil projects, site material requisitions, storehouse inventory, ready-mix batching, heavy plant fleet, biometric labor, computerized payroll, and FIDIC contracts into one certified source of truth.
            </Text>
          </Box>

          {/* Dual CTAs */}
          <Flex justify="center" align="center" gap={4} wrap="wrap" mb={12}>
            <Button
              size="lg"
              bg="#2563eb"
              color="white"
              px={8}
              h="54px"
              fontSize="md"
              fontWeight="bold"
              borderRadius="12px"
              boxShadow="0 4px 14px rgba(37, 99, 235, 0.3)"
              _hover={{ bg: '#1d4ed8', transform: 'translateY(-1px)' }}
              transition="all 0.15s ease"
              onClick={() => navigate('/dashboard')}
            >
              Explore ERP System <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="#cbd5e1"
              color="#0f172a"
              bg="white"
              px={8}
              h="54px"
              fontSize="md"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{ bg: '#f8fafc', borderColor: '#94a3b8' }}
              onClick={() => setShowDemoModal(true)}
            >
              Request a Demo
            </Button>
          </Flex>

          {/* Hero Realistic Light Dashboard Preview Mockup */}
          <Box
            maxW="1180px"
            mx="auto"
            bg="#ffffff"
            borderRadius="16px"
            border="1px solid #cbd5e1"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)"
            overflow="hidden"
          >
            {/* Window Top Bar */}
            <Flex align="center" justify="space-between" px={4} py={3} bg="#f8fafc" borderBottom="1px solid #e2e8f0">
              <Flex align="center" gap={2}>
                <Box w="10px" h="10px" borderRadius="full" bg="#ef4444" />
                <Box w="10px" h="10px" borderRadius="full" bg="#f59e0b" />
                <Box w="10px" h="10px" borderRadius="full" bg="#10b981" />
                <Text fontSize="xs" color="#64748b" ml={3} fontFamily="mono">
                  https://app.apexconstruction.com/dashboard • [{activeCompany?.name || 'Apex Construction Group'}]
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Badge size="xs" colorPalette="blue" variant="subtle">
                  Workspace: {activeCompany?.code || 'APEX'}
                </Badge>
                <Badge size="xs" colorPalette="green" variant="solid">
                  Live Operations
                </Badge>
              </Flex>
            </Flex>

            {/* Inner Dashboard Viewport */}
            <Box p={{ base: 4, md: 6 }} bg="#f8fafc">
              {/* Stat Counters Row */}
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
                <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Active Civil Projects</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>
                    {(projects || []).length} Major Sites
                  </Text>
                  <Text fontSize="11px" color="#2563eb" fontWeight="medium" mt={1}>100% On-Schedule</Text>
                </Box>

                <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Contract Book Managed</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#059669" mt={1}>
                    ${(((projects || []).reduce((acc, p) => acc + (p?.contractValue ?? p?.budget ?? 0), 0)) / 1000000).toFixed(1)}M USD
                  </Text>
                  <Text fontSize="11px" color="#64748b" mt={1}>FIDIC Controlled</Text>
                </Box>

                <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Verified Staff Personnel</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>
                    {employees.length} Personnel
                  </Text>
                  <Text fontSize="11px" color="#7c3aed" fontWeight="medium" mt={1}>Biometric Log Active</Text>
                </Box>

                <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Stock & Material SKUs</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#d97706" mt={1}>
                    {inventory.length} Warehouse SKUs
                  </Text>
                  <Text fontSize="11px" color="#64748b" mt={1}>Multi-Store Synced</Text>
                </Box>
              </SimpleGrid>

              {/* Two Column Layout Mockup */}
              <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5}>
                {/* 2 Cols: Active Project Execution Progress */}
                <Box gridColumn={{ lg: 'span 2' }} bg="#ffffff" p={5} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Flex justify="space-between" align="center" mb={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#64748b">Civil Infrastructure Portfolio</Text>
                      <Heading size="sm" color="#0f172a" mt={0.5}>Major Sites Under Execution</Heading>
                    </Box>
                    <Badge size="xs" colorPalette="green" variant="subtle">Physical Milestone Tracking</Badge>
                  </Flex>

                  <Stack gap={3.5}>
                    {(projects || []).slice(0, 3).map((p) => (
                      <Box key={p.id} p={3.5} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                        <Flex justify="space-between" align="center" mb={2}>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" color="#0f172a">{p.name || 'Civil Infrastructure Project'}</Text>
                            <Text fontSize="11px" color="#64748b">{p.clientName || 'Institutional Client'} • {p.siteLocation || 'Main Sector'}</Text>
                          </Box>
                          <Flex align="center" gap={3}>
                            <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#059669">
                              ${(p.contractValue ?? p.budget ?? 0).toLocaleString()}
                            </Text>
                            <Badge size="xs" colorPalette="blue" variant="solid">{p.progressPercent ?? 0}% Complete</Badge>
                          </Flex>
                        </Flex>
                        <Box w="100%" h="6px" bg="#e2e8f0" borderRadius="full" overflow="hidden">
                          <Box h="100%" w={`${p.progressPercent ?? 0}%`} bg="#2563eb" borderRadius="full" />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* 1 Col: Live Governance & Requisitions Feed */}
                <Box bg="#ffffff" p={5} borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#64748b" mb={1}>Live Operations Feed</Text>
                  <Heading size="sm" color="#0f172a" mb={4}>Approval Chain Audit</Heading>

                  <Stack gap={3}>
                    <Flex gap={3} align="start" p={2.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                      <Box p={1.5} bg="#dcfce7" color="#16a34a" borderRadius="6px" mt={0.5}>
                        <CheckCircle size={15} />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">Batch Ticket #RMC-904 Dispatched</Text>
                        <Text fontSize="10px" color="#64748b">32m³ Grade C35 Concrete to Flyover Pier 4</Text>
                      </Box>
                    </Flex>

                    <Flex gap={3} align="start" p={2.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                      <Box p={1.5} bg="#fef3c7" color="#d97706" borderRadius="6px" mt={0.5}>
                        <ClipboardList size={15} />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">Material Requisition #REQ-402</Text>
                        <Text fontSize="10px" color="#64748b">450 Bags Dangote 42.5R Cement pending QS sign-off</Text>
                      </Box>
                    </Flex>

                    <Flex gap={3} align="start" p={2.5} bg="#f8fafc" borderRadius="8px" border="1px solid #e2e8f0">
                      <Box p={1.5} bg="#e0e7ff" color="#4f46e5" borderRadius="6px" mt={0.5}>
                        <FileText size={15} />
                      </Box>
                      <Box flex="1">
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">IPC #08 Interim Certificate Approved</Text>
                        <Text fontSize="10px" color="#64748b">$420,000 certified by Resident Engineer</Text>
                      </Box>
                    </Flex>
                  </Stack>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 3. TRUST & VALUE STRIP */}
      <Box id="features" py={12} bg="#ffffff" borderY="1px solid #e2e8f0">
        <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }}>
          <Text textAlign="center" fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#64748b" letterSpacing="0.08em" mb={8}>
            ENTERPRISE CAPABILITIES TAILORED FOR GENERAL CONTRACTORS & INFRASTRUCTURE DEVELOPERS
          </Text>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap={4}>
            {[
              { icon: HardHat, title: 'Project Controls', desc: 'BOQs, Milestones & Daily Logs' },
              { icon: Boxes, title: 'Material Stores', desc: 'Central Stores & Site Warehouses' },
              { icon: ShoppingCart, title: 'Procurement', desc: '3-Way Match POs & Vendor GRNs' },
              { icon: Truck, title: 'Plant & Heavy Fleet', desc: 'Telematics, Service & Fuel Logs' },
              { icon: Users, title: 'Biometric Labor', desc: 'Direct Site Attendance & Payroll' },
              { icon: Scale, title: 'FIDIC Accounting', desc: 'IPCs, Variations & General Ledger' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <Box
                  key={i}
                  p={4}
                  bg="#f8fafc"
                  borderRadius="12px"
                  border="1px solid #e2e8f0"
                  textAlign="center"
                  _hover={{ borderColor: '#93c5fd', transform: 'translateY(-2px)' }}
                  transition="all 0.15s ease"
                >
                  <Box w="36px" h="36px" borderRadius="10px" bg="#eff6ff" color="#2563eb" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={2.5}>
                    <Icon size={18} />
                  </Box>
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">{v.title}</Text>
                  <Text fontSize="10px" color="#64748b" mt={0.5}>{v.desc}</Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* 4. WHY THIS ERP (PROBLEM VS SOLUTION) */}
      <Box py={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="#f8fafc">
        <Box maxW="1280px" mx="auto">
          <Box textAlign="center" maxW="760px" mx="auto" mb={14}>
            <Badge size="sm" colorPalette="blue" variant="subtle" mb={2}>THE OPERATIONAL REALITY</Badge>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Built Specifically to Solve the Chaos of Fragmented Construction Sites.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={3}>
              Traditional generic ERPs fail because they do not understand bill of quantities, transit mix batches, plant breakdowns, or FIDIC variation claims.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            {/* The Old Problem */}
            <Box p={{ base: 6, md: 8 }} bg="#ffffff" borderRadius="16px" border="1px solid #fee2e2" boxShadow="xs">
              <Flex align="center" gap={2.5} mb={4}>
                <Box p={2} bg="#fee2e2" color="#dc2626" borderRadius="8px">
                  <AlertTriangle size={20} />
                </Box>
                <Heading size="md" color="#991b1b">The Fragmented Construction Pain</Heading>
              </Flex>

              <Stack gap={4}>
                {[
                  { title: 'Scattered Information in Paper & Spreadsheets', desc: 'Site engineers log work on paper, quantity surveyors manage Excel BOQs, and head office finance operates on disconnected accounting software.' },
                  { title: 'Blind-Spot Project Delays & Cost Overruns', desc: 'Management discovers material shortages, labor absenteeism, or contractor claims weeks after they happen, leading to unrecoverable losses.' },
                  { title: 'Rogue, Unapproved Site Procurement', desc: 'Materials purchased at arbitrary rates without competitive vendor quotes or matching against authorized BOQ budget allowances.' },
                  { title: 'Storehouse Leakage & Unaccounted Steel/Cement', desc: 'Materials dispatched from central depots disappear into secondary sites without waybills, digital GRN receipts, or storekeeper sign-off.' }
                ].map((item, idx) => (
                  <Flex key={idx} gap={3} align="start">
                    <Box w="6px" h="6px" borderRadius="full" bg="#ef4444" mt={2} flexShrink={0} />
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="#0f172a">{item.title}</Text>
                      <Text fontSize="xs" color="#64748b" mt={0.5}>{item.desc}</Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>

            {/* The Centralized Solution */}
            <Box p={{ base: 6, md: 8 }} bg="#ffffff" borderRadius="16px" border="1px solid #bbf7d0" boxShadow="xs">
              <Flex align="center" gap={2.5} mb={4}>
                <Box p={2} bg="#dcfce7" color="#16a34a" borderRadius="8px">
                  <CheckCircle2 size={20} />
                </Box>
                <Heading size="md" color="#166534">The Centralized Institutional Solution</Heading>
              </Flex>

              <Stack gap={4}>
                {[
                  { title: 'Single Unified Operational Database', desc: 'Direct linkage between physical BOQ line items, site material requisitions, purchase orders, store stock, and the general financial ledger.' },
                  { title: 'Strict Multi-Level Electronic Sign-Offs', desc: 'Enforces sequential approval gates: Site Engineer → Quantity Surveyor → Procurement Lead → Managing Director before purchase commitments.' },
                  { title: 'Guaranteed 3-Way Matching for Every Invoice', desc: 'Purchases automatically cross-referenced with authorized PO terms and physical Goods Received Notes (GRN) before payment authorization.' },
                  { title: 'Complete Traceability from Quarry to Pour', desc: 'Track raw aggregate batches, cement silo stock levels, ready-mix slump test results, and transit mixer deliveries with concrete audit trails.' }
                ].map((item, idx) => (
                  <Flex key={idx} gap={3} align="start">
                    <Box w="6px" h="6px" borderRadius="full" bg="#10b981" mt={2} flexShrink={0} />
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="#0f172a">{item.title}</Text>
                      <Text fontSize="xs" color="#64748b" mt={0.5}>{item.desc}</Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* 5. CORE MODULES SHOWCASE */}
      <Box id="modules" py={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="#ffffff">
        <Box maxW="1280px" mx="auto">
          <Box textAlign="center" maxW="760px" mx="auto" mb={14}>
            <Badge size="sm" colorPalette="blue" variant="subtle" mb={2}>FULL MODULE COVERAGE</Badge>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              12 Specialized Modules. Zero Fragmented Add-Ons.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={3}>
              Every module is already fully coded and integrated into the software. Click any module to navigate directly into the active software.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
            {modulesList.map((m) => {
              const Icon = m.icon;
              return (
                <Box
                  key={m.key}
                  as="button"
                  onClick={() => navigate(m.path)}
                  p={5}
                  bg="#f8fafc"
                  borderRadius="14px"
                  border="1px solid #e2e8f0"
                  textAlign="left"
                  cursor="pointer"
                  _hover={{
                    bg: '#ffffff',
                    borderColor: '#93c5fd',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)'
                  }}
                  transition="all 0.15s ease"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Box>
                    <Flex justify="space-between" align="start" mb={3}>
                      <Box
                        w="42px"
                        h="42px"
                        borderRadius="10px"
                        bg="#ffffff"
                        border="1px solid #e2e8f0"
                        color={m.color}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="xs"
                      >
                        <Icon size={20} />
                      </Box>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Flex>
                    <Text fontSize="md" fontWeight="bold" color="#0f172a">{m.name}</Text>
                    <Text fontSize="xs" color="#64748b" mt={1.5} lineHeight="relaxed">
                      {m.desc}
                    </Text>
                  </Box>

                  <Flex align="center" gap={1.5} mt={4} pt={3} borderTop="1px solid #f1f5f9" fontSize="11px" fontWeight="semibold" color="#2563eb">
                    <Text>Launch Module</Text>
                    <ArrowRight size={12} />
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* 6. ERP WORKFLOW / HOW IT CONNECTS */}
      <Box id="workflow" py={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="#f8fafc" borderTop="1px solid #e2e8f0">
        <Box maxW="1280px" mx="auto">
          <Box textAlign="center" maxW="760px" mx="auto" mb={14}>
            <Badge size="sm" colorPalette="blue" variant="subtle" mb={2}>THE INTERCONNECTED PIPELINE</Badge>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              How Departments Work Seamlessly as One.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={3}>
              Data moves in a strict, tamper-proof sequence ensuring full foreign key integrity from site request to general ledger balance.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            {[
              { step: '01', title: 'Project & BOQ Creation', dept: 'Civil Engineering / QS', desc: 'Milestones, quantities, and target budgets established with full CAD drawing links.', color: '#2563eb' },
              { step: '02', title: 'Material Requisition', dept: 'Site Quantity Surveyor', desc: 'Site teams requisition materials against approved BOQ allowances with reason codes.', color: '#d97706' },
              { step: '03', title: 'Procurement & Vendor PO', dept: 'Procurement Officer', desc: 'Vendor comparative pricing, formal PO issuance, and scheduled delivery tracking.', color: '#7c3aed' },
              { step: '04', title: 'Store Delivery & GRN', dept: 'Warehouse Storekeeper', desc: 'Physical inspection, Goods Received Note matching, and automated inventory balance update.', color: '#059669' },
              { step: '05', title: 'Heavy Fleet & Batching', dept: 'Plant & Equipment Lead', desc: 'Concrete batch plant dispatch tickets, equipment telematics, and diesel fuel tracking.', color: '#0284c7' },
              { step: '06', title: 'General Ledger Posting', dept: 'Accounts & Finance', desc: 'Automated double-entry journal vouchers, payroll slips, and invoice reconciliation.', color: '#dc2626' },
              { step: '07', title: 'FIDIC Contract & Claims', dept: 'Contract Administrator', desc: 'Interim Payment Certificates (IPCs), variation orders, and retention escrow fund balances.', color: '#4f46e5' },
              { step: '08', title: 'Executive BI & Reporting', dept: 'Managing Director / Board', desc: 'Real-time financial exposure, site delays, profitability per cubic meter and compliance.', color: '#0f172a' }
            ].map((step, idx) => (
              <Box
                key={idx}
                p={5}
                bg="#ffffff"
                borderRadius="14px"
                border="1px solid #e2e8f0"
                boxShadow="xs"
                position="relative"
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="xl" fontWeight="black" color={step.color} fontFamily="mono">
                    {step.step}
                  </Text>
                  <Badge size="xs" colorPalette="gray" variant="subtle">
                    {step.dept}
                  </Badge>
                </Flex>
                <Text fontSize="sm" fontWeight="bold" color="#0f172a">{step.title}</Text>
                <Text fontSize="xs" color="#64748b" mt={1.5} lineHeight="relaxed">
                  {step.desc}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* 7. BUSINESS BENEFITS */}
      <Box id="benefits" py={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="#ffffff">
        <Box maxW="1280px" mx="auto">
          <Box textAlign="center" maxW="760px" mx="auto" mb={14}>
            <Badge size="sm" colorPalette="blue" variant="subtle" mb={2}>MEASURABLE RETURN ON INVESTMENT</Badge>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Measurable Operational Advantages.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={3}>
              Designed for serious commercial contractors managing tens of millions in project portfolios.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {[
              {
                icon: TrendingUp,
                title: 'Zero Material Slippage',
                metric: '18% Savings',
                desc: 'Prevent storehouse leakage, unrecorded tool losses, and undocumented diesel siphoning with mandatory digital waybills and GRN confirmation.'
              },
              {
                icon: Clock,
                title: 'Accelerated Approvals',
                metric: '4x Faster Decisions',
                desc: 'Eliminate multi-day delays of paper requisitions travelling between remote site trailers and corporate headquarters.'
              },
              {
                icon: ShieldCheck,
                title: 'Guaranteed 3-Way Matching',
                metric: '100% Audit Safety',
                desc: 'Never overpay a vendor. Every invoice is mathematically verified against initial PO rates and confirmed delivery weights.'
              },
              {
                icon: Users,
                title: 'Biometric Labor Control',
                metric: 'Zero Ghost Workers',
                desc: 'Tie site attendance logs directly into the computerized payroll engine, ensuring daily paid wages reflect verified gate check-ins.'
              },
              {
                icon: FileText,
                title: 'FIDIC Contract Protection',
                metric: '100% Claim Defense',
                desc: 'Consistently log site delays, consultant RFIs, and inclement weather logs with cryptographic timestamps to defend IPC delay penalties.'
              },
              {
                icon: DollarSign,
                title: 'Consolidated Holding Accounts',
                metric: 'Instant Financial Health',
                desc: 'Maintain independent books and currencies for parent companies, regional subsidiaries, and joint-venture consortia simultaneously.'
              }
            ].map((b, idx) => {
              const Icon = b.icon;
              return (
                <Box
                  key={idx}
                  p={6}
                  bg="#f8fafc"
                  borderRadius="16px"
                  border="1px solid #e2e8f0"
                  _hover={{ borderColor: '#93c5fd', transform: 'translateY(-2px)' }}
                  transition="all 0.15s ease"
                >
                  <Flex justify="space-between" align="start" mb={4}>
                    <Box w="42px" h="42px" borderRadius="10px" bg="#eff6ff" color="#2563eb" display="flex" alignItems="center" justifyContent="center">
                      <Icon size={22} />
                    </Box>
                    <Badge size="xs" colorPalette="green" variant="solid" fontSize="11px">
                      {b.metric}
                    </Badge>
                  </Flex>
                  <Text fontSize="md" fontWeight="bold" color="#0f172a">{b.title}</Text>
                  <Text fontSize="xs" color="#64748b" mt={2} lineHeight="relaxed">
                    {b.desc}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* 8. INTERACTIVE DASHBOARD PREVIEW */}
      <Box id="preview" py={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="#f8fafc" borderTop="1px solid #e2e8f0">
        <Box maxW="1280px" mx="auto">
          <Box textAlign="center" maxW="760px" mx="auto" mb={10}>
            <Badge size="sm" colorPalette="blue" variant="subtle" mb={2}>LIVE SOFTWARE EXPERIENCE</Badge>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Explore the Actual ERP Interface.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={2}>
              Toggle between operational views below to inspect how projects, material requisitions, machinery, and financials are presented in the active system.
            </Text>
          </Box>

          {/* Interactive View Tabs */}
          <Flex justify="center" gap={2} wrap="wrap" mb={6}>
            {[
              { key: 'overview', label: 'Executive Overview' },
              { key: 'projects', label: 'Civil Projects' },
              { key: 'procurement', label: 'Procurement & GRN' },
              { key: 'fleet', label: 'Plant & Heavy Fleet' },
              { key: 'financials', label: 'Financials & Ledgers' }
            ].map((tab) => (
              <Button
                key={tab.key}
                size="sm"
                variant={activePreviewTab === tab.key ? 'solid' : 'outline'}
                bg={activePreviewTab === tab.key ? '#2563eb' : 'white'}
                borderColor={activePreviewTab === tab.key ? '#2563eb' : '#cbd5e1'}
                color={activePreviewTab === tab.key ? 'white' : '#475569'}
                onClick={() => setActivePreviewTab(tab.key as any)}
                borderRadius="8px"
              >
                {tab.label}
              </Button>
            ))}
          </Flex>

          {/* Preview Container */}
          <Box
            bg="#ffffff"
            borderRadius="16px"
            border="1px solid #cbd5e1"
            boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.08)"
            p={{ base: 4, md: 6 }}
          >
            {activePreviewTab === 'overview' && (
              <Stack gap={5}>
                <Flex justify="space-between" align="center" borderBottom="1px solid #e2e8f0" pb={3}>
                  <Box>
                    <Heading size="sm" color="#0f172a">Executive Group Performance Dashboard</Heading>
                    <Text fontSize="xs" color="#64748b">Active Holding: {activeCompany?.name || 'Apex Construction Group'} • Consolidation across 4 Active Sites</Text>
                  </Box>
                  <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/dashboard')}>
                    Open Live Dashboard <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Total Contract Book</Text>
                    <Text fontSize="2xl" fontWeight="black" color="#059669" mt={1}>$37,700,000</Text>
                    <Text fontSize="11px" color="#2563eb" mt={1}>4 Active Sites Under Execution</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Monthly Requisitions</Text>
                    <Text fontSize="2xl" fontWeight="black" color="#d97706" mt={1}>$342,800</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>100% 3-Way GRN Matched</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Plant Asset Readiness</Text>
                    <Text fontSize="2xl" fontWeight="black" color="#0284c7" mt={1}>94.2%</Text>
                    <Text fontSize="11px" color="#059669" mt={1}>Zero Critical Machine Halts</Text>
                  </Box>
                </SimpleGrid>

                <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a" mb={3}>Major Infrastructure Projects In Execution</Text>
                  <Stack gap={2.5}>
                    {(projects || []).slice(0, 4).map(p => (
                      <Flex key={p.id} justify="space-between" align="center" p={3} bg="#ffffff" borderRadius="8px" border="1px solid #e2e8f0">
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="#0f172a">{p.name || 'Civil Infrastructure Project'}</Text>
                          <Text fontSize="10px" color="#64748b">{p.clientName || 'Institutional Client'} • {p.siteLocation || 'Site Sector'}</Text>
                        </Box>
                        <Flex align="center" gap={3}>
                          <Text fontSize="xs" fontFamily="mono" color="#059669">${(p.contractValue ?? p.budget ?? 0).toLocaleString()}</Text>
                          <Badge size="xs" colorPalette="blue">{p.progressPercent ?? 0}%</Badge>
                        </Flex>
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}

            {activePreviewTab === 'projects' && (
              <Stack gap={4}>
                <Flex justify="space-between" align="center" borderBottom="1px solid #e2e8f0" pb={3}>
                  <Box>
                    <Heading size="sm" color="#0f172a">Civil Projects & Site Management</Heading>
                    <Text fontSize="xs" color="#64748b">Bill of Quantities (BOQ), Daily Logs, Site Delays & RFIs</Text>
                  </Box>
                  <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/projects')}>
                    Open Projects Catalog <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0284c7" mb={1}>Technical Drawing & Blueprint Archive</Text>
                    <Text fontSize="xs" color="#64748b" mb={3}>Versioned CAD/DWG drawings directly associated with project piers and foundations.</Text>
                    <Badge size="xs" colorPalette="cyan">Pier-04-Reinforcement_Rev2.dwg (3.4 MB)</Badge>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#d97706" mb={1}>Requests for Information (RFIs)</Text>
                    <Text fontSize="xs" color="#64748b" mb={3}>Consultant technical clarifications tracked with resolution timestamps and formal stamps.</Text>
                    <Badge size="xs" colorPalette="orange">RFI #18: Sub-base Compaction Resolution</Badge>
                  </Box>
                </SimpleGrid>
              </Stack>
            )}

            {activePreviewTab === 'procurement' && (
              <Stack gap={4}>
                <Flex justify="space-between" align="center" borderBottom="1px solid #e2e8f0" pb={3}>
                  <Box>
                    <Heading size="sm" color="#0f172a">3-Way Procurement & Material Requisitions</Heading>
                    <Text fontSize="xs" color="#64748b">Purchase Orders (PO), Site Waybills & Goods Received Notes (GRN)</Text>
                  </Box>
                  <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/requisitions')}>
                    Open Requisitions <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Active Purchase Orders</Text>
                    <Text fontSize="xl" fontWeight="black" color="#7c3aed" mt={1}>12 Open POs</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Total committed: $184,200</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Storehouse Receipts</Text>
                    <Text fontSize="xl" fontWeight="black" color="#059669" mt={1}>100% GRN Matched</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Weighbridge verification enabled</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Reorder Safety Level</Text>
                    <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>Zero Stockouts</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Automated reorder triggers active</Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            )}

            {activePreviewTab === 'fleet' && (
              <Stack gap={4}>
                <Flex justify="space-between" align="center" borderBottom="1px solid #e2e8f0" pb={3}>
                  <Box>
                    <Heading size="sm" color="#0f172a">Heavy Equipment, Machinery & Diesel Telematics</Heading>
                    <Text fontSize="xs" color="#64748b">Caterpillar, Komatsu & Liebherr Fleet Readiness & Maintenance Logs</Text>
                  </Box>
                  <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/equipment')}>
                    Open Fleet Module <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Heavy Machinery Fleet</Text>
                    <Text fontSize="xl" fontWeight="black" color="#d97706" mt={1}>24 Excavators & Cranes</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Scheduled PM routines synced</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Fleet Diesel Consumption</Text>
                    <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>42,800 Liters / Mo</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Bowser dispenser logs logged</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Ready-Mix Batch Trucks</Text>
                    <Text fontSize="xl" fontWeight="black" color="#0284c7" mt={1}>8 Active Mixers</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Batch ticket slump tracked</Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            )}

            {activePreviewTab === 'financials' && (
              <Stack gap={4}>
                <Flex justify="space-between" align="center" borderBottom="1px solid #e2e8f0" pb={3}>
                  <Box>
                    <Heading size="sm" color="#0f172a">FIDIC Contracts, IPC Interim Certificates & Ledgers</Heading>
                    <Text fontSize="xs" color="#64748b">Retention Escrow Accounts, Advance Payment Guarantees (APG)</Text>
                  </Box>
                  <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/contract-admin')}>
                    Open Contract Admin <ExternalLink size={12} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Certified IPC Billings</Text>
                    <Text fontSize="xl" fontWeight="black" color="#059669" mt={1}>$14.8M Collected</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>5% standard retention reserved</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Computerized Payroll</Text>
                    <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>100% Tax Compliant</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Direct bank CSV export ready</Text>
                  </Box>
                  <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Text fontSize="10px" textTransform="uppercase" color="#64748b" fontWeight="bold">Audit Trail Reliability</Text>
                    <Text fontSize="xl" fontWeight="black" color="#7c3aed" mt={1}>Immutable Records</Text>
                    <Text fontSize="10px" color="#64748b" mt={1}>Every adjustment stamped with user ID</Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      {/* 9. SECURITY & AUDIT CONTROL */}
      <Box id="security" py={{ base: 14, md: 24 }} px={{ base: 4, md: 8 }} bg="#ffffff">
        <Box maxW="1280px" mx="auto">
          <Box textAlign="center" maxW="760px" mx="auto" mb={14}>
            <Badge size="sm" colorPalette="blue" variant="subtle" mb={2}>GOVERNANCE & DATA INTEGRITY</Badge>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Engineered for Strict Institutional Governance.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={3}>
              Constructed to satisfy enterprise auditor scrutiny, board oversight, and financial compliance requirements.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={5}>
            {[
              {
                icon: Lock,
                title: 'Granular Role-Based Access (RBAC)',
                desc: '10 Pre-configured role profiles: Managing Director, Site Engineer, Quantity Surveyor, Procurement Lead, HR Lead, Accountant, and Super Admin.'
              },
              {
                icon: Database,
                title: 'Company & Workspace Isolation',
                desc: 'Strict multi-company tenant boundaries ensure subsidiaries and joint venture consortia never cross-pollinate accounting entries.'
              },
              {
                icon: Activity,
                title: 'Tamper-Evident Audit Trail',
                desc: 'Every requisition approval, inventory adjustment, payroll finalization, and invoice creation records cryptographic user and timestamp stamps.'
              },
              {
                icon: Layers,
                title: 'Relational Database Integrity',
                desc: 'Structured database schema enforcing foreign key integrity across projects, budgets, BOQs, inventories, and accounting entries.'
              }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <Box
                  key={idx}
                  p={6}
                  bg="#f8fafc"
                  borderRadius="16px"
                  border="1px solid #e2e8f0"
                  boxShadow="xs"
                >
                  <Box w="40px" h="40px" borderRadius="10px" bg="#ffffff" border="1px solid #e2e8f0" color="#2563eb" display="flex" alignItems="center" justifyContent="center" mb={4}>
                    <Icon size={20} />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">{s.title}</Text>
                  <Text fontSize="xs" color="#64748b" mt={2} lineHeight="relaxed">
                    {s.desc}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* 10. FINAL CALL TO ACTION (Light Premium CTA) */}
      <Box py={{ base: 14, md: 20 }} px={{ base: 4, md: 8 }} bg="#eff6ff" borderY="1px solid #bfdbfe">
        <Box maxW="960px" mx="auto" textAlign="center">
          <Badge size="sm" colorPalette="blue" variant="solid" mb={3}>
            ENTERPRISE DEPLOYMENT READY
          </Badge>
          <Heading
            size={{ base: '2xl', md: '4xl' }}
            fontWeight="black"
            color="#1e3a8a"
            letterSpacing="-0.02em"
          >
            Bring Your Construction Operations Together.
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'lg' }}
            color="#3b82f6"
            mt={4}
            maxW="720px"
            mx="auto"
            lineHeight="relaxed"
          >
            Manage projects, people, materials, plant equipment, procurement, and finances from one connected, institutional platform.
          </Text>

          <Flex justify="center" gap={4} wrap="wrap" mt={8}>
            <Button
              size="lg"
              bg="#2563eb"
              color="white"
              px={8}
              h="54px"
              fontSize="md"
              fontWeight="bold"
              borderRadius="12px"
              boxShadow="0 4px 14px rgba(37, 99, 235, 0.3)"
              _hover={{ bg: '#1d4ed8' }}
              onClick={() => navigate('/dashboard')}
            >
              Get Started Now <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="#93c5fd"
              color="#1e40af"
              bg="white"
              px={8}
              h="54px"
              fontSize="md"
              fontWeight="bold"
              borderRadius="12px"
              _hover={{ bg: '#f8fafc', borderColor: '#60a5fa' }}
              onClick={() => setShowDemoModal(true)}
            >
              Request Guided Demo
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* 11. FOOTER (Crisp Light Enterprise Footer) */}
      <Box bg="#f8fafc" borderTop="1px solid #e2e8f0" pt={14} pb={10} px={{ base: 4, md: 8 }}>
        <Box maxW="1280px" mx="auto">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={8} mb={12}>
            {/* Column 1: Brand & Overview */}
            <Box gridColumn={{ lg: 'span 2' }}>
              <Flex align="center" gap={3} mb={3}>
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="10px"
                  bg="#2563eb"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Building2 size={20} />
                </Box>
                <Text fontSize="md" fontWeight="bold" color="#0f172a">
                  APEX CONSTRUCT ERP
                </Text>
              </Flex>
              <Text fontSize="xs" color="#64748b" maxW="380px" lineHeight="relaxed">
                The comprehensive enterprise resource planning platform engineered specifically for civil infrastructure, general contractors, ready-mix batch plants, and heavy engineering consortiums.
              </Text>
              <Text fontSize="11px" color="#94a3b8" mt={4}>
                Operating in full compliance with FIDIC, IFRS, and statutory labor frameworks.
              </Text>
            </Box>

            {/* Modules Links */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Core Modules
              </Text>
              <Stack gap={2} fontSize="xs" color="#64748b">
                <Box as="button" textAlign="left" onClick={() => navigate('/projects')} _hover={{ color: '#2563eb' }}>Civil Projects & BOQ</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/requisitions')} _hover={{ color: '#2563eb' }}>Material Requisitions</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/inventory')} _hover={{ color: '#2563eb' }}>Stores & Inventories</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/procurement')} _hover={{ color: '#2563eb' }}>Purchase Orders (PO)</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/rmc')} _hover={{ color: '#2563eb' }}>Ready-Mix Concrete</Box>
              </Stack>
            </Box>

            {/* Operations Links */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Management & Fleet
              </Text>
              <Stack gap={2} fontSize="xs" color="#64748b">
                <Box as="button" textAlign="left" onClick={() => navigate('/equipment')} _hover={{ color: '#2563eb' }}>Plant, Machinery & Fleet</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/hr')} _hover={{ color: '#2563eb' }}>HR & Biometric Attendance</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/payroll')} _hover={{ color: '#2563eb' }}>Computerized Payroll</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/contract-admin')} _hover={{ color: '#2563eb' }}>FIDIC Contract Admin</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/documents')} _hover={{ color: '#2563eb' }}>Technical Document Vault</Box>
              </Stack>
            </Box>

            {/* Governance Links */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a" textTransform="uppercase" letterSpacing="wider" mb={3}>
                Control & Portals
              </Text>
              <Stack gap={2} fontSize="xs" color="#64748b">
                <Box as="button" textAlign="left" onClick={() => navigate('/portals')} _hover={{ color: '#2563eb' }}>Role Portals Hub</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/accounting')} _hover={{ color: '#2563eb' }}>General Accounting Ledger</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/workflow')} _hover={{ color: '#2563eb' }}>Approval Workflow Engine</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/settings')} _hover={{ color: '#2563eb' }}>Enterprise Audit Trail</Box>
                <Box as="button" textAlign="left" onClick={() => navigate('/login')} _hover={{ color: '#2563eb' }}>Secure Login Portal</Box>
              </Stack>
            </Box>
          </SimpleGrid>

          <Flex
            justify="space-between"
            align={{ base: 'flex-start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            gap={4}
            pt={8}
            borderTop="1px solid #e2e8f0"
            fontSize="11px"
            color="#64748b"
          >
            <Text>© {new Date().getFullYear()} Apex Construction ERP System. All rights reserved.</Text>
            <Flex gap={4}>
              <Text>Enterprise Architecture</Text>
              <Text>•</Text>
              <Text>24 Relational Tables</Text>
              <Text>•</Text>
              <Text>FIDIC Standard Compliant</Text>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* DEMO REQUEST MODAL (Light Design) */}
      {showDemoModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.45)" backdropFilter="blur(6px)" zIndex="2000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="#ffffff" borderRadius="20px" maxW="520px" w="100%" p={7} border="1px solid #cbd5e1" boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)">
            {demoSubmitted ? (
              <Box textAlign="center" py={6}>
                <Box p={4} bg="#dcfce7" color="#16a34a" borderRadius="full" w="fit-content" mx="auto" mb={4}>
                  <CheckCheck size={40} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>Executive Briefing Scheduled!</Heading>
                <Text fontSize="xs" color="#64748b">
                  Our construction technology implementation team will reach out to {demoForm.email} within 2 hours.
                </Text>
              </Box>
            ) : (
              <>
                <Flex justify="space-between" align="center" mb={1}>
                  <Heading size="md" color="#0f172a">Request Enterprise Contractor Demo</Heading>
                  <Box as="button" onClick={() => setShowDemoModal(false)} color="#64748b" _hover={{ color: '#0f172a' }} cursor="pointer">
                    <X size={20} />
                  </Box>
                </Flex>
                <Text fontSize="xs" color="#64748b" mb={5}>
                  Speak with an infrastructure systems specialist tailored to your specific project volume.
                </Text>

                <form onSubmit={handleDemoSubmit}>
                  <Stack gap={3.5}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Full Name *</Text>
                      <Input
                        size="sm"
                        placeholder="John Adebayo"
                        bg="#f8fafc"
                        borderColor="#cbd5e1"
                        color="#0f172a"
                        value={demoForm.name}
                        onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                        required
                      />
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Corporate Work Email *</Text>
                      <Input
                        size="sm"
                        type="email"
                        placeholder="adebayo@buildcorp.com"
                        bg="#f8fafc"
                        borderColor="#cbd5e1"
                        color="#0f172a"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        required
                      />
                    </Box>

                    <SimpleGrid columns={2} gap={3}>
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Company Name *</Text>
                        <Input
                          size="sm"
                          placeholder="BuildCorp Civil Ltd"
                          bg="#f8fafc"
                          borderColor="#cbd5e1"
                          color="#0f172a"
                          value={demoForm.company}
                          onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                          required
                        />
                      </Box>
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Your Role</Text>
                        <NativeSelect.Root size="sm">
                          <NativeSelect.Field
                            bg="#f8fafc"
                            borderColor="#cbd5e1"
                            color="#0f172a"
                            value={demoForm.role}
                            onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                          >
                            <option value="Managing Director / CEO">Managing Director / CEO</option>
                            <option value="Project Director / Lead PM">Project Director / PM</option>
                            <option value="Chief Quantity Surveyor">Chief Quantity Surveyor</option>
                            <option value="Procurement Director">Procurement Director</option>
                            <option value="Finance & Accounts Lead">Finance & Accounts Lead</option>
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                      </Box>
                    </SimpleGrid>

                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Annual Project Volume Under Management</Text>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          bg="#f8fafc"
                          borderColor="#cbd5e1"
                          color="#0f172a"
                          value={demoForm.projectVolume}
                          onChange={(e) => setDemoForm({ ...demoForm, projectVolume: e.target.value })}
                        >
                          <option value="Under $5M">Under $5M</option>
                          <option value="$5M - $25M">$5M - $25M</option>
                          <option value="$25M - $100M">$25M - $100M</option>
                          <option value="Over $100M">Over $100M Infrastructure</option>
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Box>

                    <Flex justify="flex-end" gap={2} pt={3} borderTop="1px solid #e2e8f0">
                      <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#475569" onClick={() => setShowDemoModal(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" bg="#2563eb" color="white" type="submit" _hover={{ bg: '#1d4ed8' }}>
                        Confirm Demo Booking
                      </Button>
                    </Flex>
                  </Stack>
                </form>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
