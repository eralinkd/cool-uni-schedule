import { push } from 'notivue'

export const useShowNotivue = () => {
  const showNotivue = (haveError, errorText, successText) => {
    if (haveError && errorText) {
      push.error({
        title: 'Error occurred!',
        message: errorText,
        duration: 3000
      })
    }
    else if (!haveError && successText) {
      push.success({
        title: 'Success!',
        message: successText,
        duration: 3000
      })
    }
  }

  const success = (message, title = 'Success!') => {
    push.success({
      title,
      message,
      duration: 3000
    })
  }

  const error = (message, title = 'Error occurred!') => {
    push.error({
      title,
      message,
      duration: 5000
    })
  }

  const info = (message, title = 'Information') => {
    push.info({
      title,
      message,
      duration: 4000
    })
  }

  const warning = (message, title = 'Warning') => {
    push.warning({
      title,
      message,
      duration: 4000
    })
  }

  return {
    showNotivue,
    success,
    error,
    info,
    warning
  }
}
