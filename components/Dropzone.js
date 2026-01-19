import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({ onFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFile(acceptedFiles[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 cursor-pointer 
        ${isDragActive ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600">Déposez le fichier ici…</p>
      ) : (
        <p className="text-gray-600">Glissez-déposez ou cliquez pour importer un fichier Excel</p>
      )}
    </div>
  );
}
