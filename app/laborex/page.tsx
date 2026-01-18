import Sidebar from "../../components/Sidebar";
import FileUploader from "../../components/FileUploader";

export default function LaborexPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-10 bg-gray-50 text-gray-800 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">💰 Extraction Laborex</h1>
        <FileUploader /> {/* 👈 ton composant actuel */}
      </main>
    </div>
  );
}
