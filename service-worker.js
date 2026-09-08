const DEFAULT_LENGTH = 15;

function generatePassword(length = DEFAULT_LENGTH) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charsLen = chars.length;
  let result = '';

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  const max = 0x100000000 - (0x100000000 % charsLen);

  for (let i = 0; i < length; i++) {
    let val = randomValues[i];
    while (val >= max) {
      val = crypto.getRandomValues(new Uint32Array(1))[0];
    }
    const idx = val % charsLen;
    result += chars.charAt(idx);
  }

  return result;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // Might fail on some pages; nothing critical.
  }
}

function insertIntoActiveField(pwd) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.id) return;

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: (value) => {
          const el = document.activeElement;
          if (!el) return;
          if ('value' in el) {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (el.isContentEditable) {
            el.textContent = value;
          }
        },
        args: [pwd]
      },
      () => {}
    );
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'generate-password') return;

  chrome.storage.sync.get(
    {
      length: DEFAULT_LENGTH,
      autoInsert: false
    },
    async (items) => {
      const pwd = generatePassword(items.length);
      await copyToClipboard(pwd);
      if (items.autoInsert) {
        insertIntoActiveField(pwd);
      }
    }
  );
});
