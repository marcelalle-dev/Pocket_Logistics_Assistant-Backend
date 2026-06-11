import { Injectable } from '@nestjs/common';

type ItemInput = {
  unit_price: number;
  quantity: number;
  landed_cost_percent?: number;
};

@Injectable()
export class LandedCostsService {
  /**
   * Calculate landed cost total and per-item breakdown.
   */
  calculate(items: ItemInput[], additionalFees = 0) {
    const breakdown = items.map((it) => {
      const base = Number(it.unit_price) * Number(it.quantity);
      const percent = Number(it.landed_cost_percent ?? 0) / 100;
      const percentCost = base * percent;
      const total = base + percentCost;
      return {
        unit_price: Number(it.unit_price),
        quantity: Number(it.quantity),
        base: +base.toFixed(2),
        percent: +(percent * 100).toFixed(2),
        percent_cost: +percentCost.toFixed(2),
        total: +total.toFixed(2),
      };
    });

    const subtotal = breakdown.reduce((s, b) => s + b.total, 0);
    const grandTotal = +(subtotal + Number(additionalFees)).toFixed(2);

    return {
      breakdown,
      subtotal: +subtotal.toFixed(2),
      additional_fees: +Number(additionalFees).toFixed(2),
      total: grandTotal,
    };
  }
}
