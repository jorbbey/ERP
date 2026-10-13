import React, { useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Button, Badge, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  ShieldAlert,
  Clock,
  HardHat,
  Building2,
  Layers,
  Truck,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Percent
} from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { DemoRequestModal } from '../components/DemoRequestModal';
import heroWorkspaceImg from '../../../assets/Blue-Themed Construction ERP Workspace.png';

export const BenefitsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  // ROI Calculator State
  const [projectCount, setProjectCount] = useState(4);
  const [monthlySpend, setMonthlySpend] = useState(2400000); // ₦2.4M monthly material & plant spend
  const [laborCount, setLaborCount] = useState(120);

  // Calculated Benefits
  const annualSpend = monthlySpend * 12;
  const materialSavings = Math.round(annualSpend * 0.065); // 6.5% material wastage recovery
  const laborSavings = Math.round(laborCount * 45000 * 12 * 0.08); // 8% ghost-worker & unverified OT savings
  const cashflowAcceleration = Math.round(annualSpend * 0.035); // 3.5% cost of capital saved by 4.2x faster IPC draw
  const totalAnnualBenefit = materialSavings + laborSavings + cashflowAcceleration;

  const kpis = [
    {
      stat: '38%',
      label: 'Material Shrinkage Reduction',
      desc: 'Immediate clampdown on undocumented site store releases and scrap pilferage through weighbridge GRN matching.'
    },
    {
      stat: '4.2x',
      label: 'Faster IPC Cash Realization',
      desc: 'Shorten time from interim site measurement to certified owner cash disbursement from 62 days down to 14 days.'
    },
    {
      stat: '0%',
      label: 'Ghost Worker Labor Leakage',
      desc: 'Biometric fingerprint and facial recognition turnstiles eliminate phantom labor and inflated site gang rolls.'
    },
    {
      stat: '22%',
      label: 'Diesel & Fuel Cost Savings',
      desc: 'Direct connection to site fuel dispenser flowmeters stops diesel siphoning and undocumented equipment idling.'
    }
  ];

  return (
    <Box bg="#f8fafc" minH="100vh" color="#0f172a" display="flex" flexDirection="column">
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Hero Header with Capital Recovery & Financial Architecture Backdrop */}
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
        {/* Subtle Financial Engineering Grid & Emerald/Blue Ambient Radial Glow */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.16) 0%, transparent 60%),
              radial-gradient(circle at 15% 75%, rgba(37, 99, 235, 0.18) 0%, transparent 55%)
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
            alt="Financial Architecture Background"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box w="100%" position="relative" zIndex="1">
          <Flex direction="column" align="center" textAlign="center" maxW="920px" mx="auto">
            {/* NO TOP TAG AS REQUESTED */}
            <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="black" color="#ffffff" lineHeight="1.15">
              Measurable Capital Recovery & Site Operational Precision.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#cbd5e1" mt={4} lineHeight="relaxed">
              Civil contracting margins are razor-thin. A 2% cost overrun on structural concrete or unmetered diesel can wipe out project profitability. Discover how contractors recover millions.
            </Text>

            <Flex gap={3.5} wrap="wrap" justify="center" mt={7}>
              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/dashboard')}
                fontWeight="semibold"
                px={6}
                h="44px"
                boxShadow="0 2px 10px rgba(37, 99, 235, 0.35)"
              >
                Launch Live Software <ArrowRight size={16} />
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
                Schedule Financial Briefing
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* Primary KPI Stats Grid */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%">
        <Box w="100%">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            {kpis.map((kpi, idx) => (
              <Box
                key={idx}
                bg="#ffffff"
                p={6}
                borderRadius="16px"
                border="1px solid #e2e8f0"
                boxShadow="xs"
                _hover={{ borderColor: '#93c5fd', transform: 'translateY(-2px)' }}
                transition="all 0.15s ease"
              >
                <Text fontSize="4xl" fontWeight="black" color="#2563eb" lineHeight="1">
                  {kpi.stat}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="#0f172a" mt={3}>
                  {kpi.label}
                </Text>
                <Text fontSize="xs" color="#64748b" mt={2} lineHeight="relaxed">
                  {kpi.desc}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Interactive ROI Calculator */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#ffffff" borderTop="1px solid #e2e8f0" borderBottom="1px solid #e2e8f0" w="100%">
        <Box w="100%">
          <Box textAlign="center" maxW="760px" mx="auto" mb={12}>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Estimate Your Annual Recovered Profitability.
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={2}>
              Adjust your operating parameters to see conservative estimates of recovered capital across material, labor, and cashflow cycles.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 12 }} gap={8} alignItems="stretch">
            {/* Left: Input Sliders */}
            <Box gridColumn={{ lg: 'span 6' }} bg="#f8fafc" p={{ base: 5, md: 7 }} borderRadius="18px" border="1px solid #e2e8f0">
              <Heading size="md" color="#0f172a" mb={6}>Your Operational Parameters</Heading>

              <Stack gap={6}>
                {/* Active Projects Slider */}
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="xs" fontWeight="bold" color="#334155">Active Civil Sites & Projects</Text>
                    <Badge size="sm" colorPalette="blue" variant="subtle" fontWeight="bold">
                      {projectCount} Active Sites
                    </Badge>
                  </Flex>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={projectCount}
                    onChange={(e) => setProjectCount(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                  <Flex justify="space-between" fontSize="10px" color="#94a3b8" mt={1}>
                    <Text>1 Site</Text>
                    <Text>10 Sites</Text>
                    <Text>20 Sites</Text>
                  </Flex>
                </Box>

                {/* Monthly Material Spend */}
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="xs" fontWeight="bold" color="#334155">Monthly Materials & Plant Spend</Text>
                    <Badge size="sm" colorPalette="green" variant="subtle" fontWeight="bold">
                      ₦{(monthlySpend / 1000000).toFixed(2)}M / month
                    </Badge>
                  </Flex>
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="250000"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#16a34a' }}
                  />
                  <Flex justify="space-between" fontSize="10px" color="#94a3b8" mt={1}>
                    <Text>₦500k</Text>
                    <Text>₦5.0M</Text>
                    <Text>₦10.0M / mo</Text>
                  </Flex>
                </Box>

                {/* Site Labor Force */}
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="xs" fontWeight="bold" color="#334155">Total Site Workforce (Biometric Count)</Text>
                    <Badge size="sm" colorPalette="purple" variant="subtle" fontWeight="bold">
                      {laborCount} Personnel
                    </Badge>
                  </Flex>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={laborCount}
                    onChange={(e) => setLaborCount(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#7c3aed' }}
                  />
                  <Flex justify="space-between" fontSize="10px" color="#94a3b8" mt={1}>
                    <Text>20 Workers</Text>
                    <Text>250 Workers</Text>
                    <Text>500 Workers</Text>
                  </Flex>
                </Box>
              </Stack>
            </Box>

            {/* Right: Real-time Calculated ROI Output */}
            <Box gridColumn={{ lg: 'span 6' }} bg="#0f172a" color="#ffffff" p={{ base: 6, md: 8 }} borderRadius="18px" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="xs" fontWeight="bold" color="#94a3b8" textTransform="uppercase" letterSpacing="0.05em">
                    Estimated Annual Bottom-Line Return
                  </Text>
                  <Badge size="xs" colorPalette="green" variant="solid">
                    NET ANNUAL GAIN
                  </Badge>
                </Flex>
                <Heading size="3xl" color="#4ade80" fontWeight="black" mb={6}>
                  ₦{totalAnnualBenefit.toLocaleString()}
                </Heading>

                <Stack gap={3.5} pt={4} borderTop="1px solid #1e293b">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="#f8fafc">Material Wastage & Pilferage Recovery</Text>
                      <Text fontSize="10px" color="#94a3b8">6.5% reduction via weighbridge & 3-way match</Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="bold" color="#ffffff">
                      ₦{materialSavings.toLocaleString()}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="#f8fafc">Ghost Worker & Unverified Overtime Eliminated</Text>
                      <Text fontSize="10px" color="#94a3b8">Biometric turnstiles linked to daily muster</Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="bold" color="#ffffff">
                      ₦{laborSavings.toLocaleString()}
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="#f8fafc">Cash Flow Acceleration & Capital Turn</Text>
                      <Text fontSize="10px" color="#94a3b8">4.2x faster FIDIC Interim Payment Certificate certification</Text>
                    </Box>
                    <Text fontSize="sm" fontWeight="bold" color="#ffffff">
                      ₦{cashflowAcceleration.toLocaleString()}
                    </Text>
                  </Flex>
                </Stack>
              </Box>

              <Flex gap={3} mt={8} pt={6} borderTop="1px solid #1e293b">
                <Button
                  size="md"
                  flex="1"
                  bg="#2563eb"
                  color="white"
                  _hover={{ bg: '#1d4ed8' }}
                  fontWeight="semibold"
                  onClick={() => setShowDemoModal(true)}
                  h="42px"
                >
                  Verify Calculations With Our Team
                </Button>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Stakeholder Impact Breakdown */}
      <Box py={{ base: 14, md: 20 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%" flex="1">
        <Box w="100%">
          <Box textAlign="center" maxW="760px" mx="auto" mb={12}>
            <Heading size={{ base: 'xl', md: '2xl' }} fontWeight="black" color="#0f172a">
              Delivering Distinct Value Across Every Role.
            </Heading>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {[
              {
                role: 'General Contractors',
                icon: Building2,
                benefit: 'Protects tight profit margins with real-time cost-to-complete forecasting and prevents unauthorized material purchases.'
              },
              {
                role: 'Project Owners & Developers',
                icon: Layers,
                benefit: 'Gains 100% transparent audit visibility into interim valuation draws, physical site milestones, and retention balances.'
              },
              {
                role: 'Specialty Subcontractors',
                icon: HardHat,
                benefit: 'Predictable, expedited payment cycles and dispute-free variation order registers with timestamped photographic proof.'
              },
              {
                role: 'Batch Plants & Fleet Managers',
                icon: Truck,
                benefit: 'Zero concrete batch volume unaccounted for and precise machine maintenance telemetry preventing costly jobsite breakdowns.'
              }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Box key={i} bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
                  <Box w="42px" h="42px" borderRadius="10px" bg="#eff6ff" color="#2563eb" display="flex" alignItems="center" justifyContent="center" mb={4}>
                    <Icon size={22} />
                  </Box>
                  <Heading size="sm" color="#0f172a" mb={2}>
                    {s.role}
                  </Heading>
                  <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                    {s.benefit}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      <PublicFooter onOpenDemo={() => setShowDemoModal(true)} />
      <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </Box>
  );
};
