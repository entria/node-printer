export interface PrinterProps {
    isDefault: boolean,
    name: string,
    options: any,
    status: string
}

export declare function getPrinters(): PrinterProps[];

export declare function getPrinter(printerName: string): PrinterProps;