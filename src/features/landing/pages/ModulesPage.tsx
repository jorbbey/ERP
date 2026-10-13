import React, { useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Button, Badge, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  ClipboardList,
  Boxes,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  FileText,
  Scale,
  FolderKanban,
  ArrowRight,
  ExternalLink,
  Check,
  Building2,
  Workflow
} from 'lucide-react';
import { PiShootingStarDuotone } from 'react-icons/pi';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { DemoRequestModal } from '../components/DemoRequestModal';
import heroWorkspaceImg from '../../../assets/Blue-Themed Construction ERP Workspace.png';

export const ModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'engineering' | 'supply' | 'personnel' | 'finance'>('all');

  const modules = [
    {
      id: 'projects',
      route: '/projects',
      category: 'engineering',
      name: 'Civil Projects & Sites',
      icon: HardHat,
      color: '#2563eb',
      bgLight: '#eff6ff',
      badge: 'Core Project Control',
      summary: 'Hierarchical Bill of Quantities (BOQ), Daily Progress Reports (DPR), Milestone Tracking, and Delay Logging.',
      details: [
        '5-tier Work Breakdown Structure (WBS)',
        'Daily weather, site labor, and machinery logs',
        'Physical percentage completion vs. target schedule',
        'RFI and Variation Order approval registers'
      ]
    },
    {
      id: 'requisitions',
      route: '/requisitions',
      category: 'supply',
      name: 'Material Requisitions (MRN)',
      icon: ClipboardList,
      color: '#ea580c',
      bgLight: '#fff7ed',
      badge: 'Jobsite Material Flow',
      summary: 'Site engineers requisition materials directly against BOQ allowances with automated budget validation.',
      details: [
        'Multi-site priority flags (Urgent, Standard, Critical)',
        'Quantity Surveyor threshold sign-offs',
        'Real-time remaining BOQ quantity checks',
        'Automated notification to regional storekeeper'
      ]
    },
    {
      id: 'inventory',
      route: '/inventory',
      category: 'supply',
      name: 'Stores & Central Warehouses',
      icon: Boxes,
      color: '#059669',
      bgLight: '#ecfdf5',
      badge: 'Real-time Stock Ledger',
      summary: 'Multi-warehouse stock holding with automated re-order points, bin cards, and batch tracking.',
      details: [
        'Weighbridge and Goods Received Notes (GRN)',
        'Minimum buffer stock alarms for cement & rebar',
        'Site-to-site inter-project material transfers',
        'Physical stock count reconciliation & scrap write-offs'
      ]
    },
    {
      id: 'procurement',
      route: '/procurement',
      category: 'supply',
      name: 'Procurement & Purchase Orders',
      icon: ShoppingCart,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      badge: 'Commercial Governance',
      summary: 'Automate RFQ vendor bidding, Purchase Order issuance, delivery tracking, and 3-way invoice matching.',
      details: [
        'Comparative quotation matrix and vendor grading',
        'Digital Purchase Order (PO) approval matrix',
        'Waybill quantity discrepancy alerts',
        'Integrated supplier payment terms & credit limits'
      ]
    },
    {
      id: 'rmc',
      route: '/rmc',
      category: 'engineering',
      name: 'Ready-Mix Concrete (RMC)',
      icon: Truck,
      color: '#d97706',
      bgLight: '#fffbeb',
      badge: 'Batch Plant Telematics',
      summary: 'Comprehensive concrete production management from recipe mix design to transit mixer site dispatch.',
      details: [
        'Standard mix designs (M20, M25, M30, M40, M50, M60)',
        'Moisture correction algorithm for sand and aggregate',
        'Concrete cube compressive strength testing schedule',
        'GPS transit mixer drum rotation and discharge logs'
      ]
    },
    {
      id: 'equipment',
      route: '/equipment',
      category: 'engineering',
      name: 'Plant, Machinery & Fleet',
      icon: Building2,
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      badge: 'Asset Readiness',
      summary: 'Heavy equipment fleet monitoring, fuel dispenser telematics, runtime hour meters, and maintenance job cards.',
      details: [
        'Excavator, tipper, crane, and roller telematics',
        'Diesel consumption per operating hour metrics',
        'Preventive maintenance alert engine',
        'External machinery hire rates vs. owned plant allocation'
      ]
    },
    {
      id: 'hr',
      route: '/hr',
      category: 'personnel',
      name: 'HR & Biometric Attendance',
      icon: Users,
      color: '#9333ea',
      bgLight: '#faf5ff',
      badge: 'Labor Governance',
      summary: 'Ruggedized site turnstiles, trade skill certifications, safety inductions, and daily muster rolls.',
      details: [
        'Biometric fingerprint and facial site gate sync',
        'Permanent staff and casual daily gang records',
        'Trade licensing and high-risk permit compliance',
        'Disciplinary action and HSE incident logs'
      ]
    },
    {
      id: 'payroll',
      route: '/payroll',
      category: 'personnel',
      name: 'Computerized Construction Payroll',
      icon: Wallet,
      color: '#16a34a',
      bgLight: '#f0fdf4',
      badge: 'Wage Automation',
      summary: 'Automated payroll generation calculating regular hours, site overtime multipliers, and statutory deductions.',
      details: [
        'Direct link to site biometric clock-in data',
        'Tax, pension, and insurance statutory deductions',
        'Bank automated payment transfer batch files',
        'Overtime audit reports verified by Project Director'
      ]
    },
    {
      id: 'contracts',
      route: '/contract-admin',
      category: 'finance',
      name: 'FIDIC Contract Administration',
      icon: FileText,
      color: '#dc2626',
      bgLight: '#fef2f2',
      badge: 'Legal & IPC Milestones',
      summary: 'Standardized FIDIC Red, Yellow, and Silver Book progress valuations, retention escrows, and claim logs.',
      details: [
        'Interim Payment Certificate (IPC) generation',
        'Advance Payment Guarantee (APG) recoupment curves',
        'Retention money trust ledger tracking',
        'Contract extension of time (EOT) dispute records'
      ]
    },
    {
      id: 'accounting',
      route: '/accounting',
      category: 'finance',
      name: 'General Accounting & Project Ledgers',
      icon: Scale,
      color: '#0891b2',
      bgLight: '#ecfeff',
      badge: 'Cost Center Ledger',
      summary: 'Full double-entry bookkeeping with project-specific cost codes, accounts payable, accounts receivable, and cashflow.',
      details: [
        'Real-time Project P&L and Cost-to-Complete',
        'Multi-currency contractor bank account management',
        'Subcontractor back-to-back billing schedules',
        'IFRS 15 construction revenue recognition compliance'
      ]
    },
    {
      id: 'documents',
      route: '/documents',
      category: 'engineering',
      name: 'Technical Documents Vault',
      icon: FolderKanban,
      color: '#475569',
      bgLight: '#f8fafc',
      badge: 'Audited Transmittals',
      summary: 'Secure centralized document repository with version control, CAD drawings, RFIs, and tamper-proof logs.',
      details: [
        'BIM & Architectural drawing version control',
        'Technical Submittal approval registers',
        'Civil engineering test certificates (soil, rebar, steel)',
        'Immutable audit logs for compliance inspections'
      ]
    },
    {
      id: 'portals',
      route: '/portals',
      category: 'finance',
      name: 'Role Portals Hub',
      icon: PiShootingStarDuotone,
      color: '#6366f1',
      bgLight: '#eef2ff',
      badge: 'External Stakeholders',
      summary: 'Dedicated interfaces for Subcontractors, Institutional Clients, Material Suppliers, and Site Agents.',
      details: [
        'Subcontractor daily submission and invoice upload portal',
        'Owner & Developer live visual progress viewer',
        'Supplier delivery schedules & electronic waybills',
        'Site Agent offline tablet inspection interface'
      ]
    }
  ];

  const filteredModules = categoryFilter === 'all'
    ? modules
    : modules.filter(m => m.category === categoryFilter);

  return (
    <Box bg="#f8fafc" minH="100vh" color="#0f172a" display="flex" flexDirection="column">
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Hero Header with Architectural Construction Logistics Backdrop */}
      <Box
        position="relative"
        overflow="hidden"
        py={{ base: 14, md: 20 }}
        px={{ base: 4, sm: 6, md: 8, xl: 12 }}
        bg="#090e1a"
        color="#ffffff"
        borderBottom="1px solid #1e293b"
        w="100%"
      >
        {/* Subtle Architectural Drafting Grid & Amber/Blue Radial Light */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.20) 0%, transparent 60%),
              radial-gradient(circle at 10% 80%, rgba(217, 119, 6, 0.10) 0%, transparent 55%)
            `,
            backgroundSize: '40px 40px, 40px 40px, auto, auto',
          }}
        />

        {/* Ambient Workspace Image Backdrop */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w={{ base: '85%', md: '50%' }}
          h="120%"
          opacity="0.16"
          pointerEvents="none"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
          }}
        >
          <img
            src={heroWorkspaceImg}
            alt="Construction Logistics Background"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box w="100%" position="relative" zIndex="1">
          <Flex direction="column" align="center" textAlign="center" maxW="920px" mx="auto">
            {/* NO TOP TAG AS REQUESTED */}
            <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="black" color="#ffffff" lineHeight="1.15">
              12 Mission-Critical Modules. One Single Source of Engineering Truth.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#cbd5e1" mt={4} lineHeight="relaxed">
              Eliminate operational silos across your job sites, batch plants, central stores, and commercial offices. Every module is deeply connected to a unified database schema.
            </Text>

            {/* Filter Tabs */}
            <Flex justify="center" gap={2} mt={9} flexWrap="wrap">
              {[
                { id: 'all', label: 'All 12 Modules' },
                { id: 'engineering', label: 'Engineering & Sites' },
                { id: 'supply', label: 'Supply Chain & Batching' },
                { id: 'personnel', label: 'Human Resources' },
                { id: 'finance', label: 'Financials & Contracts' }
              ].map(tab => (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={categoryFilter === tab.id ? 'solid' : 'outline'}
                  bg={categoryFilter === tab.id ? '#2563eb' : 'rgba(30, 41, 59, 0.7)'}
                  color={categoryFilter === tab.id ? '#ffffff' : '#cbd5e1'}
                  borderColor={categoryFilter === tab.id ? '#2563eb' : '#334155'}
                  _hover={{ bg: categoryFilter === tab.id ? '#1d4ed8' : '#1e293b' }}
                  onClick={() => setCategoryFilter(tab.id as any)}
                  borderRadius="full"
                  px={4}
                  h="36px"
                >
                  {tab.label}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* Modules Grid */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%" flex="1">
        <Box w="100%">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {filteredModules.map((m) => {
              const Icon = m.icon;
              return (
                <Box
                  key={m.id}
                  bg="#ffffff"
                  p={{ base: 5, md: 6 }}
                  borderRadius="16px"
                  border="1px solid #e2e8f0"
                  boxShadow="xs"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  _hover={{ borderColor: '#93c5fd', transform: 'translateY(-2px)', boxShadow: 'md' }}
                  transition="all 0.2s ease"
                >
                  <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Box
                        w="46px"
                        h="46px"
                        borderRadius="12px"
                        bg={m.bgLight}
                        color={m.color}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon size={24} />
                      </Box>
                      <Badge size="xs" variant="subtle" colorPalette="gray" fontWeight="semibold">
                        {m.badge}
                      </Badge>
                    </Flex>

                    <Heading size="md" color="#0f172a" fontWeight="bold" mb={2}>
                      {m.name}
                    </Heading>
                    <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                      {m.summary}
                    </Text>

                    <Box pt={3} borderTop="1px solid #f1f5f9">
                      <Text fontSize="11px" fontWeight="bold" color="#334155" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
                        Key Capabilities
                      </Text>
                      <Stack gap={1.5}>
                        {m.details.map((detail, idx) => (
                          <Flex key={idx} align="start" gap={2}>
                            <Box color="#10b981" mt={0.5} flexShrink={0}>
                              <Check size={12} />
                            </Box>
                            <Text fontSize="xs" color="#475569" lineHeight="short">
                              {detail}
                            </Text>
                          </Flex>
                        ))}
                      </Stack>
                    </Box>
                  </Box>

                  <Flex gap={2} mt={6} pt={4} borderTop="1px solid #f1f5f9">
                    <Button
                      size="sm"
                      flex="1"
                      bg="#2563eb"
                      color="white"
                      _hover={{ bg: '#1d4ed8' }}
                      fontWeight="semibold"
                      onClick={() => navigate(m.route)}
                      h="36px"
                    >
                      Open Module <ExternalLink size={13} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="#cbd5e1"
                      color="#475569"
                      _hover={{ bg: '#f8fafc' }}
                      onClick={() => setShowDemoModal(true)}
                      h="36px"
                      px={3}
                    >
                      Demo
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* CTA Footer Banner */}
      <Box py={14} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#0f172a" color="#ffffff" w="100%">
        <Box w="100%">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={6}>
            <Box maxW="600px">
              <Heading size="lg" fontWeight="bold">Ready to see all 12 modules running synchronously?</Heading>
              <Text fontSize="xs" color="#94a3b8" mt={2}>
                Experience how data flows from site engineers to central procurement and corporate ledger without double entry.
              </Text>
            </Box>
            <Flex gap={3} wrap="wrap">
              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/dashboard')}
                fontWeight="semibold"
                px={5}
                h="40px"
              >
                Launch Enterprise Workspace <ArrowRight size={15} />
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      <PublicFooter onOpenDemo={() => setShowDemoModal(true)} />
      <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </Box>
  );
};
