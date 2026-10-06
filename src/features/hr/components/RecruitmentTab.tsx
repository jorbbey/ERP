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
  Input,
  NativeSelect,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { JobVacancy, RecruitmentApplication, UserRole } from '../../../types';
import {
  UserPlus,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Plus,
  Search,
  Filter,
  Users,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const RecruitmentTab: React.FC = () => {
  const {
    jobVacancies,
    recruitmentApplications,
    departments,
    createJobVacancy,
    updateJobVacancy,
    createRecruitmentApplication,
    updateApplicationStage,
    hireCandidate,
    activeCompany,
    currentUserName,
    activeRole
  } = useERP();

  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'vacancies'>('pipeline');
  const [pipelineStatusFilter, setPipelineStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [vacancyForm, setVacancyForm] = useState({
    title: '',
    department: 'Civil Engineering & Construction',
    openings: 2,
    experienceLevel: 'Mid-Senior (5+ yrs)',
    employmentType: 'Full-Time' as JobVacancy['employmentType'],
    location: 'Central Highway Project Site',
    salaryRange: '$4,000 - $6,500',
    status: 'Active' as JobVacancy['status'],
    closingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    description: ''
  });

  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    position: 'Field Works Engineer',
    department: 'Civil Engineering & Construction',
    experienceYears: 4,
    resumeFileName: 'resume_profile.pdf',
    notes: ''
  });

  // Action modals
  const [scheduleInterviewApp, setScheduleInterviewApp] = useState<RecruitmentApplication | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    interviewer: currentUserName,
    notes: 'Technical assessment of concrete structural designs'
  });

  const [evaluateApp, setEvaluateApp] = useState<RecruitmentApplication | null>(null);
  const [evaluationForm, setEvaluationForm] = useState({
    rating: 5,
    notes: 'Strong knowledge of geotechnical specifications and site supervision'
  });

  const [hireApp, setHireApp] = useState<RecruitmentApplication | null>(null);
  const [hireForm, setHireForm] = useState({
    salary: 5000,
    hireDate: new Date().toISOString().split('T')[0],
    role: 'Site Engineer' as UserRole
  });

  const filteredApplications = recruitmentApplications.filter(app => {
    const matchesStatus = pipelineStatusFilter === 'All' || app.status === pipelineStatusFilter;
    const matchesPosition = positionFilter === 'All' || app.position === positionFilter;
    const matchesSearch =
      !searchTerm ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPosition && matchesSearch;
  });

  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacancyForm.title.trim()) return;

    createJobVacancy({
      ...vacancyForm,
      title: vacancyForm.title.trim(),
      description: vacancyForm.description.trim() || 'Core engineering role responsible for project delivery.'
    });

    setShowVacancyModal(false);
    setVacancyForm({
      title: '',
      department: departments[0]?.name || 'Civil Engineering & Construction',
      openings: 2,
      experienceLevel: 'Mid-Senior (5+ yrs)',
      employmentType: 'Full-Time',
      location: 'Central Highway Project Site',
      salaryRange: '$4,000 - $6,500',
      status: 'Active',
      closingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      description: ''
    });
  };

  const handleCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantForm.applicantName.trim()) return;

    createRecruitmentApplication({
      applicantName: applicantForm.applicantName.trim(),
      email: applicantForm.email.trim(),
      phone: applicantForm.phone.trim(),
      position: applicantForm.position.trim(),
      department: applicantForm.department,
      experienceYears: Number(applicantForm.experienceYears) || 1,
      resumeFileName: applicantForm.resumeFileName.trim(),
      notes: applicantForm.notes.trim()
    });

    setShowApplicantModal(false);
    setApplicantForm({
      applicantName: '',
      email: '',
      phone: '',
      position: 'Field Works Engineer',
      department: departments[0]?.name || 'Civil Engineering & Construction',
      experienceYears: 4,
      resumeFileName: 'resume_profile.pdf',
      notes: ''
    });
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleInterviewApp) return;

    updateApplicationStage(scheduleInterviewApp.id, 'interview', {
      interviewDate: interviewForm.interviewDate,
      interviewer: interviewForm.interviewer,
      notes: interviewForm.notes
    });

    setScheduleInterviewApp(null);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluateApp) return;

    updateApplicationStage(evaluateApp.id, 'interview', {
      rating: Number(evaluationForm.rating),
      notes: evaluationForm.notes
    });

    setEvaluateApp(null);
  };

  const handleConfirmHire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireApp) return;

    const res = hireCandidate({
      applicationId: hireApp.id,
      salary: Number(hireForm.salary) || 4500,
      hireDate: hireForm.hireDate,
      role: hireForm.role
    });

    if (res.success) {
      alert(`Candidate ${hireApp.applicantName} successfully hired! Employee profile created with code ${res.employee?.code}.`);
    } else {
      alert(res.error || 'Failed to hire candidate');
    }

    setHireApp(null);
  };

  const activeVacanciesCount = jobVacancies.filter(v => v.status === 'Active').length;
  const inInterviewCount = recruitmentApplications.filter(a => a.status === 'interview').length;
  const hiredCount = recruitmentApplications.filter(a => a.status === 'hired').length;

  return (
    <Stack gap={6}>
      {/* Top Metric Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Active Job Postings</Text>
              <Heading size="xl" color="#2563eb" mt={1}>{activeVacanciesCount}</Heading>
              <Text fontSize="11px" color="#2563eb" mt={1}>Openings Across Sites</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#eff6ff" color="#2563eb">
              <Briefcase size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Candidate Pipeline</Text>
              <Heading size="xl" color="#0f172a" mt={1}>{recruitmentApplications.length}</Heading>
              <Text fontSize="11px" color="#64748b" mt={1}>Total Submissions</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#f1f5f9" color="#0f172a">
              <Users size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Interview Stage</Text>
              <Heading size="xl" color="#d97706" mt={1}>{inInterviewCount}</Heading>
              <Text fontSize="11px" color="#d97706" mt={1}>Assessment Scheduled</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#fffbeb" color="#d97706">
              <Clock size={22} />
            </Box>
          </Flex>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="#64748b">Hired & Onboarded</Text>
              <Heading size="xl" color="#059669" mt={1}>{hiredCount}</Heading>
              <Text fontSize="11px" color="#059669" mt={1}>Added to Staff Roster</Text>
            </Box>
            <Box p={3} borderRadius="12px" bg="#ecfdf5" color="#059669">
              <UserPlus size={22} />
            </Box>
          </Flex>
        </Card.Root>
      </SimpleGrid>

      {/* Navigation Sub-Tabs */}
      <Flex borderBottom="2px solid #e2e8f0" gap={6}>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'pipeline' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'pipeline' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('pipeline')}
        >
          Candidate Applications & Funnel ({recruitmentApplications.length})
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeSubTab === 'vacancies' ? '#2563eb' : '#64748b'}
          borderBottom={activeSubTab === 'vacancies' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveSubTab('vacancies')}
        >
          Job Vacancies & Requisitions ({jobVacancies.length})
        </Box>
      </Flex>

      {/* Sub-Tab 1: Candidate Applications Pipeline */}
      {activeSubTab === 'pipeline' && (
        <Stack gap={4}>
          <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={3}>
              <Flex gap={2} wrap="wrap" align="center" flex="1">
                <Box position="relative" minW="220px">
                  <Input
                    size="xs"
                    placeholder="Search candidate by name, position..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    pl={7}
                  />
                  <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" color="#94a3b8">
                    <Search size={12} />
                  </Box>
                </Box>

                <Box minW="140px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field
                      value={pipelineStatusFilter}
                      onChange={e => setPipelineStatusFilter(e.target.value)}
                    >
                      <option value="All">All Stages</option>
                      <option value="applied">Applied (New)</option>
                      <option value="screening">Screening</option>
                      <option value="interview">Interview</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box minW="170px">
                  <NativeSelect.Root size="xs">
                    <NativeSelect.Field
                      value={positionFilter}
                      onChange={e => setPositionFilter(e.target.value)}
                    >
                      <option value="All">All Job Positions</option>
                      {Array.from(new Set(recruitmentApplications.map(a => a.position))).map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </Flex>

              <Button
                size="sm"
                colorPalette="blue"
                onClick={() => setShowApplicantModal(true)}
                fontWeight="bold"
              >
                <Plus size={14} /> Log Candidate
              </Button>
            </Flex>
          </Card.Root>

          {/* Candidates Table */}
          <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="xs" overflow="hidden">
            <Table.Root size="sm" variant="outline">
              <Table.Header bg="#f8fafc">
                <Table.Row>
                  <Table.ColumnHeader>Applicant Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Position Applied</Table.ColumnHeader>
                  <Table.ColumnHeader>Department</Table.ColumnHeader>
                  <Table.ColumnHeader>Experience</Table.ColumnHeader>
                  <Table.ColumnHeader>Contact</Table.ColumnHeader>
                  <Table.ColumnHeader>Applied Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Evaluation</Table.ColumnHeader>
                  <Table.ColumnHeader>Stage</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Hiring Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredApplications.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={9} textAlign="center" py={8} color="#94a3b8">
                      No candidate applications found matching filters.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredApplications.map(app => (
                    <Table.Row key={app.id}>
                      <Table.Cell>
                        <Text fontWeight="bold" fontSize="xs" color="#0f172a">{app.applicantName}</Text>
                        <Text fontSize="10px" color="#64748b">{app.resumeFileName || 'Resume.pdf'}</Text>
                      </Table.Cell>
                      <Table.Cell fontSize="xs" fontWeight="semibold">{app.position}</Table.Cell>
                      <Table.Cell fontSize="xs" color="#475569">{app.department}</Table.Cell>
                      <Table.Cell fontSize="xs">{app.experienceYears} yrs</Table.Cell>
                      <Table.Cell fontSize="xs">
                        <Text>{app.phone}</Text>
                        <Text fontSize="10px" color="#64748b">{app.email}</Text>
                      </Table.Cell>
                      <Table.Cell fontSize="xs">{app.appliedDate}</Table.Cell>
                      <Table.Cell>
                        {app.rating ? (
                          <Flex align="center" gap={1} color="#d97706" fontSize="xs">
                            <Star size={12} fill="#d97706" />
                            <Text fontWeight="bold">{app.rating}/5</Text>
                          </Flex>
                        ) : (
                          <Text fontSize="11px" color="#94a3b8">Not evaluated</Text>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          size="sm"
                          colorPalette={
                            app.status === 'hired' ? 'green' :
                            app.status === 'interview' ? 'purple' :
                            app.status === 'screening' ? 'blue' :
                            app.status === 'applied' ? 'yellow' : 'red'
                          }
                        >
                          {app.status.toUpperCase()}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={1}>
                          {app.status !== 'hired' && app.status !== 'rejected' && (
                            <>
                              <Button
                                size="xs"
                                variant="outline"
                                colorPalette="purple"
                                onClick={() => {
                                  setScheduleInterviewApp(app);
                                  setInterviewForm({
                                    interviewDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
                                    interviewer: currentUserName,
                                    notes: ''
                                  });
                                }}
                              >
                                Interview
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                colorPalette="blue"
                                onClick={() => {
                                  setEvaluateApp(app);
                                  setEvaluationForm({
                                    rating: app.rating || 4,
                                    notes: app.notes || ''
                                  });
                                }}
                              >
                                Rate
                              </Button>
                              <Button
                                size="xs"
                                colorPalette="green"
                                onClick={() => {
                                  setHireApp(app);
                                  setHireForm({
                                    salary: 5000,
                                    hireDate: new Date().toISOString().split('T')[0],
                                    role: 'Site Engineer'
                                  });
                                }}
                                fontWeight="bold"
                              >
                                Hire
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                color="#dc2626"
                                onClick={() => {
                                  if (confirm(`Reject applicant ${app.applicantName}?`)) {
                                    updateApplicationStage(app.id, 'rejected', { rejectionReason: 'Qualifications not aligned' });
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === 'hired' && (
                            <Badge colorPalette="green" size="sm">
                              <CheckCircle2 size={12} /> Onboarded
                            </Badge>
                          )}
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Stack>
      )}

      {/* Sub-Tab 2: Job Vacancies Requisitions */}
      {activeSubTab === 'vacancies' && (
        <Stack gap={4}>
          <Flex justify="flex-end">
            <Button
              size="sm"
              colorPalette="blue"
              onClick={() => setShowVacancyModal(true)}
              fontWeight="bold"
            >
              <Plus size={14} /> Post New Vacancy
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {jobVacancies.map(vac => (
              <Card.Root key={vac.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Badge colorPalette="blue" size="sm">{vac.department}</Badge>
                  <Badge colorPalette={vac.status === 'Active' ? 'green' : 'gray'} size="sm">
                    {vac.status}
                  </Badge>
                </Flex>

                <Heading size="md" color="#0f172a" mb={1}>
                  {vac.title}
                </Heading>
                <Text fontSize="xs" color="#64748b" mb={3}>
                  {vac.description}
                </Text>

                <Stack gap={1.5} fontSize="xs" p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #f1f5f9" mb={4}>
                  <Flex justify="space-between">
                    <Text color="#64748b">Open Positions:</Text>
                    <Text fontWeight="bold" color="#0f172a">{vac.openings} headcount</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="#64748b">Experience Level:</Text>
                    <Text fontWeight="semibold">{vac.experienceLevel}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="#64748b">Employment Type:</Text>
                    <Text fontWeight="semibold">{vac.employmentType}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="#64748b">Site Location:</Text>
                    <Text fontWeight="semibold">{vac.location}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="#64748b">Target Salary:</Text>
                    <Text fontWeight="bold" color="#059669">{vac.salaryRange}</Text>
                  </Flex>
                  <Flex justify="space-between" pt={1} borderTop="1px solid #e2e8f0">
                    <Text color="#64748b">Closing Date:</Text>
                    <Text fontWeight="semibold" color="#d97706">{vac.closingDate}</Text>
                  </Flex>
                </Stack>

                <Flex justify="space-between" align="center">
                  <Text fontSize="11px" color="#94a3b8">Posted {vac.postedDate}</Text>
                  {vac.status === 'Active' && (
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette="red"
                      onClick={() => updateJobVacancy(vac.id, { status: 'Closed' })}
                    >
                      Close Posting
                    </Button>
                  )}
                </Flex>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      {/* Post Vacancy Modal */}
      {showVacancyModal && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Post Engineering / Project Vacancy
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define position requirements, location, and headcount.
            </Text>

            <form onSubmit={handleCreateVacancy}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Position Title *</Text>
                  <Input
                    size="sm"
                    value={vacancyForm.title}
                    onChange={e => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                    placeholder="e.g. Senior Highway Asphalt Paving Engineer"
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Department *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={vacancyForm.department}
                        onChange={e => setVacancyForm({ ...vacancyForm, department: e.target.value })}
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Headcount Openings</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={vacancyForm.openings}
                      onChange={e => setVacancyForm({ ...vacancyForm, openings: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Employment Type</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={vacancyForm.employmentType}
                        onChange={e => setVacancyForm({ ...vacancyForm, employmentType: e.target.value as any })}
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Site-Based">Site-Based</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Experience Level</Text>
                    <Input
                      size="sm"
                      value={vacancyForm.experienceLevel}
                      onChange={e => setVacancyForm({ ...vacancyForm, experienceLevel: e.target.value })}
                      placeholder="e.g. 5+ Years Construction"
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Target Salary Range</Text>
                    <Input
                      size="sm"
                      value={vacancyForm.salaryRange}
                      onChange={e => setVacancyForm({ ...vacancyForm, salaryRange: e.target.value })}
                      placeholder="e.g. $4,500 - $6,000"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Closing Date</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={vacancyForm.closingDate}
                      onChange={e => setVacancyForm({ ...vacancyForm, closingDate: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Job Description & Key Duties</Text>
                  <Textarea
                    size="sm"
                    rows={2}
                    value={vacancyForm.description}
                    onChange={e => setVacancyForm({ ...vacancyForm, description: e.target.value })}
                    placeholder="Key responsibilities and qualifications required..."
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowVacancyModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Publish Vacancy
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Log Applicant Modal */}
      {showApplicantModal && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Log Candidate Application
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Register applicant into the recruitment funnel.
            </Text>

            <form onSubmit={handleCreateApplicant}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Applicant Full Name *</Text>
                  <Input
                    size="sm"
                    value={applicantForm.applicantName}
                    onChange={e => setApplicantForm({ ...applicantForm, applicantName: e.target.value })}
                    placeholder="e.g. Ibrahim Suleiman"
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Email Address *</Text>
                    <Input
                      size="sm"
                      type="email"
                      value={applicantForm.email}
                      onChange={e => setApplicantForm({ ...applicantForm, email: e.target.value })}
                      placeholder="e.g. i.suleiman@gmail.com"
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Phone Number *</Text>
                    <Input
                      size="sm"
                      value={applicantForm.phone}
                      onChange={e => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      placeholder="+234 809 123 4567"
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Target Position *</Text>
                    <Input
                      size="sm"
                      value={applicantForm.position}
                      onChange={e => setApplicantForm({ ...applicantForm, position: e.target.value })}
                      placeholder="e.g. Quality Assurance Engineer"
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Years Experience</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={applicantForm.experienceYears}
                      onChange={e => setApplicantForm({ ...applicantForm, experienceYears: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Department</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={applicantForm.department}
                      onChange={e => setApplicantForm({ ...applicantForm, department: e.target.value })}
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setShowApplicantModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Register Applicant
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Schedule Interview Modal */}
      {scheduleInterviewApp && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="450px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Schedule Candidate Interview
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Applicant: <strong>{scheduleInterviewApp.applicantName}</strong> ({scheduleInterviewApp.position})
            </Text>

            <form onSubmit={handleScheduleInterview}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Interview Date *</Text>
                  <Input
                    size="sm"
                    type="date"
                    value={interviewForm.interviewDate}
                    onChange={e => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Lead Interviewer</Text>
                  <Input
                    size="sm"
                    value={interviewForm.interviewer}
                    onChange={e => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Interview Scope / Notes</Text>
                  <Textarea
                    size="sm"
                    rows={2}
                    value={interviewForm.notes}
                    onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setScheduleInterviewApp(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="purple" type="submit" fontWeight="bold">
                    Schedule Assessment
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Evaluate Candidate Modal */}
      {evaluateApp && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="450px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Evaluate & Rate Candidate
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Candidate: <strong>{evaluateApp.applicantName}</strong>
            </Text>

            <form onSubmit={handleSaveEvaluation}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Rating (1 to 5 Stars) *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={evaluationForm.rating}
                      onChange={e => setEvaluationForm({ ...evaluationForm, rating: Number(e.target.value) })}
                    >
                      <option value="5">★★★★★ 5 - Exceptional Fit</option>
                      <option value="4">★★★★☆ 4 - Strong Candidate</option>
                      <option value="3">★★★☆☆ 3 - Meets Basic Criteria</option>
                      <option value="2">★★☆☆☆ 2 - Below Expectations</option>
                      <option value="1">★☆☆☆☆ 1 - Unqualified</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Evaluation Notes</Text>
                  <Textarea
                    size="sm"
                    rows={3}
                    value={evaluationForm.notes}
                    onChange={e => setEvaluationForm({ ...evaluationForm, notes: e.target.value })}
                    placeholder="Technical skills feedback and recommendation..."
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setEvaluateApp(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit" fontWeight="bold">
                    Save Evaluation
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Direct Hire Candidate Modal */}
      {hireApp && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(15, 23, 42, 0.65)"
          zIndex={1400}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} border="1px solid #e2e8f0" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              Hire & Provision Employee Record
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Directly induct <strong>{hireApp.applicantName}</strong> into the corporate staff roster.
            </Text>

            <form onSubmit={handleConfirmHire}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Agreed Monthly Salary *</Text>
                  <Input
                    size="sm"
                    type="number"
                    value={hireForm.salary}
                    onChange={e => setHireForm({ ...hireForm, salary: Number(e.target.value) })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Official Start / Hire Date *</Text>
                  <Input
                    size="sm"
                    type="date"
                    value={hireForm.hireDate}
                    onChange={e => setHireForm({ ...hireForm, hireDate: e.target.value })}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>ERP System Role Assignment *</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      value={hireForm.role}
                      onChange={e => setHireForm({ ...hireForm, role: e.target.value as UserRole })}
                    >
                      <option value="Site Engineer">Site Engineer</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Quantity Surveyor">Quantity Surveyor</option>
                      <option value="Procurement Officer">Procurement Officer</option>
                      <option value="Storekeeper">Storekeeper</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Staff">Staff</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <Box p={3} bg="#ecfdf5" borderRadius="8px" border="1px solid #a7f3d0" fontSize="xs" color="#065f46">
                  <Text fontWeight="bold">Automatic Onboarding Action:</Text>
                  <Text mt={0.5}>
                    This will transition the applicant to "Hired" and generate an active employee profile with employee code and initial leave entitlements.
                  </Text>
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button size="sm" variant="outline" onClick={() => setHireApp(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="green" type="submit" fontWeight="bold">
                    Confirm Hire & Create Employee
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
