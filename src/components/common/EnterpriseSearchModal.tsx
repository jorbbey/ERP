import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Badge, Stack } from '@chakra-ui/react';
import { 
  Search, 
  X, 
  HardHat, 
  Boxes, 
  ClipboardList, 
  ShoppingCart, 
  Users, 
  Building2, 
  ArrowRight,
  Truck,
  Wallet,
  Scale,
  FileText
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EnterpriseSearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { projects, inventory, requisitions, purchaseOrders, employees } = useERP();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search results
  const matchedProjects = q ? projects.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.projectNumber.toLowerCase().includes(q) || 
    p.clientName.toLowerCase().includes(q) ||
    p.siteLocation.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedInventory = q ? inventory.filter(i => 
    i.name.toLowerCase().includes(q) || 
    i.itemCode.toLowerCase().includes(q) ||
    i.categoryName.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedRequisitions = q ? requisitions.filter(r => 
    r.requisitionNo.toLowerCase().includes(q) || 
    r.requestedBy.toLowerCase().includes(q) ||
    (r.title && r.title.toLowerCase().includes(q))
  ).slice(0, 3) : [];

  const matchedPOs = q ? purchaseOrders.filter(po => 
    po.poNumber.toLowerCase().includes(q) || 
    po.supplierName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedEmployees = q ? employees.filter(e => 
    e.name.toLowerCase().includes(q) || 
    e.code.toLowerCase().includes(q) ||
    e.department.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  // Quick module jumps when no query
  const quickModules = [
    { label: 'Civil Projects & Sites', path: '/projects', icon: HardHat, cat: 'Projects' },
    { label: 'Stores & Material Inventory', path: '/inventory', icon: Boxes, cat: 'Supply' },
    { label: 'Material Requisitions', path: '/requisitions', icon: ClipboardList, cat: 'Supply' },
    { label: 'Procurement & Purchase Orders', path: '/procurement', icon: ShoppingCart, cat: 'Supply' },
    { label: 'Ready-Mix Concrete Batching', path: '/rmc', icon: Truck, cat: 'Plant' },
    { label: 'Workforce & Biometrics', path: '/hr', icon: Users, cat: 'HR' },
    { label: 'Payroll & Remuneration', path: '/payroll', icon: Wallet, cat: 'Finance' },
    { label: 'General Ledger & Trial Balance', path: '/accounting', icon: Scale, cat: 'Finance' },
    { label: 'FIDIC Contract Administration', path: '/contract-admin', icon: FileText, cat: 'Legal' }
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const hasResults = matchedProjects.length > 0 || matchedInventory.length > 0 || matchedRequisitions.length > 0 || matchedPOs.length > 0 || matchedEmployees.length > 0;

  return (
    <Box 
      position="fixed" 
      top="0" 
      left="0" 
      right="0" 
      bottom="0" 
      bg="rgba(15, 23, 42, 0.45)" 
      backdropFilter="blur(4px)" 
      zIndex="1000"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      pt={{ base: '60px', md: '100px' }}
      px={4}
      onClick={onClose}
    >
      <Box 
        bg="#ffffff" 
        w="100%" 
        maxW="680px" 
        borderRadius="16px" 
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        border="1px solid #cbd5e1"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <Flex align="center" px={4} py={3.5} borderBottom="1px solid #e2e8f0" gap={3}>
          <Search size={20} color="#64748b" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search projects, materials, POs, staff, or modules..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              color: '#0f172a',
              backgroundColor: 'transparent',
              fontFamily: 'inherit'
            }}
          />
          {query ? (
            <Box 
              as="button" 
              onClick={() => setQuery('')} 
              p={1} 
              borderRadius="4px" 
              color="#94a3b8" 
              _hover={{ color: '#0f172a' }}
            >
              <X size={16} />
            </Box>
          ) : (
            <Badge size="xs" variant="outline" color="#64748b" borderColor="#cbd5e1" px={1.5} py={0.5}>
              ESC to exit
            </Badge>
          )}
        </Flex>

        {/* Content list */}
        <Box maxH="460px" overflowY="auto" p={3}>
          {q && !hasResults && (
            <Box py={10} textAlign="center">
              <Text fontSize="sm" color="#64748b">No matching records found for "{query}"</Text>
              <Text fontSize="xs" color="#94a3b8" mt={1}>Try searching for project numbers (PRJ-2026), materials (cement, rebar), or staff.</Text>
            </Box>
          )}

          {/* If no query, show quick navigation */}
          {!q && (
            <Box>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" letterSpacing="0.05em" px={3} py={1.5}>
                Direct Module Access
              </Text>
              <Stack gap={1} mt={1}>
                {quickModules.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <Box
                      key={idx}
                      as="button"
                      w="100%"
                      textAlign="left"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={3}
                      py={2.5}
                      borderRadius="8px"
                      _hover={{ bg: '#f1f5f9' }}
                      transition="background 0.15s ease"
                      onClick={() => handleSelect(m.path)}
                    >
                      <Flex align="center" gap={3}>
                        <Box p={1.5} bg="#eff6ff" color="#2563eb" borderRadius="6px">
                          <Icon size={16} />
                        </Box>
                        <Text fontSize="sm" fontWeight="medium" color="#0f172a">
                          {m.label}
                        </Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Badge size="xs" colorPalette="gray" variant="subtle">{m.cat}</Badge>
                        <ArrowRight size={13} color="#94a3b8" />
                      </Flex>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Matched Projects */}
          {matchedProjects.length > 0 && (
            <Box mb={3}>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" letterSpacing="0.05em" px={3} py={1}>
                Projects & Civil Sites
              </Text>
              <Stack gap={1}>
                {matchedProjects.map(p => (
                  <Box
                    key={p.id}
                    as="button"
                    w="100%"
                    textAlign="left"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    _hover={{ bg: '#eff6ff' }}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                  >
                    <Flex align="center" gap={2.5}>
                      <HardHat size={16} color="#2563eb" />
                      <Box>
                        <Flex align="center" gap={2}>
                          <Text fontSize="xs" fontWeight="bold" color="#0f172a">{p.name}</Text>
                          <Badge size="xs" colorPalette="blue">{p.projectNumber}</Badge>
                        </Flex>
                        <Text fontSize="11px" color="#64748b">{p.siteLocation} • Client: {p.clientName}</Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette="green">{p.progressPercent}% Target</Badge>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Matched Materials & Inventory */}
          {matchedInventory.length > 0 && (
            <Box mb={3}>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" letterSpacing="0.05em" px={3} py={1}>
                Stores & Materials
              </Text>
              <Stack gap={1}>
                {matchedInventory.map(i => (
                  <Box
                    key={i.id}
                    as="button"
                    w="100%"
                    textAlign="left"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    _hover={{ bg: '#f8fafc' }}
                    onClick={() => handleSelect('/inventory')}
                  >
                    <Flex align="center" gap={2.5}>
                      <Boxes size={16} color="#059669" />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{i.name}</Text>
                        <Text fontSize="11px" color="#64748b">Code: {i.itemCode} • {i.warehouseLocation}</Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette={i.currentStock <= i.minLevel ? 'red' : 'green'}>
                      {i.currentStock} {i.unit} in stock
                    </Badge>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Matched Requisitions */}
          {matchedRequisitions.length > 0 && (
            <Box mb={3}>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" letterSpacing="0.05em" px={3} py={1}>
                Field Material Requisitions
              </Text>
              <Stack gap={1}>
                {matchedRequisitions.map(r => (
                  <Box
                    key={r.id}
                    as="button"
                    w="100%"
                    textAlign="left"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    _hover={{ bg: '#fffbeb' }}
                    onClick={() => handleSelect('/requisitions')}
                  >
                    <Flex align="center" gap={2.5}>
                      <ClipboardList size={16} color="#d97706" />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{r.requisitionNo}</Text>
                        <Text fontSize="11px" color="#64748b">Requested by: {r.requestedBy} • {r.projectName}</Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette="orange">{r.status}</Badge>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Matched Employees */}
          {matchedEmployees.length > 0 && (
            <Box mb={2}>
              <Text fontSize="11px" fontWeight="bold" textTransform="uppercase" color="#94a3b8" letterSpacing="0.05em" px={3} py={1}>
                Personnel & Site Staff
              </Text>
              <Stack gap={1}>
                {matchedEmployees.map(e => (
                  <Box
                    key={e.id}
                    as="button"
                    w="100%"
                    textAlign="left"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    _hover={{ bg: '#fdf4ff' }}
                    onClick={() => handleSelect('/hr')}
                  >
                    <Flex align="center" gap={2.5}>
                      <Users size={16} color="#9333ea" />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color="#0f172a">{e.name}</Text>
                        <Text fontSize="11px" color="#64748b">{e.position} • {e.department}</Text>
                      </Box>
                    </Flex>
                    <Badge size="xs" colorPalette="purple">{e.code}</Badge>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Footer info bar */}
        <Flex px={4} py={2.5} bg="#f8fafc" borderTop="1px solid #e2e8f0" justify="space-between" align="center" fontSize="11px" color="#64748b">
          <Flex align="center" gap={3}>
            <Text>Press <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}>Enter</kbd> to select</Text>
            <Text>Press <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}>Esc</kbd> to dismiss</Text>
          </Flex>
          <Text fontWeight="semibold" color="#0f172a">Commercial ERP Explorer</Text>
        </Flex>
      </Box>
    </Box>
  );
};
