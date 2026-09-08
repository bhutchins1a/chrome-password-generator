# Contributing

Contributions are welcome. This project is intentionally small and dependency-free, and changes that preserve that simplicity are preferred.

## Bug reports

Please include the Chrome version, extension version, expected behavior, actual behavior, and steps to reproduce. Do not include real passwords, credentials, tokens, or other sensitive information.

## Pull requests

Before submitting a pull request:

1. Test the extension as an unpacked Chrome extension.
2. Test several password lengths from 10 through 20.
3. Confirm every password has at least one uppercase letter, at least one lowercase letter, exactly one digit, and exactly one character from `!@#$&_-`.
4. Confirm clipboard copying works.
5. If auto-insert code changes, test an ordinary webpage and confirm protected Chrome pages do not create unchecked runtime errors.
6. Keep unrelated changes out of the same pull request.

No build step is required.
