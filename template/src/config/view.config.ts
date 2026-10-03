import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as nunjucks from 'nunjucks';
import { env } from './env';

/**
 * View engine Nunjucks (setara Blade):
 *   @extends('template_admin')   ->  {% extends "template_admin.njk" %}
 *   @section('content')          ->  {% block content %}
 *   views/master_data/UnitsView.njk  (setara resources/views/master_data/UnitsView.blade.php)
 *
 * APP_ENV=local -> template tidak di-cache (edit view cukup refresh browser).
 */
export function setupViews(app: NestExpressApplication): void {
  const viewsDir = join(process.cwd(), 'views');

  nunjucks.configure(viewsDir, {
    autoescape: true,
    noCache: env('APP_ENV', 'local') === 'local',
    express: app.getHttpAdapter().getInstance(),
  });

  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('njk');
}

/** Data dasar untuk semua view. */
export function viewData(
  title: string,
  extra: Record<string, unknown> = {},
) {
  return { Title: title, AppName: env('APP_NAME', 'Nest Web'), ...extra };
}
