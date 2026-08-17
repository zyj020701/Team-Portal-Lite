import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.goto('http://localhost:3000/todos', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2000));

const result = await page.evaluate(() => {
  const container = document.querySelector('[data-testid="virtual-list-container"]');
  if (!container) return { error: 'container not found' };
  const inner = container.children[0];
  const itemCount = inner ? inner.children.length : 0;
  const totalHeight = inner ? inner.style.height : 'unknown';
  return { itemCount, totalHeight };
});

console.log('Virtual list verification:');
console.log('  Rendered item divs:', result.itemCount);
console.log('  Total scroll height:', result.totalHeight);
console.log('  Expected visible items ~10-15 (600px / 64px + overscan 5)');
console.log('  Total data: 10000 items');

if (result.itemCount > 0 && result.itemCount < 50) {
  console.log('\n✓ PASS: Only visible items rendered in DOM (virtual scrolling works)');
} else {
  console.log('\n✗ FAIL: Unexpected item count');
}

await browser.close();