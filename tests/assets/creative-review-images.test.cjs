const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.resolve(__dirname, '../../skills/ad-creative/assets/creative-review-template.html'), 'utf8');
const classifier = html.match(/^function localImageSource\(value\) \{[\s\S]*?^\}/m)?.[0];
assert.ok(classifier, 'The shipped template must expose the supplied-image classifier');
function classify(value, baseURI = 'https://review.example/client/index.html') {
  const context = { URL, document: { baseURI } };
  vm.createContext(context);
  vm.runInContext(classifier, context);
  return context.localImageSource(value);
}

for (const value of [
  'https://remote.example/pixel.png', '//remote.example/pixel.png',
  'ht\ttps://remote.example/pixel.png', 'ht\ntps://remote.example/pixel.png',
  '\\\\remote.example/pixel.png', '/\\remote.example/pixel.png',
  '\u0000 https://remote.example/pixel.png', 'https://review.example/local.png',
  'file://remote.example/share/pixel.png', 'javascript:alert(1)',
]) {
  test(`blocks remote or unsupported image source ${JSON.stringify(value)}`, () => {
    assert.equal(classify(value), '');
  });
}
for (const value of ['images/creative.png', '../images/creative.png', '/images/creative.png', 'data:image/png;base64,AA==']) {
  test(`keeps supplied local/data image ${JSON.stringify(value)}`, () => {
    assert.equal(classify(value), value);
  });
}
test('keeps packaged file assets in a local review page', () => {
  assert.equal(classify('images/creative.png', 'file:///tmp/review/index.html'), 'images/creative.png');
  assert.equal(classify('file:///tmp/review/creative.png'), 'file:///tmp/review/creative.png');
});
test('missing, non-string and invalid sources fall back to placeholders', () => {
  for (const value of [undefined, null, 42, '', '//[invalid']) assert.equal(classify(value), '');
});
