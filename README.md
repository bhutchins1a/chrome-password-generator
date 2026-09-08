# Chrome Password Generator

A small, dependency-free Chrome extension that generates passwords designed to satisfy character requirements commonly used by websites.

The extension runs entirely in Chrome. It does not create accounts, use a cloud service, store generated passwords, or send generated passwords anywhere.

## Features

- Adjustable password length from **10 to 20 characters**
- Guarantees **at least one uppercase letter**
- Guarantees **at least one lowercase letter**
- Includes **exactly one digit** (`0-9`)
- Includes **exactly one special character** from `!@#$&_-`
- Uses the Web Crypto API (`crypto.getRandomValues()`) for random selection
- Randomizes character positions before returning the password
- Automatically copies newly generated passwords to the clipboard
- Optional auto-insert into the currently focused text/password field
- Keyboard shortcut: **Ctrl+Shift+Y**
- No external libraries or dependencies
- No build step
- Manifest V3

## Password format

For a selected length of `N`, every generated password contains at least one uppercase letter, at least one lowercase letter, exactly one digit, exactly one special character from `!@#$&_-`, and letters in all remaining positions.

The default length is **15 characters**.

The extension intentionally uses a conservative special-character set because many websites accept these characters even when they reject less common punctuation.

## Installation

This project is installed as an **unpacked Chrome extension** rather than through the Chrome Web Store.

### Download from GitHub

1. On the GitHub repository page, click **Code**.
2. Click **Download ZIP**.
3. Extract the ZIP file to a permanent folder.
4. In Chrome, open `chrome://extensions`.
5. Turn on **Developer mode**.
6. Click **Load unpacked**.
7. Select the folder containing `manifest.json`.

### Clone with Git

```bash
git clone https://github.com/bhutchins1a/chrome-password-generator.git
```

Then open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the cloned repository folder.

## Usage

Click the extension icon. A password is generated immediately and copied to the clipboard.

Use the **Length** slider to select 10-20 characters. Changing the length generates and copies a new password.

Click **Generate** to create another password, **Copy** to copy the displayed password, or **Options** to change the saved length and auto-insert preference.

### Keyboard shortcut

Press `Ctrl+Shift+Y` to generate a password using the saved length. Chrome extension shortcuts can be changed at `chrome://extensions/shortcuts`.

## Auto-insert

Auto-insert is **off by default**.

When enabled, the extension attempts to place the generated password into the currently focused text field or content-editable element on the active webpage.

Chrome blocks script injection into certain internal or protected pages, including pages such as `chrome://extensions`. On those pages the password can still be generated and copied, but auto-insert is skipped.

## Privacy

Generated passwords are created locally in the browser. The extension does not transmit or save generated passwords, maintain a password vault, collect browsing history, or use analytics, advertising, or tracking services.

The only settings stored through `chrome.storage.sync` are the selected password length and auto-insert preference. Chrome may synchronize those settings between signed-in Chrome installations.

See [PRIVACY.md](PRIVACY.md).

## Permissions

| Permission | Purpose |
| --- | --- |
| `storage` | Saves the selected length and auto-insert preference. |
| `clipboardWrite` | Copies generated passwords to the clipboard. |
| `activeTab` | Allows optional interaction with the active page. |
| `scripting` | Allows optional insertion into the focused field. |

## Security notes

Password generation uses `crypto.getRandomValues()` rather than `Math.random()`. Random indexes use rejection sampling to avoid modulo bias, and the completed password is shuffled with a Fisher-Yates shuffle driven by the same random source.

This project is a **password generator, not a password manager**. It does not store, synchronize, recover, or manage passwords after generation. Important passwords should be stored in a trusted password manager.

## Updating

If you cloned with Git:

```bash
git pull
```

Then return to `chrome://extensions` and click **Reload** for the extension.

## Project structure

```text
manifest.json
popup.html
popup.js
options.html
options.js
service-worker.js
```

No package manager, external dependency, framework, or compilation step is required.

## Contributing

Bug reports, suggestions, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

For security-related reports, see [SECURITY.md](SECURITY.md).

## License

Released under the [MIT License](LICENSE).
