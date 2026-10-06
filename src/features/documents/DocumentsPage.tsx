import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Input,
  Stack,
  Card,
  Table,
  SimpleGrid,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { ProjectDocument } from '../../types';
import {
  FolderKanban,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  FileSpreadsheet,
  Building2,
  HardHat,
  Users,
  FileCheck,
  X,
  FileCode,
  FileImage,
  AlertCircle
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    projects,
    employees,
    contracts,
    currentUserName,
    activeRole
  } = useERP();

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRelatedType, setSelectedRelatedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);
  const [versioningDoc, setVersioningDoc] = useState<ProjectDocument | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<ProjectDocument | null>(null);

  // Form State for New Upload
  const [newDocForm, setNewDocForm] = useState({
    title: '',
    category: 'Architectural',
    relatedType: 'Project' as 'Project' | 'Employee' | 'Contract' | 'General',
    relatedId: projects[0]?.id || 1,
    description: '',
    fileName: '',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    fileData: ''
  });

  // Form State for Version Replacement
  const [versionForm, setVersionForm] = useState({
    fileName: '',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    revisionNotes: ''
  });

  // File Upload Handler with real HTML File Reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      const reader = new FileReader();
      reader.onload = () => {
        setNewDocForm(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: sizeStr,
          fileType: file.type || 'application/octet-stream',
          fileData: reader.result as string,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '')
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVersionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      setVersionForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeStr,
        fileType: file.type || 'application/octet-stream'
      }));
    }
  };

  // Submit New Document
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.title.trim()) return;

    let relatedName = '';
    let projectId: number | undefined = undefined;

    if (newDocForm.relatedType === 'Project') {
      const p = projects.find(item => item.id === Number(newDocForm.relatedId));
      relatedName = p ? p.name : 'Project';
      projectId = p?.id;
    } else if (newDocForm.relatedType === 'Employee') {
      const emp = employees.find(item => item.id === Number(newDocForm.relatedId));
      relatedName = emp ? emp.name : 'Employee';
    } else if (newDocForm.relatedType === 'Contract') {
      const c = contracts.find(item => item.id === Number(newDocForm.relatedId));
      relatedName = c ? c.title : 'Contract';
    } else {
      relatedName = 'Enterprise General';
    }

    addDocument({
      title: newDocForm.title,
      fileName: newDocForm.fileName || `${newDocForm.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      category: newDocForm.category,
      uploadDate: new Date().toISOString().split('T')[0],
      size: newDocForm.fileSize,
      fileType: newDocForm.fileType,
      fileData: newDocForm.fileData,
      uploadedBy: currentUserName,
      relatedType: newDocForm.relatedType,
      relatedId: Number(newDocForm.relatedId),
      relatedName,
      projectId,
      projectName: projectId ? relatedName : undefined,
      version: 'v1.0',
      status: 'Approved',
      description: newDocForm.description
    });

    setShowUploadModal(false);
    setNewDocForm({
      title: '',
      category: 'Architectural',
      relatedType: 'Project',
      relatedId: projects[0]?.id || 1,
      description: '',
      fileName: '',
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      fileData: ''
    });
  };

  // Submit Version Replacement
  const handleReplaceVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versioningDoc) return;

    const currentVer = versioningDoc.version || 'v1.0';
    const verNumber = parseFloat(currentVer.replace('v', '')) || 1.0;
    const nextVer = `v${(verNumber + 0.1).toFixed(1)}`;

    updateDocument(versioningDoc.id, {
      version: nextVer,
      fileName: versionForm.fileName || versioningDoc.fileName,
      size: versionForm.fileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentUserName,
      status: 'Under Review',
      description: versionForm.revisionNotes
        ? `${versioningDoc.description || ''} | Revision ${nextVer}: ${versionForm.revisionNotes}`
        : versioningDoc.description
    });

    setVersioningDoc(null);
    setVersionForm({
      fileName: '',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      revisionNotes: ''
    });
  };

  // Real Browser File Download
  const handleDownload = (doc: ProjectDocument) => {
    const fileContent = doc.fileData || `ERP Document Record: ${doc.title}\nCategory: ${doc.category}\nRelated: ${doc.relatedType} - ${doc.relatedName || ''}\nVersion: ${doc.version || 'v1.0'}\nUploaded by: ${doc.uploadedBy || 'Admin'}\nDate: ${doc.uploadDate}\n\n[Certified Enterprise ERP Archive]`;
    const blob = new Blob([fileContent], { type: doc.fileType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Documents Register as CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'File Name', 'Category', 'Related Type', 'Related Entity', 'Version', 'Status', 'Size', 'Uploaded By', 'Upload Date'];
    const rows = filteredDocs.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.fileName.replace(/"/g, '""')}"`,
      d.category,
      d.relatedType || 'General',
      `"${(d.relatedName || d.projectName || '').replace(/"/g, '""')}"`,
      d.version || 'v1.0',
      d.status || 'Approved',
      d.size,
      `"${(d.uploadedBy || '').replace(/"/g, '""')}"`,
      d.uploadDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `documents_register_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Status Change Quick Handler
  const handleStatusChange = (docId: number, newStatus: ProjectDocument['status']) => {
    updateDocument(docId, { status: newStatus });
  };

  // Filtered Documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.relatedName && doc.relatedName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesRelated = selectedRelatedType === 'all' || doc.relatedType === selectedRelatedType;
    const matchesStatus = selectedStatus === 'all' || (doc.status || 'Approved') === selectedStatus;

    return matchesSearch && matchesCategory && matchesRelated && matchesStatus;
  });

  // Calculate Statistics
  const totalCount = documents.length;
  const projectDocsCount = documents.filter(d => d.relatedType === 'Project' || d.projectId).length;
  const contractDocsCount = documents.filter(d => d.relatedType === 'Contract').length;
  const employeeDocsCount = documents.filter(d => d.relatedType === 'Employee').length;
  const underReviewCount = documents.filter(d => d.status === 'Under Review').length;

  return (
    <Box p={6}>
      {/* Top Banner */}
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
        <Flex align="center" gap={3}>
          <Box p={3} bg="#0284c7" color="white" borderRadius="14px" boxShadow="sm">
            <FolderKanban size={26} />
          </Box>
          <Box>
            <Heading size="lg" color="#0f172a">
              Enterprise Document Management & Technical Archive
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Centralized repository for project blueprints, contracts, statutory permits, compliance certifications & HR dossiers.
            </Text>
          </Box>
        </Flex>

        <Flex align="center" gap={3}>
          <Button
            size="sm"
            variant="outline"
            borderColor="#cbd5e1"
            onClick={handleExportCSV}
          >
            <FileSpreadsheet size={16} /> Export Register (CSV)
          </Button>
          <Button
            size="sm"
            bg="#0284c7"
            color="white"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus size={16} /> Upload New Document
          </Button>
        </Flex>
      </Flex>

      {/* KPI Stats Cards */}
      <SimpleGrid columns={{ base: 2, sm: 2, lg: 5 }} gap={4} mb={6}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
              Total Documents
            </Text>
            <FileText size={18} color="#0284c7" />
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#0f172a">{totalCount}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Controlled records cataloged</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
              Project Blueprints
            </Text>
            <HardHat size={18} color="#2563eb" />
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#2563eb">{projectDocsCount}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Drawings, BOQs & permits</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
              Contract Admin
            </Text>
            <Building2 size={18} color="#7c3aed" />
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#7c3aed">{contractDocsCount}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Agreements, variations & IPCs</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
              HR & Personnel
            </Text>
            <Users size={18} color="#059669" />
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#059669">{employeeDocsCount}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Identity, CVs & contracts</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">
              Under Review
            </Text>
            <Clock size={18} color="#d97706" />
          </Flex>
          <Text fontSize="2xl" fontWeight="black" color="#d97706">{underReviewCount}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Pending QA/Admin check</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Filter and Search Bar */}
      <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs" mb={6}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={3} align={{ base: 'stretch', md: 'center' }} justify="space-between">
          <Box flex="1" maxW={{ md: '350px' }}>
            <Flex align="center" gap={2} bg="#f8fafc" px={3} py={1.5} borderRadius="10px" border="1px solid #e2e8f0">
              <Search size={16} color="#94a3b8" />
              <Input
                variant="subtle"
                size="sm"
                placeholder="Search title, filename, uploader, entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Box as="button" onClick={() => setSearchTerm('')} color="#94a3b8" cursor="pointer">
                  <X size={14} />
                </Box>
              )}
            </Flex>
          </Box>

          <Flex wrap="wrap" gap={2.5}>
            <Box minW="140px">
              <NativeSelect.Root size="sm">
                <NativeSelect.Field value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="Architectural">Architectural</option>
                  <option value="Structural">Structural</option>
                  <option value="Technical Drawing">Technical Drawing</option>
                  <option value="Contract">Contract</option>
                  <option value="Permit">Permit</option>
                  <option value="Compliance / Permit">Compliance</option>
                  <option value="Quality & Testing">Quality & Testing</option>
                  <option value="Safety & Environmental">Safety & Env</option>
                  <option value="Financial / Invoicing">Financial / Invoice</option>
                  <option value="HR / Identification">HR / Identification</option>
                  <option value="General">General</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>

            <Box minW="140px">
              <NativeSelect.Root size="sm">
                <NativeSelect.Field value={selectedRelatedType} onChange={(e) => setSelectedRelatedType(e.target.value)}>
                  <option value="all">All Related Modules</option>
                  <option value="Project">Projects</option>
                  <option value="Contract">Contracts</option>
                  <option value="Employee">Employees</option>
                  <option value="General">General</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>

            <Box minW="130px">
              <NativeSelect.Root size="sm">
                <NativeSelect.Field value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Flex>
        </Flex>
      </Card.Root>

      {/* Documents Table */}
      <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline">
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Document Details</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Category</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Related Entity</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Version</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Status</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Size</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold">Uploader & Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" fontWeight="bold" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredDocs.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} textAlign="center" py={10} color="#94a3b8">
                    <FolderKanban size={32} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
                    <Text fontSize="sm" fontWeight="medium">No documents match the active filter criteria.</Text>
                    <Text fontSize="xs" mt={1}>Try clearing your search query or upload a new file.</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredDocs.map((doc) => {
                  const status = doc.status || 'Approved';
                  const statusColor =
                    status === 'Approved' ? 'green' :
                    status === 'Under Review' ? 'orange' :
                    status === 'Draft' ? 'gray' : 'red';

                  return (
                    <Table.Row key={doc.id} _hover={{ bg: '#f8fafc' }}>
                      <Table.Cell>
                        <Flex align="center" gap={3}>
                          <Box
                            w="36px"
                            h="36px"
                            borderRadius="8px"
                            bg="#e0f2fe"
                            color="#0284c7"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            {doc.fileName.endsWith('.dwg') || doc.fileName.endsWith('.cad') ? (
                              <FileCode size={18} />
                            ) : doc.fileName.endsWith('.jpg') || doc.fileName.endsWith('.png') ? (
                              <FileImage size={18} />
                            ) : (
                              <FileText size={18} />
                            )}
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                              {doc.title}
                            </Text>
                            <Text fontSize="11px" fontFamily="mono" color="#64748b">
                              {doc.fileName}
                            </Text>
                            {doc.description && (
                              <Text fontSize="10px" color="#94a3b8" mt={0.5} maxW="300px" truncate>
                                {doc.description}
                              </Text>
                            )}
                          </Box>
                        </Flex>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge size="xs" colorPalette="blue" variant="subtle">
                          {doc.category}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        <Box>
                          <Badge size="xs" colorPalette="purple" variant="outline" mb={0.5}>
                            {doc.relatedType || (doc.projectId ? 'Project' : 'General')}
                          </Badge>
                          <Text fontSize="11px" color="#334155" fontWeight="medium">
                            {doc.relatedName || doc.projectName || 'Enterprise General'}
                          </Text>
                        </Box>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge size="xs" colorPalette="cyan">
                          {doc.version || 'v1.0'}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge size="xs" colorPalette={statusColor}>
                          {status}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        <Text fontSize="xs" color="#64748b" fontFamily="mono">
                          {doc.size}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Box>
                          <Text fontSize="xs" color="#0f172a" fontWeight="medium">
                            {doc.uploadedBy || 'System User'}
                          </Text>
                          <Text fontSize="10px" color="#94a3b8">
                            {doc.uploadDate}
                          </Text>
                        </Box>
                      </Table.Cell>

                      <Table.Cell textAlign="right">
                        <Flex justify="flex-end" gap={1.5}>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorPalette="blue"
                            onClick={() => setPreviewDoc(doc)}
                            title="Interactive Document Preview"
                          >
                            <Eye size={13} /> Preview
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            colorPalette="teal"
                            onClick={() => handleDownload(doc)}
                            title="Download File to Computer"
                          >
                            <Download size={13} />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorPalette="purple"
                            onClick={() => setVersioningDoc(doc)}
                            title="Upload Revision / New Version"
                          >
                            <RefreshCw size={13} />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorPalette="red"
                            onClick={() => setDeleteConfirmDoc(doc)}
                            title="Delete Document"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Card.Root>

      {/* MODAL 1: UPLOAD NEW DOCUMENT */}
      {showUploadModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="580px" w="100%" p={6} boxShadow="2xl" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Upload Enterprise Document</Heading>
              <Box as="button" onClick={() => setShowUploadModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Upload CAD drawings, PDF contracts, regulatory approvals, or HR verification dossiers.
            </Text>

            <form onSubmit={handleCreateDocument}>
              <Stack gap={3.5}>
                {/* File Drop Area */}
                <Box
                  p={4}
                  border="2px dashed #cbd5e1"
                  borderRadius="12px"
                  bg="#f8fafc"
                  textAlign="center"
                  _hover={{ borderColor: '#0284c7' }}
                  position="relative"
                >
                  <Upload size={28} color="#0284c7" style={{ margin: '0 auto 6px auto' }} />
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                    {newDocForm.fileName || 'Click to select or drag and drop a file'}
                  </Text>
                  <Text fontSize="10px" color="#94a3b8" mt={0.5}>
                    PDF, DWG, DXF, PNG, JPG, XLSX (Simulated file buffer: {newDocForm.fileSize})
                  </Text>
                  <Input
                    type="file"
                    position="absolute"
                    inset="0"
                    opacity="0"
                    cursor="pointer"
                    onChange={handleFileChange}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Document Title *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Foundation Raft Structural Reinforcement Plan"
                    value={newDocForm.title}
                    onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                    required
                  />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newDocForm.category}
                        onChange={(e) => setNewDocForm({ ...newDocForm, category: e.target.value })}
                      >
                        <option value="Architectural">Architectural</option>
                        <option value="Structural">Structural</option>
                        <option value="Technical Drawing">Technical Drawing</option>
                        <option value="Contract">Contract</option>
                        <option value="Compliance / Permit">Compliance / Permit</option>
                        <option value="Quality & Testing">Quality & Testing</option>
                        <option value="Safety & Environmental">Safety & Env</option>
                        <option value="Financial / Invoicing">Financial / Invoice</option>
                        <option value="HR / Identification">HR / Identification</option>
                        <option value="General">General</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>File Name</Text>
                    <Input
                      size="sm"
                      placeholder="dwg_pier_04_rev2.dwg"
                      value={newDocForm.fileName}
                      onChange={(e) => setNewDocForm({ ...newDocForm, fileName: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Related Module</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newDocForm.relatedType}
                        onChange={(e) => setNewDocForm({ ...newDocForm, relatedType: e.target.value as any })}
                      >
                        <option value="Project">Project Site</option>
                        <option value="Contract">Contract Administration</option>
                        <option value="Employee">Employee Personnel</option>
                        <option value="General">Enterprise General</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Linked Entity</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={newDocForm.relatedId}
                        onChange={(e) => setNewDocForm({ ...newDocForm, relatedId: Number(e.target.value) })}
                      >
                        {newDocForm.relatedType === 'Project' && projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                        {newDocForm.relatedType === 'Employee' && employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                        ))}
                        {newDocForm.relatedType === 'Contract' && contracts.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                        {newDocForm.relatedType === 'General' && (
                          <option value="1">Central Enterprise Vault</option>
                        )}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Description / Scope Notes</Text>
                  <Input
                    size="sm"
                    placeholder="Brief summary of document contents, approval authority, or revision notes..."
                    value={newDocForm.description}
                    onChange={(e) => setNewDocForm({ ...newDocForm, description: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} pt={3} borderTop="1px solid #f1f5f9">
                  <Button size="sm" variant="outline" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#0284c7" color="white" type="submit">
                    <Upload size={14} /> Commit & Catalog Document
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL 2: INTERACTIVE DOCUMENT PREVIEW */}
      {previewDoc && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.7)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="700px" w="100%" p={6} boxShadow="2xl" maxH="92vh" overflowY="auto">
            <Flex justify="space-between" align="flex-start" mb={3} borderBottom="1px solid #e2e8f0" pb={3}>
              <Box>
                <Flex align="center" gap={2}>
                  <Badge size="xs" colorPalette="blue">{previewDoc.category}</Badge>
                  <Badge size="xs" colorPalette="cyan">{previewDoc.version || 'v1.0'}</Badge>
                  <Badge size="xs" colorPalette={previewDoc.status === 'Approved' ? 'green' : 'orange'}>
                    {previewDoc.status || 'Approved'}
                  </Badge>
                </Flex>
                <Heading size="md" color="#0f172a" mt={1}>
                  {previewDoc.title}
                </Heading>
                <Text fontSize="xs" fontFamily="mono" color="#64748b">
                  {previewDoc.fileName} • {previewDoc.size}
                </Text>
              </Box>
              <Box as="button" onClick={() => setPreviewDoc(null)} color="#94a3b8" cursor="pointer">
                <X size={20} />
              </Box>
            </Flex>

            {/* Document Visual Viewer Mock */}
            <Box
              bg="#0f172a"
              color="#f8fafc"
              borderRadius="12px"
              p={6}
              mb={4}
              minH="260px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              border="1px solid #1e293b"
            >
              <Box p={4} bg="rgba(255, 255, 255, 0.08)" borderRadius="full" mb={3}>
                <FileCheck size={36} color="#38bdf8" />
              </Box>
              <Text fontSize="sm" fontWeight="bold" color="white" textAlign="center">
                {previewDoc.title}
              </Text>
              <Text fontSize="xs" color="#94a3b8" mt={1} textAlign="center">
                Certified Enterprise Document Record • Hash: SHA-256 (Verified)
              </Text>
              <Text fontSize="11px" color="#38bdf8" mt={2} fontFamily="mono">
                {previewDoc.relatedType || 'Project'}: {previewDoc.relatedName || previewDoc.projectName || 'Central Archive'}
              </Text>
              {previewDoc.description && (
                <Box mt={3} p={2.5} bg="rgba(0, 0, 0, 0.3)" borderRadius="8px" maxW="500px">
                  <Text fontSize="xs" color="#cbd5e1" textAlign="center">
                    "{previewDoc.description}"
                  </Text>
                </Box>
              )}
            </Box>

            {/* Metadata Dossier */}
            <SimpleGrid columns={2} gap={3} p={3.5} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0" mb={4}>
              <Box>
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#94a3b8">Catalog Date</Text>
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">{previewDoc.uploadDate}</Text>
              </Box>
              <Box>
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#94a3b8">Cataloged By</Text>
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">{previewDoc.uploadedBy || 'Administrator'}</Text>
              </Box>
              <Box>
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#94a3b8">Linked Module</Text>
                <Text fontSize="xs" fontWeight="bold" color="#0f172a">{previewDoc.relatedType || 'Project'}</Text>
              </Box>
              <Box>
                <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#94a3b8">Workflow Status</Text>
                <Flex align="center" gap={1.5} mt={0.5}>
                  <Button
                    size="xs"
                    colorPalette="green"
                    variant={previewDoc.status === 'Approved' ? 'solid' : 'outline'}
                    onClick={() => handleStatusChange(previewDoc.id, 'Approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    colorPalette="orange"
                    variant={previewDoc.status === 'Under Review' ? 'solid' : 'outline'}
                    onClick={() => handleStatusChange(previewDoc.id, 'Under Review')}
                  >
                    Review
                  </Button>
                  <Button
                    size="xs"
                    colorPalette="gray"
                    variant={previewDoc.status === 'Archived' ? 'solid' : 'outline'}
                    onClick={() => handleStatusChange(previewDoc.id, 'Archived')}
                  >
                    Archive
                  </Button>
                </Flex>
              </Box>
            </SimpleGrid>

            {/* Bottom Controls */}
            <Flex justify="space-between" align="center">
              <Button size="sm" variant="outline" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
              <Button size="sm" bg="#0284c7" color="white" onClick={() => handleDownload(previewDoc)}>
                <Download size={14} /> Download File ({previewDoc.size})
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* MODAL 3: VERSION REPLACEMENT / REVISION */}
      {versioningDoc && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Upload Document Revision</Heading>
              <Box as="button" onClick={() => setVersioningDoc(null)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={3}>
              Create revision for: <strong>{versioningDoc.title}</strong> (Current: {versioningDoc.version || 'v1.0'})
            </Text>

            <form onSubmit={handleReplaceVersion}>
              <Stack gap={3}>
                <Box
                  p={4}
                  border="2px dashed #cbd5e1"
                  borderRadius="12px"
                  bg="#f8fafc"
                  textAlign="center"
                  position="relative"
                >
                  <RefreshCw size={24} color="#7c3aed" style={{ margin: '0 auto 6px auto' }} />
                  <Text fontSize="xs" fontWeight="bold" color="#0f172a">
                    {versionForm.fileName || 'Select revised file version'}
                  </Text>
                  <Text fontSize="10px" color="#94a3b8">
                    Will increment to {((parseFloat((versioningDoc.version || 'v1.0').replace('v', '')) || 1.0) + 0.1).toFixed(1)}
                  </Text>
                  <Input
                    type="file"
                    position="absolute"
                    inset="0"
                    opacity="0"
                    cursor="pointer"
                    onChange={handleVersionFileChange}
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Revision Notes / Change Log *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Revised reinforcing bar diameter from 16mm to 20mm per consultant RFI #12"
                    value={versionForm.revisionNotes}
                    onChange={(e) => setVersionForm({ ...versionForm, revisionNotes: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setVersioningDoc(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#7c3aed" color="white" type="submit">
                    Publish New Revision
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteConfirmDoc && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="450px" w="100%" p={6} boxShadow="2xl">
            <Flex align="center" gap={3} mb={3}>
              <Box p={2.5} bg="#fee2e2" color="#dc2626" borderRadius="10px">
                <AlertCircle size={22} />
              </Box>
              <Box>
                <Heading size="sm" color="#0f172a">Confirm Document Deletion</Heading>
                <Text fontSize="xs" color="#64748b">This action will remove the record from the catalog.</Text>
              </Box>
            </Flex>

            <Box p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" mb={4}>
              <Text fontSize="xs" fontWeight="bold" color="#0f172a">{deleteConfirmDoc.title}</Text>
              <Text fontSize="11px" fontFamily="mono" color="#64748b">{deleteConfirmDoc.fileName} • {deleteConfirmDoc.size}</Text>
            </Box>

            <Flex justify="flex-end" gap={2}>
              <Button size="sm" variant="outline" onClick={() => setDeleteConfirmDoc(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                bg="#dc2626"
                color="white"
                onClick={() => {
                  deleteDocument(deleteConfirmDoc.id);
                  setDeleteConfirmDoc(null);
                }}
              >
                Permanently Delete
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};
