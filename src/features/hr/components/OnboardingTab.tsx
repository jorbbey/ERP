import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  Card,
  Table,
  Stack,
  Progress
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Employee } from '../../../types';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Building,
  HardHat,
  CreditCard,
  ChevronRight,
  Printer
} from 'lucide-react';

interface OnboardingMilestone {
  id: string;
  label: string;
  category: 'Documentation' | 'Finance' | 'IT_Access' | 'Orientation' | 'Safety';
  description: string;
}

const ONBOARDING_STEPS: OnboardingMilestone[] = [
  {
    id: 'id_verification',
    label: 'Statutory Identity & Contract Verification',
    category: 'Documentation',
    description: 'Verify National ID (NIN), Tax ID (TIN), signed appointment letter and credentials'
  },
  {
    id: 'bank_pension',
    label: 'Bank Routing & Pension Fund PFA Setup',
    category: 'Finance',
    description: 'Verify commercial bank account for payroll routing and statutory pension fund allocation'
  },
  {
    id: 'it_erp_access',
    label: 'ERP Login & Module Access Provisioning',
    category: 'IT_Access',
    description: 'Set up system credentials, role-based module access permissions and security clearances'
  },
  {
    id: 'dept_induction',
    label: 'Departmental Orientation & Work Briefing',
    category: 'Orientation',
    description: 'Head of department briefing on ongoing project deliverables and supervisory hierarchy'
  },
  {
    id: 'ppe_equipment',
    label: 'Site PPE & Equipment Handover',
    category: 'Safety',
    description: 'Issuance of hard hat, high-vis jacket, site boots, ID badge, and field toolkits'
  }
];

export const OnboardingTab: React.FC = () => {
  const { employees, activeCompany } = useERP();

  // Keep onboarding progress in state (seeded per employee)
  const [completedSteps, setCompletedSteps] = useState<Record<number, string[]>>({
    1: ['id_verification', 'bank_pension', 'it_erp_access', 'dept_induction', 'ppe_equipment'],
    2: ['id_verification', 'bank_pension', 'it_erp_access', 'dept_induction', 'ppe_equipment'],
    3: ['id_verification', 'bank_pension', 'it_erp_access', 'dept_induction', 'ppe_equipment'],
    4: ['id_verification', 'bank_pension', 'it_erp_access', 'dept_induction'],
    5: ['id_verification', 'bank_pension', 'it_erp_access'],
    6: ['id_verification', 'bank_pension', 'it_erp_access', 'dept_induction', 'ppe_equipment'],
    7: ['id_verification', 'bank_pension'],
    8: ['id_verification', 'bank_pension', 'it_erp_access', 'dept_induction']
  });

  const [selectedEmpId, setSelectedEmpId] = useState<number>(employees[0]?.id || 1);

  const selectedEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];
  const empCompletedSteps = completedSteps[selectedEmployee?.id || 1] || [];
  const progressPercent = Math.round((empCompletedSteps.length / ONBOARDING_STEPS.length) * 100);

  const toggleStep = (empId: number, stepId: string) => {
    const current = completedSteps[empId] || [];
    const updated = current.includes(stepId)
      ? current.filter(s => s !== stepId)
      : [...current, stepId];

    setCompletedSteps(prev => ({
      ...prev,
      [empId]: updated
    }));
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align={{ md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
          <Box>
            <Heading size="md" color="#0f172a">
              Employee Induction & Onboarding Workflows
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={1}>
              Track verification milestones, equipment issuance, and ERP provisioning for all incoming personnel.
            </Text>
          </Box>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer size={14} /> Print Onboarding Pack
          </Button>
        </Flex>
      </Card.Root>

      {/* Main Split View */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} gap={5}>
        {/* Left Column: Staff Selector List */}
        <Box gridColumn={{ base: 'span 12', lg: 'span 5' }}>
          <Card.Root bg="white" borderRadius="16px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#64748b" mb={3}>
              Staff Onboarding Tracker ({employees.length} Personnel)
            </Text>

            <Stack gap={2} maxH="550px" overflowY="auto">
              {employees.map(emp => {
                const steps = completedSteps[emp.id] || [];
                const pct = Math.round((steps.length / ONBOARDING_STEPS.length) * 100);
                const isSelected = emp.id === selectedEmployee?.id;

                return (
                  <Box
                    key={emp.id}
                    p={3}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor={isSelected ? '#2563eb' : '#f1f5f9'}
                    bg={isSelected ? '#eff6ff' : '#f8fafc'}
                    cursor="pointer"
                    onClick={() => setSelectedEmpId(emp.id)}
                    transition="all 0.15s"
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <Box>
                        <Text fontWeight="bold" fontSize="xs" color="#0f172a">{emp.name}</Text>
                        <Text fontSize="10px" color="#64748b">{emp.code} • {emp.position}</Text>
                      </Box>
                      <Badge size="xs" colorPalette={pct === 100 ? 'green' : pct > 50 ? 'blue' : 'yellow'}>
                        {pct}% Completed
                      </Badge>
                    </Flex>
                    <Progress.Root value={pct} size="xs" colorPalette={pct === 100 ? 'green' : 'blue'} mt={2}>
                      <Progress.Track bg="#e2e8f0">
                        <Progress.Range />
                      </Progress.Track>
                    </Progress.Root>
                  </Box>
                );
              })}
            </Stack>
          </Card.Root>
        </Box>

        {/* Right Column: Detailed Checklist for Selected Employee */}
        <Box gridColumn={{ base: 'span 12', lg: 'span 7' }}>
          {selectedEmployee && (
            <Card.Root bg="white" borderRadius="16px" p={6} border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="flex-start" borderBottom="1px solid #f1f5f9" pb={4} mb={4}>
                <Box>
                  <Flex align="center" gap={2}>
                    <Heading size="md" color="#0f172a">{selectedEmployee.name}</Heading>
                    <Badge colorPalette="blue" size="sm">{selectedEmployee.code}</Badge>
                  </Flex>
                  <Text fontSize="xs" color="#64748b" mt={1}>
                    {selectedEmployee.department} • {selectedEmployee.position} ({selectedEmployee.role})
                  </Text>
                  <Text fontSize="11px" color="#94a3b8" mt={0.5}>
                    Hire Date: {selectedEmployee.hireDate} • Monthly Salary: {activeCompany.currency} {selectedEmployee.salary?.toLocaleString()}
                  </Text>
                </Box>

                <Box textAlign="right">
                  <Text fontSize="2xl" fontWeight="bold" color={progressPercent === 100 ? '#059669' : '#2563eb'}>
                    {progressPercent}%
                  </Text>
                  <Text fontSize="10px" color="#64748b">
                    {empCompletedSteps.length} of {ONBOARDING_STEPS.length} items cleared
                  </Text>
                </Box>
              </Flex>

              {/* Milestones Checklist */}
              <Stack gap={3}>
                {ONBOARDING_STEPS.map((step, idx) => {
                  const isDone = empCompletedSteps.includes(step.id);

                  return (
                    <Box
                      key={step.id}
                      p={3.5}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor={isDone ? '#bbf7d0' : '#e2e8f0'}
                      bg={isDone ? '#f0fdf4' : 'white'}
                      transition="all 0.15s"
                    >
                      <Flex justify="space-between" align="flex-start" gap={3}>
                        <Flex gap={3} align="flex-start">
                          <Box
                            mt={0.5}
                            w="20px"
                            h="20px"
                            borderRadius="full"
                            bg={isDone ? '#059669' : '#e2e8f0'}
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="10px"
                            fontWeight="bold"
                            flexShrink={0}
                          >
                            {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                          </Box>
                          <Box>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color={isDone ? '#065f46' : '#0f172a'}
                            >
                              {step.label}
                            </Text>
                            <Text fontSize="11px" color="#64748b" mt={0.5}>
                              {step.description}
                            </Text>
                          </Box>
                        </Flex>

                        <Button
                          size="xs"
                          variant={isDone ? 'solid' : 'outline'}
                          colorPalette={isDone ? 'green' : 'blue'}
                          onClick={() => toggleStep(selectedEmployee.id, step.id)}
                        >
                          {isDone ? 'Completed' : 'Mark Done'}
                        </Button>
                      </Flex>
                    </Box>
                  );
                })}
              </Stack>

              {/* Summary note */}
              {progressPercent === 100 ? (
                <Box mt={5} p={3.5} bg="#ecfdf5" borderRadius="10px" border="1px solid #a7f3d0">
                  <Flex align="center" gap={2}>
                    <CheckCircle2 size={16} color="#059669" />
                    <Text fontSize="xs" fontWeight="bold" color="#065f46">
                      Onboarding Fully Completed
                    </Text>
                  </Flex>
                  <Text fontSize="11px" color="#047857" mt={1}>
                    All statutory documentation, banking arrangements, safety gear, and ERP credentials have been formally verified.
                  </Text>
                </Box>
              ) : (
                <Box mt={5} p={3} bg="#fffbeb" borderRadius="10px" border="1px solid #fde68a">
                  <Text fontSize="xs" color="#92400e" fontWeight="medium">
                    ⚠️ {ONBOARDING_STEPS.length - empCompletedSteps.length} onboarding milestones remain pending before full operational clearance.
                  </Text>
                </Box>
              )}
            </Card.Root>
          )}
        </Box>
      </SimpleGrid>
    </Stack>
  );
};
