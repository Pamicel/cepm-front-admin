import * as groupMakerModule from './group-maker'
import { createGroups } from './group-maker.helpers'
import { groupData } from './group-maker.data'

describe('function createGroups', () => {
  it('does not throw', () => {
    expect(() => createGroups(groupData[0])).not.toThrow()
  })

  it('testing data is an array of arrays', () => {
    expect(groupData instanceof Array).toBe(true)
    expect(groupData.every((entry) => entry instanceof Array)).toBe(true)
  })

  it('returns an object with the correct structure', () => {
    for (let i = 0; i < groupData.length; i++) {
      const groups = createGroups(groupData[i])
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
    }
  })

  it('returns non-empty groups', () => {
    for (let i = 0; i < groupData.length; i++) {
      const groups = createGroups(groupData[i])
      expect(groups[1].profiles.length).not.toEqual(0)
      expect(groups[2].profiles.length).not.toEqual(0)
      expect(groups[3].profiles.length).not.toEqual(0)
      expect(groups[4].profiles.length).not.toEqual(0)
      expect(groups[5].profiles.length).not.toEqual(0)
      expect(groups[6].profiles.length).not.toEqual(0)
    }
  })

  it('does not forget anyone', () => {
    for (let i = 0; i < groupData.length; i++) {
      const groups = createGroups(groupData[i])
      const total =
        groups[1].profiles.length +
        groups[2].profiles.length +
        groups[3].profiles.length +
        groups[4].profiles.length +
        groups[5].profiles.length +
        groups[6].profiles.length
      expect(total).toEqual(groupData[0].length)
    }
  })

  it('creates balanced groups', () => {
    for (let i = 0; i < groupData.length; i++) {
      const groups = createGroups(groupData[i])
      const groupSizes = Object.values(groups)
        .map((gp) => gp.profiles.length)
        .sort((lenA, lenB) => (lenA > lenB ? 1 : -1))
      expect(
        groupSizes[groupSizes.length - 1] - groupSizes[0]
      ).toBeLessThanOrEqual(1)
    }
  })
})

describe('@state/modules/group-maker', () => {
  it('exports a valid Vuex module', () => {
    expect(groupMakerModule).toBeAVuexModule()
  })
})
