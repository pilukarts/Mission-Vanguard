// Run with Node 24+: node --experimental-strip-types --test tests/first-mission.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceFirstMission, claimFirstMission, FIRST_MISSION_REWARD } from '../src/lib/firstMission.ts';

test('older profiles can start the mission without changing existing progress', () => {
  const profile = { points: 23, activeDailyQuests: [{ progress: 7 }], hasPremiumPass: true };
  const next = advanceFirstMission(profile);
  assert.deepEqual(next.firstMission, { taps: 1, claimed: false });
  assert.equal(profile.firstMission, undefined);
  assert.equal(next.points, 23);
  assert.deepEqual(next.activeDailyQuests, profile.activeDailyQuests);
  assert.equal(next.hasPremiumPass, true);
});

test('mission resumes after saving and reloading; reward can be claimed only once', () => {
  let profile = { points: 23 };
  assert.equal(claimFirstMission(profile), profile);
  for (let i = 0; i < 5; i++) profile = advanceFirstMission(profile);
  profile = JSON.parse(JSON.stringify(profile));
  assert.equal(claimFirstMission(profile), profile);
  for (let i = 0; i < 6; i++) profile = advanceFirstMission(profile);
  assert.equal(profile.firstMission.taps, 10);
  profile = claimFirstMission(profile);
  assert.equal(profile.points, 23 + FIRST_MISSION_REWARD);
  profile = JSON.parse(JSON.stringify(profile));
  assert.equal(claimFirstMission(profile), profile);
  assert.equal(advanceFirstMission(profile), profile);
});
