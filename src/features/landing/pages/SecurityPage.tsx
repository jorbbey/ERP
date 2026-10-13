import React, { useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Button, Badge, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Server,
  UserCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Database,
  RefreshCw,
  KeyRound,
  FileText
} from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { DemoRequestModal } from '../components/DemoRequestModal';
import heroWorkspaceImg from '../../../assets/Blue-Themed Construction ERP Workspace.png';

export const SecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'director' | 'qs' | 'engineer' | 'storekeeper' | 'finance' | 'client'>('director');

  const roleDefinitions = {
    admin: {
      name: 'System Administrator',
      scope: 'Enterprise Infrastructure & Security',
      permissions: [
        { module: 'User Accounts & RBAC Assignment', access: 'Full Control', allowed: true },
        { module: 'Audit Log Export & Hash Verification', access: 'Full Control', allowed: true },
        { module: 'Database Backups & Disaster Recovery', access: 'Full Control', allowed: true },
        { module: 'Direct Financial Disbursement', access: 'Restricted (Segregation of Duties)', allowed: false },
        { module: 'BOQ Rate Alteration without VO', access: 'Restricted', allowed: false }
      ]
    },
    director: {
      name: 'Project Director / General Manager',
      scope: 'Multi-Project Executive Governance',
      permissions: [
        { module: 'Interim Payment Certificate (IPC) Final Sign-off', access: 'Full Approval', allowed: true },
        { module: 'High-Value Requisitions (₦250,000+)', access: 'Dual Sign-off', allowed: true },
        { module: 'Project Budget & Contingency Allocation', access: 'Full Authority', allowed: true },
        { module: 'Daily Gang Muster Authorization', access: 'Executive Review', allowed: true },
        { module: 'Direct Bank Transfer Triggering', access: 'Requires CFO Counter-Sign', allowed: false }
      ]
    },
    qs: {
      name: 'Quantity Surveyor (QS)',
      scope: 'Commercial Measurement & Cost Control',
      permissions: [
        { module: 'Bill of Quantities (BOQ) Maintenance', access: 'Full Control', allowed: true },
        { module: 'Variation Order (VO) Price Verification', access: 'Rate Audit Sign-off', allowed: true },
        { module: 'Material Requisition Quantity Check', access: 'Mandatory Clearance', allowed: true },
        { module: 'Physical Store Stock Release', access: 'Storekeeper Exclusive', allowed: false },
        { module: 'Payroll Final Payment Voucher', access: 'Read-Only Audit', allowed: false }
      ]
    },
    engineer: {
      name: 'Site Engineer / Agent',
      scope: 'Jobsite Field Operations & Execution',
      permissions: [
        { module: 'Daily Progress Report (DPR) Submission', access: 'Full Authoring', allowed: true },
        { module: 'Material Requisition Note (MRN) Creation', access: 'Site Level Creation', allowed: true },
        { module: 'Machinery Breakdown & Delay Logging', access: 'Field Logging', allowed: true },
        { module: 'Direct Purchase Order Issuance', access: 'Restricted to Procurement', allowed: false },
        { module: 'Subcontractor IPC Valuation Draw', access: 'Requires QS Endorsement', allowed: false }
      ]
    },
    storekeeper: {
      name: 'Central Warehouse / Site Storekeeper',
      scope: 'Physical Inventory & Material Custody',
      permissions: [
        { module: 'Goods Received Note (GRN) Issuance', access: 'Gate Authority', allowed: true },
        { module: 'Physical Weighbridge Integration Sync', access: 'Full Control', allowed: true },
        { module: 'Material Issue to Gang Foremen', access: 'Requisition Match Sign-off', allowed: true },
        { module: 'Purchase Order Approval', access: 'Restricted (Anti-Fraud)', allowed: false },
        { module: 'Vendor Payment Creation', access: 'Restricted (Anti-Fraud)', allowed: false }
      ]
    },
    finance: {
      name: 'Chief Accountant / Financial Controller',
      scope: 'Corporate Treasury & Double-Entry Ledger',
      permissions: [
        { module: '3-Way Match Verification (PO = Waybill = GRN)', access: 'Mandatory Financial Gate', allowed: true },
        { module: 'Subcontractor Retention Escrow Ledger', access: 'Full Accounting Authority', allowed: true },
        { module: 'Bank Electronic Transfer Batching', access: 'Authorized Signatory', allowed: true },
        { module: 'Site Requisition Initiation', access: 'Restricted to Field Engineers', allowed: false },
        { module: 'Physical Goods Acceptance', access: 'Restricted to Storekeepers', allowed: false }
      ]
    },
    client: {
      name: 'Institutional Owner / Client Representative',
      scope: 'External Oversight & Transparency',
      permissions: [
        { module: 'Interim Payment Certificate (IPC) Certification', access: 'Client Counter-Signature', allowed: true },
        { module: 'Live Visual Drone / Photo Site Progress', access: 'Real-Time Read-Only', allowed: true },
        { module: 'Contract Retention Balance Inspection', access: 'Read-Only Transparency', allowed: true },
        { module: 'Internal Subcontractor Cost Breakdown', access: 'Confidential (Hidden)', allowed: false },
        { module: 'Direct Warehouse Ledger Alteration', access: 'Restricted', allowed: false }
      ]
    }
  };

  const activeRoleData = roleDefinitions[selectedRole];

  return (
    <Box bg="#f8fafc" minH="100vh" color="#0f172a" display="flex" flexDirection="column">
      <PublicNavbar onOpenDemo={() => setShowDemoModal(true)} />

      {/* Hero Header with Cryptographic Architecture Backdrop */}
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
        {/* Subtle Cryptographic Vault Grid & Cybernetic Blue Radial Glow */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.20) 0%, transparent 60%),
              radial-gradient(circle at 15% 75%, rgba(6, 182, 212, 0.12) 0%, transparent 55%)
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
            alt="Security Architecture Background"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        <Box w="100%" position="relative" zIndex="1">
          <Flex direction="column" align="center" textAlign="center" maxW="920px" mx="auto">
            {/* NO TOP TAG AS REQUESTED */}
            <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="black" color="#ffffff" lineHeight="1.15">
              Institutional-Grade Security, Role-Based Access Control & Audit Trails.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#cbd5e1" mt={4} lineHeight="relaxed">
              Engineered to satisfy government infrastructure audit standards, World Bank procurement guidelines, and international banking covenants.
            </Text>

            <Flex gap={3.5} wrap="wrap" justify="center" mt={7}>
              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/settings')}
                fontWeight="semibold"
                px={6}
                h="44px"
                boxShadow="0 2px 10px rgba(37, 99, 235, 0.35)"
              >
                Inspect System Audit Trail <ArrowRight size={16} />
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
                Request Security Whitepaper
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* Security Pillars Grid */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} w="100%">
        <Box w="100%">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
              <Box w="44px" h="44px" borderRadius="12px" bg="#eff6ff" color="#2563eb" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Lock size={22} />
              </Box>
              <Heading size="md" color="#0f172a" mb={2}>AES-256 & TLS 1.3 Cryptography</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                All confidential engineering contracts, pricing rates, and corporate banking records are encrypted at rest with AES-256 and transmitted exclusively across TLS 1.3 tunnels with forward secrecy.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
              <Box w="44px" h="44px" borderRadius="12px" bg="#ecfdf5" color="#059669" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <FileCheck size={22} />
              </Box>
              <Heading size="md" color="#0f172a" mb={2}>Cryptographic Immutable Audit Vault</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                Every transaction, milestone sign-off, and cashflow modification writes an immutable, append-only log entry stamped with SHA-256 checksums, preventing retrospective tampering.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
              <Box w="44px" h="44px" borderRadius="12px" bg="#faf5ff" color="#7c3aed" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <UserCheck size={22} />
              </Box>
              <Heading size="md" color="#0f172a" mb={2}>Strict Separation of Duties (SoD)</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                Guarantees zero individual can initiate, verify, approve, and disburse capital single-handedly. Prevents procurement kickbacks and inventory release discrepancies.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
              <Box w="44px" h="44px" borderRadius="12px" bg="#fff7ed" color="#ea580c" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <RefreshCw size={22} />
              </Box>
              <Heading size="md" color="#0f172a" mb={2}>Offline Cryptographic Field Sync</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                Remote mountain highway and desert jobsites operate locally on tablets without cellular signal. Records are cryptographically signed offline and sync seamlessly upon reconnection.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
              <Box w="44px" h="44px" borderRadius="12px" bg="#f0f9ff" color="#0284c7" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Database size={22} />
              </Box>
              <Heading size="md" color="#0f172a" mb={2}>Joint Venture & Entity Isolation</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                Multi-company contractors and consortiums can partition data so Joint Venture partners only view their designated project scopes while group headquarters retains executive rollup.
              </Text>
            </Box>

            <Box bg="#ffffff" p={6} borderRadius="16px" border="1px solid #e2e8f0" boxShadow="xs">
              <Box w="44px" h="44px" borderRadius="12px" bg="#fef2f2" color="#dc2626" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <ShieldCheck size={22} />
              </Box>
              <Heading size="md" color="#0f172a" mb={2}>FIDIC & IFRS 15 Compliance</Heading>
              <Text fontSize="xs" color="#64748b" lineHeight="relaxed">
                Built-in conformance with FIDIC contract provisions (Red, Yellow, and Silver books) alongside statutory revenue recognition rules for international engineering contractors.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Interactive RBAC Inspector */}
      <Box py={{ base: 12, md: 16 }} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#ffffff" borderTop="1px solid #e2e8f0" w="100%" flex="1">
        <Box w="100%">
          <Box textAlign="center" maxW="760px" mx="auto" mb={10}>
            <Heading size={{ base: 'xl', md: '3xl' }} fontWeight="black" color="#0f172a">
              Explore Role Permissions Across Jobsite & Headquarters.
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={2}>
              Select any stakeholder role below to inspect its precise access rights, approval limits, and security constraints.
            </Text>
          </Box>

          {/* Role Buttons */}
          <Flex justify="center" gap={2} flexWrap="wrap" mb={8}>
            {[
              { id: 'admin', label: 'System Admin' },
              { id: 'director', label: 'Project Director' },
              { id: 'qs', label: 'Quantity Surveyor (QS)' },
              { id: 'engineer', label: 'Site Engineer' },
              { id: 'storekeeper', label: 'Storekeeper' },
              { id: 'finance', label: 'Finance Controller' },
              { id: 'client', label: 'Client / Owner Rep' }
            ].map(r => (
              <Button
                key={r.id}
                size="sm"
                variant={selectedRole === r.id ? 'solid' : 'outline'}
                bg={selectedRole === r.id ? '#0f172a' : '#ffffff'}
                color={selectedRole === r.id ? '#ffffff' : '#475569'}
                borderColor="#cbd5e1"
                _hover={{ bg: selectedRole === r.id ? '#1e293b' : '#f1f5f9' }}
                onClick={() => setSelectedRole(r.id as any)}
                borderRadius="full"
                px={4}
                h="36px"
              >
                {r.label}
              </Button>
            ))}
          </Flex>

          {/* Role Details Panel */}
          <Box bg="#f8fafc" p={{ base: 5, md: 7 }} borderRadius="18px" border="1px solid #e2e8f0" maxW="900px" mx="auto">
            <Flex justify="space-between" align="center" mb={4} pb={3} borderBottom="1px solid #e2e8f0">
              <Box>
                <Heading size="md" color="#0f172a" fontWeight="bold">
                  {activeRoleData.name}
                </Heading>
                <Text fontSize="xs" color="#64748b" mt={0.5}>
                  Primary Governance Scope: <span style={{ fontWeight: 600, color: '#2563eb' }}>{activeRoleData.scope}</span>
                </Text>
              </Box>
              <Badge size="sm" colorPalette="blue" variant="subtle">
                STRICT RBAC ENFORCED
              </Badge>
            </Flex>

            <Stack gap={2.5}>
              {activeRoleData.permissions.map((p, idx) => (
                <Flex
                  key={idx}
                  justify="space-between"
                  align="center"
                  p={3.5}
                  bg="#ffffff"
                  borderRadius="10px"
                  border="1px solid #e2e8f0"
                >
                  <Flex align="center" gap={3}>
                    <Box color={p.allowed ? '#16a34a' : '#dc2626'} flexShrink={0}>
                      {p.allowed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#0f172a">
                      {p.module}
                    </Text>
                  </Flex>
                  <Badge size="xs" colorPalette={p.allowed ? 'green' : 'red'} variant="subtle">
                    {p.access}
                  </Badge>
                </Flex>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      <PublicFooter onOpenDemo={() => setShowDemoModal(true)} />
      <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </Box>
  );
};
