import AdminLayout from "../AdminLayout";
import { PricingManagement } from "@/components/admin/PricingManagement";

const Pricing = () => {
  return (
    <AdminLayout>
      {/* <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Pricing Management</h2>
        <p className="mt-2 text-slate-400">Manage and update pricing plans for your programs.</p>
      </div> */}
      
      {/* Pricing Management Component */}
      <PricingManagement />
    </AdminLayout>
  );
};

export default Pricing;
