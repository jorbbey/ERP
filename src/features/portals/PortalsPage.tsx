import React from 'react';
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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  HardHat,
  Calculator,
  ShoppingCart,
  Users,
  Wallet,
  Building2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface PortalInfo {
  role: UserRole;
  title: string;
  department: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  keyResponsibilities: string[];
  primaryRoute: string;
}

export const PortalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRole, setActiveRole, currentUserName } = useERP();

  const portals: PortalInfo[] = [
    {
      role: 'Managing Director',
      title: 'Executive Managing Director Suite',
      department: 'Executive Board',
      icon: Building2,
      color: '#2563eb',
      bgColor: '#eff6ff',
      description: 'Overall corporate governance, major CapEx authorizations, tender approvals and enterprise financial health.',
      keyResponsibilities: [
        'Authorizing requisitions & purchase orders',
        'Reviewing site progress vs contract schedule',
        'Monitoring project budgets and cost variances',
        'Signing off monthly finalized payroll'
      ],
      primaryRoute: '/dashboard'
    },
    {
      role: 'Site Engineer',
      title: 'Site Engineer Field Terminal',
      department: 'Civil Construction & Operations',
      icon: HardHat,
      color: '#d97706',
      bgColor: '#fffbeb',
      description: 'Daily construction site execution, concrete pours, slump tests, workforce headcount, and site safety management.',
      keyResponsibilities: [
        'Logging daily site progress, weather & manpower',
        'Submitting engineering RFIs to consultants',
        'Reporting site safety incidents and hazards',
        'Verifying concrete batches delivered to site'
      ],
      primaryRoute: '/projects'
    },
    {
      role: 'Site Quantity Surveyor',
      title: 'Site Quantity Surveyor Terminal',
      department: 'Cost & Measurement',
      icon: Calculator,
      color: '#0891b2',
      bgColor: '#ecfeff',
      description: 'Measurement, BOQ take-offs, site material requirements verification, and interim contractor claims.',
      keyResponsibilities: [
        'Creating project-linked material requisitions',
        'Tracking unit rates and inventory valuations',
        'Auditing contractor change order estimates',
        'Submitting contract variation events'
      ],
      primaryRoute: '/requisitions'
    },
    {
      role: 'Procurement Officer',
      title: 'Procurement & Supply Chain Desk',
      department: 'Procurement & Logistics',
      icon: ShoppingCart,
      color: '#7c3aed',
      bgColor: '#faf5ff',
      description: 'Sourcing construction materials, issuing vendor Purchase Orders, and managing supplier goods receipt.',
      keyResponsibilities: [
        'Converting approved requisitions into POs',
        'Recording Goods Received Notes (GRN)',
        'Managing vendor price agreements',
        'Monitoring warehouse safety stock alerts'
      ],
      primaryRoute: '/procurement'
    },
    {
      role: 'HR Manager',
      title: 'Human Resources & Personnel Desk',
      department: 'Human Capital',
      icon: Users,
      color: '#db2777',
      bgColor: '#fdf2f8',
      description: 'Workforce management, staff onboarding, loan approvals, salary advances, and departmental assignments.',
      keyResponsibilities: [
        'Maintaining employee records & statutory numbers',
        'Reviewing and deciding salary advance requests',
        'Setting up employee loans and repayment terms',
        'Tracking staff attendance and leave status'
      ],
      primaryRoute: '/hr'
    },
    {
      role: 'Finance Manager',
      title: 'Finance & Treasury Office',
      department: 'Finance & Accounts',
      icon: Wallet,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      description: 'Financial controls, payroll execution, general ledger accounting, and supplier disbursement clearance.',
      keyResponsibilities: [
        'Computing and finalizing monthly payroll',
        'Generating and distributing staff payslips',
        'Monitoring corporate cash flow & tax liabilities',
        'Clearing purchase orders and interim certificates'
      ],
      primaryRoute: '/payroll'
    },
    {
      role: 'Super Admin',
      title: 'System Administrator Console',
      department: 'Enterprise IT & ERP Governance',
      icon: ShieldCheck,
      color: '#0f172a',
      bgColor: '#f1f5f9',
      description: 'Multi-company workspaces, access control lists (ACL), database maintenance and global system settings.',
      keyResponsibilities: [
        'Switching between group subsidiary companies',
        'Configuring company addresses and tax profiles',
        'Managing employee module access permissions',
        'Auditing system transactions and event logs'
      ],
      primaryRoute: '/settings'
    }
  ];

  const handleSwitchPersona = (portal: PortalInfo) => {
    setActiveRole(portal.role);
    navigate(portal.primaryRoute);
  };

  return (
    <Box>
      {/* Header Banner */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        gap={4} 
        mb={6}
      >
        <Box>
          <Flex align="center" gap={3}>
            <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px">
              <Sparkles size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="#0f172a">
                Role Portals & Personas Hub
              </Heading>
              <Text fontSize="xs" color="#64748b" mt={0.5}>
                Simulate and experience the Construction ERP system across all organizational job functions.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box p={3} bg="white" border="1px solid #e2e8f0" borderRadius="12px" fontSize="xs">
          <Text color="#64748b">Current Active Persona:</Text>
          <Text fontWeight="bold" color="#2563eb">{currentUserName} ({activeRole})</Text>
        </Box>
      </Flex>

      {/* Portals Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isCurrent = activeRole === portal.role;

          return (
            <Card.Root
              key={portal.role}
              bg="white"
              border="1px solid"
              borderColor={isCurrent ? '#2563eb' : '#e2e8f0'}
              borderRadius="16px"
              p={5}
              boxShadow={isCurrent ? 'md' : 'xs'}
              position="relative"
              overflow="hidden"
            >
              {isCurrent && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  h="4px"
                  bg="#2563eb"
                />
              )}

              <Flex justify="space-between" align="flex-start" mb={3}>
                <Box
                  w="42px"
                  h="42px"
                  borderRadius="12px"
                  bg={portal.bgColor}
                  color={portal.color}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size={22} />
                </Box>
                {isCurrent ? (
                  <Badge colorPalette="blue" variant="solid" fontSize="10px">
                    <CheckCircle2 size={12} /> Active Persona
                  </Badge>
                ) : (
                  <Badge variant="subtle" colorPalette="gray" fontSize="10px">
                    {portal.department}
                  </Badge>
                )}
              </Flex>

              <Heading size="sm" color="#0f172a" mb={1}>
                {portal.title}
              </Heading>

              <Text fontSize="xs" color="#64748b" mb={3} lineHeight="relaxed">
                {portal.description}
              </Text>

              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" mb={4}>
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b" mb={1.5}>
                  Core Workflows & Privileges:
                </Text>
                <Stack gap={1}>
                  {portal.keyResponsibilities.map((resp, i) => (
                    <Flex key={i} fontSize="11px" color="#334155" align="center" gap={1.5}>
                      <Box as="span" w="4px" h="4px" borderRadius="full" bg={portal.color} flexShrink={0} />
                      <Text as="span">{resp}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Box>

              <Button
                size="sm"
                w="100%"
                bg={isCurrent ? '#0f172a' : portal.color}
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={() => handleSwitchPersona(portal)}
              >
                {isCurrent ? 'Enter Workspace' : `Switch to ${portal.role}`} <ArrowRight size={15} />
              </Button>
            </Card.Root>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
