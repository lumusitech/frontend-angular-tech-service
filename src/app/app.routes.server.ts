import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'track', renderMode: RenderMode.Server },
  { path: 'track/:code', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'tech/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
