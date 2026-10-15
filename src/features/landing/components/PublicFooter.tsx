import React from 'react';
import { Box, Flex, Text, SimpleGrid, Stack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../../../context/ERPContext';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';
import logoImg from '../../../assets/Minimalist Blue Architectural Growth Logo.png';

interface PublicFooterProps {
  onOpenDemo?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenDemo }) => {
  const navigate = useNavigate();
  const { supabaseUser } = useERP();

  const handleAuthOrNav = (path: string) => {
    if (supabaseUser) {
      navigate(path);
    } else {
      navigate('/login?mode=signin');
    }
  };

  return (
    <Box as="footer" py={16} px={{ base: 4, sm: 6, md: 8, xl: 12 }} bg="#090d16" color="#ffffff" w="100%">
      <Box w="100%">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={10} mb={14}>
          {/* Col 1: Brand & Overview */}
          <Box gridColumn={{ lg: 'span 2' }}>
            <Flex align="center" gap={3} mb={5}>
              <Box
                w="34px"
                h="34px"
                minW="34px"
                minH="34px"
                maxW="34px"
                maxH="34px"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="6px"
                cursor="pointer"
                onClick={() => navigate('/')}
              >
                <img
                  src={logoImg}
                  alt="Apex Construct Logo"
                  width={34}
                  height={34}
                  style={{
                    width: '34px',
                    height: '34px',
                    minWidth: '34px',
                    minHeight: '34px',
                    maxWidth: '34px',
                    maxHeight: '34px',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '6px',
                  }}
                />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#94a3b8" maxW="420px" lineHeight="relaxed">
              Apex Construct is the comprehensive enterprise resource planning platform engineered specifically for civil infrastructure, general contractors, ready-mix batch plants, and heavy engineering consortiums.
            </Text>
            <Text fontSize="11px" color="#64748b" mt={4}>
              Operating in full compliance with FIDIC (Red, Yellow & Silver Books), IFRS 15, and statutory site labor frameworks.
            </Text>

            {/* Quick Auth Actions in Footer */}
            <Flex gap={3} mt={5} wrap="wrap">
              <Button
                size="sm"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                onClick={() => navigate('/login?mode=signup')}
                h="34px"
                px={3.5}
                fontSize="xs"
                fontWeight="semibold"
              >
                <UserPlus size={13} style={{ marginRight: '6px' }} /> Sign up
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderColor="#334155"
                color="#ffffff"
                _hover={{ bg: '#1e293b' }}
                onClick={() => navigate('/login?mode=signin')}
                h="34px"
                px={3.5}
                fontSize="xs"
                fontWeight="semibold"
              >
                <LogIn size={13} style={{ marginRight: '6px' }} /> Sign in
              </Button>
            </Flex>
          </Box>

          {/* Col 2: Product & Platform Pages */}
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="#ffffff" textTransform="uppercase" letterSpacing="wider" mb={3.5}>
              Navigation
            </Text>
            <Stack gap={2.5} fontSize="xs" color="#94a3b8">
              <Box as="button" textAlign="left" onClick={() => navigate('/features')} _hover={{ color: '#60a5fa' }} cursor="pointer">Civil ERP Features</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/modules')} _hover={{ color: '#60a5fa' }} cursor="pointer">12 Core Modules</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/workflows')} _hover={{ color: '#60a5fa' }} cursor="pointer">Approval Workflows</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/benefits')} _hover={{ color: '#60a5fa' }} cursor="pointer">ROI & Benefits</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/preview')} _hover={{ color: '#60a5fa' }} cursor="pointer">Interactive Preview</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/security')} _hover={{ color: '#60a5fa' }} cursor="pointer">Security & RBAC</Box>
            </Stack>
          </Box>

          {/* Col 3: Operational Modules (Protected) */}
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="#ffffff" textTransform="uppercase" letterSpacing="wider" mb={3.5}>
              Operations & Sites
            </Text>
            <Stack gap={2.5} fontSize="xs" color="#94a3b8">
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/projects')} _hover={{ color: '#60a5fa' }} cursor="pointer">Civil Projects & BOQ</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/requisitions')} _hover={{ color: '#60a5fa' }} cursor="pointer">Material Requisitions</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/inventory')} _hover={{ color: '#60a5fa' }} cursor="pointer">Stores & Inventories</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/procurement')} _hover={{ color: '#60a5fa' }} cursor="pointer">3-Way PO Matching</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/rmc')} _hover={{ color: '#60a5fa' }} cursor="pointer">Ready-Mix Concrete</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/equipment')} _hover={{ color: '#60a5fa' }} cursor="pointer">Plant, Machinery & Fleet</Box>
            </Stack>
          </Box>

          {/* Col 4: Governance & Corporate (Protected) */}
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="#ffffff" textTransform="uppercase" letterSpacing="wider" mb={3.5}>
              Access & Governance
            </Text>
            <Stack gap={2.5} fontSize="xs" color="#94a3b8">
              <Box as="button" textAlign="left" onClick={() => navigate('/login?mode=signup')} _hover={{ color: '#60a5fa' }} cursor="pointer" color="#60a5fa" fontWeight="semibold">Sign up for Account</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/login?mode=signin')} _hover={{ color: '#60a5fa' }} cursor="pointer">Sign in to ERP</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/hr')} _hover={{ color: '#60a5fa' }} cursor="pointer">Biometric Labor Muster</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/payroll')} _hover={{ color: '#60a5fa' }} cursor="pointer">Payroll Engine</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/contract-admin')} _hover={{ color: '#60a5fa' }} cursor="pointer">FIDIC Contract Admin</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/accounting')} _hover={{ color: '#60a5fa' }} cursor="pointer">General Ledger & P&L</Box>
              <Box as="button" textAlign="left" onClick={() => handleAuthOrNav('/portals')} _hover={{ color: '#60a5fa' }} cursor="pointer">Multi-Role Portals</Box>
              {onOpenDemo && (
                <Box as="button" textAlign="left" onClick={onOpenDemo} _hover={{ color: '#60a5fa' }} cursor="pointer" color="#94a3b8">Request Contractor Demo</Box>
              )}
            </Stack>
          </Box>
        </SimpleGrid>

        <Flex
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
          pt={8}
          borderTop="1px solid #1e293b"
          fontSize="11px"
          color="#64748b"
        >
          <Text>© {new Date().getFullYear()} Apex Construction ERP System. All rights reserved.</Text>
          <Flex gap={4} wrap="wrap">
            <Text>Enterprise Architecture</Text>
            <Text>•</Text>
            <Text>24 Relational Tables</Text>
            <Text>•</Text>
            <Text>FIDIC Standard Compliant</Text>
            <Text>•</Text>
            <Text>SOC2 Type II Certified</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
