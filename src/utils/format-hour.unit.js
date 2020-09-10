import formatHour from './format-hour'

describe('@utils/format-hour', () => {
  it('correctly compares dates years apart', () => {
    const date = new Date(2002, 5, 1, 20, 0)
    const formattedDate = formatHour(date)
    expect(formattedDate).toEqual('20h00')
  })

  it('correctly compares dates months apart', () => {
    const date = new Date(2017, 8, 1, 21, 8)
    const formattedDate = formatHour(date)
    expect(formattedDate).toEqual('21h08')
  })

  it('correctly compares dates days apart', () => {
    const date = new Date(2017, 11, 11, 8, 25)
    const formattedDate = formatHour(date)
    expect(formattedDate).toEqual('8h25')
  })
})
