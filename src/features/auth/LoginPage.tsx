import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Card,
  Stack,
  NativeSelect,
  SimpleGrid,
  Badge
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    activeCompany, 
    signInWithSupabase, 
    registerCompanyWorkspace,
    supabaseUser
  } = useERP();

  // Mode: 'signin' or 'signup' (Company Registration)
  const modeParam = searchParams.get('mode');
  const isSignupPath = location.pathname === '/signup';
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(() => {
    return isSignupPath || modeParam === 'signup' ? 'signup' : 'signin';
  });

  useEffect(() => {
    if (isSignupPath || modeParam === 'signup') {
      setAuthMode('signup');
    } else if (modeParam === 'signin') {
      setAuthMode('signin');
    }
  }, [isSignupPath, modeParam]);

  // Sign In Form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Company Registration Form fields
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [businessAddress, setBusinessAddress] = useState('');
  const [industry, setIndustry] = useState('General Civil Contracting');
  const [currency, setCurrency] = useState('₦');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already authenticated, redirect cleanly to dashboard
  useEffect(() => {
    if (supabaseUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [supabaseUser, navigate]);

  // Check URL query parameters for session expiration reasons
  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'inactivity_timeout') {
      setErrorMessage('Your session has expired due to 24 hours of inactivity. Please log in again to continue.');
    } else if (reason === 'session_expired') {
      setErrorMessage('Your session has expired because the tab or browser was closed. Please log in to continue.');
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithSupabase(loginEmail.trim(), loginPassword);
      if (res.success) {
        setSuccessMessage('Authentication successful! Loading your company workspace...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials or contact your administrator.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!companyName.trim() || !companyEmail.trim() || !contactPerson.trim() || !adminPassword) {
      setErrorMessage('Please fill in all mandatory fields (Company Name, Email, Contact Person, and Password).');
      return;
    }

    if (adminPassword.length < 6) {
      setErrorMessage('Administrator password must be at least 6 characters long.');
      return;
    }

    if (adminPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    try {
      const res = registerCompanyWorkspace({
        companyName: companyName.trim(),
        companyEmail: companyEmail.trim().toLowerCase(),
        contactPerson: contactPerson.trim(),
        contactPhone: contactPhone.trim() || '+234 800 000 0000',
        country: country.trim(),
        businessAddress: businessAddress.trim(),
        industry,
        currency,
        password: adminPassword,
        trialDays: 14
      });

      if (res.success) {
        setSuccessMessage(`Company workspace "${res.company?.name}" created! Initializing 14-day enterprise trial...`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 400);
      } else {
        setErrorMessage(res.error || 'Failed to register company. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during company workspace onboarding.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setSearchParams({ mode });
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <Box minH="100vh" bg="#f8fafc" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={{ base: 2.5, sm: 4 }} py={{ base: 6, sm: 8 }}>
      {/* Return to Public Site */}
      <Flex justify="center" mb={4}>
        <Button
          size="xs"
          variant="ghost"
          color="#64748b"
          _hover={{ color: '#0f172a', bg: '#e2e8f0' }}
          onClick={() => navigate('/')}
        >
          ← Return to Public Website
        </Button>
      </Flex>

      <Card.Root 
        bg="white" 
        maxW={authMode === 'signup' ? '680px' : '440px'} 
        w="100%" 
        borderRadius={{ base: '14px', sm: '20px' }} 
        p={{ base: 4, sm: 6, md: 8 }} 
        border="1px solid #cbd5e1" 
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.08)"
      >
        {/* Brand Header */}
        <Flex direction="column" align="center" textAlign="center" mb={5}>
          <Box
            w="52px"
            h="52px"
            borderRadius="14px"
            bg={activeCompany?.themeColor || '#2563eb'}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
            boxShadow="0 4px 14px rgba(37,99,235,0.25)"
          >
            <Building2 size={28} />
          </Box>
          <Heading size="lg" color="#0f172a">
            {authMode === 'signup' ? 'Register Company Workspace' : activeCompany?.name || 'Commercial Construction ERP'}
          </Heading>
          <Text fontSize="xs" color="#64748b" mt={1}>
            {authMode === 'signup' 
              ? 'Start your 14-day enterprise trial. Staff accounts are administrator-controlled.' 
              : 'Sign in to access your company operations & jobsite records'}
          </Text>
        </Flex>

        {/* Tab Toggle: Sign in vs Register Company */}
        <Flex bg="#f1f5f9" p={1} borderRadius="10px" mb={5} gap={1}>
          <Button
            flex="1"
            size="sm"
            variant="plain"
            bg={authMode === 'signin' ? 'white' : 'transparent'}
            color={authMode === 'signin' ? '#0f172a' : '#64748b'}
            fontWeight={authMode === 'signin' ? 'bold' : 'medium'}
            fontSize={{ base: 'xs', sm: 'sm' }}
            boxShadow={authMode === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}
            borderRadius="8px"
            onClick={() => switchMode('signin')}
          >
            Sign in
          </Button>
          <Button
            flex="1"
            size="sm"
            variant="plain"
            bg={authMode === 'signup' ? 'white' : 'transparent'}
            color={authMode === 'signup' ? '#0f172a' : '#64748b'}
            fontWeight={authMode === 'signup' ? 'bold' : 'medium'}
            fontSize={{ base: 'xs', sm: 'sm' }}
            boxShadow={authMode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}
            borderRadius="8px"
            onClick={() => switchMode('signup')}
          >
            Register<Box as="span" display={{ base: 'none', sm: 'inline' }}> Company</Box><Box as="span" display={{ base: 'none', md: 'inline' }}> (Free Trial)</Box>
          </Button>
        </Flex>

        {/* Error or Success Alerts */}
        {errorMessage && (
          <Box
            p={3.5}
            mb={4}
            borderRadius="10px"
            bg="#fef2f2"
            border="1px solid #fecaca"
            color="#b91c1c"
            fontSize="xs"
            display="flex"
            alignItems="flex-start"
            gap={2}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <Text>{errorMessage}</Text>
          </Box>
        )}

        {successMessage && (
          <Box
            p={3.5}
            mb={4}
            borderRadius="10px"
            bg="#f0fdf4"
            border="1px solid #bbf7d0"
            color="#166534"
            fontSize="xs"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <Text>{successMessage}</Text>
          </Box>
        )}

        {authMode === 'signin' ? (
          /* FORM: Sign in */
          <form onSubmit={handleSignIn}>
            <Stack gap={4}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                  <Mail size={13} color="#64748b" /> Corporate / Employee Email
                </Text>
                <Input
                  size="sm"
                  type="email"
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoFocus
                />
              </Box>

              <Box>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" display="flex" alignItems="center" gap={1.5}>
                    <Lock size={13} color="#64748b" /> Password
                  </Text>
                </Flex>
                <Box position="relative">
                  <Input
                    size="sm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    pr={9}
                  />
                  <Box
                    position="absolute"
                    right="8px"
                    top="50%"
                    transform="translateY(-50%)"
                    cursor="pointer"
                    color="#94a3b8"
                    _hover={{ color: '#0f172a' }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Box>
                </Box>
              </Box>

              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                type="submit"
                w="100%"
                mt={2}
                disabled={loading}
              >
                Sign in
              </Button>

              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" fontSize="11px" color="#64748b" textAlign="center">
                <Text fontWeight="medium" color="#334155">Employee Notice:</Text>
                Ordinary staff accounts are managed by your company administrator. Contact your HR or IT department if you need account activation.
              </Box>

              <Text fontSize="xs" color="#64748b" textAlign="center" mt={1}>
                Registering a new construction firm?{' '}
                <Text
                  as="span"
                  color="#2563eb"
                  fontWeight="bold"
                  cursor="pointer"
                  onClick={() => switchMode('signup')}
                >
                  Start Company Trial
                </Text>
              </Text>
            </Stack>
          </form>
        ) : (
          /* FORM: Company Registration & Onboarding */
          <form onSubmit={handleRegisterCompany}>
            <Stack gap={3.5}>
              {/* Trial Callout Banner */}
              <Box p={3} bg="#eff6ff" borderRadius="10px" border="1px solid #bfdbfe" fontSize="xs">
                <Flex align="center" gap={2} mb={1}>
                  <ShieldCheck size={16} color="#2563eb" />
                  <Text fontWeight="bold" color="#1d4ed8">14-Day Enterprise Trial Included</Text>
                </Flex>
                <Text color="#3b82f6" fontSize="11px">
                  Register your construction company workspace. You receive full access to FIDIC Contracts, Stores & Inventory, Biometric HR, 3-Way PO Matching, Equipment, and RMC batching.
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <Building2 size={13} color="#64748b" /> Company Legal Name *
                  </Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Apex Civil & Engineering Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    autoFocus
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <Mail size={13} color="#64748b" /> Official Company Email *
                  </Text>
                  <Input
                    size="sm"
                    type="email"
                    placeholder="admin@company.com"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <UserIcon size={13} color="#64748b" /> Contact Person / Managing Director *
                  </Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Engr. Babatunde Lawal"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <Phone size={13} color="#64748b" /> Contact Phone Number *
                  </Text>
                  <Input
                    size="sm"
                    placeholder="+234 803 123 4567"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <Globe size={13} color="#64748b" /> Country
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Canada">Canada</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <Briefcase size={13} color="#64748b" /> Industry / Primary Trade
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field value={industry} onChange={(e) => setIndustry(e.target.value)}>
                      <option value="General Civil Contracting">General Civil Contracting</option>
                      <option value="Heavy Infrastructure & Roads">Heavy Infrastructure & Roads</option>
                      <option value="Commercial & Residential Building">Commercial & Residential Building</option>
                      <option value="Specialty Subcontractor">Specialty Subcontractor</option>
                      <option value="Ready-Mix Concrete & Aggregates">Ready-Mix Concrete & Aggregates</option>
                      <option value="Mechanical & Electrical (MEP)">Mechanical & Electrical (MEP)</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <MapPin size={13} color="#64748b" /> Business / Head Office Address
                  </Text>
                  <Input
                    size="sm"
                    placeholder="Plot 10 Industrial Area, Victoria Island"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                    Operating Currency
                  </Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="₦">₦ - Nigerian Naira (NGN)</option>
                      <option value="$">$ - US Dollar (USD)</option>
                      <option value="£">£ - British Pound (GBP)</option>
                      <option value="€">€ - Euro (EUR)</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                    <Lock size={13} color="#64748b" /> Admin Password (min. 6 chars) *
                  </Text>
                  <Input
                    size="sm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                    Confirm Password *
                  </Text>
                  <Input
                    size="sm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat admin password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Box>
              </SimpleGrid>

              <Button
                size="md"
                bg="#2563eb"
                color="white"
                _hover={{ bg: '#1d4ed8' }}
                type="submit"
                w="100%"
                mt={2}
                disabled={loading}
              >
                Register Company & Start Trial
              </Button>

              <Text fontSize="xs" color="#64748b" textAlign="center" mt={2}>
                Already registered?{' '}
                <Text
                  as="span"
                  color="#2563eb"
                  fontWeight="bold"
                  cursor="pointer"
                  onClick={() => switchMode('signin')}
                >
                  Sign in
                </Text>
              </Text>
            </Stack>
          </form>
        )}
      </Card.Root>
    </Box>
  );
};
