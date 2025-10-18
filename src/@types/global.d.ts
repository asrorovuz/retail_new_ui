export {}

declare global {
  interface Window {
    astilectron?: {
      sendMessage?: (
        message: any,
        callback?: (message: any) => void
      ) => void
      onMessage?: (
        callback: (message: { name: string; payload: any }) => void
      ) => void
    }
  }

  const astilectron: {
    sendMessage?: (
      message: any,
      callback?: (message: any) => void
    ) => void
    onMessage?: (
      callback: (message: { name: string; payload: any }) => void
    ) => void
  }
}
