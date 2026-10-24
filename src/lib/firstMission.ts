import type { PlayerProfile } from './types';

export const FIRST_MISSION_TARGET = 10;
export const FIRST_MISSION_REWARD = 100;

export function advanceFirstMission(profile: PlayerProfile): PlayerProfile {
  const mission = profile.firstMission ?? { taps: 0, claimed: false };
  if (mission.claimed || mission.taps >= FIRST_MISSION_TARGET) return profile;
  return { ...profile, firstMission: { ...mission, taps: mission.taps + 1 } };
}

export function claimFirstMission(profile: PlayerProfile): PlayerProfile {
  if (!profile.firstMission || profile.firstMission.claimed || profile.firstMission.taps < FIRST_MISSION_TARGET) return profile;
  return {
    ...profile,
    points: profile.points + FIRST_MISSION_REWARD,
    firstMission: { ...profile.firstMission, claimed: true },
  };
}
