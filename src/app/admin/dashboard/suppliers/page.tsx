import { SupplierListTable } from "@/components/features/admin/suppliers/SupplierListTable";
import { SupplierBalances } from "@/components/features/admin/suppliers/SupplierBalances";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Admin Suppliers List Page
 * Route: /admin/dashboard/suppliers
 */
export default function AdminSuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Supplier Management
        </h1>
        <p className="text-muted-foreground">
          Manage data suppliers and their configurations.
        </p>
      </div>
      <Tabs defaultValue="suppliers">
        <TabsList>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="balances">Supplier Balance</TabsTrigger>
        </TabsList>
        <TabsContent value="suppliers"><SupplierListTable /></TabsContent>
        <TabsContent value="balances"><SupplierBalances /></TabsContent>
      </Tabs>
    </div>
  );
}
