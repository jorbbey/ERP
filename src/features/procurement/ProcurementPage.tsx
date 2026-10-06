import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Card,
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../context/ERPContext';
import { PurchaseOrder } from '../../types';
import { PurchaseOrdersTab } from './components/PurchaseOrdersTab';
import { GoodsReceivedNotesTab } from './components/GoodsReceivedNotesTab';
import { SuppliersTab } from './components/SuppliersTab';
import { ProcurementAnalyticsTab } from './components/ProcurementAnalyticsTab';
import {
  ShoppingCart,
  PackageCheck,
  Building2,
  BarChart3,
  Download,
  Plus
} from 'lucide-react';

export const ProcurementPage: React.FC = () => {
  const { purchaseOrders, goodsReceivedNotes, suppliers } = useERP();

  const [activeTab, setActiveTab] = useState<'pos' | 'grn' | 'suppliers' | 'analytics'>('pos');
  const [grnTargetPO, setGrnTargetPO] = useState<PurchaseOrder | null>(null);

  const handleOpenCreateGRNForPO = (po: PurchaseOrder) => {
    setGrnTargetPO(po);
    setActiveTab('grn');
  };

  return (
    <Stack gap={6}>
      {/* Top Banner */}
      <Card.Root bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
        <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ sm: 'center' }} gap={4}>
          <Box>
            <Flex align="center" gap={3}>
              <Box p={2.5} bg="#2563eb" color="white" borderRadius="12px">
                <ShoppingCart size={26} />
              </Box>
              <Box>
                <Heading size="lg" color="#0f172a" fontWeight="bold">
                  Procurement & Materials Supply Chain
                </Heading>
                <Text fontSize="xs" color="#64748b" mt={0.5}>
                  Vendor purchase orders, site Goods Received Notes (GRN), supplier registries, and material spend tracking.
                </Text>
              </Box>
            </Flex>
          </Box>

          <Flex gap={2} align="center">
            <Button
              size="sm"
              variant="outline"
              borderColor="#cbd5e1"
              color="#334155"
              onClick={() => {
                const blob = new Blob([
                  "Item Code,Description,Quantity,Unit,Unit Price,Tax %,Discount %\nMAT-101,Standard Portland Cement Type 1,100,Bags,28.5,5,0\nMAT-201,High-Tensile TMT Deformed Rebar 16mm,10,Tonnes,940,5,0"
                ], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "PO_Import_Template.csv";
                a.click();
              }}
            >
              <Download size={14} /> Download PO Template
            </Button>
          </Flex>
        </Flex>

        {/* Tab Navigation */}
        <Flex gap={2} mt={6} pt={4} borderTop="1px solid #f1f5f9" wrap="wrap">
          <Button
            size="sm"
            variant={activeTab === 'pos' ? 'solid' : 'ghost'}
            colorPalette={activeTab === 'pos' ? 'blue' : 'gray'}
            onClick={() => setActiveTab('pos')}
          >
            <ShoppingCart size={15} /> Purchase Orders ({purchaseOrders.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === 'grn' ? 'solid' : 'ghost'}
            colorPalette={activeTab === 'grn' ? 'blue' : 'gray'}
            onClick={() => setActiveTab('grn')}
          >
            <PackageCheck size={15} /> Goods Received Notes ({goodsReceivedNotes.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === 'suppliers' ? 'solid' : 'ghost'}
            colorPalette={activeTab === 'suppliers' ? 'blue' : 'gray'}
            onClick={() => setActiveTab('suppliers')}
          >
            <Building2 size={15} /> Suppliers Directory ({suppliers.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === 'analytics' ? 'solid' : 'ghost'}
            colorPalette={activeTab === 'analytics' ? 'blue' : 'gray'}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={15} /> Spend & Compliance Analytics
          </Button>
        </Flex>
      </Card.Root>

      {/* Tab Panels */}
      {activeTab === 'pos' && (
        <PurchaseOrdersTab onOpenCreateGRNForPO={handleOpenCreateGRNForPO} />
      )}

      {activeTab === 'grn' && (
        <GoodsReceivedNotesTab
          preSelectedPO={grnTargetPO}
          onClearPreSelectedPO={() => setGrnTargetPO(null)}
        />
      )}

      {activeTab === 'suppliers' && (
        <SuppliersTab />
      )}

      {activeTab === 'analytics' && (
        <ProcurementAnalyticsTab />
      )}
    </Stack>
  );
};
