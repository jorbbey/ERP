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
  Stack,
  NativeSelect
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Project, ProjectInvoice } from '../../../types';
import { Plus, DollarSign, FileCheck, CheckCircle2, AlertCircle, Clock, Receipt } from 'lucide-react';

interface FinancialsTabProps {
  project: Project;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ project }) => {
  const { projectInvoices, addProjectInvoice, updateProjectInvoice, activeCompany } = useERP();

  const currentInvoices = projectInvoices.filter(i => i.projectId === project.id);
  const totalBilled = currentInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = currentInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const outstandingAmount = totalBilled - totalPaid;
  const billingCoveragePercent = project.contractValue > 0 ? Math.round((totalBilled / project.contractValue) * 100) : 0;

  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    invoiceNumber: `IPC-2026-0${currentInvoices.length + 1}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    totalAmount: 180000,
    paidAmount: 0,
    status: 'sent' as ProjectInvoice['status'],
    description: 'Interim Payment Certificate (IPC) for verified site work milestone'
  });

  const handleOpenAdd = () => {
    setForm({
      invoiceNumber: `IPC-2026-0${currentInvoices.length + 1}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      totalAmount: 180000,
      paidAmount: 0,
      status: 'sent',
      description: 'Interim Payment Certificate (IPC) for verified site work milestone'
    });
    setFeedback(null);
    setShowAddModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.invoiceNumber.trim()) {
      setFeedback('Certificate / Invoice number is required.');
      return;
    }
    const total = Number(form.totalAmount);
    const paid = Number(form.paidAmount);
    if (total <= 0) {
      setFeedback('Invoice amount must be greater than zero.');
      return;
    }
    if (paid < 0 || paid > total) {
      setFeedback('Paid amount must be between 0 and total amount.');
      return;
    }

    addProjectInvoice({
      projectId: project.id,
      invoiceNumber: form.invoiceNumber.trim(),
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      totalAmount: total,
      paidAmount: paid,
      status: form.status,
      description: form.description.trim()
    });

    setShowAddModal(false);
  };

  const handleMarkPaid = (inv: ProjectInvoice) => {
    updateProjectInvoice(inv.id, {
      paidAmount: inv.totalAmount,
      status: 'paid'
    });
  };

  return (
    <Stack gap={6}>
      {/* Financial Statement Overview (vw_project_financials replication) */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap={4}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Agreed Contract Sum
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#0f172a" mt={1}>
            {activeCompany.currency} {project.contractValue.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#64748b" mt={1}>
            Baseline lump sum value
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Total Allocated Budget
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#2563eb" mt={1}>
            {activeCompany.currency} {project.budget.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#64748b" mt={1}>
            Operating expense cap
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Total Invoiced / Billed
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#7c3aed" mt={1}>
            {activeCompany.currency} {totalBilled.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#7c3aed" fontWeight="medium" mt={1}>
            {billingCoveragePercent}% of Contract Billed
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Total Received / Paid
          </Text>
          <Text fontSize="xl" fontWeight="black" color="#16a34a" mt={1}>
            {activeCompany.currency} {totalPaid.toLocaleString()}
          </Text>
          <Text fontSize="11px" color="#16a34a" fontWeight="medium" mt={1}>
            Certified client collections
          </Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#64748b">
            Outstanding Receivable
          </Text>
          <Text fontSize="xl" fontWeight="black" color={outstandingAmount > 0 ? '#d97706' : '#16a34a'} mt={1}>
            {activeCompany.currency} {outstandingAmount.toLocaleString()}
          </Text>
          <Text fontSize="11px" color={outstandingAmount > 0 ? '#d97706' : '#16a34a'} fontWeight="bold" mt={1}>
            {outstandingAmount > 0 ? 'Pending Settlement' : 'Settled in Full'}
          </Text>
        </Card.Root>
      </SimpleGrid>

      {/* Interim Payment Certificates (IPCs) & Invoices Table */}
      <Card.Root bg="white" borderRadius="14px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <Heading size="sm" color="#0f172a">Interim Payment Certificates (IPCs) & Billing Schedule</Heading>
            <Text fontSize="xs" color="#64748b">
              Formal payment applications certified by consulting engineers and submitted for client disbursement.
            </Text>
          </Box>
          <Button size="sm" bg="#2563eb" color="white" onClick={handleOpenAdd}>
            <Plus size={15} /> Issue New Payment Certificate / IPC
          </Button>
        </Flex>

        {currentInvoices.length === 0 ? (
          <Box py={8} textAlign="center" color="#94a3b8" fontSize="xs">
            No interim payment certificates or invoices recorded yet for this project.
          </Box>
        ) : (
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Certificate / Invoice #</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Issue Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Due Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Scope / Milestone Description</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Certified Amount</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Disbursed / Paid</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569" textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentInvoices.map((inv) => (
                <Table.Row key={inv.id}>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a">
                    {inv.invoiceNumber}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">
                    {inv.invoiceDate}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">
                    {inv.dueDate}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" maxW="280px">
                    {inv.description || 'Milestone payment'}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" color="#0f172a" textAlign="right">
                    {activeCompany.currency} {inv.totalAmount.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#16a34a" fontWeight="bold" textAlign="right">
                    {activeCompany.currency} {inv.paidAmount.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      size="xs"
                      colorPalette={
                        inv.status === 'paid' ? 'green' :
                        inv.status === 'sent' ? 'blue' :
                        inv.status === 'overdue' ? 'red' : 'gray'
                      }
                    >
                      {inv.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {inv.status !== 'paid' && (
                      <Button
                        size="xs"
                        colorPalette="green"
                        variant="subtle"
                        onClick={() => handleMarkPaid(inv)}
                        title="Record full payment receipt"
                      >
                        <CheckCircle2 size={12} /> Mark Disbursed
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}

        {/* Footer Total */}
        <Flex justify="space-between" align="center" p={3.5} mt={3} bg="#f8fafc" borderRadius="10px" border="1px solid #edf2f7">
          <Text fontSize="xs" fontWeight="bold" color="#64748b">
            TOTAL CERTIFIED IPC BILLINGS ({currentInvoices.length} Certificates)
          </Text>
          <Text fontSize="base" fontWeight="black" color="#2563eb">
            {activeCompany.currency} {totalBilled.toLocaleString()}
          </Text>
        </Flex>
      </Card.Root>

      {/* Modal: Issue Payment Certificate */}
      {showAddModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="550px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>Issue Interim Payment Certificate (IPC)</Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>Generate client billing certificate against certified progress of works.</Text>

            {feedback && (
              <Box p={3} mb={3} borderRadius="8px" bg="#fef2f2" border="1px solid #fecaca" fontSize="xs" color="#b91c1c">
                {feedback}
              </Box>
            )}

            <form onSubmit={handleSaveAdd}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Certificate / Invoice No *</Text>
                    <Input
                      size="sm"
                      value={form.invoiceNumber}
                      onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      >
                        <option value="sent">Sent / Submitted</option>
                        <option value="draft">Draft</option>
                        <option value="paid">Paid / Settled</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Issue Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={form.invoiceDate}
                      onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Payment Due Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      required
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Certified Billing Sum ({activeCompany.currency}) *</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={1}
                      value={form.totalAmount}
                      onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })}
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Initial Disbursed / Paid ({activeCompany.currency})</Text>
                    <Input
                      size="sm"
                      type="number"
                      min={0}
                      value={form.paidAmount}
                      onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Milestone Scope / Description *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. IPC #2: Raft foundation casting, waterproofing, and basement columns"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="#2563eb" color="white" type="submit">
                    Issue Payment Certificate
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
