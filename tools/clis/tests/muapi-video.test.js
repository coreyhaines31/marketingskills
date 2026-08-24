import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPayload,
  pollGeneration,
  selectVideoUrl,
  submitGeneration,
} from '../muapi-video.js';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

test('builds a current text-to-video payload', () => {
  assert.deepEqual(
    buildPayload({
      model: 'hunyuan-text-to-video',
      prompt: 'slow dolly through a sunlit studio',
      aspectRatio: '9:16',
      details: null,
    }),
    { prompt: 'slow dolly through a sunlit studio', aspect_ratio: '9:16' },
  );
});

test('builds an image-to-video payload only with an HTTPS source', () => {
  assert.deepEqual(
    buildPayload({
      model: 'hunyuan-image-to-video',
      prompt: 'subtle camera push-in',
      image: 'https://cdn.example.test/frame.png',
      aspectRatio: '16:9',
      details: null,
    }),
    {
      prompt: 'subtle camera push-in',
      aspect_ratio: '16:9',
      image_url: 'https://cdn.example.test/frame.png',
    },
  );
  assert.throws(
    () => buildPayload({ model: 'hunyuan-image-to-video', prompt: 'move', image: 'http://example.test/frame.png' }),
    /HTTPS URL/,
  );
});

test('submits exactly one generation POST', async () => {
  const calls = [];
  const result = await submitGeneration({
    apiBase: 'https://api.example.test',
    apiKey: 'secret',
    endpoint: '/api/v1/hunyuan-text-to-video',
    payload: { prompt: 'tree' },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return jsonResponse({ request_id: 'request-1', status: 'queued' });
    },
  });
  assert.equal(result.request_id, 'request-1');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.method, 'POST');
});

test('polls bounded result GETs and returns a completed result', async () => {
  let calls = 0;
  const delays = [];
  const result = await pollGeneration({
    apiBase: 'https://api.example.test',
    apiKey: 'secret',
    id: 'request-1',
    maxPolls: 3,
    pollIntervalMs: 1,
    sleepImpl: async (delay) => delays.push(delay),
    fetchImpl: async (_url, init) => {
      assert.equal(init.method, 'GET');
      calls += 1;
      if (calls === 1) return jsonResponse({ status: 'processing' });
      return jsonResponse({ status: 'completed', outputs: ['https://cdn.example.test/video.mp4'] });
    },
  });
  assert.equal(result.status, 'completed');
  assert.equal(calls, 2);
  assert.equal(delays.length, 1);
});

test('stops on terminal errors without retrying the generation', async () => {
  let calls = 0;
  await assert.rejects(
    pollGeneration({
      apiBase: 'https://api.example.test',
      apiKey: 'secret',
      id: 'request-1',
      maxPolls: 4,
      sleepImpl: async () => {},
      fetchImpl: async () => {
        calls += 1;
        return jsonResponse({ status: 'failed', error: 'schema rejected' });
      },
    }),
    /schema rejected/,
  );
  assert.equal(calls, 1);
});

test('selects HTTPS video output URLs and ignores unsafe values', () => {
  assert.equal(
    selectVideoUrl({ output: { video: 'https://cdn.example.test/video.webm' } }),
    'https://cdn.example.test/video.webm',
  );
  assert.equal(selectVideoUrl({ outputs: ['http://example.test/video.mp4'] }), null);
});

test('rejects an invalid aspect ratio before network dispatch', () => {
  assert.throws(
    () => buildPayload({ model: 'hunyuan-text-to-video', prompt: 'test', aspectRatio: '4:3' }),
    /aspect-ratio must be one of/,
  );
});
