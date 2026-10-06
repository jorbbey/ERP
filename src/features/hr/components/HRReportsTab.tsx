import React from 'react';
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
import {
  TrendingUp,
  Users,
  Calendar,
  Building,
  DollarSign,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';

export const HRReportsTab: React.FC = () => {
  const {
    employees,
    departments,
    attendance,
    leaves,
    payrollRuns,
    activeCompany
  } = useERP();

  const totalEmployees = employees.length || 1;
  const activeEmployees = employees.filter(e => e.status === 'Active');

  // Department distribution
  const deptStats = departments.map(d => {
    const count = employees.filter(e => e.department === d.name).length;
    const pct = Math.round((count / totalEmployees) * 100);
    const wageBill = employees
      .filter(e => e.department === d.name)
      .reduce((sum, e) => sum + (e.salary || 0), 0);
    return { name: d.name, count, pct, wageBill };
  });

  // Attendance rate
  const totalAttendanceLogs = attendance.length || 1;
  const onTimeCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const punctualityRate = Math.round((onTimeCount / totalAttendanceLogs) * 100);

  // Leave stats
  const totalLeaves = leaves.length || 1;
  const approvedLeaves = leaves.filter(l => l.status === 'Approved');
  const annualLeavesCount = approvedLeaves.filter(l => l.leaveType === 'Annual Leave').length;
  const sickLeavesCount = approvedLeaves.filter(l => l.leaveType === 'Sick Leave').length;
  const casualLeavesCount = approvedLeaves.filter(l => l.leaveType === 'Casual').length;

  const totalWageBill = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

  const handleExportHRReport = () => {
    const lines = [
      `=== ${activeCompany.name} HR & WORKFORCE REPORT ===`,
      `Report Date: ${new Date().toISOString().split('T')[0]}`,
      `Total Headcount: ${totalEmployees}`,
      `Active Personnel: ${activeEmployees.length}`,
      `Punctuality Rate: ${punctualityRate}%`,
      `Monthly Base Wage Bill: ${activeCompany.currency} ${totalWageBill.toLocaleString()}`,
      '',
      '--- DEPARTMENTAL DISTRIBUTION ---',
      ...deptStats.map(d => `${d.name}: ${d.count} staff (${d.pct}%) - Wage Bill: ${activeCompany.currency} ${d.wageBill.toLocaleString()}`),
      '',
      '--- LEAVE UTILIZATION ---',
      `Total Approved Requests: ${approvedLeaves.length}`,
      `Annual Leaves: ${annualLeavesCount}`,
      `Sick Leaves: ${sickLeavesCount}`,
      `Casual Leaves: ${casualLeavesCount}`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hr_analytics_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align={{ md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
          <Box>
            <Heading size="md" color="#0f172a">
              Human Capital & Workforce Analytics
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={1}>
              Headcount dynamics, attendance punctuality metrics, and departmental wage expenditures.
            </Text>
          </Box>
          <Flex gap={2}>
            <Button size="sm" variant="outline" onClick={handleExportHRReport}>
              <Download size={14} /> Export Summary
            </Button>
            <Button size="sm" colorPalette="blue" onClick={() => window.print()}>
              <Printer size={14} /> Print Report
            </Button>
          </Flex>
        </Flex>
      </Card.Root>

      {/* KPI Overview */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Total Headcount</Text>
              <Heading size="xl" color="#0f172a" mt={1}>{totalEmployees}</Heading>
              <Text fontSize="11px" color="#059669" mt={1}>{activeEmployees.length} on active roster</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <Users size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Punctuality Score</Text>
              <Heading size="xl" color="#059669" mt={1}>{punctualityRate}%</Heading>
              <Text fontSize="11px" color="#059669" mt={1}>{onTimeCount} on-time shift punches</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#ecfdf5" color="#059669">
              <Clock size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Authorized Leaves</Text>
              <Heading size="xl" color="#d97706" mt={1}>{approvedLeaves.length}</Heading>
              <Text fontSize="11px" color="#d97706" mt={1}>Approved YTD</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fffbeb" color="#d97706">
              <Calendar size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Monthly Base Wage Bill</Text>
              <Heading size="xl" color="#2563eb" mt={1}>
                {activeCompany.currency} {totalWageBill.toLocaleString()}
              </Heading>
              <Text fontSize="11px" color="#2563eb" mt={1}>Gross Staff Commitment</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <DollarSign size={22} />
            </Box>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* Department Breakdown */}
      <SimpleGrid columns={{ base: 1, lg: 12 }} gap={5}>
        <Box gridColumn={{ base: 'span 12', lg: 'span 7' }}>
          <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs" h="100%">
            <Heading size="sm" color="#0f172a" mb={1}>
              Departmental Workforce & Wage Distribution
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Staff concentration and monthly compensation breakdown by division.
            </Text>

            <Stack gap={4}>
              {deptStats.map(d => (
                <Box key={d.name} p={3} bg="#f8fafc" borderRadius="12px" border="1px solid #f1f5f9">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="bold" fontSize="xs" color="#0f172a">{d.name}</Text>
                    <Text fontWeight="mono" fontSize="xs" color="#2563eb">
                      {d.count} staff ({d.pct}%)
                    </Text>
                  </Flex>
                  <Progress.Root value={d.pct} size="xs" colorPalette="blue" my={1.5}>
                    <Progress.Track bg="#e2e8f0">
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                  <Flex justify="space-between" fontSize="11px" color="#64748b">
                    <Text>Monthly Base Salary Bill:</Text>
                    <Text fontWeight="bold" color="#059669">
                      {activeCompany.currency} {d.wageBill.toLocaleString()}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </Card.Root>
        </Box>

        <Box gridColumn={{ base: 'span 12', lg: 'span 5' }}>
          <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs" h="100%">
            <Heading size="sm" color="#0f172a" mb={1}>
              Absence & Leave Utilization
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Approved leaves breakdown across statutory entitlement classes.
            </Text>

            <Stack gap={3.5}>
              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                <Flex justify="space-between" align="center">
                  <Text fontSize="xs" fontWeight="semibold" color="#0f172a">Annual Vacation Leaves</Text>
                  <Badge colorPalette="blue" size="sm">{annualLeavesCount} Granted</Badge>
                </Flex>
                <Text fontSize="11px" color="#64748b" mt={1}>Statutory 21 days annual allowance</Text>
              </Box>

              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                <Flex justify="space-between" align="center">
                  <Text fontSize="xs" fontWeight="semibold" color="#0f172a">Medical & Sick Leaves</Text>
                  <Badge colorPalette="green" size="sm">{sickLeavesCount} Granted</Badge>
                </Flex>
                <Text fontSize="11px" color="#64748b" mt={1}>Doctor-certified recuperation</Text>
              </Box>

              <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
                <Flex justify="space-between" align="center">
                  <Text fontSize="xs" fontWeight="semibold" color="#0f172a">Casual Emergency Leaves</Text>
                  <Badge colorPalette="yellow" size="sm">{casualLeavesCount} Granted</Badge>
                </Flex>
                <Text fontSize="11px" color="#64748b" mt={1}>Short unplanned urgent absences</Text>
              </Box>

              <Box p={3.5} bg="#eff6ff" borderRadius="10px" border="1px solid #bfdbfe" mt={2}>
                <Text fontSize="xs" fontWeight="bold" color="#1e40af">Historical Payroll Runs</Text>
                <Text fontSize="11px" color="#1e3a8a" mt={1}>
                  Total of {payrollRuns.length} monthly payroll exercises have been successfully processed and verified in the electronic ledger.
                </Text>
              </Box>
            </Stack>
          </Card.Root>
        </Box>
      </SimpleGrid>
    </Stack>
  );
};
