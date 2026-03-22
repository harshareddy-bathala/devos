type WindowWithTauriInternals = Window & {
  __TAURI_INTERNALS__?: unknown;
};

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  if (tagName === 'TEXTAREA') {
    return true;
  }

  if (tagName !== 'INPUT') {
    return target.isContentEditable;
  }

  const input = target as HTMLInputElement;
  const nonTextTypes = new Set([
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
  ]);

  return !nonTextTypes.has(input.type);
}

function isReloadShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (
    key === 'f5' ||
    ((event.ctrlKey || event.metaKey) && key === 'r') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'r')
  );
}

export function setupDesktopGuards() {
  const runtimeWindow = window as WindowWithTauriInternals;
  if (!runtimeWindow.__TAURI_INTERNALS__) {
    return () => undefined;
  }

  const originalAlert = window.alert;
  const originalConfirm = window.confirm;
  const originalPrompt = window.prompt;

  const onContextMenu = (event: MouseEvent) => {
    if (isEditableElement(event.target)) {
      return;
    }

    event.preventDefault();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (isReloadShortcut(event) || key === 'f12' || ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'i')) {
      event.preventDefault();
    }
  };

  window.alert = (message?: unknown) => {
    console.warn('Blocked browser alert in desktop mode:', message);
  };
  window.confirm = (message?: string) => {
    console.warn('Blocked browser confirm in desktop mode:', message);
    return false;
  };
  window.prompt = (message?: string, defaultValue?: string) => {
    console.warn('Blocked browser prompt in desktop mode:', message, defaultValue);
    return null;
  };

  window.addEventListener('contextmenu', onContextMenu);
  window.addEventListener('keydown', onKeyDown, { capture: true });

  return () => {
    window.removeEventListener('contextmenu', onContextMenu);
    window.removeEventListener('keydown', onKeyDown, { capture: true });
    window.alert = originalAlert;
    window.confirm = originalConfirm;
    window.prompt = originalPrompt;
  };
}