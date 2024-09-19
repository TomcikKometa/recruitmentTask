import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import player from 'lottie-web';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
