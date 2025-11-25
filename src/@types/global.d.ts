import "@tanstack/react-table";

declare global {
  interface Window {
    astilectron?: {
      sendMessage?: (message: any, callback?: (message: any) => void) => void;
      onMessage?: (
        callback: (message: { name: string; payload: any }) => void
      ) => void;
    };
  }

  const astilectron: {
    sendMessage?: (message: any, callback?: (message: any) => void) => void;
    onMessage?: (
      callback: (message: { name: string; payload: any }) => void
    ) => void;
  };
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    color?: string;
    bodyCellClassName?: string;
    headerClassName?: string;
  }
}

export {};
