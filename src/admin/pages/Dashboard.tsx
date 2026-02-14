import AdminLayout from "../AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="fixed top-[73px] left-0 right-0 z-20 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:left-64 md:px-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">Welcome to your admin dashboard.</p>
      </div>
      <div className="pt-[100px]">
        {/* Dashboard content goes here */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
