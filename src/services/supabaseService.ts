import { getSupabase, getSupabaseConfig } from './supabaseClient';
import { erpStorage } from './erpStorage';
import { 
  Company, 
  Project, 
  Employee, 
  Supplier, 
  Warehouse, 
  InventoryItem, 
  Requisition, 
  StockMovement 
} from '../types';

export const supabaseService = {
  isConfigured: () => getSupabaseConfig().isConfigured,

  // Fetch all rows from a Supabase table
  async fetchTable<T = any>(tableName: string): Promise<T[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.warn(`Supabase fetch failed for "${tableName}":`, error.message);
        return null;
      }
      return (data as T[]) || [];
    } catch (err) {
      console.warn(`Supabase exception fetching "${tableName}":`, err);
      return null;
    }
  },

  // Insert a single record
  async insertRecord(tableName: string, record: Record<string, any>): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from(tableName).insert(record);
      if (error) {
        console.warn(`Supabase insert failed for "${tableName}":`, error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`Supabase exception inserting into "${tableName}":`, err);
      return false;
    }
  },

  // Update a record
  async updateRecord(tableName: string, id: number | string, updates: Record<string, any>): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from(tableName).update(updates).eq('id', id);
      if (error) {
        console.warn(`Supabase update failed for "${tableName}" [id=${id}]:`, error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`Supabase exception updating "${tableName}":`, err);
      return false;
    }
  },

  // Delete a record
  async deleteRecord(tableName: string, id: number | string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) {
        console.warn(`Supabase delete failed for "${tableName}" [id=${id}]:`, error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`Supabase exception deleting from "${tableName}":`, err);
      return false;
    }
  },

  // Bulk Seed Supabase with Current ERP Data
  async seedFromLocal(): Promise<{ success: boolean; message: string; counts?: Record<string, number> }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, message: 'Supabase client is not configured. Please enter your Project URL and Anon Key in Settings.' };
    }

    try {
      const companies = erpStorage.getCompanies();
      const projects = erpStorage.getProjects();
      const employees = erpStorage.getEmployees();
      const suppliers = erpStorage.getSuppliers();
      const warehouses = erpStorage.getWarehouses();
      const categories = erpStorage.getInventoryCategories();
      const inventory = erpStorage.getInventory();
      const requisitions = erpStorage.getRequisitions();
      const movements = erpStorage.getStockMovements();

      const counts: Record<string, number> = {};

      // 1. Companies
      if (companies.length > 0) {
        const payload = companies.map(c => ({
          id: c.id,
          name: c.name,
          code: c.code,
          currency: c.currency,
          theme_color: c.themeColor,
          address: c.address,
          tax_number: c.taxNumber,
          phone: c.phone,
          email: c.email,
          website: c.website,
          is_active: c.isActive ?? true
        }));
        const { error } = await supabase.from('companies').upsert(payload);
        if (!error) counts['companies'] = payload.length;
      }

      // 2. Employees
      if (employees.length > 0) {
        const payload = employees.map(e => ({
          id: e.id,
          code: e.code,
          first_name: e.firstName,
          last_name: e.lastName,
          name: e.name,
          email: e.email,
          phone: e.phone,
          department: e.department,
          position: e.position,
          role: e.role,
          salary: e.salary,
          hire_date: e.hireDate,
          status: e.status,
          bank_name: e.bankName,
          account_number: e.accountNumber
        }));
        const { error } = await supabase.from('employees').upsert(payload);
        if (!error) counts['employees'] = payload.length;
      }

      // 3. Projects
      if (projects.length > 0) {
        const payload = projects.map(p => ({
          id: p.id,
          project_number: p.projectNumber,
          name: p.name,
          client_id: p.clientId,
          client_name: p.clientName,
          site_location: p.siteLocation,
          manager: p.manager,
          contract_value: p.contractValue,
          budget: p.budget,
          spent: p.spent,
          start_date: p.startDate,
          end_date: p.endDate,
          progress_percent: p.progressPercent,
          status: p.status
        }));
        const { error } = await supabase.from('projects').upsert(payload);
        if (!error) counts['projects'] = payload.length;
      }

      // 4. Categories & Warehouses & Suppliers
      if (categories.length > 0) {
        const payload = categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          item_count: cat.itemCount
        }));
        const { error } = await supabase.from('inventory_categories').upsert(payload);
        if (!error) counts['inventory_categories'] = payload.length;
      }

      if (warehouses.length > 0) {
        const payload = warehouses.map(w => ({
          id: w.id,
          code: w.code,
          name: w.name,
          location: w.location,
          store_keeper_name: w.storeKeeperName,
          phone: w.phone,
          status: w.status
        }));
        const { error } = await supabase.from('warehouses').upsert(payload);
        if (!error) counts['warehouses'] = payload.length;
      }

      if (suppliers.length > 0) {
        const payload = suppliers.map(s => ({
          id: s.id,
          supplier_code: s.supplierCode,
          company_name: s.companyName,
          contact_person: s.contactPerson,
          email: s.email,
          phone: s.phone,
          address: s.address,
          category: s.category,
          balance: s.balance,
          status: s.status
        }));
        const { error } = await supabase.from('suppliers').upsert(payload);
        if (!error) counts['suppliers'] = payload.length;
      }

      // 5. Inventory Items
      if (inventory.length > 0) {
        const payload = inventory.map(item => ({
          id: item.id,
          item_code: item.itemCode,
          name: item.name,
          category_id: item.categoryId,
          category_name: item.categoryName,
          unit: item.unit,
          current_stock: item.currentStock,
          opening_stock: item.openingStock,
          min_level: item.minLevel,
          cost_price: item.costPrice,
          selling_price: item.sellingPrice,
          warehouse_id: item.warehouseId,
          warehouse_location: item.warehouseLocation,
          supplier_id: item.supplierId,
          supplier_name: item.supplierName
        }));
        const { error } = await supabase.from('inventory_items').upsert(payload);
        if (!error) counts['inventory_items'] = payload.length;
      }

      // 6. Requisitions & Items
      if (requisitions.length > 0) {
        const reqPayload = requisitions.map(r => ({
          id: r.id,
          requisition_no: r.requisitionNo,
          project_id: r.projectId,
          project_name: r.projectName,
          requested_by: r.requestedBy,
          department: r.department,
          requisition_date: r.requisitionDate,
          priority: r.priority,
          status: r.status,
          title: r.title,
          trade: r.trade,
          supplier: r.supplier,
          total_estimated_amount: r.totalEstimatedAmount,
          approved_by: r.approvedBy,
          approval_date: r.approvalDate,
          remarks: r.remarks
        }));
        const { error } = await supabase.from('requisitions').upsert(reqPayload);
        if (!error) counts['requisitions'] = reqPayload.length;

        // Requisition Items
        const allItems: any[] = [];
        requisitions.forEach(r => {
          r.items.forEach((item, idx) => {
            allItems.push({
              requisition_id: r.id,
              inventory_item_id: item.inventoryItemId || null,
              item_code: item.itemCode,
              item_name: item.itemName,
              item_type: item.itemType || 'material',
              description: item.description,
              unit: item.unit,
              quantity_required: item.quantityRequired,
              quantity_in_stock: item.quantityInStock || 0,
              quantity_to_purchase: item.quantityToPurchase || 0,
              quantity_approved: item.quantityApproved || 0,
              quantity_dispatched: item.quantityDispatched || 0,
              price: item.price ?? null,
              value: item.value ?? null,
              is_custom_item: item.isCustomItem ?? false,
              status: item.status || 'pending'
            });
          });
        });
        if (allItems.length > 0) {
          const { error: itemsError } = await supabase.from('requisition_items').insert(allItems);
          if (!itemsError) counts['requisition_items'] = allItems.length;
        }
      }

      return {
        success: true,
        message: 'Successfully synchronized data to your Supabase PostgreSQL database!',
        counts
      };
    } catch (err: any) {
      return { success: false, message: `Sync error: ${err?.message || 'Unknown error'}` };
    }
  }
};
