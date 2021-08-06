import * as groupMakerModule from './group-maker'
import * as groupData from './group-maker.data'

const profileGroupId = ({
  profile = {},
  groups = {
    1: { id: 1, profiles: [] },
    2: { id: 2, profiles: [] },
    3: { id: 3, profiles: [] },
    4: { id: 4, profiles: [] },
    5: { id: 5, profiles: [] },
    6: { id: 6, profiles: [] },
  },
  maxGroupSize,
}) => {
  if (!profile.potentialGroupIds || profile.potentialGroupIds.length === 0) {
    return null // Not assigned to a group
  }

  const nonOverflow = profile.potentialGroupIds
    .map((id) => groups[id])
    .filter((gp) => gp.profiles.length < maxGroupSize)

  if (nonOverflow.length === 0) {
    // If all groups overflow
    return null // Not assigned to a group
  }

  const noFriends = nonOverflow.filter((gp) =>
    gp.profiles.every((p) => !profile.friends.includes(p.id))
  )

  if (noFriends.length === 0) {
    const smallest = nonOverflow.sort((a1, a2) =>
      a1.profiles.length > a2.profiles.length ? 1 : -1
    )[0]
    return smallest.id
  }

  return noFriends.sort((a1, a2) =>
    a1.profiles.length > a2.profiles.length ? 1 : -1
  )[0].id
}

const createGroups = (profiles = []) => {
  const groups = {}
  const N_GROUPS = 6
  const maxGroupSize = Math.ceil(profiles.length / N_GROUPS)

  for (let id = 1; id <= N_GROUPS; id++) {
    groups[id] = {
      id,
      profiles: [],
    }
  }

  const waitList = []

  const assignProfilesToGroupsOrWaitingList = (profiles) => {
    profiles.forEach((profile) => {
      const groupId = profileGroupId({
        profile,
        groups,
        maxGroupSize,
      })
      if (groupId) {
        groups[groupId].profiles.push(profile)
      } else {
        waitList.push(profile)
      }
    })
  }

  const MIN_RESPONSES = 6

  // Create proto-groups
  const protoGroups = {
    forced: [],
    selected: [],
    fewResponses: [],
    remainder: [],
  }
  profiles.forEach((profile) => {
    // Order of priority:
    // 1- forced
    // 2- selected
    // 3- few responses

    if (profile.forced) {
      protoGroups.forced.push(profile)
    } else if (profile.selectedFor.length !== 0) {
      protoGroups.selected.push(profile)
    } else if (profile.nResponses < MIN_RESPONSES) {
      protoGroups.fewResponses.push(profile)
    } else {
      protoGroups.remainder.push(profile)
    }
  })

  // Put "forced" profiles in their assigned groups
  const forced = protoGroups.forced.map((profile) => {
    return { ...profile, potentialGroupIds: [profile.forced] }
  })
  assignProfilesToGroupsOrWaitingList(forced)

  // Put "selected" profiles in the waitList
  // (the reasoning is that they were selected and thus
  //  are sure to have an experience, so they are used
  //  as fill-ins)
  protoGroups.selected.forEach((profile) => waitList.push(profile))

  // Put "low response" profiles in 3 or 4
  const fewResponses = protoGroups.fewResponses
    // sort so that profiles w/ less responses are prioritized
    .sort((pa, pb) => (pa.nResponses > pb.nResponses ? 1 : -1))
    .map((profile) => {
      return { ...profile, potentialGroupIds: [3, 4] }
    })
  assignProfilesToGroupsOrWaitingList(fewResponses)

  /**
   * Table of truth for remaining profiles
   *
   * GR means "grievances == true"
   * PB means "public == true"
   * PR means "private == true"
   *
   * GR  PB  PR  Group      (case)    // reasoning
   * ----------------------------------------------------------------------
   * 0   0   0   waitList   (A)       // not interesting
   * 0   0   1   [4, 5, 6]  (B)       // groups with the "public" experience
   * 0   1   0   [1, 2, 3]  (C)       // groups with the "private" experience
   * 0   1   1   waitList   (A)       // not interesting
   * 1   0   0   [2, 6]     (D)       // groups with the "grievances" experience
   * 1   0   1   [6]        (E)       // "public" ∩ "grievances"
   * 1   1   0   [2]        (F)       // "private" ∩ "grievances"
   * 1   1   1   [2, 6]     (D)       // groups with the "grievances" experience
   *
   * boolean equations per case
   * A <= !GR && PB === PR
   * B <= !GR && !PB && PR
   * C <= !GR && PB && !PR
   * D <= GR && PB === PR
   * E <= GR && !PB && PR
   * F <= GR && PB && !PR
   *
   */

  // Give potential group ids to the remaining profiles
  const remainder = protoGroups.remainder.map((profile) => {
    const gr = profile.grievances
    const pb = profile.public
    const pr = profile.private
    let potentialGroupIds

    if (!gr) {
      if (pb === pr) {
        // A
        potentialGroupIds = [] // ie put in waitList
      } else if (pr) {
        // B
        potentialGroupIds = [4, 5, 6]
      } else if (pb) {
        // C
        potentialGroupIds = [1, 2, 3]
      }
    } else {
      if (pb === pr) {
        // D
        potentialGroupIds = [2, 6]
      } else if (pr) {
        // E
        potentialGroupIds = [6]
      } else if (pb) {
        // F
        potentialGroupIds = [2]
      }
    }

    return { ...profile, potentialGroupIds }
  })

  assignProfilesToGroupsOrWaitingList(remainder)

  // Top up with the wailList
  assignProfilesToGroupsOrWaitingList(
    waitList.map((profile) => {
      return { ...profile, potentialGroupIds: [1, 2, 3, 4, 5, 6] }
    })
  )

  return groups
}

describe('function createGroups', () => {
  it('does not throw', () => {
    expect(() => createGroups(groupData[0])).not.toThrow()
  })

  it('returns an object with the correct structure', () => {
    const groups = createGroups(groupData[0])
    expect(groups[1]).toBeDefined()
    expect(groups[2]).toBeDefined()
    expect(groups[3]).toBeDefined()
    expect(groups[4]).toBeDefined()
    expect(groups[5]).toBeDefined()
    expect(groups[6]).toBeDefined()
    expect(groups[1].profiles).toBeDefined()
    expect(groups[2].profiles).toBeDefined()
    expect(groups[3].profiles).toBeDefined()
    expect(groups[4].profiles).toBeDefined()
    expect(groups[5].profiles).toBeDefined()
    expect(groups[6].profiles).toBeDefined()
    expect(groups[1].id).toBe(1)
    expect(groups[2].id).toBe(2)
    expect(groups[3].id).toBe(3)
    expect(groups[4].id).toBe(4)
    expect(groups[5].id).toBe(5)
    expect(groups[6].id).toBe(6)
  })
  // it('returns non-empty groups', () => {
  //   const groups = createGroups(groupData[0])
  //   expect(groups[1].profiles.length).not.toEqual(0)
  //   expect(groups[2].profiles.length).not.toEqual(0)
  //   expect(groups[3].profiles.length).not.toEqual(0)
  //   expect(groups[4].profiles.length).not.toEqual(0)
  //   expect(groups[5].profiles.length).not.toEqual(0)
  //   expect(groups[6].profiles.length).not.toEqual(0)
  // })
})

describe('@state/modules/group-maker', () => {
  it('exports a valid Vuex module', () => {
    expect(groupMakerModule).toBeAVuexModule()
  })
})