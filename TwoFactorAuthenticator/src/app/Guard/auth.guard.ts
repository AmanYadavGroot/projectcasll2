import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem("email")) {
    return true;
  }

  // Redirect to login with returnUrl
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
