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

function setStatus(msg) {
  const status = document.getElementById('status');
  status.textContent = msg;
  if (msg) {
    setTimeout(() => (status.textContent = ''), 2000);
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus('Copied to clipboard.');
  } catch (e) {
    setStatus('Copy failed.');
  }
}

function updatePassword(length, autoInsert) {
  const passwordInput = document.getElementById('password');
  const pwd = generatePassword(length);
  passwordInput.value = pwd;
  copyToClipboard(pwd);

  if (autoInsert) {
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
}

document.addEventListener('DOMContentLoaded', () => {
  const lengthRange = document.getElementById('lengthRange');
  const lengthDisplay = document.getElementById('lengthDisplay');
  const generateBtn = document.getElementById('generate');
  const copyBtn = document.getElementById('copy');
  const passwordInput = document.getElementById('password');
  const optionsBtn = document.getElementById('options');

  chrome.storage.sync.get(
    {
      length: DEFAULT_LENGTH,
      autoInsert: false
    },
    (items) => {
      const length = items.length;
      const autoInsert = items.autoInsert;

      lengthRange.value = length;
      lengthDisplay.textContent = length;

      updatePassword(length, autoInsert);
    }
  );

  lengthRange.addEventListener('input', () => {
    const length = parseInt(lengthRange.value, 10);
    lengthDisplay.textContent = length;

    chrome.storage.sync.get(
      {
        autoInsert: false
      },
      (items) => {
        chrome.storage.sync.set({ length }, () => {
          updatePassword(length, items.autoInsert);
        });
      }
    );
  });

  generateBtn.addEventListener('click', () => {
    chrome.storage.sync.get(
      {
        length: DEFAULT_LENGTH,
        autoInsert: false
      },
      (items) => {
        updatePassword(items.length, items.autoInsert);
      }
    );
  });

  copyBtn.addEventListener('click', () => {
    const value = passwordInput.value;
    if (!value) {
      setStatus('Nothing to copy.');
      return;
    }
    copyToClipboard(value);
  });

  optionsBtn.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
});
