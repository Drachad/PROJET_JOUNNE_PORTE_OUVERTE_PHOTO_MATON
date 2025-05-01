interface Navigator {
  share?: (data: {
    title?: string
    text?: string
    url?: string
    files?: File[]
  }) => Promise<void>
}
