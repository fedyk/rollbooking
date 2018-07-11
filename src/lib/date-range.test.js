const assert = require('assert')
const DateRange = require('./date-range');

describe('lib:DateRange', () => {
  it('should create an instance', () => {
    assert.ok(DateRange(new Date, new Date), 'create new range by passing start and end date')
    assert.ok(DateRange({
      start: '1985-04-12T10:20:50.52Z',
      end: '1985-04-12T18:20:50.52Z'
    }), 'create new range by passing start and end object')
  })

  describe('#isOverlap', () => {
    it('should overlap 1', () => {
      assert(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T11:00:00.00Z', '2018-05-01T12:00:00.00Z')
        )
      )
    })
    
    it('should overlap 2', () => {
      assert(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T09:00:00.00Z', '2018-05-01T11:00:00.00Z')
        )
      )
    })
    
    it('should overlap 3', () => {
      assert(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T17:00:00.00Z', '2018-05-01T19:00:00.00Z')
        )
      )
    })
    
    it('should overlap 4', () => {
      assert(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z')
        )
      )
    })
    
    it('should overlap 5', () => {
      assert(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T09:00:00.00Z', '2018-05-01T19:00:00.00Z')
        )
      )
    })
    
    it('should NOT overlap 1', () => {
      assert(
        !DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T09:00:00.00Z', '2018-05-01T10:00:00.00Z')
        )
      )
    })
    
    it('should NOT overlap 2', () => {
      assert(
        !DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z').isOverlap(
          DateRange('2018-05-01T18:20:00.00Z', '2018-05-01T20:00:00.00Z')
        )
      )
    })
  })

  describe('#clone', () => {
    let sourceDateRange, cloneDateRange;

    beforeEach(() => {
      sourceDateRange = DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:20:00.00Z')
      cloneDateRange = sourceDateRange.clone()
    })

    it('should work', () => {
      assert(sourceDateRange != cloneDateRange)
      assert(sourceDateRange.start != cloneDateRange.start)
      assert(sourceDateRange.start.getTime() == cloneDateRange.start.getTime())
      assert(sourceDateRange.end != cloneDateRange.end)
      assert(sourceDateRange.end.getTime() == cloneDateRange.end.getTime())
    })
  })

  describe('#exclude', () => {

    it('should exclude range 1', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z').exclude(
          DateRange('2018-05-01T09:00:00.00Z', '2018-05-01T10:00:00.00Z')
        ), [
          DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z')
        ])
    })

    it('should exclude range 2', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z').exclude(
          DateRange('2018-05-01T11:00:00.00Z', '2018-05-01T12:00:00.00Z')
        ), [
          DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T11:00:00.00Z'),
          DateRange('2018-05-01T12:00:00.00Z', '2018-05-01T18:00:00.00Z')
        ]
      )
    })
    
    it('should exclude range 3', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z').exclude(
          DateRange('2018-05-01T09:00:00.00Z', '2018-05-01T12:00:00.00Z')
        ), [
          DateRange('2018-05-01T12:00:00.00Z', '2018-05-01T18:00:00.00Z')
        ]
      )
    })

    it('should exclude range 4', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z').exclude(
          DateRange('2018-05-01T12:00:00.00Z', '2018-05-01T18:00:00.00Z')
        ), [
          DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T12:00:00.00Z'),
        ]
      )
    })
    
    it('should exclude range 5', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z').exclude(
          DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z')
        ), []
      )
    })
    
    it('should exclude range 6', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T18:00:00.00Z').exclude([
          DateRange('2018-05-01T09:00:00.00Z', '2018-05-01T10:00:00.00Z'),
          DateRange('2018-05-01T11:00:00.00Z', '2018-05-01T12:00:00.00Z'),
          DateRange('2018-05-01T16:00:00.00Z', '2018-05-01T18:00:00.00Z'),
          DateRange('2018-05-01T17:00:00.00Z', '2018-05-01T17:30:00.00Z'),
          DateRange('2018-05-01T18:00:00.00Z', '2018-05-01T20:00:00.00Z'),
        ]), [
          DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T11:00:00.00Z'),
          DateRange('2018-05-01T12:00:00.00Z', '2018-05-01T16:00:00.00Z'),
        ]
      )
    })
  })

  describe('#split', () => {
    it('should split', () => {
      assert.deepEqual(
        DateRange('2018-05-01T10:00:00.00Z', '2018-05-01T10:04:30.00Z').split(60 * 1000)
        , [
          new Date('2018-05-01T10:00:00.00Z'),
          new Date('2018-05-01T10:01:00.00Z'),
          new Date('2018-05-01T10:02:00.00Z'),
          new Date('2018-05-01T10:03:00.00Z'),
          new Date('2018-05-01T10:04:00.00Z'),
          new Date('2018-05-01T10:04:30.00Z'),
        ]
      )
    })
  })
})
