import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'summary_report',
  expression: `
 (SELECT "income"."category_name" ::varchar AS "category",
    "income"."income_sum" AS "sum",
    "income"."created_at" AS "createdAt",
    "wallet_id" AS "walletId",
    true AS "isIncome"
   FROM public."income")
UNION
 (SELECT "costs"."category_name" ::varchar AS "category",
    "costs"."cost_sum" AS "sum",
    "costs"."created_at" AS "createdAt",
    "wallet_id" AS "walletId",
    false AS "isIncome"
   FROM public."costs")
    `,
})
export class ReportEntity {
  @ViewColumn({ name: 'category' })
  category: string;

  @ViewColumn({ name: 'sum' })
  sum: number;

  @ViewColumn({ name: 'isIncome' })
  isIncome: boolean;

  @ViewColumn({ name: 'createdAt' })
  createdAt: string | Date;

  @ViewColumn({ name: 'walletId' })
  walletId: number | string;
}
