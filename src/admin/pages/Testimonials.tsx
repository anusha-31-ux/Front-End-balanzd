import AdminLayout from "../AdminLayout";

const Testimonials = () => {
  return (
    <AdminLayout>
      <div className="fixed top-[73px] left-64 right-0 z-20 bg-slate-900/50 px-6 py-4 backdrop-blur border-b border-slate-200/5">
        <h2 className="text-3xl font-bold text-white">Testimonials Management</h2>
        <p className="mt-2 text-slate-400">Manage customer testimonials and reviews.</p>
      </div>
      <div className="pt-[100px]">
        {/* Testimonials content goes here */}
      </div>
    </AdminLayout>
  );
};

export default Testimonials;
