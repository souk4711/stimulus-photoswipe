export const findController = (application, selector, controllerName) => {
  const ele = document.querySelector(selector)
  return application.getControllerForElementAndIdentifier(ele, controllerName)
}

export const aTimeout = async (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export const nextFrame = async () => {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

export const click = async (selector) => {
  document.querySelector(selector).click()
  return nextFrame()
}
