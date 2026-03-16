declare module 'qrcode' {
  interface QRCodeOptions {
    type?: string;
    margin?: number;
    width?: number;
    errorCorrectionLevel?: string;
  }
  interface QRCodeExport {
    toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
    toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      options?: QRCodeOptions
    ): Promise<void>;
  }
  const qrcode: QRCodeExport;
  export default qrcode;
}
