const DEFAULT_LENGTH = 15;

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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

  // Exactly one digit and exactly one allowed special character.
  // All remaining characters are letters.
  const chars = [
    randomChar(DIGITS),
    randomChar(SPECIALS)
  ];

  for (let i = 0; i < length - 2; i++) {
    chars.push(randomChar(LETTERS));
  }

  // Randomize the position of every character.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
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
