import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, Stack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, Shield, Layers, Workflow, Award, Eye } from 'lucide-react';
import { PiShootingStarDuotone } from 'react-icons/pi';
import logoImg from '../../../assets/Minimalist Blue Architectural Growth Logo.png';

interface PublicNavbarProps {
  onOpenDemo?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenDemo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Past hero section threshold (~60px)
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { label: 'Features', path: '/features', icon: PiShootingStarDuotone },
    { label: 'Modules', path: '/modules', icon: Layers },
    { label: 'Workflow', path: '/workflows', icon: Workflow },
    { label: 'Benefits', path: '/benefits', icon: Award },
    { label: 'Dashboard', path: '/preview', icon: Eye },
    { label: 'Security', path: '/security', icon: Shield },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="100"
      w="100%"
      bg={isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#090e1a'}
      backdropFilter={isScrolled ? 'blur(16px)' : 'none'}
      borderBottom={isScrolled ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)'}
      boxShadow={isScrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : 'none'}
      transition="background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
    >
      <Box w="100%" px={{ base: 4, sm: 6, md: 8, xl: 12 }}>
        <Flex h="72px" align="center" justify="space-between">
          {/* Brand Logo Only (Strict 36px size, standalone, no text beside logo) */}
          <Box
            cursor="pointer"
            onClick={() => navigate('/')}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="36px"
            h="36px"
            minW="36px"
            minH="36px"
            maxW="36px"
            maxH="36px"
            overflow="hidden"
            borderRadius="8px"
            title="Apex Construct - Civil ERP Home"
            transition="transform 0.15s ease"
            _hover={{ transform: 'scale(1.04)' }}
            bg={isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.04)'}
          >
            <img
              src={logoImg}
              alt="Apex Construct Logo"
              width={36}
              height={36}
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                minHeight: '36px',
                maxWidth: '36px',
                maxHeight: '36px',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '6px',
              }}
            />
          </Box>

          {/* Desktop Navigation Links */}
          <Flex align="center" gap={{ lg: 6, xl: 8 }} display={{ base: 'none', lg: 'flex' }}>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Box
                  key={link.path}
                  as="button"
                  onClick={() => navigate(link.path)}
                  fontSize="sm"
                  fontWeight={active ? '700' : '500'}
                  color={
                    active
                      ? isScrolled
                        ? '#2563eb'
                        : '#60a5fa'
                      : isScrolled
                      ? '#475569'
                      : '#cbd5e1'
                  }
                  position="relative"
                  py={2}
                  px={1}
                  cursor="pointer"
                  transition="all 0.15s ease"
                  _hover={{
                    color: isScrolled ? '#2563eb' : '#ffffff',
                  }}
                >
                  {link.label}
                  {active && (
                    <Box
                      position="absolute"
                      bottom="-2px"
                      left="0"
                      right="0"
                      h="2.5px"
                      bg={isScrolled ? '#2563eb' : '#60a5fa'}
                      borderRadius="full"
                    />
                  )}
                </Box>
              );
            })}
          </Flex>

          {/* Right Action CTAs */}
          <Flex align="center" gap={{ base: 1.5, sm: 3 }}>
            {onOpenDemo && (
              <Button
                size="sm"
                variant="ghost"
                color={isScrolled ? '#475569' : '#f1f5f9'}
                display={{ base: 'none', md: 'inline-flex' }}
                _hover={{
                  bg: isScrolled ? '#f1f5f9' : 'rgba(255, 255, 255, 0.12)',
                  color: isScrolled ? '#0f172a' : '#ffffff',
                }}
                onClick={onOpenDemo}
                fontWeight="semibold"
                px={3}
                h="36px"
              >
                Request Demo
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              borderColor={isScrolled ? '#cbd5e1' : 'rgba(255, 255, 255, 0.25)'}
              color={isScrolled ? '#0f172a' : '#ffffff'}
              bg={isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.04)'}
              _hover={{
                bg: isScrolled ? '#f8fafc' : 'rgba(255, 255, 255, 0.12)',
                borderColor: isScrolled ? '#94a3b8' : 'rgba(255, 255, 255, 0.45)',
              }}
              onClick={() => navigate('/login?mode=signin')}
              fontWeight="semibold"
              px={{ base: 2.5, sm: 4 }}
              fontSize={{ base: 'xs', sm: 'sm' }}
              h={{ base: '32px', sm: '36px' }}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              bg="#2563eb"
              color="white"
              _hover={{ bg: '#1d4ed8' }}
              onClick={() => navigate('/login?mode=signup')}
              fontWeight="semibold"
              px={{ base: 2.5, sm: 4 }}
              fontSize={{ base: 'xs', sm: 'sm' }}
              h={{ base: '32px', sm: '36px' }}
              boxShadow={
                isScrolled
                  ? '0 2px 6px rgba(37, 99, 235, 0.25)'
                  : '0 2px 10px rgba(37, 99, 235, 0.45)'
              }
            >
              Launch<Box as="span" display={{ base: 'none', sm: 'inline' }}> Software</Box> <ArrowRight size={13} />
            </Button>

            {/* Mobile Menu Toggle (STRICTLY HIDDEN ON DESKTOP) */}
            <button
              type="button"
              className="mobile-menu-toggle lg:hidden"
              data-mobile-toggle="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '8px',
                color: isScrolled ? '#0f172a' : '#ffffff',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </Flex>
        </Flex>

        {/* Mobile Navigation Drawer (STRICTLY HIDDEN ON DESKTOP) */}
        {mobileMenuOpen && (
          <Box
            py={4}
            px={2}
            borderTop={isScrolled ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)'}
            className="mobile-menu-toggle lg:hidden"
            data-mobile-toggle="true"
            display={{ base: 'block', lg: 'none' }}
            bg={isScrolled ? '#ffffff' : '#090e1a'}
            borderRadius="0 0 12px 12px"
          >
            <Stack gap={2}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Box
                    key={link.path}
                    as="button"
                    textAlign="left"
                    py={2.5}
                    px={3}
                    borderRadius="8px"
                    fontSize="sm"
                    fontWeight={active ? '700' : '500'}
                    bg={
                      active
                        ? isScrolled
                          ? '#eff6ff'
                          : 'rgba(37, 99, 235, 0.2)'
                        : 'transparent'
                    }
                    color={
                      active
                        ? isScrolled
                          ? '#2563eb'
                          : '#60a5fa'
                        : isScrolled
                        ? '#334155'
                        : '#cbd5e1'
                    }
                    display="flex"
                    alignItems="center"
                    gap={3}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(link.path);
                    }}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Box>
                );
              })}

              <Box pt={3} borderTop={isScrolled ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.1)'}>
                <Button
                  size="sm"
                  w="100%"
                  bg="#2563eb"
                  color="white"
                  mb={2}
                  h="38px"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login?mode=signup');
                  }}
                >
                  Launch Software <ArrowRight size={14} />
                </Button>
                <Button
                  size="sm"
                  w="100%"
                  variant="outline"
                  borderColor={isScrolled ? '#cbd5e1' : 'rgba(255, 255, 255, 0.25)'}
                  color={isScrolled ? '#0f172a' : '#ffffff'}
                  mb={2}
                  h="38px"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login?mode=signin');
                  }}
                >
                  Sign in
                </Button>
                {onOpenDemo && (
                  <Button
                    size="sm"
                    w="100%"
                    variant="ghost"
                    color={isScrolled ? '#64748b' : '#94a3b8'}
                    h="36px"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDemo();
                    }}
                  >
                    Request Enterprise Demo
                  </Button>
                )}
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};
