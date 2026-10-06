import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Stack,
  NativeSelect,
  SimpleGrid
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { Employee, UserRole } from '../../../types';
import { X, CheckCircle2, UserPlus, Save } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit
}) => {
  const { addEmployee, updateEmployee, departments, employeeCustomFields } = useERP();

  const [formData, setFormData] = useState({
    code: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Civil Engineering & Construction',
    position: 'Field Works Engineer',
    designation: 'Site Supervision Engineer',
    role: 'Site Engineer' as UserRole,
    salary: 5500,
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active' as Employee['status'],
    nin: '',
    tin: '',
    bankName: 'First Commercial Bank',
    accountName: '',
    accountNumber: '',
    pfa: 'Apex Pension Trust',
    emergencyContactName: '',
    emergencyContactPhone: '',
    qualificationsStr: 'B.Sc Civil Engineering',
    certificationsStr: 'NSE, COREN Registered',
    customFieldValues: {} as Record<string, string>
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        code: employeeToEdit.code,
        firstName: employeeToEdit.firstName || employeeToEdit.name.split(' ')[0] || '',
        lastName: employeeToEdit.lastName || employeeToEdit.name.split(' ').slice(1).join(' ') || '',
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        department: employeeToEdit.department,
        position: employeeToEdit.position,
        designation: employeeToEdit.designation || '',
        role: employeeToEdit.role,
        salary: employeeToEdit.salary,
        hireDate: employeeToEdit.hireDate,
        status: employeeToEdit.status,
        nin: employeeToEdit.nin || '',
        tin: employeeToEdit.tin || '',
        bankName: employeeToEdit.bankName || 'First Commercial Bank',
        accountName: employeeToEdit.accountName || employeeToEdit.name,
        accountNumber: employeeToEdit.accountNumber || '',
        pfa: employeeToEdit.pfa || 'Apex Pension Trust',
        emergencyContactName: employeeToEdit.emergencyContactName || '',
        emergencyContactPhone: employeeToEdit.emergencyContactPhone || '',
        qualificationsStr: (employeeToEdit.qualifications || []).join(', '),
        certificationsStr: (employeeToEdit.certifications || []).join(', '),
        customFieldValues: employeeToEdit.customFieldValues || {}
      });
    } else {
      setFormData({
        code: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: departments[0]?.name || 'Civil Engineering & Construction',
        position: '',
        designation: '',
        role: 'Site Engineer',
        salary: 4500,
        hireDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        nin: '',
        tin: '',
        bankName: 'First Commercial Bank',
        accountName: '',
        accountNumber: '',
        pfa: 'Apex Pension Trust',
        emergencyContactName: '',
        emergencyContactPhone: '',
        qualificationsStr: '',
        certificationsStr: '',
        customFieldValues: {}
      });
    }
    setFormError('');
  }, [employeeToEdit, departments, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('First Name and Last Name are required.');
      return;
    }
    if (!formData.email.trim() || !formData.phone.trim()) {
      setFormError('Email and Phone number are required.');
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const qualifications = formData.qualificationsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const certifications = formData.certificationsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: fullName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        position: formData.position.trim() || 'Staff Officer',
        designation: formData.designation.trim() || formData.position.trim(),
        role: formData.role,
        salary: Number(formData.salary) || 0,
        hireDate: formData.hireDate,
        status: formData.status,
        nin: formData.nin.trim(),
        tin: formData.tin.trim(),
        bankName: formData.bankName.trim(),
        accountName: formData.accountName.trim() || fullName,
        accountNumber: formData.accountNumber.trim(),
        pfa: formData.pfa.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        qualifications,
        certifications,
        customFieldValues: formData.customFieldValues
      });
    } else {
      addEmployee({
        code: formData.code.trim() || undefined,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: fullName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        position: formData.position.trim() || 'Staff Member',
        designation: formData.designation.trim() || formData.position.trim(),
        role: formData.role,
        salary: Number(formData.salary) || 0,
        hireDate: formData.hireDate,
        status: formData.status,
        nin: formData.nin.trim(),
        tin: formData.tin.trim(),
        bankName: formData.bankName.trim(),
        accountName: formData.accountName.trim() || fullName,
        accountNumber: formData.accountNumber.trim(),
        pfa: formData.pfa.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        qualifications,
        certifications,
        customFieldValues: formData.customFieldValues
      });
    }

    onClose();
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(15, 23, 42, 0.65)"
      backdropFilter="blur(4px)"
      zIndex={1300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="16px"
        maxW="850px"
        w="100%"
        maxH="90vh"
        display="flex"
        flexDirection="column"
        boxShadow="2xl"
        border="1px solid #e2e8f0"
        overflow="hidden"
      >
        {/* Modal Header */}
        <Flex
          px={6}
          py={4}
          borderBottom="1px solid #e2e8f0"
          justify="space-between"
          align="center"
          bg="#f8fafc"
        >
          <Box>
            <Heading size="md" color="#0f172a">
              {employeeToEdit ? `Edit Staff Record — ${employeeToEdit.name}` : 'Register New Employee'}
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Original ERP HR personnel specifications, statutory credentials, and banking setup.
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </Button>
        </Flex>

        {/* Modal Body */}
        <Box p={6} overflowY="auto" flex="1">
          {formError && (
            <Box p={3} mb={4} bg="#fef2f2" border="1px solid #fecaca" borderRadius="8px" color="#991b1b" fontSize="xs" fontWeight="semibold">
              {formError}
            </Box>
          )}

          <form id="employee-form" onSubmit={handleSubmit}>
            <Stack gap={5}>
              {/* Section 1: Basic Identity */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>
                  1. Identity & Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>First Name *</Text>
                    <Input
                      size="sm"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. John"
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Last Name *</Text>
                    <Input
                      size="sm"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Adebayo"
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Employee Code (Optional)</Text>
                    <Input
                      size="sm"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Auto if blank (EMP-xxx)"
                      disabled={!!employeeToEdit}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Official Email *</Text>
                    <Input
                      size="sm"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. j.adebayo@company.com"
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Phone Number *</Text>
                    <Input
                      size="sm"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +234 802 345 6789"
                      required
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Employment Status</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Archived">Archived</option>
                        <option value="Terminated">Terminated</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Section 2: Department & Employment Role */}
              <Box pt={3} borderTop="1px solid #f1f5f9">
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>
                  2. Department, Role & Compensation
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Department *</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Job Position *</Text>
                    <Input
                      size="sm"
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g. Senior Structural Engineer"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Designation</Text>
                    <Input
                      size="sm"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Lead Project Supervisor"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>ERP System Role</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                      >
                        <option value="Managing Director">Managing Director</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Site Engineer">Site Engineer</option>
                        <option value="Quantity Surveyor">Quantity Surveyor</option>
                        <option value="Procurement Officer">Procurement Officer</option>
                        <option value="Storekeeper">Storekeeper</option>
                        <option value="Finance Manager">Finance Manager</option>
                        <option value="Accountant">Accountant</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Staff">Staff</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Basic Monthly Salary *</Text>
                    <Input
                      size="sm"
                      type="number"
                      value={formData.salary}
                      onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                      placeholder="e.g. 5000"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Hire Date *</Text>
                    <Input
                      size="sm"
                      type="date"
                      value={formData.hireDate}
                      onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Section 3: Statutory & Banking Details */}
              <Box pt={3} borderTop="1px solid #f1f5f9">
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>
                  3. Statutory Tax, Identification & Banking
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>National ID Number (NIN)</Text>
                    <Input
                      size="sm"
                      value={formData.nin}
                      onChange={e => setFormData({ ...formData, nin: e.target.value })}
                      placeholder="e.g. 10293847561"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Tax ID Number (TIN)</Text>
                    <Input
                      size="sm"
                      value={formData.tin}
                      onChange={e => setFormData({ ...formData, tin: e.target.value })}
                      placeholder="e.g. TIN-99281920"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Pension PFA Provider</Text>
                    <Input
                      size="sm"
                      value={formData.pfa}
                      onChange={e => setFormData({ ...formData, pfa: e.target.value })}
                      placeholder="e.g. Apex Pension Trust"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Commercial Bank Name</Text>
                    <Input
                      size="sm"
                      value={formData.bankName}
                      onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. First Commercial Bank"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Bank Account Number</Text>
                    <Input
                      size="sm"
                      value={formData.accountNumber}
                      onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="e.g. 0123456789"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Account Beneficiary Name</Text>
                    <Input
                      size="sm"
                      value={formData.accountName}
                      onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                      placeholder="As registered with bank"
                    />
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Section 4: Emergency Contacts & Qualifications */}
              <Box pt={3} borderTop="1px solid #f1f5f9">
                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>
                  4. Emergency Contact & Qualifications
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Emergency Contact Name</Text>
                    <Input
                      size="sm"
                      value={formData.emergencyContactName}
                      onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. Mary Adebayo (Spouse)"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Emergency Contact Phone</Text>
                    <Input
                      size="sm"
                      value={formData.emergencyContactPhone}
                      onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="e.g. +234 803 111 2222"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Academic Qualifications (comma separated)</Text>
                    <Input
                      size="sm"
                      value={formData.qualificationsStr}
                      onChange={e => setFormData({ ...formData, qualificationsStr: e.target.value })}
                      placeholder="e.g. B.Sc Civil Engineering, M.Sc Geotechnical"
                    />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>Professional Certifications (comma separated)</Text>
                    <Input
                      size="sm"
                      value={formData.certificationsStr}
                      onChange={e => setFormData({ ...formData, certificationsStr: e.target.value })}
                      placeholder="e.g. COREN, PMP, OSHA Site Safety"
                    />
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Section 5: Custom Fields (from employee_custom_fields) */}
              {employeeCustomFields.length > 0 && (
                <Box pt={3} borderTop="1px solid #f1f5f9">
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#2563eb" mb={2}>
                    5. Extended Custom Attributes
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    {employeeCustomFields.map(f => (
                      <Box key={f.id}>
                        <Text fontSize="xs" fontWeight="semibold" color="#334155" mb={1}>{f.fieldLabel || f.fieldName}</Text>
                        <Input
                          size="sm"
                          type={f.fieldType === 'number' ? 'number' : f.fieldType === 'date' ? 'date' : 'text'}
                          value={formData.customFieldValues[f.fieldName] || ''}
                          onChange={e => setFormData({
                            ...formData,
                            customFieldValues: {
                              ...formData.customFieldValues,
                              [f.fieldName]: e.target.value
                            }
                          })}
                          placeholder={`Enter ${f.fieldLabel || f.fieldName}`}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </Stack>
          </form>
        </Box>

        {/* Modal Footer */}
        <Flex
          px={6}
          py={3}
          borderTop="1px solid #e2e8f0"
          justify="flex-end"
          gap={3}
          bg="#f8fafc"
        >
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            colorPalette="blue"
            type="submit"
            form="employee-form"
            fontWeight="bold"
          >
            {employeeToEdit ? <Save size={14} /> : <UserPlus size={14} />}
            {employeeToEdit ? 'Save Employee Changes' : 'Confirm Registration'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
