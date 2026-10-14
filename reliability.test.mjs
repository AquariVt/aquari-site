import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual client effect and route with deterministic time and
// mocked upstream HTTP. No credentials or live API quota are used by tests.
function loadSource(filename, mocks, globals = {}) {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(compiled, {
    module: loaded, exports: loaded.exports, URL, AbortController, setTimeout, clearTimeout,
    console: { error() {} }, ...globals,
    require(name) {
      if (name in mocks) return mocks[name];
      if (name.startsWith('.')) return loadSource(path.resolve(path.dirname(filename), `${name}.ts`), mocks, globals);
      throw new Error(`Unexpected dependency: ${name}`);
    },
  }, { filename });
  return loaded.exports;
}

async function pollingScenario(failedSection, transportFailure = false) {
  const start = Date.parse('2026-10-14T14:00:00Z');
  let clock = start, effect, timer;
  const requests = [];
  const react = {
    useState: initial => [initial, () => {}], useEffect: fn => { effect = fn; },
    useRef: current => ({ current }), useCallback: fn => fn, useSyncExternalStore: () => 'www.aquari-vt.jp',
  };
  const page = loadSource('app/page.tsx', {
    react, 'react/jsx-runtime': { jsx: () => null, jsxs: () => null }, 'next/image': () => null,
  }, {
    Date: class extends Date { static now() { return clock; } },
    document: { visibilityState: 'visible', addEventListener() {}, removeEventListener() {} },
    window: {
      setTimeout: () => 1, clearTimeout() {}, setInterval: fn => { timer = fn; return 1; },
      clearInterval() {}, addEventListener() {}, removeEventListener() {},
    },
    fetch: async () => {
      requests.push((clock - start) / 60000);
      return { ok: !transportFailure, json: async () => ({
        currentLive: null, latestShort: null, latestArchive: null, latestVideo: null,
        sections: Object.fromEntries(['live', 'archive', 'shorts', 'video'].map(name => [name, {
          status: name === failedSection ? 'error' : 'ok', checkedAt: new Date(clock).toISOString(),
        }])),
      }) };
    },
  });
  page.default();
  const cleanup = effect();
  const flush = () => new Promise(resolve => setImmediate(resolve));
  await flush();
  for (let minute = 1; minute <= 22; minute++) { clock += 60000; timer(); await flush(); }
  cleanup();
  return requests;
}

test('a failed Shorts, video or live section does not slow successful API polling', async () => {
  for (const section of ['shorts', 'video', 'live']) {
    assert.deepEqual(await pollingScenario(section), Array.from({ length: 23 }, (_, i) => i));
  }
});
test('whole-request failures still back off to avoid repeated failed requests', async () => {
  assert.deepEqual(await pollingScenario(null, true), [0, 2, 6, 14, 22]);
});

const channelId = 'UCBvSY3MYEkkJ194_Zdjp2Jw';
const video = (number, archive = true) => ({
  id: `v${String(number).padStart(10, '0')}`,
  snippet: { channelId, title: `Video ${number}`, liveBroadcastContent: 'none', publishedAt: '2026-09-01T00:00:00Z' },
  contentDetails: { duration: 'PT10M' }, status: { privacyStatus: 'public', embeddable: true },
  ...(archive ? { liveStreamingDetails: { actualEndTime: '2026-09-01T01:00:00Z' } } : {}),
});

async function apiScenario(videos, options = {}) {
  const requests = [];
  const route = loadSource('app/api/youtube/latest/route.ts', {
    'next/server': { NextResponse: { json: (body, init) => ({ body, ...init }) } },
    'next/cache': { unstable_cache: fn => {
      const cache = new Map();
      return (...args) => {
        const key = JSON.stringify(args);
        if (!cache.has(key)) cache.set(key, fn(...args));
        return cache.get(key);
      };
    } },
  }, {
    process: { env: { YOUTUBE_API_KEY: 'test-only', YOUTUBE_SHORTS_PLAYLIST_ID: 'UUSH_TEST_PLAYLIST' } },
    fetch: async input => {
      const url = new URL(input), endpoint = url.pathname.split('/').pop(), params = url.searchParams;
      requests.push({ endpoint, token: params.get('pageToken') });
      if (endpoint === 'channels') return { ok: true, json: async () => ({ items: [{ contentDetails: { relatedPlaylists: { uploads: 'UU_TEST_UPLOADS' } } }] }) };
      if (endpoint === 'search') return { ok: true, json: async () => ({ items: [] }) };
      if (endpoint === 'playlistItems') {
        if (params.get('playlistId') === 'UUSH_TEST_PLAYLIST') return { ok: true, json: async () => ({ items: [] }) };
        const offset = Number(params.get('pageToken') || 0);
        if (options.historyFails && offset >= 100) return { ok: false, status: 503 };
        const nextPageToken = options.repeatToken && offset >= 100 ? String(offset)
          : offset + 50 < videos.length ? String(offset + 50) : undefined;
        return { ok: true, json: async () => ({
          items: videos.slice(offset, offset + 50).map(item => ({ contentDetails: { videoId: item.id } })), nextPageToken,
        }) };
      }
      if (endpoint === 'videos') {
        const ids = new Set(params.get('id').split(','));
        return { ok: true, json: async () => ({ items: videos.filter(item => ids.has(item.id)) }) };
      }
      throw new Error(`Unexpected endpoint: ${endpoint}`);
    },
  });
  return { response: await route.GET(), requests };
}

test('normal uploads remain discoverable beyond 100 newer streams', async () => {
  const uploads = Array.from({ length: 150 }, (_, i) => video(i));
  uploads.push(video(150, false));
  const { response, requests } = await apiScenario(uploads);
  assert.equal(response.status, 200);
  assert.equal(response.body.latestVideo.id, uploads[150].id);
  assert.equal(response.body.sections.video.status, 'ok');
  assert.ok(requests.some(request => request.endpoint === 'playlistItems' && request.token === '150'));
});
test('history is not fetched when a normal upload is in the recent index', async () => {
  const uploads = Array.from({ length: 150 }, (_, i) => video(i, i !== 1));
  const { response, requests } = await apiScenario(uploads);
  assert.equal(response.body.latestVideo.id, uploads[1].id);
  assert.ok(!requests.some(request => Number(request.token) >= 100));
});
test('a failed history page is an isolated video error, not a false empty result', async () => {
  const { response } = await apiScenario(Array.from({ length: 150 }, (_, i) => video(i)), { historyFails: true });
  assert.equal(response.status, 200);
  assert.equal(response.body.sections.video.status, 'error');
  assert.equal(response.body.sections.archive.status, 'ok');
  assert.equal(response.body.sections.live.status, 'ok');
});
test('a repeated pagination token stops without looping or claiming there are no uploads', async () => {
  const { response } = await apiScenario(Array.from({ length: 150 }, (_, i) => video(i)), { repeatToken: true });
  assert.equal(response.body.sections.video.status, 'error');
});
test('no normal upload is reported only after the playlist is exhausted', async () => {
  const { response, requests } = await apiScenario(Array.from({ length: 151 }, (_, i) => video(i)));
  assert.equal(response.body.latestVideo, null);
  assert.equal(response.body.sections.video.status, 'ok');
  assert.ok(requests.some(request => request.token === '150'));
});
