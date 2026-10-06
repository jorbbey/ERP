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
import { useERP } from '../../context/ERPContext';
import { RmcMixDesign } from '../../types';
import { 
  Truck, 
  Plus, 
  FlaskConical, 
  Scale, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const RmcPage: React.FC = () => {
  const { 
    mixDesigns, 
    addMixDesign, 
    batchRecords, 
    dispatchBatchTicket, 
    qualityInspections,
    recordQualityInspection,
    projects, 
    activeCompany 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'dispatches' | 'mixDesigns' | 'qa'>('dispatches');
  const [showMixModal, setShowMixModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showQAModal, setShowQAModal] = useState(false);

  // Form states
  const [newMix, setNewMix] = useState({
    code: `MIX-M${30 + mixDesigns.length * 5}-SPEC`,
    grade: 'M30 High-Flow Concrete',
    slumpTarget: '140 ± 20 mm',
    cementKg: 380,
    waterLitres: 160,
    fineAggregateKg: 790,
    coarseAggregateKg: 1040,
    admixtureLitres: 3.5,
    target28DayStrength: '38.0 MPa'
  });

  const [newBatch, setNewBatch] = useState({
    mixDesignCode: mixDesigns[0]?.code || 'MIX-M25-PUMP',
    truckNo: 'TM-09 (MAN TGS 33.400)',
    volumeCuM: 8,
    clientProject: projects[0]?.name || 'Bridge Extension Project',
    slumpMeasured: '130 mm (Passed)'
  });

  const [newQA, setNewQA] = useState({
    batchTicketNo: batchRecords[0]?.ticketNo || 'BT-2026-904',
    inspectionDate: new Date().toISOString().split('T')[0],
    slumpMm: 135,
    cylinder7DayStrength: '31.2 MPa',
    cylinder28DayStrength: 'Pending 28d',
    passed: true,
    notes: 'No segregation; flow consistency confirmed.'
  });

  const handleCreateMix = (e: React.FormEvent) => {
    e.preventDefault();
    addMixDesign(newMix);
    setShowMixModal(false);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchBatchTicket(newBatch);
    setShowBatchModal(false);
  };

  const handleCreateQA = (e: React.FormEvent) => {
    e.preventDefault();
    recordQualityInspection(newQA);
    setShowQAModal(false);
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={4}>
          <Box>
            <Heading size="lg" color="#0f172a" fontWeight="bold">
              Ready-Mix Concrete (RMC) Operations
            </Heading>
            <Text fontSize="sm" color="#64748b" mt={1}>
              Concrete mix formulations, water-cement ratios, transit mixer fleet dispatching, and QA compression testing.
            </Text>
          </Box>

          <Flex gap={2}>
            {activeTab === 'dispatches' && (
              <Button size="sm" colorPalette="blue" onClick={() => setShowBatchModal(true)} fontWeight="semibold">
                <Plus size={16} /> Dispatch Batch Ticket
              </Button>
            )}
            {activeTab === 'mixDesigns' && (
              <Button size="sm" colorPalette="blue" onClick={() => setShowMixModal(true)} fontWeight="semibold">
                <Plus size={16} /> New Mix Formulation
              </Button>
            )}
            {activeTab === 'qa' && (
              <Button size="sm" colorPalette="blue" onClick={() => setShowQAModal(true)} fontWeight="semibold">
                <Plus size={16} /> Record QA Slump Inspection
              </Button>
            )}
          </Flex>
        </Flex>
      </Card.Root>

      {/* Tabs */}
      <Flex borderBottom="2px solid #e2e8f0" gap={6}>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeTab === 'dispatches' ? '#2563eb' : '#64748b'}
          borderBottom={activeTab === 'dispatches' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveTab('dispatches')}
        >
          Transit Mixer Fleet Dispatches ({batchRecords.length})
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeTab === 'mixDesigns' ? '#2563eb' : '#64748b'}
          borderBottom={activeTab === 'mixDesigns' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveTab('mixDesigns')}
        >
          Mix Designs & Lab Formulations ({mixDesigns.length})
        </Box>
        <Box
          as="button"
          pb={3}
          fontSize="sm"
          fontWeight="bold"
          color={activeTab === 'qa' ? '#2563eb' : '#64748b'}
          borderBottom={activeTab === 'qa' ? '2px solid #2563eb' : 'none'}
          mb="-2px"
          cursor="pointer"
          onClick={() => setActiveTab('qa')}
        >
          QA Testing & Slump Inspections ({qualityInspections.length})
        </Box>
      </Flex>

      {/* Tab: Dispatches */}
      {activeTab === 'dispatches' && (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          {batchRecords.map((batch) => (
            <Card.Root key={batch.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="center">
                <Badge size="xs" colorPalette="blue" fontFamily="mono">{batch.ticketNo}</Badge>
                <Badge colorPalette={batch.status === 'Poured' ? 'green' : 'cyan'}>
                  {batch.status}
                </Badge>
              </Flex>

              <Heading size="md" color="#0f172a" mt={2} display="flex" alignItems="center" gap={2}>
                <Truck size={18} color="#2563eb" /> {batch.truckNo}
              </Heading>

              <Text fontSize="xs" color="#64748b" mt={1}>
                Site Destination: <Text as="span" fontWeight="bold" color="#0f172a">{batch.clientProject}</Text>
              </Text>

              <SimpleGrid columns={2} gap={2} my={3} p={3} bg="#f8fafc" borderRadius="10px" fontSize="xs">
                <Box>
                  <Text color="#64748b">Mix Formulation:</Text>
                  <Text fontWeight="bold" color="#0f172a">{batch.mixDesignCode}</Text>
                </Box>
                <Box>
                  <Text color="#64748b">Batch Volume:</Text>
                  <Text fontWeight="bold" color="#2563eb" fontFamily="mono">{batch.volumeCuM} m³ Delivered</Text>
                </Box>
              </SimpleGrid>

              <Flex justify="space-between" align="center" pt={2} borderTop="1px solid #f1f5f9" fontSize="xs" color="#64748b">
                <Text>Slump Test: <Text as="span" fontWeight="bold" color="#059669">{batch.slumpMeasured}</Text></Text>
                <Text>Dispatched: {batch.batchTime}</Text>
              </Flex>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}

      {/* Tab: Mix Designs */}
      {activeTab === 'mixDesigns' && (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {mixDesigns.map((mix) => (
            <Card.Root key={mix.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
              <Badge size="xs" colorPalette="blue" fontFamily="mono">{mix.code}</Badge>
              <Heading size="md" color="#0f172a" mt={1}>{mix.grade}</Heading>
              <Text fontSize="xs" color="#64748b">Target Slump: {mix.slumpTarget}</Text>

              <Stack gap={1.5} my={3} p={3} bg="#f8fafc" borderRadius="10px" fontSize="xs">
                <Text fontWeight="bold" color="#334155" borderBottom="1px solid #e2e8f0" pb={1}>
                  Mix Ratios per 1m³:
                </Text>
                <Flex justify="space-between"><Text color="#64748b">Cement OPC 42.5:</Text><Text fontWeight="semibold">{mix.cementKg} kg</Text></Flex>
                <Flex justify="space-between"><Text color="#64748b">Water:</Text><Text fontWeight="semibold">{mix.waterLitres} L</Text></Flex>
                <Flex justify="space-between"><Text color="#64748b">Fine Sand:</Text><Text fontWeight="semibold">{mix.fineAggregateKg} kg</Text></Flex>
                <Flex justify="space-between"><Text color="#64748b">Granite 20mm:</Text><Text fontWeight="semibold">{mix.coarseAggregateKg} kg</Text></Flex>
                <Flex justify="space-between"><Text color="#64748b">Admixture:</Text><Text fontWeight="semibold">{mix.admixtureLitres} L</Text></Flex>
              </Stack>

              <Flex justify="space-between" align="center" p={2.5} bg="#ecfdf5" borderRadius="8px" fontSize="xs" fontWeight="bold" color="#065f46">
                <Text>28-Day Strength:</Text>
                <Text fontFamily="mono">{mix.target28DayStrength}</Text>
              </Flex>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}

      {/* Tab: QA Testing */}
      {activeTab === 'qa' && (
        <Card.Root bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden">
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">Batch Ticket #</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">Inspection Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold" textAlign="center">Slump Test</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">7-Day Compression</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">28-Day Target</Table.ColumnHeader>
                <Table.ColumnHeader color="#64748b" fontWeight="bold">QA Verdict</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {qualityInspections.map((q) => (
                <Table.Row key={q.id}>
                  <Table.Cell fontFamily="mono" fontWeight="bold" fontSize="xs">{q.batchTicketNo}</Table.Cell>
                  <Table.Cell fontSize="xs">{q.inspectionDate}</Table.Cell>
                  <Table.Cell textAlign="center" fontSize="xs" fontWeight="bold">{q.slumpMm} mm</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono">{q.cylinder7DayStrength}</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono">{q.cylinder28DayStrength}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={q.passed ? 'green' : 'red'} size="xs">
                      {q.passed ? 'Passed Standard' : 'Defect Non-Conformance'}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* Modal: Add Mix Formulation */}
      {showMixModal && (
        <Box 
          position="fixed" 
          inset="0" 
          zIndex="1000" 
          bg="rgba(15, 23, 42, 0.6)" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" p={6} maxW="480px" w="100%" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={4}>New Concrete Mix Formulation</Heading>
            <form onSubmit={handleCreateMix}>
              <Stack gap={3} fontSize="xs">
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Mix Code</Text>
                    <Input 
                      required 
                      size="sm" 
                      value={newMix.code} 
                      onChange={(e) => setNewMix({ ...newMix, code: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Grade Description</Text>
                    <Input 
                      required 
                      size="sm" 
                      value={newMix.grade} 
                      onChange={(e) => setNewMix({ ...newMix, grade: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Target Slump</Text>
                    <Input 
                      size="sm" 
                      value={newMix.slumpTarget} 
                      onChange={(e) => setNewMix({ ...newMix, slumpTarget: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>28-Day Strength</Text>
                    <Input 
                      size="sm" 
                      value={newMix.target28DayStrength} 
                      onChange={(e) => setNewMix({ ...newMix, target28DayStrength: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={3} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Cement (kg)</Text>
                    <Input 
                      type="number"
                      size="sm" 
                      value={newMix.cementKg} 
                      onChange={(e) => setNewMix({ ...newMix, cementKg: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Water (L)</Text>
                    <Input 
                      type="number"
                      size="sm" 
                      value={newMix.waterLitres} 
                      onChange={(e) => setNewMix({ ...newMix, waterLitres: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Admixture (L)</Text>
                    <Input 
                      type="number"
                      step="0.1"
                      size="sm" 
                      value={newMix.admixtureLitres} 
                      onChange={(e) => setNewMix({ ...newMix, admixtureLitres: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} mt={4} pt={3} borderTop="1px solid #e2e8f0">
                  <Button size="sm" variant="outline" onClick={() => setShowMixModal(false)}>Cancel</Button>
                  <Button size="sm" colorPalette="blue" type="submit">Save Formulation</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: Dispatch Batch */}
      {showBatchModal && (
        <Box 
          position="fixed" 
          inset="0" 
          zIndex="1000" 
          bg="rgba(15, 23, 42, 0.6)" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" p={6} maxW="460px" w="100%" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={4}>Dispatch Transit Mixer Truck</Heading>
            <form onSubmit={handleCreateBatch}>
              <Stack gap={3} fontSize="xs">
                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>Mix Formulation</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field 
                      aria-label="Mix Formulation"
                      value={newBatch.mixDesignCode} 
                      onChange={(e) => setNewBatch({ ...newBatch, mixDesignCode: e.target.value })}
                    >
                      {mixDesigns.map(m => (
                        <option key={m.id} value={m.code}>{m.code} - {m.grade}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Truck Registration #</Text>
                    <Input 
                      required 
                      size="sm" 
                      value={newBatch.truckNo} 
                      onChange={(e) => setNewBatch({ ...newBatch, truckNo: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Batch Volume (m³)</Text>
                    <Input 
                      type="number"
                      min="1"
                      max="12"
                      required 
                      size="sm" 
                      value={newBatch.volumeCuM} 
                      onChange={(e) => setNewBatch({ ...newBatch, volumeCuM: Number(e.target.value) })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>Site Work Destination</Text>
                  <Input 
                    required 
                    size="sm" 
                    value={newBatch.clientProject} 
                    onChange={(e) => setNewBatch({ ...newBatch, clientProject: e.target.value })}
                  />
                </Box>

                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>Measured Slump at Discharge</Text>
                  <Input 
                    size="sm" 
                    value={newBatch.slumpMeasured} 
                    onChange={(e) => setNewBatch({ ...newBatch, slumpMeasured: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={4} pt={3} borderTop="1px solid #e2e8f0">
                  <Button size="sm" variant="outline" onClick={() => setShowBatchModal(false)}>Cancel</Button>
                  <Button size="sm" colorPalette="blue" type="submit">Dispatch Truck</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* Modal: QA Slump Inspection */}
      {showQAModal && (
        <Box 
          position="fixed" 
          inset="0" 
          zIndex="1000" 
          bg="rgba(15, 23, 42, 0.6)" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          p={4}
        >
          <Box bg="white" borderRadius="16px" p={6} maxW="460px" w="100%" boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={4}>Record QA Slump Inspection</Heading>
            <form onSubmit={handleCreateQA}>
              <Stack gap={3} fontSize="xs">
                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>Batch Ticket</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field 
                      aria-label="Batch Ticket"
                      value={newQA.batchTicketNo} 
                      onChange={(e) => setNewQA({ ...newQA, batchTicketNo: e.target.value })}
                    >
                      {batchRecords.map(b => (
                        <option key={b.id} value={b.ticketNo}>{b.ticketNo} - {b.truckNo}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>Slump Cone Drop (mm)</Text>
                    <Input 
                      type="number"
                      required 
                      size="sm" 
                      value={newQA.slumpMm} 
                      onChange={(e) => setNewQA({ ...newQA, slumpMm: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="#334155" mb={1}>7-Day Strength</Text>
                    <Input 
                      size="sm" 
                      value={newQA.cylinder7DayStrength} 
                      onChange={(e) => setNewQA({ ...newQA, cylinder7DayStrength: e.target.value })}
                    />
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontWeight="semibold" color="#334155" mb={1}>QA Technician Remarks</Text>
                  <Input 
                    size="sm" 
                    value={newQA.notes} 
                    onChange={(e) => setNewQA({ ...newQA, notes: e.target.value })}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={4} pt={3} borderTop="1px solid #e2e8f0">
                  <Button size="sm" variant="outline" onClick={() => setShowQAModal(false)}>Cancel</Button>
                  <Button size="sm" colorPalette="blue" type="submit">Record QA Result</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Stack>
  );
};
