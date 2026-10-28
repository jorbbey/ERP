import React, { useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Table,
  Input,
  Stack,
  Card,
  SimpleGrid
} from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Filter,
  RefreshCw,
  X
} from 'lucide-react';

export interface TemplateColumn {
  key: string;
  label: string;
  required: boolean;
  type?: 'string' | 'number' | 'email' | 'enum' | 'date';
  description: string;
  example: string | number;
  validValues?: string[];
}

export interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle: string;
  moduleKey: 'inventory' | 'employees' | 'suppliers' | 'projects';
  templateColumns: TemplateColumn[];
  sampleData: Record<string, any>[];
  existingRecords?: any[];
  duplicateKeyField?: string;
  guidanceNotes?: string[];
  onCommitImport: (validRecords: any[]) => { successCount: number; failedCount: number; errors?: string[] };
}

interface ParsedRow {
  rowNumber: number;
  data: Record<string, any>;
  errors: string[];
  warnings: string[];
  isValid: boolean;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  moduleTitle,
  moduleKey,
  templateColumns,
  sampleData,
  existingRecords = [],
  duplicateKeyField,
  guidanceNotes = [],
  onCommitImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'summary'>('upload');
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [filterView, setFilterView] = useState<'all' | 'valid' | 'errors'>('all');
  const [importResult, setImportResult] = useState<{ successCount: number; failedCount: number; errors?: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Download Template Handler
  const handleDownloadTemplate = () => {
    // Worksheet 1: Template with Headers and Sample Rows
    const headers = templateColumns.map(c => c.label);
    const rows = sampleData.map(sample => {
      const row: Record<string, any> = {};
      templateColumns.forEach(c => {
        row[c.label] = sample[c.key] !== undefined ? sample[c.key] : c.example;
      });
      return row;
    });

    const ws1 = XLSX.utils.json_to_sheet(rows, { header: headers });
    
    // Set column widths
    ws1['!cols'] = templateColumns.map(c => ({ wch: Math.max(c.label.length + 4, 16) }));

    // Worksheet 2: Guidance & Instructions
    const instructionsData = templateColumns.map(c => ({
      'Field Name': c.label,
      'Internal Key': c.key,
      'Required': c.required ? 'YES (Mandatory)' : 'No (Optional)',
      'Data Type': c.type || 'Text',
      'Description': c.description,
      'Valid Options / Format': c.validValues ? c.validValues.join(', ') : 'Free text / value',
      'Example': String(c.example)
    }));
    const ws2 = XLSX.utils.json_to_sheet(instructionsData);
    ws2['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 36 }, { wch: 32 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, `${moduleTitle.slice(0, 20)} Data`);
    XLSX.utils.book_append_sheet(wb, ws2, 'Field Instructions');

    XLSX.writeFile(wb, `${moduleKey}_import_template.xlsx`);
  };

  // 1b. Download CSV Template Handler
  const handleDownloadCsvTemplate = () => {
    const headers = templateColumns.map(c => `"${c.label.replace(/"/g, '""')}"`);
    const rows = sampleData.map(sample => {
      return templateColumns.map(c => {
        const val = sample[c.key] !== undefined ? sample[c.key] : c.example;
        const strVal = String(val ?? '');
        return `"${strVal.replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${moduleKey}_import_template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 2. Parse Uploaded File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
        setUploadError(null);
        if (rawJson.length === 0) {
          setUploadError('The uploaded spreadsheet contains no data rows.');
          setIsProcessing(false);
          return;
        }

        // Map column labels/keys to internal keys
        const labelToColMap = new Map<string, TemplateColumn>();
        templateColumns.forEach(c => {
          labelToColMap.set(c.label.toLowerCase().trim(), c);
          labelToColMap.set(c.key.toLowerCase().trim(), c);
          labelToColMap.set(c.label.toLowerCase().replace(/[^a-z0-9]/g, ''), c);
          labelToColMap.set(c.key.toLowerCase().replace(/[^a-z0-9]/g, ''), c);
        });

        // Set of existing keys for duplicate detection
        const existingKeySet = new Set<string>();
        if (duplicateKeyField && existingRecords.length > 0) {
          existingRecords.forEach(r => {
            const val = r[duplicateKeyField];
            if (val) existingKeySet.add(String(val).toLowerCase().trim());
          });
        }

        const seenKeysInSheet = new Set<string>();

        const processed: ParsedRow[] = rawJson.map((rawRow, idx) => {
          const rowData: Record<string, any> = {};
          const errors: string[] = [];
          const warnings: string[] = [];

          // Map values
          Object.keys(rawRow).forEach(rawKey => {
            const cleanKey = rawKey.toLowerCase().trim();
            const col = labelToColMap.get(cleanKey) || labelToColMap.get(cleanKey.replace(/[^a-z0-9]/g, ''));
            if (col) {
              rowData[col.key] = rawRow[rawKey];
            }
          });

          // Validation
          templateColumns.forEach(col => {
            let val = rowData[col.key];

            // Required check
            if (col.required && (val === undefined || val === null || String(val).trim() === '')) {
              errors.push(`Missing required field: "${col.label}"`);
            }

            // Numeric check
            if (col.type === 'number' && val !== undefined && val !== null && String(val).trim() !== '') {
              const cleaned = String(val).replace(/[^0-9.-]/g, '');
              const num = parseFloat(cleaned);
              if (isNaN(num)) {
                errors.push(`"${col.label}" must be a valid number`);
              } else {
                rowData[col.key] = num;
              }
            }

            // Email check
            if (col.type === 'email' && val && String(val).trim() !== '') {
              const emailStr = String(val).trim();
              if (!emailStr.includes('@') || !emailStr.includes('.')) {
                warnings.push(`"${col.label}" may be an invalid email address`);
              }
            }

            // Enum check
            if (col.type === 'enum' && col.validValues && val && String(val).trim() !== '') {
              const valStr = String(val).trim();
              const match = col.validValues.find(v => v.toLowerCase() === valStr.toLowerCase());
              if (!match) {
                warnings.push(`"${col.label}" has non-standard value (${valStr}). Acceptable: ${col.validValues.slice(0, 3).join(', ')}...`);
              } else {
                rowData[col.key] = match; // Normalize casing
              }
            }
          });

          // Duplicate key check
          if (duplicateKeyField && rowData[duplicateKeyField]) {
            const keyVal = String(rowData[duplicateKeyField]).toLowerCase().trim();
            if (existingKeySet.has(keyVal)) {
              errors.push(`Duplicate record: ${keyVal} already exists in database`);
            } else if (seenKeysInSheet.has(keyVal)) {
              errors.push(`Duplicate record within spreadsheet: ${keyVal}`);
            } else {
              seenKeysInSheet.add(keyVal);
            }
          }

          return {
            rowNumber: idx + 2, // Excel 1-indexed header is row 1
            data: rowData,
            errors,
            warnings,
            isValid: errors.length === 0
          };
        });

        setParsedRows(processed);
        setStep('preview');
      } catch (err: any) {
        setUploadError('Failed to parse spreadsheet: ' + (err?.message || 'Invalid file structure'));
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 3. Commit Import
  const handleCommit = () => {
    const validRows = parsedRows.filter(r => r.isValid).map(r => r.data);
    if (validRows.length === 0) {
      setUploadError('There are no valid rows to import. Please review row-level errors.');
      return;
    }

    const result = onCommitImport(validRows);
    setImportResult(result);
    setStep('summary');
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.filter(r => !r.isValid).length;

  const displayedRows = parsedRows.filter(r => {
    if (filterView === 'valid') return r.isValid;
    if (filterView === 'errors') return !r.isValid;
    return true;
  });

  return (
    <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.65)" zIndex="1100" display="flex" alignItems="center" justifyContent="center" p={{ base: 2, sm: 4 }} backdropFilter="blur(2px)">
      <Box bg="white" borderRadius="18px" maxW="960px" w="100%" p={{ base: 4, sm: 6 }} boxShadow="2xl" maxH="90vh" display="flex" flexDirection="column">
        {/* Header */}
        <Flex justify="space-between" align="center" pb={3} mb={4} borderBottom="1px solid #e2e8f0">
          <Flex align="center" gap={3}>
            <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
              <FileSpreadsheet size={22} />
            </Box>
            <Box>
              <Heading size="md" color="#0f172a">Excel Data Import — {moduleTitle}</Heading>
              <Text fontSize="xs" color="#64748b">
                Structured bulk data import with field validation & duplicate protection
              </Text>
            </Box>
          </Flex>
          <Button size="xs" variant="ghost" onClick={onClose}>
            <X size={16} />
          </Button>
        </Flex>

        {/* Workflow Steps Indicator */}
        <Flex gap={2} mb={4} p={1.5} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0">
          <Button
            size="xs"
            variant="plain"
            bg={step === 'upload' ? 'white' : 'transparent'}
            color={step === 'upload' ? '#2563eb' : '#64748b'}
            fontWeight={step === 'upload' ? 'bold' : 'medium'}
            boxShadow={step === 'upload' ? 'xs' : 'none'}
            onClick={() => setStep('upload')}
          >
            1. Template & Upload
          </Button>
          <Button
            size="xs"
            variant="plain"
            bg={step === 'preview' ? 'white' : 'transparent'}
            color={step === 'preview' ? '#2563eb' : '#64748b'}
            fontWeight={step === 'preview' ? 'bold' : 'medium'}
            boxShadow={step === 'preview' ? 'xs' : 'none'}
            disabled={parsedRows.length === 0}
            onClick={() => setStep('preview')}
          >
            2. Validate & Preview ({parsedRows.length} rows)
          </Button>
          <Button
            size="xs"
            variant="plain"
            bg={step === 'summary' ? 'white' : 'transparent'}
            color={step === 'summary' ? '#2563eb' : '#64748b'}
            fontWeight={step === 'summary' ? 'bold' : 'medium'}
            boxShadow={step === 'summary' ? 'xs' : 'none'}
            disabled={!importResult}
          >
            3. Import Summary
          </Button>
        </Flex>

        {uploadError && (
          <Box p={3} mb={3} bg="#fef2f2" borderRadius="8px" border="1px solid #fecaca" color="#dc2626" fontSize="xs" display="flex" justifyContent="space-between" alignItems="center">
            <Text>{uploadError}</Text>
            <Button size="xs" variant="ghost" color="#dc2626" onClick={() => setUploadError(null)}>Dismiss</Button>
          </Box>
        )}

        {/* STEP 1: Upload & Template */}
        {step === 'upload' && (
          <Box flex="1" overflowY="auto" pr={1}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={5}>
              {/* Left: Download Template */}
              <Box p={5} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                <Flex align="center" gap={2} mb={2}>
                  <Download size={18} color="#2563eb" />
                  <Heading size="xs" color="#0f172a">Step 1: Download Standard Template</Heading>
                </Flex>
                <Text fontSize="xs" color="#64748b" mb={3}>
                  Download the official template with standardized column headers and sample data rows.
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
                  <Button size="sm" bg="#2563eb" color="white" _hover={{ bg: '#1d4ed8' }} onClick={handleDownloadTemplate}>
                    <Download size={14} /> Excel (.xlsx)
                  </Button>
                  <Button size="sm" variant="outline" borderColor="#2563eb" color="#2563eb" _hover={{ bg: '#eff6ff' }} onClick={handleDownloadCsvTemplate}>
                    <Download size={14} /> CSV (.csv)
                  </Button>
                </SimpleGrid>
                <Box mt={3} fontSize="11px" color="#64748b">
                  Includes <strong>{templateColumns.length} standardized columns</strong> and format guidance.
                </Box>
              </Box>

              {/* Right: Upload File */}
              <Box p={5} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0">
                <Flex align="center" gap={2} mb={2}>
                  <Upload size={18} color="#16a34a" />
                  <Heading size="xs" color="#0f172a">Step 2: Upload Populated Spreadsheet</Heading>
                </Flex>
                <Text fontSize="xs" color="#64748b" mb={4}>
                  Select your completed spreadsheet (.xlsx, .xls, or .csv). The system will automatically validate row by row.
                </Text>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="#2563eb"
                  color="#2563eb"
                  _hover={{ bg: '#eff6ff' }}
                  onClick={() => fileInputRef.current?.click()}
                  w="100%"
                  disabled={isProcessing}
                >
                  <Upload size={15} /> {isProcessing ? 'Validating...' : 'Select File to Upload'}
                </Button>
                {fileName && (
                  <Text fontSize="11px" color="#16a34a" mt={2} fontWeight="medium">
                    Selected: {fileName}
                  </Text>
                )}
              </Box>
            </SimpleGrid>

            {/* Business Rules & Guidance */}
            <Box p={4} bg="#fefce8" borderRadius="10px" border="1px solid #fef08a" mb={4}>
              <Flex align="flex-start" gap={2.5}>
                <HelpCircle size={18} color="#ca8a04" style={{ marginTop: '2px', flexShrink: 0 }} />
                <Box fontSize="xs">
                  <Text fontWeight="bold" color="#854d0e" mb={1}>Business Rules & Data Integrity Requirements:</Text>
                  <Stack gap={1} color="#713f12">
                    {moduleKey === 'inventory' && (
                      <>
                        <Text>• <strong>Master Catalog Only:</strong> Importing material records creates catalog master data. It does NOT automatically inflate physical warehouse stock quantities.</Text>
                        <Text>• <strong>Opening Stock:</strong> To establish physical quantities, record a Goods Receipt (GRN) or Stock Opening balance transaction in Stores.</Text>
                      </>
                    )}
                    {moduleKey === 'employees' && (
                      <>
                        <Text>• <strong>HR Records Only:</strong> Importing employees creates personnel records. It does NOT automatically grant login credentials or system access.</Text>
                        <Text>• <strong>Access Provisioning:</strong> Login accounts must be explicitly provisioned by an administrator through the Employee Access Control panel.</Text>
                      </>
                    )}
                    {moduleKey === 'suppliers' && (
                      <>
                        <Text>• <strong>Vendor Verification:</strong> Suppliers are registered into the Procurement directory. Duplicate checks are enforced on Company Name and Supplier Code.</Text>
                      </>
                    )}
                    {guidanceNotes.map((note, idx) => (
                      <Text key={idx}>• {note}</Text>
                    ))}
                  </Stack>
                </Box>
              </Flex>
            </Box>

            {/* Expected Columns Overview */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#334155" mb={2}>Supported Template Columns:</Text>
              <Flex wrap="wrap" gap={1.5}>
                {templateColumns.map(col => (
                  <Badge
                    key={col.key}
                    size="xs"
                    colorPalette={col.required ? 'purple' : 'gray'}
                    variant={col.required ? 'solid' : 'subtle'}
                  >
                    {col.label} {col.required ? '*' : ''}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Box>
        )}

        {/* STEP 2: Preview & Validation Table */}
        {step === 'preview' && (
          <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
            {/* Validation KPI bar */}
            <Flex justify="space-between" align="center" p={3} bg="#f8fafc" borderRadius="10px" border="1px solid #e2e8f0" mb={3}>
              <Flex align="center" gap={3}>
                <Text fontSize="xs" color="#64748b">File: <strong>{fileName}</strong></Text>
                <Badge size="xs" colorPalette="green">{validCount} Ready to Import</Badge>
                {invalidCount > 0 && <Badge size="xs" colorPalette="red">{invalidCount} Errors Detected</Badge>}
              </Flex>
              <Flex align="center" gap={1.5}>
                <Text fontSize="xs" color="#64748b">Show:</Text>
                <Button size="xs" variant={filterView === 'all' ? 'solid' : 'ghost'} colorPalette="blue" onClick={() => setFilterView('all')}>
                  All ({parsedRows.length})
                </Button>
                <Button size="xs" variant={filterView === 'valid' ? 'solid' : 'ghost'} colorPalette="green" onClick={() => setFilterView('valid')}>
                  Valid ({validCount})
                </Button>
                <Button size="xs" variant={filterView === 'errors' ? 'solid' : 'ghost'} colorPalette="red" onClick={() => setFilterView('errors')}>
                  Errors ({invalidCount})
                </Button>
              </Flex>
            </Flex>

            {/* Preview Table */}
            <Box flex="1" overflowX="auto" overflowY="auto" border="1px solid #e2e8f0" borderRadius="10px">
              <Table.Root size="sm" striped minW="650px">
                <Table.Header bg="#f1f5f9" position="sticky" top="0" zIndex="2">
                  <Table.Row>
                    <Table.ColumnHeader w="50px">Row</Table.ColumnHeader>
                    <Table.ColumnHeader w="80px">Status</Table.ColumnHeader>
                    {templateColumns.slice(0, 5).map(col => (
                      <Table.ColumnHeader key={col.key}>{col.label}</Table.ColumnHeader>
                    ))}
                    <Table.ColumnHeader>Validation Notes</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {displayedRows.map((row) => (
                    <Table.Row key={row.rowNumber} bg={row.isValid ? 'transparent' : '#fef2f2'}>
                      <Table.Cell fontWeight="bold">{row.rowNumber}</Table.Cell>
                      <Table.Cell>
                        {row.isValid ? (
                          <Badge size="xs" colorPalette="green">VALID</Badge>
                        ) : (
                          <Badge size="xs" colorPalette="red">INVALID</Badge>
                        )}
                      </Table.Cell>
                      {templateColumns.slice(0, 5).map(col => (
                        <Table.Cell key={col.key} fontSize="11px">
                          {row.data[col.key] !== undefined && row.data[col.key] !== null ? String(row.data[col.key]) : '—'}
                        </Table.Cell>
                      ))}
                      <Table.Cell fontSize="10px">
                        {row.errors.length > 0 && (
                          <Stack gap={0.5} color="#b91c1c">
                            {row.errors.map((err, i) => (
                              <Flex key={i} align="center" gap={1}>
                                <XCircle size={10} /> <Text as="span">{err}</Text>
                              </Flex>
                            ))}
                          </Stack>
                        )}
                        {row.warnings.length > 0 && (
                          <Stack gap={0.5} color="#d97706" mt={0.5}>
                            {row.warnings.map((warn, i) => (
                              <Flex key={i} align="center" gap={1}>
                                <AlertCircle size={10} /> <Text as="span">{warn}</Text>
                              </Flex>
                            ))}
                          </Stack>
                        )}
                        {row.isValid && row.warnings.length === 0 && (
                          <Flex color="#16a34a" align="center" gap={1}>
                            <CheckCircle2 size={10} /> <Text as="span">Passed all validation checks</Text>
                          </Flex>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>

            {/* Bottom Actions */}
            <Flex justify="space-between" align="center" pt={4}>
              <Button size="sm" variant="outline" onClick={() => setStep('upload')}>
                ← Choose Another File
              </Button>
              <Flex gap={2}>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  bg="#2563eb"
                  color="white"
                  _hover={{ bg: '#1d4ed8' }}
                  disabled={validCount === 0}
                  onClick={handleCommit}
                >
                  Commit Import ({validCount} Valid Records)
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}

        {/* STEP 3: Summary Report */}
        {step === 'summary' && importResult && (
          <Box flex="1" overflowY="auto" textAlign="center" py={8} px={4}>
            <Box w="64px" h="64px" borderRadius="full" bg="#f0fdf4" color="#16a34a" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={4}>
              <CheckCircle2 size={36} />
            </Box>
            <Heading size="lg" color="#0f172a" mb={2}>Import Operation Completed</Heading>
            <Text fontSize="sm" color="#64748b" maxW="480px" mx="auto" mb={6}>
              The spreadsheet data has been validated and committed to the {moduleTitle} database repository.
            </Text>

            <SimpleGrid columns={2} gap={4} maxW="400px" mx="auto" mb={6}>
              <Box p={4} bg="#f0fdf4" borderRadius="12px" border="1px solid #bbf7d0">
                <Text fontSize="xs" fontWeight="bold" color="#166534">SUCCESSFULLY IMPORTED</Text>
                <Text fontSize="2xl" fontWeight="black" color="#16a34a">{importResult.successCount}</Text>
              </Box>
              <Box p={4} bg="#fef2f2" borderRadius="12px" border="1px solid #fecaca">
                <Text fontSize="xs" fontWeight="bold" color="#991b1b">REJECTED / SKIPPED</Text>
                <Text fontSize="2xl" fontWeight="black" color="#dc2626">{importResult.failedCount}</Text>
              </Box>
            </SimpleGrid>

            {importResult.errors && importResult.errors.length > 0 && (
              <Box maxW="500px" mx="auto" p={3} bg="#f8fafc" borderRadius="10px" textAlign="left" mb={6}>
                <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Rejected Row Reasons:</Text>
                <Stack gap={1} fontSize="11px" color="#64748b">
                  {importResult.errors.map((err, i) => (
                    <Text key={i}>• {err}</Text>
                  ))}
                </Stack>
              </Box>
            )}

            <Button size="md" bg="#2563eb" color="white" _hover={{ bg: '#1d4ed8' }} onClick={onClose} px={8}>
              Return to {moduleTitle}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
