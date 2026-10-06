import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Badge,
  Card,
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  HardHat,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { companies, activeCompany, setActiveCompanyId, setActiveRole } = useERP();

  const [email, setEmail] = useState('adebayo@buildcorp.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Managing Director');
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuperAdminMode) {
      setActiveRole('Super Admin');
    } else {
      setActiveRole(selectedRole);
    }
    navigate('/dashboard');
  };

  const quickPersonas: { role: UserRole; name: string; email: string }[] = [
    { role: 'Managing Director', name: 'John Adebayo', email: 'adebayo@buildcorp.com' },
    { role: 'Site Engineer', name: 'Babajide Cole', email: 'b.cole@buildcorp.com' },
    { role: 'Procurement Officer', name: 'Fatima Yusuf', email: 'f.yusuf@buildcorp.com' },
    { role: 'HR Manager', name: 'Ngozi Okafor', email: 'n.okafor@buildcorp.com' },
    { role: 'Finance Manager', name: 'Emeka Nwosu', email: 'e.nwosu@buildcorp.com' },
    { role: 'Super Admin', name: 'System Administrator', email: 'admin@buildcorp.com' },
  ];

  return (
    <Box minH="100vh" bg="#0f172a" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Card.Root bg="white" maxW="480px" w="100%" borderRadius="20px" p={{ base: 6, md: 8 }} boxShadow="2xl">
        {/* Brand Header */}
        <Flex direction="column" align="center" textAlign="center" mb={6}>
          <Box
            w="54px"
            h="54px"
            borderRadius="16px"
            bg={activeCompany.themeColor}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
            boxShadow="0 4px 14px rgba(0,0,0,0.2)"
          >
            <Building2 size={30} />
          </Box>
          <Heading size="lg" color="#0f172a">
            {activeCompany.name}
          </Heading>
          <Text fontSize="xs" color="#64748b" mt={1}>
            Enterprise Construction Resource Planning Suite
          </Text>
        </Flex>

        {/* Super Admin Switch Banner */}
        <Flex
          justify="space-between"
          align="center"
          p={3}
          bg={isSuperAdminMode ? '#eff6ff' : '#f8fafc'}
          borderRadius="12px"
          border="1px solid"
          borderColor={isSuperAdminMode ? '#bfdbfe' : '#e2e8f0'}
          mb={5}
        >
          <Flex align="center" gap={2}>
            <ShieldCheck size={18} color={isSuperAdminMode ? '#2563eb' : '#64748b'} />
            <Text fontSize="xs" fontWeight="bold" color="#0f172a">
              {isSuperAdminMode ? 'Super Admin Portal' : 'Standard Employee Access'}
            </Text>
          </Flex>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setIsSuperAdminMode(!isSuperAdminMode)}
          >
            {isSuperAdminMode ? 'Switch to Staff' : 'Super Admin'}
          </Button>
        </Flex>

        <form onSubmit={handleLogin}>
          <Stack gap={4}>
            {/* Subsidiary Workspace */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                Corporate Workspace
              </Text>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  value={activeCompany.id}
                  onChange={(e) => setActiveCompanyId(Number(e.target.value))}
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>

            {!isSuperAdminMode && (
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                  Account Role & Designation
                </Text>
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  >
                    <option value="Managing Director">Managing Director</option>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Site Quantity Surveyor">Site Quantity Surveyor</option>
                    <option value="Procurement Officer">Procurement Officer</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Accountant">Accountant</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            )}

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                Corporate Email Address
              </Text>
              <Input
                size="sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                Password
              </Text>
              <Input
                size="sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>

            <Button
              size="md"
              bg="#2563eb"
              color="white"
              _hover={{ bg: '#1d4ed8' }}
              type="submit"
              w="100%"
              mt={2}
            >
              Sign In to ERP <ArrowRight size={16} />
            </Button>
          </Stack>
        </form>

        {/* Quick Role Fillers */}
        <Box mt={6} pt={4} borderTop="1px solid #e2e8f0">
          <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b" mb={2}>
            Demo Quick Persona Login:
          </Text>
          <Flex wrap="wrap" gap={1.5}>
            {quickPersonas.map((p) => (
              <Button
                key={p.role}
                size="xs"
                variant="subtle"
                colorPalette="gray"
                onClick={() => {
                  setSelectedRole(p.role);
                  setEmail(p.email);
                  setIsSuperAdminMode(p.role === 'Super Admin');
                }}
              >
                {p.role}
              </Button>
            ))}
          </Flex>
        </Box>
      </Card.Root>
    </Box>
  );
};
