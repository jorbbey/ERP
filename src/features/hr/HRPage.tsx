import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Card,
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import {
  Users,
  Building,
  Clock,
  Calendar,
  UserPlus,
  CreditCard,
  Award,
  TrendingUp,
  FileCheck
} from 'lucide-react';

import { EmployeeDirectoryTab } from './components/EmployeeDirectoryTab';
import { DepartmentsTab } from './components/DepartmentsTab';
import { AttendanceTab } from './components/AttendanceTab';
import { LeaveManagementTab } from './components/LeaveManagementTab';
import { RecruitmentTab } from './components/RecruitmentTab';
import { OnboardingTab } from './components/OnboardingTab';
import { AdvancesLoansTab } from './components/AdvancesLoansTab';
import { HRReportsTab } from './components/HRReportsTab';

type HRTab =
  | 'directory'
  | 'departments'
  | 'attendance'
  | 'leaves'
  | 'recruitment'
  | 'onboarding'
  | 'finance'
  | 'reports';

export const HRPage: React.FC = () => {
  const {
    employees,
    departments,
    attendance,
    leaves,
    recruitmentApplications,
    salaryAdvances,
    employeeLoans,
    activeCompany
  } = useERP();

  const [activeTab, setActiveTab] = useState<HRTab>('directory');

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const inInterview = recruitmentApplications.filter(a => a.status === 'interview').length;
  const pendingAdvances = salaryAdvances.filter(a => a.status === 'Pending').length;

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={4}>
          <Box>
            <Flex align="center" gap={3}>
              <Box p={2.5} borderRadius="12px" bg="#eff6ff" color="#2563eb">
                <Users size={24} />
              </Box>
              <Box>
                <Heading size="lg" color="#0f172a" fontWeight="bold">
                  Human Resources & Personnel Directorate
                </Heading>
                <Text fontSize="xs" color="#64748b" mt={0.5}>
                  Workforce records, departmental hierarchy, biometric attendance, leave administration, recruitment, and advances.
                </Text>
              </Box>
            </Flex>
          </Box>

          <Flex gap={2} align="center" wrap="wrap">
            <Badge colorPalette="blue" size="md" px={3} py={1}>
              {employees.length} Personnel
            </Badge>
            <Badge colorPalette="purple" size="md" px={3} py={1}>
              {departments.length} Divisions
            </Badge>
          </Flex>
        </Flex>
      </Card.Root>

      {/* Main Tab Navigation */}
      <Flex
        borderBottom="2px solid #e2e8f0"
        gap={{ base: 4, md: 6 }}
        overflowX="auto"
        pb={1}
      >
        {[
          { id: 'directory', label: 'Employee Directory', icon: Users, badge: employees.length },
          { id: 'departments', label: 'Departments', icon: Building, badge: departments.length },
          { id: 'attendance', label: 'Attendance & Punches', icon: Clock, badge: attendance.length },
          { id: 'leaves', label: 'Leave Management', icon: Calendar, badge: pendingLeaves > 0 ? `${pendingLeaves} New` : undefined, badgeColor: 'yellow' },
          { id: 'recruitment', label: 'Recruitment & Hiring', icon: UserPlus, badge: inInterview > 0 ? `${inInterview} Ivws` : undefined, badgeColor: 'purple' },
          { id: 'onboarding', label: 'Onboarding Pipeline', icon: FileCheck },
          { id: 'finance', label: 'Advances & Loans', icon: CreditCard, badge: pendingAdvances > 0 ? `${pendingAdvances} Req` : undefined, badgeColor: 'yellow' },
          { id: 'reports', label: 'HR Analytics', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Flex
              key={tab.id}
              as="button"
              align="center"
              gap={2}
              pb={3}
              fontSize="sm"
              fontWeight="bold"
              color={isActive ? '#2563eb' : '#64748b'}
              borderBottom={isActive ? '2px solid #2563eb' : 'none'}
              mb="-2px"
              cursor="pointer"
              whiteSpace="nowrap"
              onClick={() => setActiveTab(tab.id as HRTab)}
              _hover={{ color: '#0f172a' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge
                  size="xs"
                  colorPalette={tab.badgeColor || (isActive ? 'blue' : 'gray')}
                  variant={isActive ? 'solid' : 'subtle'}
                >
                  {tab.badge}
                </Badge>
              )}
            </Flex>
          );
        })}
      </Flex>

      {/* Tab Panels */}
      {activeTab === 'directory' && <EmployeeDirectoryTab />}
      {activeTab === 'departments' && <DepartmentsTab />}
      {activeTab === 'attendance' && <AttendanceTab />}
      {activeTab === 'leaves' && <LeaveManagementTab />}
      {activeTab === 'recruitment' && <RecruitmentTab />}
      {activeTab === 'onboarding' && <OnboardingTab />}
      {activeTab === 'finance' && <AdvancesLoansTab />}
      {activeTab === 'reports' && <HRReportsTab />}
    </Stack>
  );
};
