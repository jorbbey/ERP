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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    activeCompany, 
    signInWithSupabase, 
    signUpWithSupabase, 
    supabaseUser
  } = useERP();

  // Mode: 'signin' or 'signup'
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

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, redirect cleanly to dashboard
  useEffect(() => {
    if (supabaseUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [supabaseUser, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithSupabase(email.trim(), password);
      if (res.success) {
        setSuccessMessage('Authentication successful! Loading workspace...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      } else {
        if (res.error?.includes('Email not confirmed')) {
          setErrorMessage('Account found. Please verify your email or toggle off confirmation in project settings.');
        } else {
          setErrorMessage(res.error || 'Failed to sign in. Please verify your email and password.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and a secure password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUpWithSupabase(email.trim(), password, fullName.trim());
      if (res.success) {
        if (res.session) {
          setSuccessMessage('Account created! Loading workspace...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 300);
        } else {
          // Attempt immediate sign in
          const autoLogin = await signInWithSupabase(email.trim(), password);
          if (autoLogin.success) {
            setSuccessMessage('Account created! Loading workspace...');
            setTimeout(() => {
              navigate('/dashboard');
            }, 300);
          } else {
            setSuccessMessage('Account created! You can now sign in with your email and password.');
            setAuthMode('signin');
            setSearchParams({ mode: 'signin' });
          }
        }
      } else {
        setErrorMessage(res.error || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during account creation.');
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
    <Box minH="100vh" bg="#f1f5f9" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4}>
      {/* Return to Public Site */}
      <Flex justify="center" mb={4}>
        <Button
          size="xs"
          variant="ghost"
          color="#64748b"
          _hover={{ color: '#0f172a', bg: '#e2e8f0' }}
          onClick={() => navigate('/')}
        >
          ← Return to Public Site
        </Button>
      </Flex>

      <Card.Root 
        bg="white" 
        maxW="440px" 
        w="100%" 
        borderRadius="20px" 
        p={{ base: 6, md: 8 }} 
        border="1px solid #cbd5e1" 
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.08)"
      >
        {/* Brand Header */}
        <Flex direction="column" align="center" textAlign="center" mb={5}>
          <Box
            w="52px"
            h="52px"
            borderRadius="14px"
            bg={activeCompany.themeColor || '#2563eb'}
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
            {activeCompany.name}
          </Heading>
          <Text fontSize="xs" color="#64748b" mt={1}>
            Commercial Construction ERP Suite
          </Text>
        </Flex>

        {/* Tab Toggle: Sign in vs Sign up */}
        <Flex bg="#f1f5f9" p={1} borderRadius="10px" mb={5}>
          <Button
            flex="1"
            size="sm"
            variant="plain"
            bg={authMode === 'signin' ? 'white' : 'transparent'}
            color={authMode === 'signin' ? '#0f172a' : '#64748b'}
            fontWeight={authMode === 'signin' ? 'bold' : 'medium'}
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
            boxShadow={authMode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}
            borderRadius="8px"
            onClick={() => switchMode('signup')}
          >
            Sign up
          </Button>
        </Flex>

        {/* Error or Success Alerts */}
        {errorMessage && (
          <Box
            p={3}
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
            p={3}
            mb={4}
            borderRadius="10px"
            bg="#f0fdf4"
            border="1px solid #bbf7d0"
            color="#15803d"
            fontSize="xs"
            display="flex"
            alignItems="flex-start"
            gap={2}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <Text>{successMessage}</Text>
          </Box>
        )}

        {/* FORM: Sign in */}
        {authMode === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <Stack gap={4}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                  <Mail size={13} color="#64748b" /> Corporate Email
                </Text>
                <Input
                  size="sm"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Text fontSize="xs" color="#64748b" textAlign="center" mt={2}>
                Don't have an account?{' '}
                <Text
                  as="span"
                  color="#2563eb"
                  fontWeight="bold"
                  cursor="pointer"
                  onClick={() => switchMode('signup')}
                >
                  Sign up
                </Text>
              </Text>
            </Stack>
          </form>
        ) : (
          /* FORM: Sign up */
          <form onSubmit={handleSignUp}>
            <Stack gap={3.5}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                  <UserIcon size={13} color="#64748b" /> Full Name
                </Text>
                <Input
                  size="sm"
                  placeholder="e.g. Engr. Chukwuma Obi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoFocus
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                  <Mail size={13} color="#64748b" /> Corporate Email
                </Text>
                <Input
                  size="sm"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1} display="flex" alignItems="center" gap={1.5}>
                  <Lock size={13} color="#64748b" /> Password (min. 6 characters)
                </Text>
                <Box position="relative">
                  <Input
                    size="sm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>
                  Confirm Password
                </Text>
                <Input
                  size="sm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                disabled={loading}
              >
                Sign up
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
