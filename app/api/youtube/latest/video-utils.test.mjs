import test from 'node:test';
import assert from 'node:assert/strict';
import { selectLatestUpload, isLiveCandidate, isActiveLive, durationSeconds } from './video-utils.ts';
const upload = (id, duration, publishedAt = '2026-10-01T00:00:00Z') => ({ id, snippet: { liveBroadcastContent: 'none', publishedAt }, contentDetails: { duration } });
const catalog = { ids: ['short'], complete: true, checkedAt: '2026-10-14T12:00:00Z' };
test('Shorts, archives and scheduled streams never become the latest normal upload', () => {
 const videos = [upload('short','PT25S','2026-10-10T00:00:00Z'), { ...upload('archive','PT2H'), liveStreamingDetails: { actualEndTime: '2026-10-14T01:00:00Z' } }, { ...upload('scheduled','PT0S'), snippet: { liveBroadcastContent: 'upcoming' } }, upload('normal','PT8M')];
 assert.equal(selectLatestUpload(videos, catalog).video?.id, 'normal');
});
test('a short normal upload is preserved when a complete Shorts catalog excludes it', () => {
 assert.equal(selectLatestUpload([upload('landscape','PT45S')], catalog).video?.id, 'landscape');
});
test('missing, incomplete or older catalogs do not mislabel a new Short', () => {
 const videos = [upload('new-short','PT30S','2026-10-14T11:50:00Z'), upload('older','PT10M')];
 for (const index of [null, { ...catalog, complete: false }, catalog]) assert.deepEqual(selectLatestUpload(videos,index), { video: null, uncertain: true });
});
test('long uploads can still be shown when Shorts lookup is unavailable', () => {
 assert.equal(selectLatestUpload([upload('normal','PT3M1S')], null).video?.id, 'normal');
});
test('scheduled streams are monitored but LIVE is shown only while active', () => {
 const scheduled = { id: 'stream', snippet: { liveBroadcastContent: 'upcoming' } };
 const active = { ...scheduled, snippet: { liveBroadcastContent: 'live' } };
 const ended = { ...active, liveStreamingDetails: { actualEndTime: '2026-10-14T12:00:00Z' } };
 assert.equal(isLiveCandidate(scheduled),true); assert.equal(isActiveLive(scheduled),false);
 assert.equal(isActiveLive(active),true); assert.equal(isActiveLive(ended),false); assert.equal(isLiveCandidate(ended),false);
});
test('invalid durations cannot be used as evidence of a normal upload', () => {
 for (const value of [undefined, '', 'P', 'bad']) assert.equal(durationSeconds(value),null);
 assert.deepEqual(selectLatestUpload([upload('unknown','bad')],catalog),{ video:null, uncertain:true });
});
