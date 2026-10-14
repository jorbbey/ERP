import React, { useState } from 'react';
import { Box, Flex, Heading, Text, Input, Button, Stack } from '@chakra-ui/react';
import { CheckCheck, X } from 'lucide-react';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoRequestModal: React.FC<DemoRequestModalProps> = ({ isOpen, onClose }) => {
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectVolume: '₦10M - ₦50M Annual'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <Box
      position="fixed"
      inset="0"
      bg="rgba(15, 23, 42, 0.45)"
      backdropFilter="blur(6px)"
      zIndex="2000"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="#ffffff"
        borderRadius="20px"
        maxW="520px"
        w="100%"
        p={{ base: 5, md: 7 }}
        border="1px solid #cbd5e1"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      >
        {demoSubmitted ? (
          <Box textAlign="center" py={6}>
            <Box p={4} bg="#dcfce7" color="#16a34a" borderRadius="full" w="fit-content" mx="auto" mb={4}>
              <CheckCheck size={40} />
            </Box>
            <Heading size="md" color="#0f172a" mb={2}>Executive Briefing Scheduled!</Heading>
            <Text fontSize="xs" color="#64748b">
              Our civil infrastructure implementation specialists will contact {demoForm.email} within 2 business hours.
            </Text>
          </Box>
        ) : (
          <>
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Request Enterprise Contractor Demo</Heading>
              <Box as="button" onClick={onClose} color="#64748b" _hover={{ color: '#0f172a' }} cursor="pointer">
                <X size={20} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={5}>
              Speak with a technical specialist tailored to your specific civil construction, ready-mix, and plant volume.
            </Text>

            <form onSubmit={handleSubmit}>
              <Stack gap={3.5}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Full Name *</Text>
                  <Input
                    size="sm"
                    placeholder="Eng. Marcus Vance"
                    bg="#f8fafc"
                    borderColor="#cbd5e1"
                    color="#0f172a"
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Corporate Work Email *</Text>
                  <Input
                    size="sm"
                    type="email"
                    placeholder="vance@infrastruct.com"
                    bg="#f8fafc"
                    borderColor="#cbd5e1"
                    color="#0f172a"
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                    required
                  />
                </Box>

                <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                  <Box flex="1">
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Company / Entity *</Text>
                    <Input
                      size="sm"
                      placeholder="Apex Civil Engineering Ltd"
                      bg="#f8fafc"
                      borderColor="#cbd5e1"
                      color="#0f172a"
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      required
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Direct Phone</Text>
                    <Input
                      size="sm"
                      placeholder="+234 803 234 5678"
                      bg="#f8fafc"
                      borderColor="#cbd5e1"
                      color="#0f172a"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    />
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Active Annual Contract Volume</Text>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: '#0f172a',
                    }}
                    value={demoForm.projectVolume}
                    onChange={(e) => setDemoForm({ ...demoForm, projectVolume: e.target.value })}
                  >
                    <option value="Under ₦10M Annual">Under ₦10M Annual Contract Book</option>
                    <option value="₦10M - ₦50M Annual">₦10M - ₦50M Active Infrastructure</option>
                    <option value="₦50M - ₦150M Annual">₦50M - ₦150M Multi-Site Consortium</option>
                    <option value="₦150M+ Heavy Infrastructure">₦150M+ Heavy Infrastructure & Concession</option>
                  </select>
                </Box>

                <Flex justify="flex-end" gap={2} pt={3} borderTop="1px solid #e2e8f0">
                  <Button size="sm" variant="outline" borderColor="#cbd5e1" color="#475569" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit" _hover={{ bg: '#1d4ed8' }}>
                    Confirm Demo Booking
                  </Button>
                </Flex>
              </Stack>
            </form>
          </>
        )}
      </Box>
    </Box>
  );
};
