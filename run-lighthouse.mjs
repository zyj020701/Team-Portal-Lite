import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Launching Edge in visible mode...');
const chrome = await launch({
  chromePath: edgePath,
  chromeFlags: [
    '--port=9222',
    '--disable-web-security',
  ],
});

console.log('Edge launched on port', chrome.port);

try {
  const result = await lighthouse('http://localhost:3000', {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.56,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4,
    },
  });

  const reportJson = JSON.parse(result.report);
  const categories = reportJson.categories;
  const audits = reportJson.audits;

  const metrics = {
    performance_score: categories.performance.score * 100,
    lcp: {
      value: audits['largest-contentful-paint'].numericValue,
      score: audits['largest-contentful-paint'].score,
      displayValue: audits['largest-contentful-paint'].displayValue,
    },
    fcp: {
      value: audits['first-contentful-paint'].numericValue,
      score: audits['first-contentful-paint'].score,
      displayValue: audits['first-contentful-paint'].displayValue,
    },
    tbt: {
      value: audits['total-blocking-time'].numericValue,
      score: audits['total-blocking-time'].score,
      displayValue: audits['total-blocking-time'].displayValue,
    },
    cls: {
      value: audits['cumulative-layout-shift'].numericValue,
      score: audits['cumulative-layout-shift'].score,
      displayValue: audits['cumulative-layout-shift'].displayValue,
    },
    si: {
      value: audits['speed-index'].numericValue,
      score: audits['speed-index'].score,
      displayValue: audits['speed-index'].displayValue,
    },
  };

  console.log('\n=== LIGHTHOUSE RESULTS ===');
  console.log(JSON.stringify(metrics, null, 2));

  mkdirSync('docs/performance', { recursive: true });
  writeFileSync('docs/performance/lighthouse-report.json', result.report);
  writeFileSync('docs/performance/lighthouse-metrics.json', JSON.stringify(metrics, null, 2));
  console.log('\nReport saved to docs/performance/');
} catch (err) {
  console.error('Lighthouse error:', err.message);
  process.exitCode = 1;
} finally {
  await chrome.kill();
}