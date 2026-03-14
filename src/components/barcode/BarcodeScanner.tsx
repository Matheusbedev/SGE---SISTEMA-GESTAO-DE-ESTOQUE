import React, { useRef, useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { iniciarLeituraNoVideo, pararLeitura } from '../../services/codigoBarrasService';

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onDetected: (codigo: string) => void;
}

export function BarcodeScanner({ open, onClose, onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [erro, setErro] = useState('');
  const [manual, setManual] = useState('');
  const [modoManual, setModoManual] = useState(false);

  useEffect(() => {
    if (!open) {
      pararLeitura();
      setErro('');
      setManual('');
      setModoManual(false);
      return;
    }

    if (videoRef.current) {
      iniciarLeituraNoVideo(videoRef.current, (codigo) => {
        onDetected(codigo);
        onClose();
      }).catch((e: Error) => {
        setErro(e.message);
        setModoManual(true);
      });
    }

    return () => { pararLeitura(); };
  }, [open]);

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (manual.trim()) {
      onDetected(manual.trim());
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ler Código de Barras" size="md">
      {!modoManual ? (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-32 border-2 border-green-400 rounded-lg opacity-70" />
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">Aponte a câmera para o código de barras</p>
          <Button variant="ghost" onClick={() => setModoManual(true)} className="w-full justify-center text-sm">
            Digitar código manualmente
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {erro && <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">{erro}</p>}
          <form onSubmit={handleManual} className="space-y-3">
            <Input
              label="Código de barras"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Digite ou cole o código"
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 justify-center">Confirmar</Button>
              {!erro && (
                <Button type="button" variant="secondary" onClick={() => setModoManual(false)}>
                  Usar câmera
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
