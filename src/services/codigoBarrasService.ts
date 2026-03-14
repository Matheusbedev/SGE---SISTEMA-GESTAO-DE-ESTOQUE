import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

let reader: BrowserMultiFormatReader | null = null;
let active = false;

const SUPPORTED_FORMATS_REGEX = /^(\d{8}|\d{13}|[A-Z0-9\-\.\ \$\/\+\%]{1,80}|[0-9A-Za-z]{1,100})$/;

export function validarFormato(codigo: string): boolean {
  if (!codigo || codigo.trim().length === 0) return false;
  // Accept EAN-8 (8 digits), EAN-13 (13 digits), Code128 (alphanumeric), QR (any non-empty)
  return SUPPORTED_FORMATS_REGEX.test(codigo.trim());
}

export async function iniciarLeitura(callback: (codigo: string) => void): Promise<void> {
  if (active) pararLeitura();

  try {
    // Check camera permission
    await navigator.mediaDevices.getUserMedia({ video: true });
  } catch {
    throw new Error('Permissão de câmera negada. Por favor, permita o acesso à câmera ou insira o código manualmente.');
  }

  reader = new BrowserMultiFormatReader();
  active = true;

  const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
  const deviceId = videoDevices.length > 0 ? videoDevices[0].deviceId : undefined;

  // Create a temporary video element
  const video = document.createElement('video');
  video.setAttribute('playsinline', 'true');

  try {
    await reader.decodeFromVideoDevice(deviceId ?? null, video, (result, err) => {
      if (!active) return;
      if (result) {
        const codigo = result.getText();
        if (validarFormato(codigo)) {
          pararLeitura();
          callback(codigo);
        }
      }
      if (err && !(err instanceof NotFoundException)) {
        console.warn('Barcode scan error:', err);
      }
    });
  } catch (e) {
    active = false;
    throw e;
  }
}

export async function iniciarLeituraNoVideo(
  videoElement: HTMLVideoElement,
  callback: (codigo: string) => void
): Promise<void> {
  if (active) pararLeitura();

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
  } catch {
    throw new Error('Permissão de câmera negada. Por favor, permita o acesso à câmera ou insira o código manualmente.');
  }

  reader = new BrowserMultiFormatReader();
  active = true;

  const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
  const deviceId = videoDevices.length > 0 ? videoDevices[0].deviceId : undefined;

  try {
    await reader.decodeFromVideoDevice(deviceId ?? null, videoElement, (result, err) => {
      if (!active) return;
      if (result) {
        const codigo = result.getText();
        if (validarFormato(codigo)) {
          pararLeitura();
          callback(codigo);
        }
      }
      if (err && !(err instanceof NotFoundException)) {
        console.warn('Barcode scan error:', err);
      }
    });
  } catch (e) {
    active = false;
    throw e;
  }
}

export function pararLeitura(): void {
  active = false;
  if (reader) {
    reader.reset();
    reader = null;
  }
}

export function isAtivo(): boolean {
  return active;
}
