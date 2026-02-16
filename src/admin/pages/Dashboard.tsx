import AdminLayout from "../AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="fixed top-[90px] left-0 right-0 z-20 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:px-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">Welcome to your admin dashboard.</p>
      </div>
      <div className="pt-[120px] md:pt-[100px]">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Coming Soon</h3>
            <p className="text-slate-400">This feature is under development. Stay tuned for updates!</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
