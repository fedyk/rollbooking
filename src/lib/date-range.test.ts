import { ok, deepEqual } from 'assert';
import { DateRange } from './date-range';

describe('lib:DateRange', () => {
  it('should create an instance', () => {
    ok(new DateRange(new Date, new Date), 'create new range by passing start and end date')
  })

  describe('#isOverlap', () => {
    it('should overlap 1', () => {
      ok(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T11:00:00.00', '2018-05-01T12:00:00.00')
        )
      )
    })
    
    it('should overlap 2', () => {
      ok(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T09:00:00.00', '2018-05-01T11:00:00.00')
        )
      )
    })
    
    it('should overlap 3', () => {
      ok(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T17:00:00.00', '2018-05-01T19:00:00.00')
        )
      )
    })
    
    it('should overlap 4', () => {
      ok(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00')
        )
      )
    })
    
    it('should overlap 5', () => {
      ok(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T09:00:00.00', '2018-05-01T19:00:00.00')
        )
      )
    })
    
    it('should NOT overlap 1', () => {
      ok(
        !new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T09:00:00.00', '2018-05-01T10:00:00.00')
        )
      )
    })
    
    it('should NOT overlap 2', () => {
      ok(
        !new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00').isOverlap(
          new DateRange('2018-05-01T18:20:00.00', '2018-05-01T20:00:00.00')
        )
      )
    })
  })

  describe('#clone', () => {
    let sourceDateRange, cloneDateRange;

    beforeEach(() => {
      sourceDateRange = new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:20:00.00')
      cloneDateRange = sourceDateRange.clone()
    })

    it('should work', () => {
      ok(sourceDateRange != cloneDateRange)
      ok(sourceDateRange.start != cloneDateRange.start)
      ok(sourceDateRange.start.getTime() == cloneDateRange.start.getTime())
      ok(sourceDateRange.end != cloneDateRange.end)
      ok(sourceDateRange.end.getTime() == cloneDateRange.end.getTime())
    })
  })

  describe('#exclude', () => {

    it('should exclude range 1', () => {
      deepEqual(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00').exclude(
          new DateRange('2018-05-01T09:00:00.00', '2018-05-01T10:00:00.00')
        ), [
          new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00')
        ])
    })

    it('should exclude range 2', () => {
      deepEqual(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00').exclude(
          new DateRange('2018-05-01T11:00:00.00', '2018-05-01T12:00:00.00')
        ), [
          new DateRange('2018-05-01T10:00:00.00', '2018-05-01T11:00:00.00'),
          new DateRange('2018-05-01T12:00:00.00', '2018-05-01T18:00:00.00')
        ]
      )
    })
    
    it('should exclude range 3', () => {
      deepEqual(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00').exclude(
          new DateRange('2018-05-01T09:00:00.00', '2018-05-01T12:00:00.00')
        ), [
          new DateRange('2018-05-01T12:00:00.00', '2018-05-01T18:00:00.00')
        ]
      )
    })

    it('should exclude range 4', () => {
      deepEqual(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00').exclude(
          new DateRange('2018-05-01T12:00:00.00', '2018-05-01T18:00:00.00')
        ), [
          new DateRange('2018-05-01T10:00:00.00', '2018-05-01T12:00:00.00'),
        ]
      )
    })
    
    it('should exclude range 5', () => {
      deepEqual(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00').exclude(
          new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00')
        ), []
      )
    })
    
    it('should exclude range 6', () => {
      deepEqual(
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T18:00:00.00').exclude([
          new DateRange('2018-05-01T09:00:00.00', '2018-05-01T10:00:00.00'),
          new DateRange('2018-05-01T11:00:00.00', '2018-05-01T12:00:00.00'),
          new DateRange('2018-05-01T16:00:00.00', '2018-05-01T18:00:00.00'),
          new DateRange('2018-05-01T17:00:00.00', '2018-05-01T17:30:00.00'),
          new DateRange('2018-05-01T18:00:00.00', '2018-05-01T20:00:00.00'),
        ]), [
          new DateRange('2018-05-01T10:00:00.00', '2018-05-01T11:00:00.00'),
          new DateRange('2018-05-01T12:00:00.00', '2018-05-01T16:00:00.00'),
        ]
      )
    })
  })

  describe('#split', () => {
    it('should split', () => {
      deepEqual(new DateRange('2018-05-01T10:00:00.00', '2018-05-01T10:04:30.00').split(60 * 1000), [
          new Date('2018-05-01T10:00:00.00'),
          new Date('2018-05-01T10:01:00.00'),
          new Date('2018-05-01T10:02:00.00'),
          new Date('2018-05-01T10:03:00.00'),
          new Date('2018-05-01T10:04:00.00'),
          new Date('2018-05-01T10:04:30.00'),
        ]
      )
    })
    it('should split with rounded periods', () => {
      deepEqual(new DateRange('2018-05-01T10:00:00.00', '2018-05-01T10:04:30.00').split(60 * 1000, {
        round: true
      }), [
          new Date('2018-05-01T10:00:00.00'),
          new Date('2018-05-01T10:01:00.00'),
          new Date('2018-05-01T10:02:00.00'),
          new Date('2018-05-01T10:03:00.00'),
          new Date('2018-05-01T10:04:00.00'),
        ]
      )
    })
  })
  describe("#intersection", function() {
    it("should get intersection", function() {
      deepEqual(DateRange.intersection(
        new DateRange("2018-05-01T10:00:00.00", "2018-05-01T11:00:00.00"),
        new DateRange("2018-05-01T10:30:00.00", "2018-05-01T11:30:00.00")
      ),
        new DateRange("2018-05-01T10:30:00.00", "2018-05-01T11:00:00.00")
      )
    })
  })

  describe('#merge', () => {
    it('should merge', () => {
      deepEqual(DateRange.merge([
        new DateRange('2018-05-01T10:50:00.00', '2018-05-01T11:00:00.00'),
        new DateRange('2018-05-01T10:45:00.00', '2018-05-01T10:50:00.00'),
        new DateRange('2018-05-01T10:45:00.00', '2018-05-01T11:00:00.00'),

        new DateRange('2018-05-01T10:25:00.00', '2018-05-01T10:30:00.00'),
        new DateRange('2018-05-01T10:20:00.00', '2018-05-01T10:25:00.00'),
        new DateRange('2018-05-01T10:20:00.00', '2018-05-01T10:25:00.00'),

        new DateRange('2018-05-01T10:05:00.00', '2018-05-01T10:10:00.00'),
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T10:05:00.00'),
      ]), [
        new DateRange('2018-05-01T10:00:00.00', '2018-05-01T10:10:00.00'),
        new DateRange('2018-05-01T10:20:00.00', '2018-05-01T10:30:00.00'),
        new DateRange('2018-05-01T10:45:00.00', '2018-05-01T11:00:00.00'),
      ])
    })
  })
})
