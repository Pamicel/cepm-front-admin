import formatDuration from './format-duration'

describe('@utils/format-duration', () => {
  it('works with less than an hour', () => {
    const result = formatDuration(20)
    expect(result).toEqual('20min')
  })
  it('works with more than an hour', () => {
    const result = formatDuration(70)
    expect(result).toEqual('1h10min')
  })
})
