import AdminLayout from "../AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">Welcome to your admin dashboard.</p>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
