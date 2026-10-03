// setara Illuminate\Support\Facades\Validator::make($data, $rules)
// Aturan berupa string dipisah "|", format pesan error sama dengan Laravel:
//   { code: ["The code field is required."] }
//
// Aturan yang didukung: required, nullable, max:n, boolean,
//                       unique:table,column[,ignoreId[,idColumn]]
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface ValidationResult {
  fails: boolean;
  errors: Record<string, string[]>;
}

@Injectable()
export class ValidatorService {
  constructor(private readonly dataSource: DataSource) {}

  async make(
    data: Record<string, unknown>,
    rules: Record<string, string>,
  ): Promise<ValidationResult> {
    const errors: Record<string, string[]> = {};

    for (const [field, ruleString] of Object.entries(rules)) {
      const value = data[field];
      const ruleList = ruleString.split('|');
      const label = field.replace(/_/g, ' ');
      const empty = value === null || value === undefined || value === '';
      const add = (msg: string) => (errors[field] ??= []).push(msg);

      if (empty) {
        if (ruleList.includes('required')) add(`The ${label} field is required.`);
        continue; // seperti Laravel: aturan lain dilewati untuk nilai kosong
      }

      for (const rule of ruleList) {
        const idx = rule.indexOf(':');
        const name = idx === -1 ? rule : rule.slice(0, idx);
        const params = idx === -1 ? [] : rule.slice(idx + 1).split(',');

        switch (name) {
          case 'max':
            if (String(value).length > Number(params[0])) {
              add(`The ${label} field must not be greater than ${params[0]} characters.`);
            }
            break;
          case 'boolean':
            if (![true, false, 1, 0, '1', '0'].includes(value as never)) {
              add(`The ${label} field must be true or false.`);
            }
            break;
          case 'unique':
            if (await this.exists(params, value)) {
              add(`The ${label} has already been taken.`);
            }
            break;
        }
      }
    }

    return { fails: Object.keys(errors).length > 0, errors };
  }

  /**
   * unique:table,column,ignoreId,idColumn
   * Seperti Laravel, baris yang sudah di-soft-delete tetap dihitung.
   */
  private async exists(params: string[], value: unknown): Promise<boolean> {
    const [table, column, ignoreId, idColumn = 'id'] = params;
    const ident = /^[A-Za-z0-9_]+$/;
    if (![table, column, idColumn].every((p) => ident.test(p ?? ''))) {
      throw new Error(`Invalid unique rule: ${params.join(',')}`);
    }

    const hasIgnore = !!ignoreId && ignoreId !== 'NULL';
    const sql =
      `SELECT 1 FROM \`${table}\` WHERE \`${column}\` = ?` +
      (hasIgnore ? ` AND \`${idColumn}\` <> ?` : '') +
      ' LIMIT 1';

    const rows = await this.dataSource.query(
      sql,
      hasIgnore ? [value, ignoreId] : [value],
    );
    return rows.length > 0;
  }
}
