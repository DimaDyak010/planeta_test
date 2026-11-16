interface Notification {
  type: 'success' | 'error'
  message: string
}

export function useNotifications() {
  const notification = useState<Notification | null>('notification', () => null)

  function success(message: string) {
    notification.value = { type: 'success', message }
    const displayed = notification.value

    if (import.meta.client) {
      setTimeout(() => {
        if (notification.value === displayed) dismiss()
      }, 4000)
    }
  }

  function error(message: string) {
    notification.value = { type: 'error', message }
  }

  function dismiss() {
    notification.value = null
  }

  return { notification, success, error, dismiss }
}
