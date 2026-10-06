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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { Equipment, Vehicle, MaintenanceRecord, FuelConsumption } from '../../types';
import {
  Truck,
  Wrench,
  Fuel,
  HardHat,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const EquipmentPage: React.FC = () => {
  const {
    equipment,
    vehicles,
    maintenanceRecords,
    fuelConsumptions,
    addEquipment,
    updateEquipment,
    addVehicle,
    updateVehicle,
    addMaintenanceRecord,
    addFuelConsumption,
    projects,
    activeCompany
  } = useERP();

  const [activeTab, setActiveTab] = useState<'machinery' | 'fleet' | 'maintenance' | 'fuel'>('machinery');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [showAddFuelModal, setShowAddFuelModal] = useState(false);

  // Form States
  const [equipmentForm, setEquipmentForm] = useState({
    equipmentCode: `EQ-${Date.now().toString().slice(-4)}`,
    name: '',
    type: 'Excavator',
    status: 'available' as Equipment['status'],
    projectId: undefined as number | undefined,
    operatorName: '',
    hourlyRate: 120,
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleCode: `VH-${Date.now().toString().slice(-4)}`,
    plateNumber: '',
    model: '',
    type: 'Transit Mixer Truck',
    status: 'active' as Vehicle['status'],
    driverName: '',
    currentOdometer: 45000,
    fuelCapacityLiters: 300,
    lastServiceDate: new Date().toISOString().split('T')[0]
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    assetType: 'Equipment' as 'Equipment' | 'Vehicle',
    assetId: 1,
    maintenanceDate: new Date().toISOString().split('T')[0],
    description: '',
    cost: 850,
    performedBy: 'Apex Internal Plant Workshop',
    partsReplaced: '',
    nextServiceDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    status: 'completed' as MaintenanceRecord['status']
  });

  const [fuelForm, setFuelForm] = useState({
    vehicleId: 1,
    fuelDate: new Date().toISOString().split('T')[0],
    liters: 120,
    cost: 180,
    odometerKm: 48500,
    driverName: 'Suleiman Bello',
    fuelStation: 'Yard Bulk Diesel Tank #1'
  });

  // Handlers
  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentForm.name.trim()) return;
    const proj = projects.find(p => p.id === Number(equipmentForm.projectId));
    addEquipment({
      equipmentCode: equipmentForm.equipmentCode,
      name: equipmentForm.name,
      type: equipmentForm.type as any,
      status: equipmentForm.status,
      projectId: equipmentForm.projectId ? Number(equipmentForm.projectId) : undefined,
      projectName: proj?.name,
      operatorName: equipmentForm.operatorName,
      hourlyRate: Number(equipmentForm.hourlyRate),
      serialNumber: equipmentForm.serialNumber,
      purchaseDate: equipmentForm.purchaseDate
    });
    setShowAddEquipmentModal(false);
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.model.trim()) return;
    addVehicle({
      vehicleCode: vehicleForm.vehicleCode,
      plateNumber: vehicleForm.plateNumber,
      model: vehicleForm.model,
      type: vehicleForm.type as any,
      status: vehicleForm.status,
      driverName: vehicleForm.driverName,
      currentOdometer: Number(vehicleForm.currentOdometer),
      fuelCapacityLiters: Number(vehicleForm.fuelCapacityLiters),
      lastServiceDate: vehicleForm.lastServiceDate
    });
    setShowAddVehicleModal(false);
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    let assetName = '';
    let assetCode = '';

    if (maintenanceForm.assetType === 'Equipment') {
      const eq = equipment.find(item => item.id === Number(maintenanceForm.assetId));
      assetName = eq ? eq.name : 'Heavy Machinery';
      assetCode = eq ? eq.equipmentCode : 'EQ';
    } else {
      const v = vehicles.find(item => item.id === Number(maintenanceForm.assetId));
      assetName = v ? v.model : 'Fleet Vehicle';
      assetCode = v ? v.vehicleCode : 'VH';
    }

    addMaintenanceRecord({
      assetType: maintenanceForm.assetType,
      assetId: Number(maintenanceForm.assetId),
      assetName,
      assetCode,
      maintenanceDate: maintenanceForm.maintenanceDate,
      description: maintenanceForm.description,
      cost: Number(maintenanceForm.cost),
      performedBy: maintenanceForm.performedBy,
      partsReplaced: maintenanceForm.partsReplaced,
      nextServiceDate: maintenanceForm.nextServiceDate,
      status: maintenanceForm.status
    });
    setShowAddMaintenanceModal(false);
  };

  const handleCreateFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find(item => item.id === Number(fuelForm.vehicleId));
    addFuelConsumption({
      vehicleId: Number(fuelForm.vehicleId),
      vehicleCode: v?.vehicleCode || 'VH-01',
      plateNumber: v?.plateNumber || 'ABJ-001',
      fuelDate: fuelForm.fuelDate,
      liters: Number(fuelForm.liters),
      cost: Number(fuelForm.cost),
      odometerKm: Number(fuelForm.odometerKm),
      driverName: fuelForm.driverName,
      fuelStation: fuelForm.fuelStation
    });
    setShowAddFuelModal(false);
  };

  // Export Machinery & Fleet Ledger to CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: any[] = [];
    let fileName = '';

    if (activeTab === 'machinery') {
      fileName = 'heavy_machinery_inventory.csv';
      headers = ['Equipment Code', 'Name', 'Type', 'Status', 'Project Assigned', 'Operator', 'Hourly Rate', 'Serial Number'];
      rows = equipment.map(e => [
        e.equipmentCode,
        `"${e.name.replace(/"/g, '""')}"`,
        e.type,
        e.status,
        `"${(e.projectName || '').replace(/"/g, '""')}"`,
        e.operatorName,
        e.hourlyRate,
        e.serialNumber
      ]);
    } else if (activeTab === 'fleet') {
      fileName = 'transport_fleet_register.csv';
      headers = ['Vehicle Code', 'Plate Number', 'Model', 'Type', 'Status', 'Driver', 'Odometer (km)', 'Fuel Capacity (L)'];
      rows = vehicles.map(v => [
        v.vehicleCode,
        v.plateNumber,
        `"${v.model.replace(/"/g, '""')}"`,
        v.type,
        v.status,
        v.driverName,
        v.currentOdometer,
        v.fuelCapacityLiters
      ]);
    } else if (activeTab === 'maintenance') {
      fileName = 'maintenance_service_log.csv';
      headers = ['Asset Code', 'Asset Name', 'Type', 'Date', 'Cost', 'Vendor / Technician', 'Status', 'Next Service'];
      rows = maintenanceRecords.map(m => [
        m.assetCode,
        `"${m.assetName.replace(/"/g, '""')}"`,
        m.assetType,
        m.maintenanceDate,
        m.cost,
        `"${m.performedBy.replace(/"/g, '""')}"`,
        m.status,
        m.nextServiceDate
      ]);
    } else {
      fileName = 'bulk_fuel_logs.csv';
      headers = ['Vehicle Code', 'Plate Number', 'Date', 'Liters', 'Cost', 'Odometer', 'Driver', 'Station'];
      rows = fuelConsumptions.map(f => [
        f.vehicleCode,
        f.plateNumber,
        f.fuelDate,
        f.liters,
        f.cost,
        f.odometerKm || 0,
        f.driverName,
        `"${(f.fuelStation || '').replace(/"/g, '""')}"`
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const totalEquipmentCount = equipment.length;
  const inUseCount = equipment.filter(e => e.status === 'in_use').length;
  const totalVehiclesCount = vehicles.length;
  const activeVehiclesCount = vehicles.filter(v => v.status === 'active').length;
  const totalFuelLiters = fuelConsumptions.reduce((sum, f) => sum + f.liters, 0);

  return (
    <Box p={6}>
      {/* Top Banner */}
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={6}>
        <Flex align="center" gap={3}>
          <Box p={3} bg="#059669" color="white" borderRadius="14px" boxShadow="sm">
            <Truck size={26} />
          </Box>
          <Box>
            <Heading size="lg" color="#0f172a">
              Plant, Machinery & Transport Fleet Management
            </Heading>
            <Text fontSize="xs" color="#64748b" mt={0.5}>
              Heavy earthmoving equipment, transit concrete mixers, dump tippers, lowbeds & workshop maintenance logs.
            </Text>
          </Box>
        </Flex>

        <Flex align="center" gap={3}>
          <Button size="sm" variant="outline" borderColor="#cbd5e1" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} /> Export Register (CSV)
          </Button>
          {activeTab === 'machinery' && (
            <Button size="sm" bg="#059669" color="white" onClick={() => setShowAddEquipmentModal(true)}>
              <Plus size={16} /> Register Heavy Machinery
            </Button>
          )}
          {activeTab === 'fleet' && (
            <Button size="sm" bg="#059669" color="white" onClick={() => setShowAddVehicleModal(true)}>
              <Plus size={16} /> Register Fleet Vehicle
            </Button>
          )}
          {activeTab === 'maintenance' && (
            <Button size="sm" bg="#059669" color="white" onClick={() => setShowAddMaintenanceModal(true)}>
              <Plus size={16} /> Log Servicing / Overhaul
            </Button>
          )}
          {activeTab === 'fuel' && (
            <Button size="sm" bg="#059669" color="white" onClick={() => setShowAddFuelModal(true)}>
              <Plus size={16} /> Log Bulk Fuel Dispense
            </Button>
          )}
        </Flex>
      </Flex>

      {/* KPI Stats */}
      <SimpleGrid columns={{ base: 2, sm: 2, lg: 5 }} gap={4} mb={6}>
        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Heavy Machinery</Text>
          <Text fontSize="2xl" fontWeight="black" color="#0f172a" mt={1}>{totalEquipmentCount}</Text>
          <Text fontSize="10px" color="#059669" mt={1}>{inUseCount} deployed on site</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Transport Fleet</Text>
          <Text fontSize="2xl" fontWeight="black" color="#2563eb" mt={1}>{totalVehiclesCount}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>{activeVehiclesCount} trucks active</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Servicing Records</Text>
          <Text fontSize="2xl" fontWeight="black" color="#7c3aed" mt={1}>{maintenanceRecords.length}</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Workshop work orders</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Fuel Dispensed</Text>
          <Text fontSize="2xl" fontWeight="black" color="#d97706" mt={1}>{totalFuelLiters.toLocaleString()} L</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Bulk yard logs</Text>
        </Card.Root>

        <Card.Root bg="white" borderRadius="14px" p={4} border="1px solid #e2e8f0" boxShadow="xs">
          <Text fontSize="10px" textTransform="uppercase" fontWeight="bold" color="#64748b">Operational Readiness</Text>
          <Text fontSize="2xl" fontWeight="black" color="#16a34a" mt={1}>94.2%</Text>
          <Text fontSize="10px" color="#64748b" mt={1}>Zero critical downtime</Text>
        </Card.Root>
      </SimpleGrid>

      {/* Tabs */}
      <Flex borderBottom="1px solid #e2e8f0" gap={4} mb={6}>
        <Button
          variant="plain"
          pb={3}
          borderBottom="2px solid"
          borderColor={activeTab === 'machinery' ? '#059669' : 'transparent'}
          color={activeTab === 'machinery' ? '#059669' : '#64748b'}
          fontWeight={activeTab === 'machinery' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('machinery')}
        >
          <HardHat size={16} /> Heavy Plant & Machinery ({equipment.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          borderBottom="2px solid"
          borderColor={activeTab === 'fleet' ? '#059669' : 'transparent'}
          color={activeTab === 'fleet' ? '#059669' : '#64748b'}
          fontWeight={activeTab === 'fleet' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('fleet')}
        >
          <Truck size={16} /> Commercial Transport Fleet ({vehicles.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          borderBottom="2px solid"
          borderColor={activeTab === 'maintenance' ? '#059669' : 'transparent'}
          color={activeTab === 'maintenance' ? '#059669' : '#64748b'}
          fontWeight={activeTab === 'maintenance' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('maintenance')}
        >
          <Wrench size={16} /> Maintenance & Workshop ({maintenanceRecords.length})
        </Button>
        <Button
          variant="plain"
          pb={3}
          borderBottom="2px solid"
          borderColor={activeTab === 'fuel' ? '#059669' : 'transparent'}
          color={activeTab === 'fuel' ? '#059669' : '#64748b'}
          fontWeight={activeTab === 'fuel' ? 'bold' : 'medium'}
          fontSize="sm"
          onClick={() => setActiveTab('fuel')}
        >
          <Fuel size={16} /> Bulk Fuel Consumption Logs ({fuelConsumptions.length})
        </Button>
      </Flex>

      {/* TAB 1: MACHINERY */}
      {activeTab === 'machinery' && (
        <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Plant Code & Equipment Name</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Equipment Type</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Assigned Project</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Designated Operator</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Rate / Hr</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Serial Number</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {equipment.map(eq => (
                <Table.Row key={eq.id}>
                  <Table.Cell>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">{eq.name}</Text>
                    <Text fontSize="11px" fontFamily="mono" color="#64748b">{eq.equipmentCode}</Text>
                  </Table.Cell>
                  <Table.Cell><Badge size="xs" colorPalette="blue">{eq.type}</Badge></Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette={eq.status === 'in_use' ? 'green' : eq.status === 'available' ? 'cyan' : 'orange'}>
                      {eq.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">{eq.projectName || 'Central Depot / Available'}</Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">{eq.operatorName}</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono" fontWeight="bold">${eq.hourlyRate}/hr</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono" color="#64748b">{eq.serialNumber}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* TAB 2: FLEET */}
      {activeTab === 'fleet' && (
        <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Vehicle & Plate No</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Model Specification</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Category</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Status</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Assigned Driver</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Odometer</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Tank Capacity</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {vehicles.map(v => (
                <Table.Row key={v.id}>
                  <Table.Cell>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">{v.plateNumber}</Text>
                    <Text fontSize="11px" fontFamily="mono" color="#64748b">{v.vehicleCode}</Text>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" maxW="300px">{v.model}</Table.Cell>
                  <Table.Cell><Badge size="xs" colorPalette="purple">{v.type}</Badge></Table.Cell>
                  <Table.Cell>
                    <Badge size="xs" colorPalette={v.status === 'active' ? 'green' : v.status === 'in_service' ? 'blue' : 'red'}>
                      {v.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">{v.driverName}</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono">{(v.currentOdometer || 0).toLocaleString()} km</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono">{v.fuelCapacityLiters} L</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* TAB 3: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Asset Details</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Service Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Work Scope & Diagnosis</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Parts Replaced</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Cost</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Service Technician / Vendor</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Next Due</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {maintenanceRecords.map(m => (
                <Table.Row key={m.id}>
                  <Table.Cell>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">{m.assetName}</Text>
                    <Badge size="xs" colorPalette="cyan" mt={0.5}>{m.assetCode} ({m.assetType})</Badge>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">{m.maintenanceDate}</Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155" maxW="280px">{m.description}</Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b" maxW="200px">{m.partsReplaced || 'N/A'}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" fontFamily="mono">${m.cost.toLocaleString()}</Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">{m.performedBy}</Table.Cell>
                  <Table.Cell fontSize="xs" color="#16a34a">{m.nextServiceDate}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* TAB 4: BULK FUEL */}
      {activeTab === 'fuel' && (
        <Card.Root bg="white" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden" boxShadow="xs">
          <Table.Root size="sm" striped>
            <Table.Header bg="#f8fafc">
              <Table.Row>
                <Table.ColumnHeader color="#475569">Vehicle & Plate</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Dispense Date</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Volume (Liters)</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Total Cost</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Odometer Reading</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Driver / Receiver</Table.ColumnHeader>
                <Table.ColumnHeader color="#475569">Dispense Station</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fuelConsumptions.map(f => (
                <Table.Row key={f.id}>
                  <Table.Cell>
                    <Text fontSize="xs" fontWeight="bold" color="#0f172a">{f.plateNumber}</Text>
                    <Text fontSize="11px" fontFamily="mono" color="#64748b">{f.vehicleCode}</Text>
                  </Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">{f.fuelDate}</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" fontFamily="mono" color="#2563eb">{f.liters} L</Table.Cell>
                  <Table.Cell fontSize="xs" fontWeight="bold" fontFamily="mono">${f.cost.toLocaleString()}</Table.Cell>
                  <Table.Cell fontSize="xs" fontFamily="mono">{(f.odometerKm || 0).toLocaleString()} km</Table.Cell>
                  <Table.Cell fontSize="xs" color="#334155">{f.driverName}</Table.Cell>
                  <Table.Cell fontSize="xs" color="#64748b">{f.fuelStation}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Root>
      )}

      {/* MODAL 1: ADD EQUIPMENT */}
      {showAddEquipmentModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Register Heavy Plant / Machinery</Heading>
              <Box as="button" onClick={() => setShowAddEquipmentModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>Add an earthmoving machine, crane, or automated plant asset.</Text>

            <form onSubmit={handleCreateEquipment}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Equipment Code</Text>
                    <Input size="sm" value={equipmentForm.equipmentCode} onChange={(e) => setEquipmentForm({ ...equipmentForm, equipmentCode: e.target.value })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Machine Type</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={equipmentForm.type} onChange={(e) => setEquipmentForm({ ...equipmentForm, type: e.target.value })}>
                        <option value="Excavator">Excavator</option>
                        <option value="Tower Crane">Tower Crane</option>
                        <option value="Concrete Pump">Concrete Pump</option>
                        <option value="Bulldozer">Bulldozer</option>
                        <option value="Batch Plant">Batch Plant</option>
                        <option value="Compactor / Roller">Compactor / Roller</option>
                        <option value="Wheel Loader">Wheel Loader</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Machine Name & Model *</Text>
                  <Input size="sm" placeholder="e.g. Caterpillar 336D Hydraulic Crawler Excavator" value={equipmentForm.name} onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })} required />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Project</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={equipmentForm.projectId} onChange={(e) => setEquipmentForm({ ...equipmentForm, projectId: e.target.value ? Number(e.target.value) : undefined })}>
                        <option value="">Depot / Available</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Certified Operator</Text>
                    <Input size="sm" placeholder="Samuel Okon" value={equipmentForm.operatorName} onChange={(e) => setEquipmentForm({ ...equipmentForm, operatorName: e.target.value })} />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Hourly Operating Rate ($)</Text>
                    <Input size="sm" type="number" value={equipmentForm.hourlyRate} onChange={(e) => setEquipmentForm({ ...equipmentForm, hourlyRate: Number(e.target.value) })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Serial / Chassis No</Text>
                    <Input size="sm" placeholder="CAT-336D-99812" value={equipmentForm.serialNumber} onChange={(e) => setEquipmentForm({ ...equipmentForm, serialNumber: e.target.value })} />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddEquipmentModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#059669" color="white" type="submit">Commit Plant Registration</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL 2: ADD VEHICLE */}
      {showAddVehicleModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Register Fleet Vehicle</Heading>
              <Box as="button" onClick={() => setShowAddVehicleModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>Catalog commercial trucks, mixers, or site utility pickups.</Text>

            <form onSubmit={handleCreateVehicle}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Plate Number *</Text>
                    <Input size="sm" placeholder="ABJ-772-XA" value={vehicleForm.plateNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Vehicle Type</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={vehicleForm.type} onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}>
                        <option value="Transit Mixer Truck">Transit Mixer Truck</option>
                        <option value="Tipper / Dump Truck">Tipper / Dump Truck</option>
                        <option value="Flatbed Lowbed">Flatbed Lowbed</option>
                        <option value="Site Pickup 4x4">Site Pickup 4x4</option>
                        <option value="Water Tanker">Water Tanker</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Make & Model Description *</Text>
                  <Input size="sm" placeholder="Mercedes-Benz Actros 3340 8x4 Concrete Transit Mixer (9m³)" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} required />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Assigned Driver</Text>
                    <Input size="sm" placeholder="Suleiman Bello" value={vehicleForm.driverName} onChange={(e) => setVehicleForm({ ...vehicleForm, driverName: e.target.value })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Current Odometer (km)</Text>
                    <Input size="sm" type="number" value={vehicleForm.currentOdometer} onChange={(e) => setVehicleForm({ ...vehicleForm, currentOdometer: Number(e.target.value) })} />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddVehicleModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#059669" color="white" type="submit">Register Vehicle</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL 3: ADD MAINTENANCE */}
      {showAddMaintenanceModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="540px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Log Workshop Maintenance / Service</Heading>
              <Box as="button" onClick={() => setShowAddMaintenanceModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>Record preventive inspection, oil change, or mechanical overhaul.</Text>

            <form onSubmit={handleCreateMaintenance}>
              <Stack gap={3}>
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Asset Category</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={maintenanceForm.assetType} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, assetType: e.target.value as any })}>
                        <option value="Equipment">Heavy Machinery</option>
                        <option value="Vehicle">Fleet Vehicle</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Select Asset</Text>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field value={maintenanceForm.assetId} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, assetId: Number(e.target.value) })}>
                        {maintenanceForm.assetType === 'Equipment' ? (
                          equipment.map(e => <option key={e.id} value={e.id}>{e.name} ({e.equipmentCode})</option>)
                        ) : (
                          vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.plateNumber})</option>)
                        )}
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Work Scope & Diagnosis *</Text>
                  <Input size="sm" placeholder="500-hour service: hydraulic filter, oil change & brake inspection" value={maintenanceForm.description} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })} required />
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Service Cost ($)</Text>
                    <Input size="sm" type="number" value={maintenanceForm.cost} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: Number(e.target.value) })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Workshop / Technician</Text>
                    <Input size="sm" value={maintenanceForm.performedBy} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, performedBy: e.target.value })} />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddMaintenanceModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#059669" color="white" type="submit">Record Service</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}

      {/* MODAL 4: ADD FUEL */}
      {showAddFuelModal && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="500px" w="100%" p={6} boxShadow="2xl">
            <Flex justify="space-between" align="center" mb={1}>
              <Heading size="md" color="#0f172a">Log Bulk Diesel Fuel Dispense</Heading>
              <Box as="button" onClick={() => setShowAddFuelModal(false)} color="#94a3b8" cursor="pointer">
                <X size={18} />
              </Box>
            </Flex>
            <Text fontSize="xs" color="#64748b" mb={4}>Record bulk yard diesel fueling with odometer tracking.</Text>

            <form onSubmit={handleCreateFuel}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Target Vehicle</Text>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field value={fuelForm.vehicleId} onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: Number(e.target.value) })}>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.plateNumber} - {v.model}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Fuel Liters (L)</Text>
                    <Input size="sm" type="number" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: Number(e.target.value), cost: Number(e.target.value) * 1.5 })} required />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Total Cost ($)</Text>
                    <Input size="sm" type="number" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: Number(e.target.value) })} required />
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Odometer (km)</Text>
                    <Input size="sm" type="number" value={fuelForm.odometerKm} onChange={(e) => setFuelForm({ ...fuelForm, odometerKm: Number(e.target.value) })} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Receiving Driver</Text>
                    <Input size="sm" value={fuelForm.driverName} onChange={(e) => setFuelForm({ ...fuelForm, driverName: e.target.value })} />
                  </Box>
                </SimpleGrid>

                <Flex justify="flex-end" gap={2} pt={2}>
                  <Button size="sm" variant="outline" onClick={() => setShowAddFuelModal(false)}>Cancel</Button>
                  <Button size="sm" bg="#059669" color="white" type="submit">Log Fuel</Button>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};
