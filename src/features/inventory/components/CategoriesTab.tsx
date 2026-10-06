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
  Stack
} from '@chakra-ui/react';
import { useERP } from '../../../context/ERPContext';
import { InventoryCategory } from '../../../types';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Boxes,
  DollarSign
} from 'lucide-react';

export const CategoriesTab: React.FC = () => {
  const {
    inventoryCategories,
    addInventoryCategory,
    updateInventoryCategory,
    deleteInventoryCategory,
    inventory,
    activeCompany
  } = useERP();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<InventoryCategory | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (cat: InventoryCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateInventoryCategory(editingCategory.id, { name: name.trim(), description: description.trim() });
      setEditingCategory(null);
    } else {
      addInventoryCategory({ name: name.trim(), description: description.trim() });
      setShowAddModal(false);
    }
    setName('');
    setDescription('');
  };

  return (
    <Stack gap={5}>
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="sm" color="#0f172a">
            Material Classification & Categories
          </Heading>
          <Text fontSize="xs" color="#64748b">
            Organize site stores, procurement catalogues, and bill of quantities item lines.
          </Text>
        </Box>

        <Button size="sm" colorPalette="blue" onClick={handleOpenAdd} fontWeight="semibold">
          <Plus size={16} /> New Category
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        {inventoryCategories.map((cat) => {
          const items = inventory.filter(i => i.categoryId === cat.id || i.categoryName === cat.name);
          const totalVal = items.reduce((acc, i) => acc + (i.currentStock * i.costPrice), 0);

          return (
            <Card.Root key={cat.id} bg="white" borderRadius="16px" p={5} border="1px solid #e2e8f0" boxShadow="xs">
              <Flex justify="space-between" align="flex-start">
                <Flex align="center" gap={2.5}>
                  <Box p={2.5} bg="#eff6ff" color="#2563eb" borderRadius="10px">
                    <Tag size={18} />
                  </Box>
                  <Box>
                    <Heading size="sm" color="#0f172a">{cat.name}</Heading>
                    <Text fontSize="10px" color="#94a3b8" mt={0.5}>Created: {cat.createdAt || 'Standard'}</Text>
                  </Box>
                </Flex>

                <Flex gap={1}>
                  <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => handleOpenEdit(cat)} title="Edit Category">
                    <Edit size={13} />
                  </Button>
                  {inventoryCategories.length > 1 && (
                    <Button size="xs" variant="ghost" colorPalette="red" onClick={() => deleteInventoryCategory(cat.id)} title="Delete Category">
                      <Trash2 size={13} />
                    </Button>
                  )}
                </Flex>
              </Flex>

              <Text fontSize="xs" color="#64748b" mt={3} minH="36px">
                {cat.description || 'General construction supplies and materials category.'}
              </Text>

              <SimpleGrid columns={2} gap={2} mt={3} pt={3} borderTop="1px dashed #e2e8f0">
                <Box bg="#f8fafc" p={2} borderRadius="8px">
                  <Text fontSize="9px" textTransform="uppercase" fontWeight="bold" color="#64748b">Catalog SKUs</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#0f172a">{items.length} Items</Text>
                </Box>
                <Box bg="#f8fafc" p={2} borderRadius="8px">
                  <Text fontSize="9px" textTransform="uppercase" fontWeight="bold" color="#64748b">Category Value</Text>
                  <Text fontSize="sm" fontWeight="bold" color="#16a34a">
                    {activeCompany.currency} {totalVal.toLocaleString()}
                  </Text>
                </Box>
              </SimpleGrid>
            </Card.Root>
          );
        })}
      </SimpleGrid>

      {/* Add / Edit Category Modal */}
      {(showAddModal || editingCategory) && (
        <Box position="fixed" inset="0" bg="rgba(15, 23, 42, 0.6)" zIndex="1000" display="flex" alignItems="center" justifyContent="center" p={4}>
          <Box bg="white" borderRadius="16px" maxW="440px" w="100%" p={6} boxShadow="2xl">
            <Heading size="md" color="#0f172a" mb={1}>
              {editingCategory ? 'Edit Material Category' : 'Create Material Category'}
            </Heading>
            <Text fontSize="xs" color="#64748b" mb={4}>
              Define material category name and specification notes.
            </Text>

            <form onSubmit={handleSave}>
              <Stack gap={3}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Category Name *</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. Electrical & Conduit Fittings"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#334155" mb={1}>Description</Text>
                  <Input
                    size="sm"
                    placeholder="e.g. High-voltage cables, DB boards, switches and conduits"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Box>

                <Flex justify="flex-end" gap={2} mt={3}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCategory(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" colorPalette="blue" type="submit">
                    {editingCategory ? 'Save Changes' : 'Create Category'}
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
