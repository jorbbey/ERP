import React, { useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Button, Badge, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  Workflow,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileText,
  DollarSign,
  AlertOctagon,
  Scale,
  Users,
  HardHat,
  Boxes,
  Truck
} from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { DemoRequestModal } from '../components/DemoRequestModal';
import heroWorkspaceImg from '../../../assets/Blue-Themed Construction ERP Workspace.png';

export const WorkflowPublicPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Jobsite Requisition (MRN)',
      actor: 'Site Engineer / Agent',
      actorIcon: HardHat,
      color: '#2563eb',
      bgLight: '#eff6ff',
      tag: 'Field Initiation',
      summary: 'Engineer creates material request on mobile/tablet directly tagged to a specific BOQ item code and physical site zone.',
      checks: [
        'Validated against project Bill of Quantities remaining threshold',
        'Automatic GPS site coordinate timestamping',
        'Priority tagging (Standard, Urgent, Safety-Critical)',
        'Attached photo documentation of site requirement'
      ]
    },
    {
      step: '02',
      title: 'Quantity Surveyor (QS) Audit',
      actor: 'Project QS / Cost Controller',
      actorIcon: Scale,
      color: '#d97706',
      bgLight: '#fffbeb',
      tag: 'Rate & Quantity Verification',
      summary: 'QS verifies physical progress rates, unit price escalations, and ensures consumption matches structural milestones.',
      checks: [
        'Variance analysis vs. target construction budget',
        'Check for duplicate requisitions across sub-contractors',
        'Cross-examination with daily site weather and progress logs',
        'Digital signature and cost-code allocation'
      ]
    },
    {
      step: '03',
      title: 'Project Director Authorization',
      actor: 'Project Director / GM',
      actorIcon: Users,
      color: '#7c3aed',
      bgLight: '#f5f3ff',
      tag: 'Executive Governance',
      summary: 'Executive sign-off based on project milestone completion, client certification status, and cash flow forecast.',
      checks: [
        'Automated routing based on monetary threshold bands',
        'Dual-signoff enforcement for high-value orders (₦250,000+)',
        'Mobile one-click signoff with push notification',
        'Automatic delegation to deputy when manager is in remote inspection'
      ]
    },
    {
      step: '04',
      title: 'Commercial Procurement & PO',
      actor: 'Procurement Specialist',
      actorIcon: Boxes,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      tag: '3-Way Bidding',
      summary: 'Central purchasing generates competitive RFQs, selects pre-qualified suppliers, and issues legal Purchase Orders.',
      checks: [
        'Vendor performance scorecard validation',
        'Contractual payment terms & discount clauses',
        'Delivery milestone commitments & liquidated damage terms',
        'Automated PO transmission to selected supplier portal'
      ]
    },
    {
      step: '05',
      title: 'Physical Receipt & Weighbridge (GRN)',
      actor: 'Site Storekeeper',
      actorIcon: Truck,
      color: '#059669',
      bgLight: '#ecfdf5',
      tag: 'Physical Verification',
      summary: 'Materials arrive on site. Storekeeper matches physical delivery against supplier waybill and runs quality checks.',
      checks: [
        'Weighbridge scale reading integration for rebar and cement',
        'Goods Received Note (GRN) generated with condition photos',
        'Immediate short-shipment or damage debit note issuance',
        'Instant stock ledger update in local site store'
      ]
    },
    {
      step: '06',
      title: 'Finance 3-Way Match & Disbursement',
      actor: 'Chief Financial Officer / Accounts',
      actorIcon: DollarSign,
      color: '#16a34a',
      bgLight: '#f0fdf4',
      tag: 'Financial Settlement',
      summary: 'Finance executes 3-way automated matching (PO = Waybill = GRN). No invoice is ever disbursed without physical proof.',
      checks: [
        '100% mathematical audit of prices, taxes, and discounts',
        'Automated generation of electronic payment voucher',
        'Immediate posting to project cost-ledger accounts',
        'Bank automated clearing house (ACH) batch execution'
      ]
    }
  ];

  const currentWorkflow = workflowSteps[activeStep];
  const CurrentActorIcon = currentWorkflow.actorIcon;

  return (
    <Box bg="#f8fafc" minH="100vh" color="#0f172a" display="flex" flexDirection="column">
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Hero Header with Approval Governance Circuit Backdrop */}
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
        {/* Subtle Approval Workflow Network Grid & Violet/Blue Radial Glow */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.18) 0%, transparent 60%),
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
            alt="Governance Workflow Background"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box w="100%" position="relative" zIndex="1">
          <Flex direction="column" align="center" textAlign="center" maxW="920px" mx="auto">
            {/* NO TOP TAG AS REQUESTED */}
            <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="black" color="#ffffff" lineHeight="1.15">
              Rigorous Civil Workflows. Zero Approvals Slipping Through The Cracks.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#cbd5e1" mt={4} lineHeight="relaxed">
              Eliminate corruption, material leakage, and uncertified expenses. Apex Construct automates the end-to-end lifecycle from initial site request to final corporate financial disbursement.
            </Text>

            <Flex gap={3.5} wrap="wrap" justify="center" mt={7}>
              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/workflow')}
                fontWeight="semibold"
                px={6}
                h="44px"
                boxShadow="0 2px 10px rgba(37, 99, 235, 0.35)"
              >
                Inspect Live Approval Engine <ArrowRight size={16} />
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
                Request Workflow Walkthrough
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* Interactive Workflow Stepper Section */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%" flex="1">
        <Box w="100%">
          {/* Step Selector Horizontal Bar */}
          <SimpleGrid columns={{ base: 2, sm: 3, lg: 6 }} gap={3} mb={8}>
            {workflowSteps.map((s, idx) => {
              const isSelected = activeStep === idx;
              return (
                <Box
                  key={s.step}
                  as="button"
                  onClick={() => setActiveStep(idx)}
                  p={3.5}
                  borderRadius="12px"
                  bg={isSelected ? '#0f172a' : '#ffffff'}
                  color={isSelected ? '#ffffff' : '#0f172a'}
                  border="1px solid"
                  borderColor={isSelected ? '#0f172a' : '#e2e8f0'}
                  textAlign="left"
                  cursor="pointer"
                  transition="all 0.15s ease"
                  _hover={{ borderColor: '#93c5fd' }}
                >
                  <Text fontSize="11px" fontWeight="black" color={isSelected ? '#60a5fa' : '#2563eb'}>
                    STAGE {s.step}
                  </Text>
                  <Text fontSize="xs" fontWeight="bold" mt={1} lineClamp={1}>
                    {s.title}
                  </Text>
                  <Text fontSize="10px" color={isSelected ? '#94a3b8' : '#64748b'} mt={0.5} lineClamp={1}>
                    {s.actor}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Active Step Detailed Deep-Dive Card */}
          <Box
            bg="#ffffff"
            borderRadius="20px"
            border="1px solid #e2e8f0"
            p={{ base: 6, md: 8 }}
            boxShadow="sm"
            mb={12}
          >
            <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ base: 'flex-start', lg: 'center' }} gap={6} pb={6} borderBottom="1px solid #f1f5f9">
              <Flex align="center" gap={4}>
                <Box
                  w="56px"
                  h="56px"
                  borderRadius="16px"
                  bg={currentWorkflow.bgLight}
                  color={currentWorkflow.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <CurrentActorIcon size={28} />
                </Box>
                <Box>
                  <Flex align="center" gap={2}>
                    <Badge size="sm" colorPalette="blue" variant="solid">
                      STAGE {currentWorkflow.step}
                    </Badge>
                    <Badge size="sm" variant="subtle" colorPalette="gray">
                      {currentWorkflow.tag}
                    </Badge>
                  </Flex>
                  <Heading size="lg" color="#0f172a" fontWeight="bold" mt={1}>
                    {currentWorkflow.title}
                  </Heading>
                  <Text fontSize="xs" color="#64748b" mt={0.5}>
                    Assigned Role: <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentWorkflow.actor}</span>
                  </Text>
                </Box>
              </Flex>

              <Flex gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="#cbd5e1"
                  color="#475569"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  h="36px"
                >
                  Previous Stage
                </Button>
                <Button
                  size="sm"
                  bg="#2563eb"
                  color="white"
                  disabled={activeStep === workflowSteps.length - 1}
                  onClick={() => setActiveStep(Math.min(workflowSteps.length - 1, activeStep + 1))}
                  h="36px"
                >
                  Next Stage <ArrowRight size={14} />
                </Button>
              </Flex>
            </Flex>

            <Box mt={6}>
              <Text fontSize="sm" color="#334155" lineHeight="relaxed" mb={6}>
                {currentWorkflow.summary}
              </Text>

              <Text fontSize="xs" fontWeight="bold" color="#0f172a" textTransform="uppercase" letterSpacing="0.05em" mb={3}>
                Mandatory System Validations & Governance Rules:
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3.5}>
                {currentWorkflow.checks.map((chk, i) => (
                  <Flex key={i} align="start" gap={3} p={3.5} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                    <Box color="#16a34a" mt={0.5} flexShrink={0}>
                      <CheckCircle2 size={16} />
                    </Box>
                    <Text fontSize="xs" color="#334155" fontWeight="medium" lineHeight="short">
                      {chk}
                    </Text>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>
          </Box>

          {/* Governance Pillars */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0">
              <Box w="40px" h="40px" borderRadius="10px" bg="#fee2e2" color="#dc2626" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <AlertOctagon size={20} />
              </Box>
              <Heading size="sm" color="#0f172a" mb={2}>Anti-Collusion Separation of Duties</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                The engineer who creates the request cannot authorize payment. The storekeeper who receives materials cannot create the PO. Strict separation prevents internal collusion.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0">
              <Box w="40px" h="40px" borderRadius="10px" bg="#fef3c7" color="#d97706" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Clock size={20} />
              </Box>
              <Heading size="sm" color="#0f172a" mb={2}>Automated SLAs & Dynamic Escalation</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                If an urgent requisition sits unapproved for more than 4 hours, the system automatically escalates to the Regional Operations Director to prevent jobsite concrete pour delays.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0">
              <Box w="40px" h="40px" borderRadius="10px" bg="#eff6ff" color="#2563eb" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <ShieldCheck size={20} />
              </Box>
              <Heading size="sm" color="#0f172a" mb={2}>Cryptographic Immutable Audit Log</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                Every authorization, modification, rejection, and comment is stamped with user identity, GPS coordinate, timestamp, and IP address. Read-only audit log satisfies international lenders.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      <PublicFooter onOpenDemo={() => setShowDemoModal(true)} />
      <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </Box>
  );
};
