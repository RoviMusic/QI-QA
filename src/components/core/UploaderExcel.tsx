import { FileExcelOutlined, UploadOutlined } from "@ant-design/icons";

interface UploaderProps {
    title?: string;
    file: any;
    handleFileUpload: (event: any) => void;
    isProcessing: boolean;
}

export default function UploaderExcel({title = "Archivo Excel", file, handleFileUpload, isProcessing=false}: UploaderProps) {
  return (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileExcelOutlined className="inline w-4 h-4 mr-2" />
          {title}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => handleFileUpload(event)}
            className="hidden"
            id="file-input"
            disabled={isProcessing}
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center"
          >
            <UploadOutlined className="w-12 text-gray-400 mb-2" />
            <span className="text-gray-600">
              {file ? file.name : "Haz clic para seleccionar un archivo Excel"}
            </span>
          </label>
        </div>
      </div>
    </>
  );
}
