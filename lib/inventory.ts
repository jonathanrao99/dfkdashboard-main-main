// As per PRD §8.1
export function casesToUnits(unitsPerCase:number|undefined, cases:number){ return (unitsPerCase ?? 1) * cases }
export function unitsToCases(unitsPerCase:number|undefined, units:number){ return units / (unitsPerCase ?? 1) }

// naive FIFO valuation
export type Layer = { qty:number; unitCost:number }
export function fifoConsume(layers:Layer[], usageQty:number){
  const consumed: {qty:number; unitCost:number}[] = []
  let remaining = usageQty
  for(const layer of layers){
    if(remaining<=0) break
    const take = Math.min(layer.qty, remaining)
    consumed.push({qty:take, unitCost:layer.unitCost})
    layer.qty -= take
    remaining -= take
  }
  const value = consumed.reduce((s,c)=>s + c.qty*c.unitCost, 0)
  return { consumed, value, layers }
}

export const onHandFromMoves = (moves:{qty:number}[]) =>
  moves.reduce((s,m)=> s + m.qty, 0)
