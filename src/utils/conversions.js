// Reusable size conversion helpers. Pure data/functions, no UI or storage
// dependency, so the Phase 2 browser extension can reuse them directly.

const IN_TO_CM = 2.54

export function inToCm(inches) {
  const n = parseFloat(inches)
  return isNaN(n) ? '' : (n * IN_TO_CM).toFixed(1)
}

export function cmToIn(cm) {
  const n = parseFloat(cm)
  return isNaN(n) ? '' : (n / IN_TO_CM).toFixed(1)
}

// Shoe sizes. UK and EU numbering is treated as unisex; only the US system
// splits by gender.
export const SHOE_SIZES = [
  { usMen: '6', usWomen: '7.5', uk: '5.5', eu: '39' },
  { usMen: '6.5', usWomen: '8', uk: '6', eu: '39.5' },
  { usMen: '7', usWomen: '8.5', uk: '6.5', eu: '40' },
  { usMen: '7.5', usWomen: '9', uk: '7', eu: '40.5' },
  { usMen: '8', usWomen: '9.5', uk: '7.5', eu: '41' },
  { usMen: '8.5', usWomen: '10', uk: '8', eu: '42' },
  { usMen: '9', usWomen: '10.5', uk: '8.5', eu: '42.5' },
  { usMen: '9.5', usWomen: '11', uk: '9', eu: '43' },
  { usMen: '10', usWomen: '11.5', uk: '9.5', eu: '44' },
  { usMen: '10.5', usWomen: '12', uk: '10', eu: '44.5' },
  { usMen: '11', usWomen: '12.5', uk: '10.5', eu: '45' },
  { usMen: '11.5', usWomen: '13', uk: '11', eu: '45.5' },
  { usMen: '12', usWomen: '13.5', uk: '11.5', eu: '46' },
  { usMen: '13', usWomen: '14.5', uk: '12.5', eu: '47.5' },
]

// Women's apparel numeric sizing (tops, bottoms, dresses). Letter sizes
// (XS-XXL) are fairly consistent across regions and don't need a chart.
export const APPAREL_SIZES = [
  { us: '0', uk: '4', eu: '32' },
  { us: '2', uk: '6', eu: '34' },
  { us: '4', uk: '8', eu: '36' },
  { us: '6', uk: '10', eu: '38' },
  { us: '8', uk: '12', eu: '40' },
  { us: '10', uk: '14', eu: '42' },
  { us: '12', uk: '16', eu: '44' },
  { us: '14', uk: '18', eu: '46' },
  { us: '16', uk: '20', eu: '48' },
  { us: '18', uk: '22', eu: '50' },
  { us: '20', uk: '24', eu: '52' },
]

// Bra band size. US and UK numbers match; EU uses a different scale.
export const BRA_BANDS = [
  { usUk: '28', eu: '60' },
  { usUk: '30', eu: '65' },
  { usUk: '32', eu: '70' },
  { usUk: '34', eu: '75' },
  { usUk: '36', eu: '80' },
  { usUk: '38', eu: '85' },
  { usUk: '40', eu: '90' },
  { usUk: '42', eu: '95' },
  { usUk: '44', eu: '100' },
]

// Bra cup size. US and UK match through D, then diverge going up.
export const BRA_CUPS = [
  { us: 'AA', uk: 'AA', eu: 'AA' },
  { us: 'A', uk: 'A', eu: 'A' },
  { us: 'B', uk: 'B', eu: 'B' },
  { us: 'C', uk: 'C', eu: 'C' },
  { us: 'D', uk: 'D', eu: 'D' },
  { us: 'DD', uk: 'DD', eu: 'E' },
  { us: 'DDD/E', uk: 'E', eu: 'F' },
  { us: 'F', uk: 'F', eu: 'G' },
  { us: 'G', uk: 'G', eu: 'H' },
  { us: 'H', uk: 'H', eu: 'I' },
]
