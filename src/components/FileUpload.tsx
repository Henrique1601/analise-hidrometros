import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface FileUploadProps {
  onFileLoad: (file: File) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function FileUpload({ onFileLoad, loading, error }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      onFileLoad(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onFileLoad(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={clsx(
          'relative rounded-2xl p-12 glass border-2 border-dashed cursor-pointer transition-all duration-300',
          isDragOver 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-dark-600 hover:border-primary-500/50'
        )}
      >
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            background: isDragOver 
              ? 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            className={clsx(
              'w-20 h-20 rounded-2xl flex items-center justify-center mb-6',
              isDragOver 
                ? 'bg-primary-500/30 text-primary-400' 
                : 'bg-dark-700/50 text-dark-400'
            )}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-3 border-dark-600 border-t-primary-500 rounded-full"
              />
            ) : uploadedFile ? (
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-white font-semibold text-lg mb-2">Processando planilha...</p>
                <p className="text-dark-400">Analisando dados de hidrômetros</p>
              </motion.div>
            ) : uploadedFile ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-emerald-400 font-semibold text-lg mb-2 flex items-center gap-2 justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                  Arquivo carregado!
                </p>
                <p className="text-dark-400">{uploadedFile.name}</p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-white font-semibold text-lg mb-2">
                  Arraste sua planilha Excel aqui
                </p>
                <p className="text-dark-400 mb-4">
                  ou clique para selecionar o arquivo (.xlsx)
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 border border-primary-500/30"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="text-sm font-medium">Selecionar arquivo</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
