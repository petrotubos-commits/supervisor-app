import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  
  // Click on Clientes
  await page.click('button:has-text("Clientes")');
  await page.waitForTimeout(300);
  
  // Get the modal HTML
  const modalHtml = await page.locator('div.fixed.inset-0').first().innerHTML();
  console.log('Modal HTML (first 300 chars):');
  console.log(modalHtml.substring(0, 300));
  
  // Check computed styles
  const styles = await page.locator('div.fixed.inset-0').first().evaluate(el => {
    return window.getComputedStyle(el);
  });
  
  console.log('Display:', styles.display);
  console.log('Visibility:', styles.visibility);
  console.log('Opacity:', styles.opacity);
  
  await browser.close();
})();
