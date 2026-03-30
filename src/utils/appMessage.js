let globalMessage = null;

export function setGlobalMessage(messageInstance) {
  globalMessage = messageInstance;
}

export function showErrorMessage(content) {
  if (!content || !globalMessage) return;
  globalMessage.error(content);
}

export function markErrorNotified(error) {
  if (!error || typeof error !== "object") return error;
  error.__toastShown = true;
  return error;
}

export function isErrorNotified(error) {
  return Boolean(error?.__toastShown);
}

export function notifyError(error, fallbackMessage = "网络异常，请稍后再试") {
  const target = error instanceof Error ? error : new Error(fallbackMessage);
  if (!target.message) target.message = fallbackMessage;
  if (!target.__toastShown) {
    showErrorMessage(target.message || fallbackMessage);
    markErrorNotified(target);
  }
  return target;
}