# neighbor - Word Add-in

This directory contains the Microsoft Word Add-in for `a11yfred`. It helps writers check their documents for accessibility and inclusive language directly inside Microsoft Word.

## How it works

The Word Add-in uses React and Vite. It connects to the `neighbor` content rules to find problems like:

- Ableist language
- Confusing idioms
- Vague link text
- Text in ALL CAPS

## How to run locally

To start the development server for the add-in:

```bash
npm install
npm run dev
```

You can then load the add-in into Microsoft Word using the manifest file.

## Technologies used

- **React**: For the user interface.
- **Vite**: For fast building and development.
- **Office.js**: To connect with Microsoft Word.
