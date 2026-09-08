# Security Policy

## Supported version

The latest version in the repository is the supported version.

## Reporting a vulnerability

Please do not publish sensitive vulnerability details in a normal GitHub issue.

If GitHub's **Private vulnerability reporting** / **Report a vulnerability** feature is available, use it. Otherwise, open a minimal public issue stating that you have a security concern and need a private contact channel; do not include exploit details, secrets, or generated passwords.

## Security design

The extension generates passwords locally, uses `crypto.getRandomValues()`, uses rejection sampling for character indexes, shuffles characters before returning the password, does not store generated passwords in Chrome storage, has no external JavaScript dependencies, and has no remote password-generation service.

This project is a password generator, not a password manager.
