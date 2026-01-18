import Sidebar from "../../components/Sidebar";
import FileUploaderUbipharm from "../../components/FileUploaderUbipharm";

export default function UbipharmPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-10 bg-gray-50 text-gray-800 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">📊 Extraction Ubipharm</h1>
        <FileUploaderUbipharm /> {/* 👈 composant dédié */}
      </main>
    </div>
  );
}
