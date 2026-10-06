import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Card,
  Input,
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Project, DailySiteReport } from '../../../types';
import { Plus, FileText, User, Calendar, CheckCircle2 } from 'lucide-react';

interface DailyReportsTabProps {
  project: Project;
}

export const DailyReportsTab: React.FC<DailyReportsTabProps> = ({ project }) => {
  const { dailySiteReports, addDailySiteReport, employees, currentUserName } = useERP();

  const currentReports = dailySiteReports
    .filter(r => r.projectId === project.id)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());

  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    summary: '',
    engineer: currentUserName
  });

  const handleOpenAdd = () => {
    setForm({
      reportDate: new Date().toISOString().split('T')[0],
      summary: '',
      engineer: currentUserName
    });
    setFeedback(null);
    setShowAddModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.summary.trim()) {
      setFeedback('Executive summary is required.');
      return;
    }

    addDailySiteReport({
      projectId: project.id,
      reportDate: form.reportDate,
      summary: form.summary.trim(),
      engineer: form.engineer.trim()
    });

    setShowAddModal(false);
  };

  return (
    <Stack gap={5}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Heading size="sm" color="#0f172a">Executive Daily Site Reports</Heading>
          <Text fontSize="xs" color="#64748b">
            Official daily operational summaries compiled by senior site engineers for management review.
          </Text>
        </Box>
        <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAdd}>
          <Plus size={15} /> Add Executive Site Report
        </Button>
      </Flex>

      {currentReports.length === 0 ? (
        <Card.Root bg="white" borderRadius="14px" p={8} textAlign="center" border="1px solid #e2e8f0">
          <Text fontSize="xs" color="#94a3b8">No executive reports recorded yet for this project.</Text>
          <Button size="xs" colorPalette="blue" mt={3} onClick={handleOpenAdd}>
            Draft First Executive Report
          </Button>
        </Card.Root>
      ) : (
        <Stack gap={3}>
          {currentReports.map((rep) => (
            <Card.Root key={rep.id} bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="center" mb={2} flexWrap="wrap" gap={2}>
                <Flex align="center" gap={2}>
                  <Calendar size={15} color="#2563eb" />
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">
                    {rep.reportDate}
                  </Text>
                </Flex>
                <Flex align="center" gap={1.5} fontSize="11px" color="#64748b">
                  <User size={13} />
                  <Text fontWeight="medium">Supervising Engineer: {rep.engineer}</Text>
                </Flex>
              </Flex>

              <Box p={3.5} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" mt={1}>
                <Text fontSize="xs" color="#334155" lineHeight="relaxed">
                  {rep.summary}
                </Text>
              </Box>
            </Card.Root>
          ))}
        </Stack>
      )}

      {/* Modal: Add Executive Report */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Add Executive Daily Site Report</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Draft formal daily executive overview for stakeholders.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveAdd}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Report Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={form.reportDate}
                      onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Supervising Engineer *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={form.engineer}
                        onChange={(e) => setForm({ ...form, engineer: e.target.value })}
                      >
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Executive Summary *</Text>
                  <Input
                    size="sm"
                    placeholder="Comprehensive operational narrative and critical site highlights..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Publish Executive Report
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
