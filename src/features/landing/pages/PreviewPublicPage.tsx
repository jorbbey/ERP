import React, { useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Button, Badge, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  HardHat,
  Boxes,
  Truck,
  FileText,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { DemoRequestModal } from '../components/DemoRequestModal';
import { useERP } from '../../../context/ERPContext';
import heroWorkspaceImg from '../../../assets/Blue-Themed Construction ERP Workspace.png';

export const PreviewPublicPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, inventory, requisitions, activeCompany } = useERP();
  const currency = activeCompany?.currency || '₦';
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'exec' | 'projects' | 'requisitions' | 'fleet' | 'contracts'>('exec');

  return (
    <Box bg="#f8fafc" minH="100vh" color="#0f172a" display="flex" flexDirection="column">
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Hero Header with Live Command Center Telemetry Backdrop */}
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
        {/* Subtle Command Center Grid & Blue/Cyan Radial Glow */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.20) 0%, transparent 60%),
              radial-gradient(circle at 15% 75%, rgba(14, 165, 233, 0.14) 0%, transparent 55%)
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
          opacity="0.18"
          pointerEvents="none"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
          }}
        >
          <img
            src={heroWorkspaceImg}
            alt="Live Workspace Preview Background"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box w="100%" position="relative" zIndex="1">
          <Flex direction="column" align="center" textAlign="center" maxW="920px" mx="auto">
            {/* NO TOP TAG AS REQUESTED */}
            <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="black" color="#ffffff" lineHeight="1.15">
              Experience the Live Platform Workspace.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#cbd5e1" mt={4} lineHeight="relaxed">
              Explore key operational views with live sample data. Click through to any section or jump straight into the full software.
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
                _hover={{ bg: '#1e293b' }}
                onClick={() => navigate('/login?mode=signin')}
                fontWeight="semibold"
                px={6}
                h="44px"
              >
                Sign in
              </Button>
              <Button
                size="md"
                variant="ghost"
                color="#cbd5e1"
                _hover={{ color: '#ffffff', bg: 'rgba(255, 255, 255, 0.08)' }}
                onClick={() => setShowDemoModal(true)}
                fontWeight="semibold"
                px={6}
                h="44px"
              >
                Request Guided Tour
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* Interactive Tabs Bar */}
      <Box py={8} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%" flex="1">
        <Box w="100%">
          <Flex
            justify="center"
            gap={2}
            flexWrap="wrap"
            mb={8}
            p={1.5}
            bg="#ffffff"
            borderRadius="14px"
            border="1px solid #e2e8f0"
            maxW="920px"
            mx="auto"
            boxShadow="xs"
          >
            {[
              { id: 'exec', label: 'Executive Overview', icon: BarChart3 },
              { id: 'projects', label: 'Civil Projects & BOQ', icon: HardHat },
              { id: 'requisitions', label: 'Material Requisitions', icon: Boxes },
              { id: 'fleet', label: 'Plant & Heavy Fleet', icon: Truck },
              { id: 'contracts', label: 'FIDIC Contracts', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={isSelected ? 'solid' : 'ghost'}
                  bg={isSelected ? '#2563eb' : 'transparent'}
                  color={isSelected ? '#ffffff' : '#475569'}
                  _hover={{ bg: isSelected ? '#1d4ed8' : '#f1f5f9' }}
                  onClick={() => setActiveTab(tab.id as any)}
                  fontWeight="semibold"
                  borderRadius="8px"
                  px={4}
                  h="38px"
                >
                  <Icon size={15} /> {tab.label}
                </Button>
              );
            })}
          </Flex>

          {/* Tab 1: Executive Overview */}
          {activeTab === 'exec' && (
            <Box bg="#ffffff" borderRadius="20px" border="1px solid #e2e8f0" p={{ base: 5, md: 8 }} boxShadow="xs">
              <Flex justify="space-between" align="center" mb={6} pb={4} borderBottom="1px solid #f1f5f9">
                <Box>
                  <Heading size="md" color="#0f172a" fontWeight="bold">Executive Group Performance Dashboard</Heading>
                  <Text fontSize="xs" color="#64748b">Active Entity: {activeCompany?.name || 'Apex Construction'} • 4 Active Heavy Sites</Text>
                </Box>
                <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/login?mode=signup')} h="32px" px={3}>
                  Launch Software <ExternalLink size={12} />
                </Button>
              </Flex>

              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} mb={6}>
                <Box p={4} borderRadius="12px" bg="#f8fafc" border="1px solid #e2e8f0">
                  <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Active Civil Sites</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>4 Active Sites</Text>
                  <Text fontSize="11px" color="#16a34a" mt={1}>100% on schedule</Text>
                </Box>
                <Box p={4} borderRadius="12px" bg="#f8fafc" border="1px solid #e2e8f0">
                  <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Contract Book Value</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#2563eb" mt={1}>{currency} 53.6M</Text>
                  <Text fontSize="11px" color="#64748b" mt={1}>FIDIC certified volume</Text>
                </Box>
                <Box p={4} borderRadius="12px" bg="#f8fafc" border="1px solid #e2e8f0">
                  <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Total Site Workforce</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>142 Personnel</Text>
                  <Text fontSize="11px" color="#7c3aed" mt={1}>Biometric attendance 96%</Text>
                </Box>
                <Box p={4} borderRadius="12px" bg="#f8fafc" border="1px solid #e2e8f0">
                  <Text fontSize="10px" fontWeight="bold" color="#64748b" textTransform="uppercase">Stores & Inventory SKUs</Text>
                  <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>{inventory.length} Verified SKUs</Text>
                  <Text fontSize="11px" color="#16a34a" mt={1}>Optimal re-order status</Text>
                </Box>
              </SimpleGrid>
            </Box>
          )}

          {/* Tab 2: Civil Projects & BOQ */}
          {activeTab === 'projects' && (
            <Box bg="#ffffff" borderRadius="20px" border="1px solid #e2e8f0" p={{ base: 5, md: 8 }} boxShadow="xs">
              <Flex justify="space-between" align="center" mb={6} pb={4} borderBottom="1px solid #f1f5f9">
                <Box>
                  <Heading size="md" color="#0f172a" fontWeight="bold">Civil Infrastructure Projects Execution</Heading>
                  <Text fontSize="xs" color="#64748b">Bill of Quantities (BOQ), Daily Logs, Site Delays & RFIs</Text>
                </Box>
                <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/projects')} h="32px" px={3}>
                  Open Projects Catalog <ExternalLink size={12} />
                </Button>
              </Flex>

              <Stack gap={3.5}>
                {projects.map(p => (
                  <Box key={p.id} p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Flex justify="space-between" align="start" mb={2}>
                      <Box>
                        <Flex align="center" gap={2}>
                          <Text fontWeight="bold" fontSize="sm" color="#0f172a">{p.name}</Text>
                          <Badge size="xs" colorPalette="blue" variant="subtle">{p.projectNumber}</Badge>
                        </Flex>
                        <Text fontSize="xs" color="#64748b" mt={0.5}>
                          Location: {p.siteLocation} • Client: {p.clientName}
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontWeight="black" fontSize="sm" color="#0f172a">{p.progressPercent}% Target</Text>
                        <Text fontSize="xs" color="#059669">{currency} {(p.spent / 1000).toFixed(0)}k Spent</Text>
                      </Box>
                    </Flex>
                    <Box w="100%" h="6px" bg="#e2e8f0" borderRadius="full" overflow="hidden" mt={2}>
                      <Box h="100%" w={`${p.progressPercent}%`} bg="#2563eb" borderRadius="full" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Tab 3: Material Requisitions */}
          {activeTab === 'requisitions' && (
            <Box bg="#ffffff" borderRadius="20px" border="1px solid #e2e8f0" p={{ base: 5, md: 8 }} boxShadow="xs">
              <Flex justify="space-between" align="center" mb={6} pb={4} borderBottom="1px solid #f1f5f9">
                <Box>
                  <Heading size="md" color="#0f172a" fontWeight="bold">3-Way Procurement & Material Requisitions</Heading>
                  <Text fontSize="xs" color="#64748b">Purchase Orders (PO), Site Waybills & Goods Received Notes (GRN)</Text>
                </Box>
                <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/requisitions')} h="32px" px={3}>
                  Open Requisitions <ExternalLink size={12} />
                </Button>
              </Flex>

              <Stack gap={3}>
                {requisitions.slice(0, 4).map(req => (
                  <Flex key={req.id} justify="space-between" align="center" p={3.5} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                    <Box>
                      <Flex align="center" gap={2}>
                        <Text fontSize="xs" fontWeight="bold" fontFamily="mono" color="#0f172a">{req.requisitionNo}</Text>
                        <Badge size="xs" colorPalette={req.status === 'Approved' ? 'green' : 'orange'}>
                          {req.status}
                        </Badge>
                      </Flex>
                      <Text fontSize="xs" color="#334155" mt={0.5}>{req.projectName} — Requested by {req.requestedBy}</Text>
                    </Box>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                      {req.totalEstimatedAmount !== undefined ? `${currency} ${req.totalEstimatedAmount.toLocaleString()}` : 'Unpriced'}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          )}

          {/* Tab 4: Plant & Fleet Telematics */}
          {activeTab === 'fleet' && (
            <Box bg="#ffffff" borderRadius="20px" border="1px solid #e2e8f0" p={{ base: 5, md: 8 }} boxShadow="xs">
              <Flex justify="space-between" align="center" mb={6} pb={4} borderBottom="1px solid #f1f5f9">
                <Box>
                  <Heading size="md" color="#0f172a" fontWeight="bold">Heavy Equipment & Fleet Telematics</Heading>
                  <Text fontSize="xs" color="#64748b">Caterpillar, Komatsu & Liebherr Fleet Readiness & Maintenance Logs</Text>
                </Box>
                <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/equipment')} h="32px" px={3}>
                  Open Fleet Module <ExternalLink size={12} />
                </Button>
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {[
                  { name: 'CAT 336DL Hydraulic Excavator', site: 'Lekki Highway Site', hours: '3,420 hrs', fuel: '82%', status: 'Operating' },
                  { name: 'Komatsu D85 Bulldozer', site: 'Ikoyi Foundation Site', hours: '4,110 hrs', fuel: '64%', status: 'Operating' },
                  { name: 'Mercedes Actros 3340 Tipper', site: 'Epe Bridge Corridor', hours: '1,890 hrs', fuel: '95%', status: 'Maintenance Due' }
                ].map((eq, i) => (
                  <Box key={i} p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Flex justify="space-between" align="start">
                      <Text fontSize="xs" fontWeight="bold" color="#0f172a">{eq.name}</Text>
                      <Badge size="xs" colorPalette={eq.status === 'Operating' ? 'green' : 'yellow'}>{eq.status}</Badge>
                    </Flex>
                    <Text fontSize="11px" color="#64748b" mt={1}>Site: {eq.site}</Text>
                    <Flex justify="space-between" fontSize="11px" color="#334155" mt={3} pt={2} borderTop="1px solid #e2e8f0">
                      <Text>Engine: {eq.hours}</Text>
                      <Text>Fuel Tank: {eq.fuel}</Text>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Tab 5: FIDIC Contracts */}
          {activeTab === 'contracts' && (
            <Box bg="#ffffff" borderRadius="20px" border="1px solid #e2e8f0" p={{ base: 5, md: 8 }} boxShadow="xs">
              <Flex justify="space-between" align="center" mb={6} pb={4} borderBottom="1px solid #f1f5f9">
                <Box>
                  <Heading size="md" color="#0f172a" fontWeight="bold">FIDIC Contracts, IPC Interim Certificates & Ledgers</Heading>
                  <Text fontSize="xs" color="#64748b">Retention Escrow Accounts, Advance Payment Guarantees (APG)</Text>
                </Box>
                <Button size="xs" bg="#2563eb" color="white" onClick={() => navigate('/contract-admin')} h="32px" px={3}>
                  Open Contract Admin <ExternalLink size={12} />
                </Button>
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">FIDIC Red Book IPC #07 - Lekki Express</Text>
                  <Text fontSize="11px" color="#64748b" mt={0.5}>Certified by Resident Engineer • Valuation ₦4,850,000</Text>
                  <Flex justify="space-between" fontSize="xs" mt={3} pt={2} borderTop="1px solid #e2e8f0">
                    <Text color="#64748b">Retention (5%): ₦242,500</Text>
                    <Text fontWeight="bold" color="#16a34a">Approved for Payout</Text>
                  </Flex>
                </Box>
                <Box p={4} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">Advance Payment Guarantee (APG) Amortization</Text>
                  <Text fontSize="11px" color="#64748b" mt={0.5}>Original APG ₦3,500,000 • 68% Recovered to Date</Text>
                  <Flex justify="space-between" fontSize="xs" mt={3} pt={2} borderTop="1px solid #e2e8f0">
                    <Text color="#64748b">Outstanding: ₦1,120,000</Text>
                    <Text fontWeight="bold" color="#2563eb">Fully Collateralized</Text>
                  </Flex>
                </Box>
              </SimpleGrid>
            </Box>
          )}
        </Box>
      </Box>

      <PublicFooter onOpenDemo={() => setShowDemoModal(true)} />
      <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </Box>
  );
};
