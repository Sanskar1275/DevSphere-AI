import AddCourseForm from "../components/admin/AddCourseForm";

function Admin() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        👨‍💻 Admin Dashboard
      </h1>

      <AddCourseForm />

    </div>
  );
}

export default Admin;