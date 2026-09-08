const DEFAULT_LENGTH = 15;

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const LETTERS = UPPERCASE + LOWERCASE;
const SPECIALS = '!@#$&_-';
const DIGITS = '0123456789';

function randomIndex(maxExclusive) {
  const limit = 0x100000000 - (0x100000000 % maxExclusive);
  let value;

  do {
    value = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (value >= limit);

  return value % maxExclusive;
}

function randomChar(chars) {
  return chars.charAt(randomIndex(chars.length));
}

function generatePassword(length = DEFAULT_LENGTH) {
  length = Math.max(10, Math.min(20, length));

  // Guarantee every generated password contains:
  // - at least one uppercase letter
  // - at least one lowercase letter
  // - exactly one digit
  // - exactly one allowed special character
  const chars = [
    randomChar(UPPERCASE),
    randomChar(LOWERCASE),
    randomChar(DIGITS),
    randomChar(SPECIALS)
  ];

  // Fill the remaining positions with letters only.
  for (let i = 0; i < length - 4; i++) {
    chars.push(randomChar(LETTERS));
  }

  // Randomize the position of every character.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
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
      if (!tab || !tab.id || !tab.url) return;

      // Chrome does not allow extensions to inject scripts into
      // internal or protected browser pages.
      if (
        tab.url.startsWith('chrome://') ||
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:')
      ) {
        return;
      }

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
        () => {
          if (chrome.runtime.lastError) {
            // Ignore pages where Chrome prohibits script injection.
          }
        }
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
