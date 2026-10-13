import React from 'react';
import { Box, Flex, Text, SimpleGrid, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../../assets/Minimalist Blue Architectural Growth Logo.png';

interface PublicFooterProps {
  onOpenDemo?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenDemo }) => {
  const navigate = useNavigate();

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

          {/* Col 3: Operational Modules */}
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="#ffffff" textTransform="uppercase" letterSpacing="wider" mb={3.5}>
              Operations & Sites
            </Text>
            <Stack gap={2.5} fontSize="xs" color="#94a3b8">
              <Box as="button" textAlign="left" onClick={() => navigate('/projects')} _hover={{ color: '#60a5fa' }} cursor="pointer">Civil Projects & BOQ</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/requisitions')} _hover={{ color: '#60a5fa' }} cursor="pointer">Material Requisitions</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/inventory')} _hover={{ color: '#60a5fa' }} cursor="pointer">Stores & Inventories</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/procurement')} _hover={{ color: '#60a5fa' }} cursor="pointer">3-Way PO Matching</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/rmc')} _hover={{ color: '#60a5fa' }} cursor="pointer">Ready-Mix Concrete</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/equipment')} _hover={{ color: '#60a5fa' }} cursor="pointer">Plant, Machinery & Fleet</Box>
            </Stack>
          </Box>

          {/* Col 4: Governance & Corporate */}
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="#ffffff" textTransform="uppercase" letterSpacing="wider" mb={3.5}>
              Governance & Admin
            </Text>
            <Stack gap={2.5} fontSize="xs" color="#94a3b8">
              <Box as="button" textAlign="left" onClick={() => navigate('/hr')} _hover={{ color: '#60a5fa' }} cursor="pointer">Biometric Labor Muster</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/payroll')} _hover={{ color: '#60a5fa' }} cursor="pointer">Payroll Engine</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/contract-admin')} _hover={{ color: '#60a5fa' }} cursor="pointer">FIDIC Contract Admin</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/accounting')} _hover={{ color: '#60a5fa' }} cursor="pointer">General Ledger & P&L</Box>
              <Box as="button" textAlign="left" onClick={() => navigate('/portals')} _hover={{ color: '#60a5fa' }} cursor="pointer">Multi-Role Portals</Box>
              {onOpenDemo && (
                <Box as="button" textAlign="left" onClick={onOpenDemo} _hover={{ color: '#60a5fa' }} cursor="pointer" color="#60a5fa" fontWeight="bold">Request Contractor Demo</Box>
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
