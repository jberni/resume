#!/usr/bin/env node
/**
 * Print resume.html to PDF with background graphics (gray sidebar, blue accents).
 * Run: node print-resume-pdf.js
 * Requires: npm install puppeteer (one-time)
 */
const path = require('path');
const fs = require('fs');

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not found. Run: npm install puppeteer');
    process.exit(1);
  }

  const htmlPath = path.join(__dirname, 'resume.html');
  const pdfPath = path.join(process.env.HOME || '', 'Downloads', 'resume.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('resume.html not found in', __dirname);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.45in', right: '0.45in', bottom: '0.45in', left: '0.45in' }
  });
  await browser.close();
  console.log('PDF saved to', pdfPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
