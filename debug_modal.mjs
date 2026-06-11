import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1400, height: 900 }
  });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  
  // Click on Clientes button
  await page.click('button:has-text("Clientes")');
  await page.waitForTimeout(500);
  
  // Check if modal exists in DOM
  const modalExists = await page.locator('div.fixed.inset-0').count();
  console.log('Modal overlay found:', modalExists > 0);
  
  // Check if modal title exists
  const titleExists = await page.locator('h2:has-text("Gestionar Clientes")').count();
  console.log('Modal title found:', titleExists > 0);
  
  // Get HTML
  const html = await page.content();
  const hasModal = html.includes('Gestionar Clientes');
  console.log('HTML contains modal title:', hasModal);
  
  await browser.close();
})();
