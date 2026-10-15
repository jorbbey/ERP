import React, { useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Button, Badge, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Truck,
  CheckCircle2,
  HardHat,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  BarChart3,
  Calendar,
  AlertTriangle,
  FileCheck,
  Users
} from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { DemoRequestModal } from '../components/DemoRequestModal';

import heroWorkspaceImg from '../../../assets/Blue-Themed Construction ERP Workspace.png';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'site' | 'materials' | 'commercial'>('all');

  const coreFeatures = [
    {
      category: 'site',
      icon: FileSpreadsheet,
      badge: 'Engineering BOQ',
      title: '5-Tier Bill of Quantities (BOQ) Breakdown',
      desc: 'Ingest massive civil BOQs with hierarchical Work Breakdown Structures. Tie measured physical quantities directly to certified interim valuation draws.',
      highlights: [
        'Item-rate unit rate analysis (Labor, Plant, Material, Overhead)',
        'Variation Order (VO) tracking with rate escalation clauses',
        'Physical milestone progress vs. financial burn rate',
        'CAD & BIM revision tracking with revision comparison'
      ]
    },
    {
      category: 'site',
      icon: Truck,
      badge: 'Plant & Telematics',
      title: 'Heavy Machinery & Fleet Telematics',
      desc: 'Connect Caterpillar, Komatsu, and Liebherr equipment telematics. Track runtime hour meters, fuel burn rates, and preventive maintenance cycles.',
      highlights: [
        'Automated diesel dispenser integration to stop fuel pilferage',
        'Hourly operating cost calculation per active civil site',
        'Machine breakdown alerts & emergency job cards',
        'Equipment transfer waybills between regional project sites'
      ]
    },
    {
      category: 'materials',
      icon: Cpu,
      badge: 'Ready-Mix Logistics',
      title: 'Ready-Mix Concrete (RMC) Batch Dispatch',
      desc: 'Purpose-built for wet-batch and dry-batch commercial concrete plants. Harmonize batch computer recipes directly with pour delivery tickets.',
      highlights: [
        'Moisture compensation adjustments for sand and aggregate',
        'Compressive strength break tests (7-day, 14-day, 28-day)',
        'GPS transit mixer drum revolution counters & slump timing',
        'Batching cement silo replenishment automations'
      ]
    },
    {
      category: 'materials',
      icon: FileCheck,
      badge: 'Supply Chain Audit',
      title: '3-Way Procurement Matching (PO vs Waybill vs GRN)',
      desc: 'Enforce stringent multi-tier commercial verification. Guarantee zero disbursements without physical gate weighbridge logs and storekeeper sign-off.',
      highlights: [
        'Site Requisition (MRN) to Purchase Order workflow',
        'Storekeeper Goods Received Note (GRN) inspection logs',
        'Supplier invoice discrepancy alerts & automated debit notes',
        'Comparative vendor bidding scorecards & pricing histories'
      ]
    },
    {
      category: 'commercial',
      icon: Users,
      badge: 'Workforce Biometrics',
      title: 'Biometric Field Labor & Daily Gang Allocation',
      desc: 'Eliminate ghost workers and attendance fraud. Ruggedized biometric hardware connects directly to computerized construction payroll.',
      highlights: [
        'Site turnstile fingerprint & facial biometric synchronization',
        'Trade skill classification (Masons, Carpenters, Steel-fixers, Operators)',
        'Overtime authorization linked to daily engineer progress logs',
        'Statutory safety induction & medical fitness expiry alerts'
      ]
    },
    {
      category: 'commercial',
      icon: TrendingUp,
      badge: 'FIDIC Governance',
      title: 'Automated FIDIC Interim Payment Certificates (IPC)',
      desc: 'Generate standardized FIDIC Red Book, Yellow Book, and EPC valuations with contract retention escrows and advance repayment deductions.',
      highlights: [
        'Retention money accounting with scheduled release covenants',
        'Advance Payment Guarantee (APG) amortization schedules',
        'Engineer determination variance reconciliations',
        'Subcontractor back-to-back payment terms management'
      ]
    }
  ];

  const filteredFeatures = activeTab === 'all' 
    ? coreFeatures 
    : coreFeatures.filter(f => f.category === activeTab);

  return (
    <Box bg="#f8fafc" minH="100vh" color="#0f172a" display="flex" flexDirection="column">
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Hero Header with Architectural Blueprint Backdrop */}
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
        {/* Subtle Architectural Grid & Atmospheric Radial Glow */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 75% 25%, rgba(37, 99, 235, 0.18) 0%, transparent 60%),
              radial-gradient(circle at 15% 75%, rgba(14, 165, 233, 0.12) 0%, transparent 55%)
            `,
            backgroundSize: '40px 40px, 40px 40px, auto, auto',
          }}
        />

        {/* Ambient Workspace Image Backdrop (Masked & Blended) */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          w={{ base: '85%', md: '50%' }}
          h="120%"
          opacity="0.18"
          pointerEvents="none"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
          }}
        >
          <img
            src={heroWorkspaceImg}
            alt="Civil Engineering Background"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box w="100%" position="relative" zIndex="1">
          <Flex direction="column" align="center" textAlign="center" maxW="920px" mx="auto">
            {/* NO TOP TAG AS REQUESTED */}
            <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="black" color="#ffffff" lineHeight="1.15">
              Comprehensive Civil ERP Capabilities Engineered for Mission-Critical Job Sites.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#cbd5e1" mt={4} lineHeight="relaxed">
              Generic software fails on the construction site. Apex Construct integrates civil engineering Bill of Quantities, batching logistics, heavy equipment telematics, and FIDIC financial governance into one unified platform.
            </Text>

            <Flex gap={3.5} wrap="wrap" justify="center" mt={7}>
              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/login?mode=signup')}
                fontWeight="semibold"
                px={6}
                h="44px"
                boxShadow="0 2px 10px rgba(37, 99, 235, 0.35)"
              >
                Launch Software <ArrowRight size={16} />
              </Button>
              <Button
                size="md"
                variant="outline"
                borderColor="#475569"
                color="#ffffff"
                _hover={{ bg: '#1e293b', borderColor: '#94a3b8' }}
                onClick={() => setShowDemoModal(true)}
                fontWeight="semibold"
                px={6}
                h="44px"
              >
                Request Technical Demo
              </Button>
            </Flex>

            {/* Floating Technical Specs Metadata */}
            <Flex
              gap={3}
              wrap="wrap"
              justify="center"
              fontSize="11px"
              color="#94a3b8"
              fontWeight="medium"
              mt={6}
            >
              <span>5-Tier WBS Hierarchy</span>
              <span style={{ color: '#475569' }}>•</span>
              <span>Heavy Fleet Telematics</span>
              <span style={{ color: '#475569' }}>•</span>
              <span>RMC Moisture Batching</span>
              <span style={{ color: '#475569' }}>•</span>
              <span>FIDIC Red Book 1999</span>
              <span style={{ color: '#475569' }}>•</span>
              <span>3-Way GRN Match</span>
            </Flex>
          </Flex>

          {/* Filter Pills */}
          <Flex justify="center" gap={2} mt={10} flexWrap="wrap">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'site', label: 'Site & Civil Works' },
              { id: 'materials', label: 'Supply Chain & Batching' },
              { id: 'commercial', label: 'Commercial & Labor' }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? 'solid' : 'outline'}
                bg={activeTab === tab.id ? '#2563eb' : 'rgba(30, 41, 59, 0.7)'}
                color={activeTab === tab.id ? '#ffffff' : '#cbd5e1'}
                borderColor={activeTab === tab.id ? '#2563eb' : '#334155'}
                _hover={{ bg: activeTab === tab.id ? '#1d4ed8' : '#1e293b' }}
                onClick={() => setActiveTab(tab.id as any)}
                borderRadius="full"
                px={4}
                h="36px"
              >
                {tab.label}
              </Button>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Main Features Grid */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%" flex="1">
        <Box w="100%">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {filteredFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <Box
                  key={i}
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
                        w="44px"
                        h="44px"
                        borderRadius="12px"
                        bg="#eff6ff"
                        color="#2563eb"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon size={22} />
                      </Box>
                      <Badge size="xs" colorPalette="blue" variant="subtle" fontWeight="semibold">
                        {f.badge}
                      </Badge>
                    </Flex>

                    <Heading size="md" color="#0f172a" fontWeight="bold" mb={2}>
                      {f.title}
                    </Heading>
                    <Text fontSize="xs" color="#64748b" lineHeight="relaxed" mb={4}>
                      {f.desc}
                    </Text>

                    <Box pt={3} borderTop="1px solid #f1f5f9">
                      <Text fontSize="11px" fontWeight="bold" color="#334155" textTransform="uppercase" letterSpacing="0.05em" mb={2.5}>
                        Key Engineering Highlights
                      </Text>
                      <Stack gap={2}>
                        {f.highlights.map((h, hIdx) => (
                          <Flex key={hIdx} align="start" gap={2}>
                            <Box color="#10b981" mt={0.5} flexShrink={0}>
                              <CheckCircle2 size={13} />
                            </Box>
                            <Text fontSize="xs" color="#475569" lineHeight="short">
                              {h}
                            </Text>
                          </Flex>
                        ))}
                      </Stack>
                    </Box>
                  </Box>

                  <Box mt={6} pt={4} borderTop="1px solid #f1f5f9">
                    <Button
                      size="xs"
                      w="100%"
                      variant="ghost"
                      color="#2563eb"
                      _hover={{ bg: '#eff6ff' }}
                      fontWeight="bold"
                      onClick={() => navigate('/login?mode=signup')}
                      h="32px"
                    >
                      Explore In Software <ArrowRight size={13} />
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Comparison Matrix Section */}
      <Box py={{ base: 14, md: 20 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#ffffff" borderTop="1px solid #e2e8f0" w="100%">
        <Box w="100%">
          <Box textAlign="center" maxW="760px" mx="auto" mb={10}>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Why Generic ERPs and Spreadsheets Fall Short in Construction.
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={2}>
              See how Apex Construct compares with standard generic software suites when deployed in heavy civil environments.
            </Text>
          </Box>

          <Box overflowX="auto" borderRadius="14px" border="1px solid #e2e8f0" bg="#ffffff" boxShadow="xs">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>Capability / Civil Requirement</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff' }}>Apex Construct Civil ERP</th>
                  <th style={{ padding: '16px 20px', fontWeight: '600', color: '#64748b' }}>Generic Corporate ERPs</th>
                  <th style={{ padding: '16px 20px', fontWeight: '600', color: '#64748b' }}>Excel Spreadsheets</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    title: '5-Tier Bill of Quantities (BOQ) Linking',
                    apex: 'Native hierarchical BOQ with live draw valuation',
                    generic: 'Requires ₦2.5M+ custom software consulting',
                    spreadsheets: 'Disconnected tabs prone to formula corruption'
                  },
                  {
                    title: 'Ready-Mix Concrete Moisture & Batching',
                    apex: 'Automated batch telemetry & cube break logs',
                    generic: 'No native ready-mix concrete capabilities',
                    spreadsheets: 'Manual logbooks with zero sensor verification'
                  },
                  {
                    title: 'Heavy Fleet Diesel Dispenser Telematics',
                    apex: 'Direct flowmeter sync & hours-meter tracking',
                    generic: 'Limited to basic manual vehicle expense entry',
                    spreadsheets: 'Vulnerable to widespread fuel theft & inflation'
                  },
                  {
                    title: 'FIDIC IPC Retention Escrow & APG Amortization',
                    apex: 'Built-in Red/Yellow/Silver Book compliance',
                    generic: 'Standard accounting only; no FIDIC logic',
                    spreadsheets: 'High financial audit vulnerability'
                  },
                  {
                    title: 'Offline Remote Jobsite Synchronization',
                    apex: 'Full offline daily log capture & conflict resolution',
                    generic: 'Requires constant high-bandwidth internet',
                    spreadsheets: 'Version conflicts across multiple laptops'
                  }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#0f172a' }}>{row.title}</td>
                    <td style={{ padding: '14px 20px', color: '#16a34a', fontWeight: '600', backgroundColor: '#f0fdf4' }}>
                      <Flex align="center" gap={1.5}>
                        <CheckCircle2 size={15} color="#16a34a" /> {row.apex}
                      </Flex>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{row.generic}</td>
                    <td style={{ padding: '14px 20px', color: '#dc2626' }}>{row.spreadsheets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      {/* CTA Footer Banner */}
      <Box py={14} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#1e293b" color="#ffffff" w="100%">
        <Box w="100%">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={6}>
            <Box maxW="600px">
              <Heading size="lg" fontWeight="bold">Ready to see these capabilities live on your projects?</Heading>
              <Text fontSize="xs" color="#94a3b8" mt={2}>
                Launch the interactive ERP sandbox immediately or speak with a civil infrastructure solutions consultant.
              </Text>
            </Box>
            <Flex gap={3} wrap="wrap">
              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/login?mode=signup')}
                fontWeight="semibold"
                px={5}
                h="40px"
              >
                Launch Software <ArrowRight size={15} />
              </Button>
              <Button
                size="md"
                variant="outline"
                borderColor="#475569"
                color="#ffffff"
                _hover={{ bg: '#1e293b' }}
                onClick={() => navigate('/login?mode=signin')}
                fontWeight="semibold"
                px={5}
                h="40px"
              >
                Sign in
              </Button>
              <Button
                size="md"
                variant="ghost"
                color="#94a3b8"
                _hover={{ color: '#ffffff', bg: 'rgba(255, 255, 255, 0.08)' }}
                onClick={() => setShowDemoModal(true)}
                fontWeight="semibold"
                px={5}
                h="40px"
              >
                Request Enterprise Demo
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
