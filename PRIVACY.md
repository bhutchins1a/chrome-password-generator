# Privacy Policy

Chrome Password Generator generates passwords locally in the user's browser.

It does not collect, transmit, sell, share, or remotely store personal information or generated passwords.

## Generated passwords

Generated passwords exist only as needed to display, copy, or optionally insert them. The extension does not save generated passwords to Chrome storage, a remote service, an analytics platform, or a password database.

A generated password may be copied to the system clipboard. Clipboard contents are then subject to the operating system, browser, clipboard-history features, and other software installed on the device.

## Stored settings

The extension stores only the selected password length and whether auto-insert is enabled. These settings are stored with `chrome.storage.sync`.

Chrome may synchronize those settings between Chrome installations associated with the same signed-in Chrome profile. No generated password is intentionally placed in `chrome.storage.sync`.

## Website interaction

If auto-insert is enabled, the extension may place the newly generated password into the currently focused text field or content-editable element on the active webpage.

The extension does not read, collect, or transmit existing page form contents as part of this feature.

Chrome blocks script injection into certain internal or protected pages. Auto-insert is skipped where Chrome does not permit it.

## Network activity

The extension does not require a remote server or external API for password generation and contains no analytics, advertising, tracking, or telemetry service.

## Changes

If the extension's data practices change, this statement should be updated before release.
