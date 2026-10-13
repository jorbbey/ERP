import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Stack,
  Card
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import heroWorkspaceImg from '../../assets/Blue-Themed Construction ERP Workspace.png';
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
  Workflow,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  Lock,
  Database,
  ExternalLink,
  DollarSign,
  Clock,
  BarChart3,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';
import { PiShootingStarDuotone } from 'react-icons/pi';
import { PublicNavbar } from './components/PublicNavbar';
import { PublicFooter } from './components/PublicFooter';
import { DemoRequestModal } from './components/DemoRequestModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCompany, projects, requisitions, inventory } = useERP();

  // Demo Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Interactive Dashboard Preview Tab
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'projects' | 'procurement' | 'fleet' | 'financials'>('overview');
  // Persona Solution Selector
  const [selectedPersona, setSelectedPersona] = useState<'gc' | 'specialty' | 'owners' | 'civil'>('gc');

  return (
    <Box minH="100vh" bg="#ffffff" color="#0f172a" fontFamily="'Plus Jakarta Sans', sans-serif" display="flex" flexDirection="column">
      {/* 1. Reusable Top Navigation Bar with Dedicated Pages */}
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* 2. HERO SECTION (Captivating Dark Flush Into Light; Bright & Upright Hero Image Right) */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 12, md: 16 }}
        pb={{ base: 14, md: 20 }}
        px={{ base: 4, sm: 6, md: 8, xl: 12 }}
        color="#ffffff"
        borderBottom="none"
        w="100%"
        style={{
          background: `
            radial-gradient(ellipse 75% 45% at 76% 20%, rgba(37, 99, 235, 0.14) 0%, transparent 60%),
            radial-gradient(ellipse 55% 35% at 20% 15%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
            linear-gradient(145deg, #090e1a 0%, #0d1629 32%, #12223c 52%, #1a2d4d 66%, #283e64 78%, #3e587f 88%, #cbd5e1 96%, #f8fafc 100%)
          `,
        }}
      >
        {/* Subtle, calm ambient diagonal glow (clean, sleek, zero busy grid lines) */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 85% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
          }}
        />

        <Box w="100%" position="relative" zIndex="1">
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align={{ base: 'flex-start', lg: 'center' }}
            justify="space-between"
            gap={{ base: 10, lg: 8, xl: 12 }}
            w="100%"
          >
            {/* Left Column: Hero Content */}
            <Box
              w={{ base: '100%', lg: '50%' }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {/* Commanding Headline */}
              <Heading
                as="h1"
                fontSize={{ base: '2.4rem', sm: '3rem', md: '3.6rem', lg: '3.8rem', xl: '4.4rem' }}
                fontWeight="900"
                lineHeight="1.06"
                letterSpacing="-0.035em"
                color="#ffffff"
                mb={4}
                style={{ textWrap: 'balance' }}
              >
                One Platform to Run Your Entire Construction Business.
              </Heading>

              {/* Value Proposition */}
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="#cbd5e1"
                lineHeight="relaxed"
                mb={6}
              >
                Unify civil projects, site material requisitions, central storehouse inventory, ready-mix concrete batching, heavy plant fleet, biometric labor, and FIDIC-certified progress claims into one synchronized source of truth.
              </Text>

              {/* Action CTAs */}
              <Flex align="center" gap={3.5} wrap="wrap" mb={8}>
                <Button
                  size="lg"
                  bg="#2563eb"
                  color="white"
                  px={7}
                  h="50px"
                  fontSize="sm"
                  fontWeight="bold"
                  borderRadius="12px"
                  boxShadow="0 4px 16px rgba(37, 99, 235, 0.35)"
                  _hover={{ bg: '#1d4ed8', transform: 'translateY(-1px)' }}
                  transition="all 0.15s ease"
                  onClick={() => navigate('/dashboard')}
                >
                  Explore ERP System <ArrowRight size={16} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="#475569"
                  color="#ffffff"
                  bg="rgba(15, 23, 42, 0.6)"
                  px={7}
                  h="50px"
                  fontSize="sm"
                  fontWeight="bold"
                  borderRadius="12px"
                  _hover={{ bg: '#1e293b', borderColor: '#94a3b8' }}
                  onClick={() => setShowDemoModal(true)}
                >
                  Request a Demo
                </Button>
              </Flex>

              {/* Architectural Trust & Compliance Metadata */}
              <Flex
                align="center"
                gap={{ base: 2, sm: 3 }}
                wrap="wrap"
                fontSize="xs"
                color="#94a3b8"
                fontWeight="medium"
              >
                <span>FIDIC Red & Yellow Book Compliant</span>
                <span aria-hidden="true" style={{ color: '#475569' }}>·</span>
                <span>IFRS Standard Job Costing</span>
                <span aria-hidden="true" style={{ color: '#475569' }}>·</span>
                <span>Biometric Labor Terminal Sync</span>
                <span aria-hidden="true" style={{ color: '#475569' }}>·</span>
                <span>Automated 3-Way GRN Match</span>
              </Flex>
            </Box>

            {/* Right Column: Full Hero Image (Bright, Upright, High-Clarity) */}
            <Box
              w={{ base: '100%', lg: '50%' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              position="relative"
            >
              {/* Radiant Back-Glow to keep the image bright and vivid */}
              <Box
                position="absolute"
                inset="-12px"
                bg="radial-gradient(circle at center, rgba(37, 99, 235, 0.25) 0%, rgba(14, 165, 233, 0.14) 45%, transparent 72%)"
                borderRadius="24px"
                pointerEvents="none"
              />
              <img
                src={heroWorkspaceImg}
                alt="Apex Construction ERP Workspace"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  borderRadius: '16px',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 10px 30px rgba(37, 99, 235, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  filter: 'brightness(1.06) contrast(1.02) saturate(1.03)',
                }}
              />
            </Box>
          </Flex>
        </Box>

        {/* Modern Curvy Diagonal Flush Divider into Telemetry */}
        <Box
          position="absolute"
          bottom="-1px"
          left="0"
          right="0"
          w="100%"
          overflow="hidden"
          lineHeight="0"
          pointerEvents="none"
          zIndex="2"
        >
          <svg
            viewBox="0 0 1440 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '44px', display: 'block' }}
          >
            <path
              d="M0,24 C380,68 960,4 1440,40 L1440,68 L0,68 Z"
              fill="#f8fafc"
            />
          </svg>
        </Box>
      </Box>

      {/* 3. LIVE ENTERPRISE TELEMETRY (Under Hero Section - Full Width) */}
      <Box py={8} bg="#f8fafc" borderBottom="1px solid #e2e8f0" w="100%">
        <Box w="100%" px={{ base: 4, sm: 6, md: 8, xl: 12 }}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b" letterSpacing="0.05em">Active Civil Projects</Text>
              <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1} fontFamily="mono">
                {(projects || []).length} Major Sites
              </Text>
              <Text fontSize="11px" color="#2563eb" fontWeight="medium" mt={1}>100% On-Schedule & Milestone Synced</Text>
            </Box>

            <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b" letterSpacing="0.05em">Contract Book Managed</Text>
              <Text fontSize="2xl" fontWeight="black" color="#059669" mt={1} fontFamily="mono">
                ₦{(((projects || []).reduce((acc, p) => acc + (p?.contractValue ?? p?.budget ?? 0), 0)) / 1000000).toFixed(1)}M
              </Text>
              <Text fontSize="11px" color="#64748b" mt={1}>FIDIC Controlled Commercial Ledger</Text>
            </Box>

            <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b" letterSpacing="0.05em">Verified Workforce</Text>
              <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1} fontFamily="mono">
                142 Personnel
              </Text>
              <Text fontSize="11px" color="#7c3aed" fontWeight="medium" mt={1}>Biometric Synchronized Muster</Text>
            </Box>

            <Box p={4} bg="#ffffff" borderRadius="12px" border="1px solid #e2e8f0" boxShadow="xs">
              <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b" letterSpacing="0.05em">Stores & Material SKUs</Text>
              <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1} fontFamily="mono">
                {(inventory || []).length} Stocked Items
              </Text>
              <Text fontSize="11px" color="#059669" fontWeight="medium" mt={1}>Direct Waybill & Weighbridge Linked</Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* 4. ENTERPRISE MULTI-ROLE ARCHITECTURE */}
      <Box py={{ base: 14, md: 20 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#ffffff" w="100%">
        <Box w="100%">
          <Box textAlign="center" maxW="800px" mx="auto" mb={10}>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Built for Every Stakeholder Across the Construction Lifecycle.
            </Heading>
            <Text fontSize="sm" color="#475569" mt={2.5}>
              Whether coordinating multi-tier subcontractors, managing capital draws for institutional owners, or pouring ready-mix concrete on a highway bridge, our platform delivers purpose-built tools.
            </Text>
          </Box>

          {/* Persona Switcher Tabs */}
          <Flex 
            justify="center" 
            gap={2} 
            flexWrap="wrap" 
            mb={8} 
            p={1.5} 
            bg="#f8fafc" 
            borderRadius="14px" 
            border="1px solid #e2e8f0"
            maxW="860px"
            mx="auto"
          >
            {[
              { id: 'gc', label: 'General Contractors', icon: Building2 },
              { id: 'specialty', label: 'Specialty & Subcontractors', icon: HardHat },
              { id: 'owners', label: 'Owners & Developers', icon: Layers },
              { id: 'civil', label: 'Civil & Heavy Infrastructure', icon: Truck },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = selectedPersona === tab.id;
              return (
                <Button
                  key={tab.id}
                  size="sm"
                  h="38px"
                  px={4}
                  borderRadius="10px"
                  bg={isSelected ? '#2563eb' : 'transparent'}
                  color={isSelected ? '#ffffff' : '#64748b'}
                  _hover={{ bg: isSelected ? '#1d4ed8' : '#f1f5f9', color: isSelected ? '#ffffff' : '#0f172a' }}
                  onClick={() => setSelectedPersona(tab.id as any)}
                  fontWeight="semibold"
                >
                  <Icon size={16} />
                  {tab.label}
                </Button>
              );
            })}
          </Flex>

          {/* Persona Content Box */}
          <Box maxW="1100px" mx="auto" bg="#f8fafc" p={{ base: 6, md: 8 }} borderRadius="18px" border="1px solid #e2e8f0">
            {selectedPersona === 'gc' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} alignItems="center">
                <Box>
                  <Heading size="lg" color="#0f172a" mb={3}>Total Command Over All Active Jobsites</Heading>
                  <Text fontSize="sm" color="#475569" mb={4} lineHeight="relaxed">
                    Protect margins with real-time labor utilization, centralized procurement, multi-warehouse stores, and automated FIDIC Interim Payment Certificate (IPC) claims.
                  </Text>
                  <Button size="sm" bg="#2563eb" color="white" onClick={() => navigate('/projects')}>
                    Open Projects Workspace <ArrowRight size={14} />
                  </Button>
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">BOQ Quantity Takeoff</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Variance tracking against target contract</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">3-Way PO Matching</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Waybills, weighbridges, and invoices</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Heavy Equipment Hours</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Telematics and fuel burn tracking</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Biometric Site Gates</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Zero ghost workers on daily payroll</Text>
                  </Box>
                </SimpleGrid>
              </SimpleGrid>
            )}

            {selectedPersona === 'specialty' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} alignItems="center">
                <Box>
                  <Heading size="lg" color="#0f172a" mb={3}>Fast Claim Approvals & Transparent Payment Terms</Heading>
                  <Text fontSize="sm" color="#475569" mb={4} lineHeight="relaxed">
                    Submit progress claims with timestamped photographic proof. Reconcile back-to-back contract milestones without disputed variation deductions.
                  </Text>
                  <Button size="sm" bg="#7c3aed" color="white" onClick={() => navigate('/portals')}>
                    Explore Subcontractor Portal <ArrowRight size={14} />
                  </Button>
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Digital Daily DPRs</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Signed logs from site agents</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Variation Order Logs</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Never execute unpaid out-of-scope work</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Subcontractor Portal</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Dedicated billing & invoice uploads</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Retention Escrows</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Scheduled defect release tracking</Text>
                  </Box>
                </SimpleGrid>
              </SimpleGrid>
            )}

            {selectedPersona === 'owners' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} alignItems="center">
                <Box>
                  <Heading size="lg" color="#0f172a" mb={3}>100% Capital Transparency and Audit Compliance</Heading>
                  <Text fontSize="sm" color="#475569" mb={4} lineHeight="relaxed">
                    Institutional oversight with live progress dashboards, verified physical milestones, and independent Quantity Surveyor sign-off.
                  </Text>
                  <Button size="sm" bg="#059669" color="white" onClick={() => navigate('/contract-admin')}>
                    Review Contract Administration <ArrowRight size={14} />
                  </Button>
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Executive Dashboard</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Multi-site capital rollups</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">FIDIC Standard Compliant</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Red & Yellow Book covenants</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">APG Amortization</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Advance guarantee recoupment</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Immutable Logs</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Audit-ready for sovereign funds</Text>
                  </Box>
                </SimpleGrid>
              </SimpleGrid>
            )}

            {selectedPersona === 'civil' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} alignItems="center">
                <Box>
                  <Heading size="lg" color="#0f172a" mb={3}>Ready-Mix Concrete, Quarries & Heavy Earthmoving</Heading>
                  <Text fontSize="sm" color="#475569" mb={4} lineHeight="relaxed">
                    Designed for heavy road corridors, bridges, and batching plants. Automated moisture compensation, cube break test logging, and telematics.
                  </Text>
                  <Button size="sm" bg="#ea580c" color="white" onClick={() => navigate('/rmc')}>
                    Inspect Batching Module <ArrowRight size={14} />
                  </Button>
                </Box>
                <SimpleGrid columns={2} gap={3}>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">RMC Batch Recipes</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>M20 to M60 moisture correction</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Transit Mixer GPS</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Drum revolutions & pour tickets</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Diesel Dispensers</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Flowmeter pump sync against theft</Text>
                  </Box>
                  <Box p={3.5} bg="#ffffff" borderRadius="10px" border="1px solid #e2e8f0">
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">Offline Field Sync</Text>
                    <Text fontSize="11px" color="#64748b" mt={1}>Remote desert/bush site tablets</Text>
                  </Box>
                </SimpleGrid>
              </SimpleGrid>
            )}
          </Box>
        </Box>
      </Box>

      {/* 5. DEDICATED SECTION PREVIEWS WITH DIRECT NAVIGATION TO DEDICATED PAGES */}
      <Box py={{ base: 14, md: 20 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#f8fafc" borderTop="1px solid #e2e8f0" w="100%">
        <Box w="100%">
          <Box textAlign="center" maxW="760px" mx="auto" mb={12}>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Explore Every Dimension of the Platform in Depth.
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={2}>
              Each capability, module, and security specification has its own dedicated page with comprehensive technical documentation and interactive tools.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {/* Hub 1: Features */}
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box w="44px" h="44px" borderRadius="12px" bg="#eff6ff" color="#2563eb" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <PiShootingStarDuotone size={22} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>Civil ERP Features</Heading>
                <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                  Deep dive into 5-tier BOQ breakdown, heavy fleet telematics, ready-mix concrete batch dispatching, and automated FIDIC Interim Payment Certificates.
                </Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#2563eb" color="#2563eb" _hover={{ bg: '#eff6ff' }} onClick={() => navigate('/features')} w="100%">
                Explore Features Page <ArrowRight size={14} />
              </Button>
            </Box>

            {/* Hub 2: Modules */}
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box w="44px" h="44px" borderRadius="12px" bg="#f5f3ff" color="#7c3aed" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <Layers size={22} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>12 Core Modules</Heading>
                <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                  Detailed technical tour of all 12 modules including Projects, Material Requisitions, Stores, Procurement, Ready-Mix, Fleet, HR, and Accounting.
                </Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#7c3aed" color="#7c3aed" _hover={{ bg: '#f5f3ff' }} onClick={() => navigate('/modules')} w="100%">
                Explore 12 Modules <ArrowRight size={14} />
              </Button>
            </Box>

            {/* Hub 3: Workflow */}
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box w="44px" h="44px" borderRadius="12px" bg="#fffbeb" color="#d97706" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <Workflow size={22} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>Multi-Stage Approval Workflow</Heading>
                <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                  Interactive 6-stage governance stepper showing how material requisitions flow from jobsite engineers through QS audit to finance disbursement.
                </Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#d97706" color="#d97706" _hover={{ bg: '#fffbeb' }} onClick={() => navigate('/workflows')} w="100%">
                Explore Workflows Page <ArrowRight size={14} />
              </Button>
            </Box>

            {/* Hub 4: Benefits */}
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box w="44px" h="44px" borderRadius="12px" bg="#ecfdf5" color="#059669" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <TrendingUp size={22} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>Benefits & ROI Calculator</Heading>
                <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                  Hard financial returns: 38% material shrinkage reduction, 4.2x faster IPC cashflow, and an interactive calculator to estimate your annual bottom-line return.
                </Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#059669" color="#059669" _hover={{ bg: '#ecfdf5' }} onClick={() => navigate('/benefits')} w="100%">
                Explore Benefits & ROI <ArrowRight size={14} />
              </Button>
            </Box>

            {/* Hub 5: Live Dashboard Preview */}
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box w="44px" h="44px" borderRadius="12px" bg="#f0f9ff" color="#0284c7" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <BarChart3 size={22} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>Interactive Platform Tour</Heading>
                <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                  Take a complete visual tour across live workspace views including executive KPIs, active civil projects, site delay logs, and fleet telematics.
                </Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#0284c7" color="#0284c7" _hover={{ bg: '#f0f9ff' }} onClick={() => navigate('/preview')} w="100%">
                Open Platform Tour <ArrowRight size={14} />
              </Button>
            </Box>

            {/* Hub 6: Security */}
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box w="44px" h="44px" borderRadius="12px" bg="#fef2f2" color="#dc2626" display="flex" alignItems="center" justifyContent="center" mb={4}>
                  <ShieldCheck size={22} />
                </Box>
                <Heading size="md" color="#0f172a" mb={2}>Security & RBAC Matrix</Heading>
                <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                  Institutional-grade security: AES-256 encryption, tamper-proof audit trails, strict separation of duties, and an interactive 7-role RBAC inspector.
                </Text>
              </Box>
              <Button size="sm" variant="outline" borderColor="#dc2626" color="#dc2626" _hover={{ bg: '#fef2f2' }} onClick={() => navigate('/security')} w="100%">
                Explore Security Page <ArrowRight size={14} />
              </Button>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* 6. CALL TO ACTION SECTION */}
      <Box py={16} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#0f172a" color="#ffffff" w="100%">
        <Box w="100%">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={8}>
            <Box maxW="680px">
              <Heading size="2xl" fontWeight="black" lineHeight="1.2">
                Deploy the Operating System for Modern Construction.
              </Heading>
              <Text fontSize="sm" color="#94a3b8" mt={3} lineHeight="relaxed">
                Experience seamless multi-site visibility, automated 3-way procurement controls, and FIDIC-standard progress claims. Launch the live workspace instantly.
              </Text>
            </Box>

            <Flex gap={3.5} wrap="wrap">
              <Button
                size="lg"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/dashboard')}
                fontWeight="bold"
                px={6}
                h="46px"
              >
                Launch Live Software <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="#334155"
                color="#ffffff"
                _hover={{ bg: '#1e293b' }}
                onClick={() => setShowDemoModal(true)}
                fontWeight="semibold"
                px={6}
                h="46px"
              >
                Request Enterprise Demo
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* 7. REUSABLE PUBLIC FOOTER */}
      <PublicFooter onOpenDemo={() => setShowDemoModal(true)} />

      {/* 8. DEMO REQUEST MODAL */}
      <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </Box>
  );
};
