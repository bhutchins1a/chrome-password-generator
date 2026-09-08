const DEFAULT_LENGTH = 15;

function saveOptions() {
  const lenInput = document.getElementById('length');
  const autoInsertInput = document.getElementById('autoInsert');
  let length = parseInt(lenInput.value, 10);

  if (isNaN(length) || length < 10) length = 10;
  if (length > 20) length = 20;

  chrome.storage.sync.set(
    {
      length,
      autoInsert: autoInsertInput.checked
    },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => (status.textContent = ''), 1500);
    }
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      length: DEFAULT_LENGTH,
      autoInsert: false
    },
    (items) => {
      document.getElementById('length').value = items.length;
      document.getElementById('autoInsert').checked = items.autoInsert;
    }
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
