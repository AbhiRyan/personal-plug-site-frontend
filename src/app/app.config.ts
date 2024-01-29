import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { AuthEffects } from './store/app.effects';
import { ApiCentralEffects } from './store/api-central.effects';
import * as fromAppRducer from './store/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideHttpClient(withFetch()),
    provideStore(),
    provideState(fromAppRducer.appFeature),
    provideEffects(AuthEffects, ApiCentralEffects),
  ],
};
