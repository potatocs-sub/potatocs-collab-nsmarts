import { DestroyRef, Injectable, inject, signal, effect } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  isDesktop = signal<boolean>(false)
  isSideNavOpen = signal<boolean>(true)
  destroyRef = inject(DestroyRef);

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe(
        [Breakpoints.Large, Breakpoints.XLarge] // 현재 1280px 기준
        // ['(min-width: 1441px)'] // 현재 1441px 보다 작으면 false가 나온다
      )
      .pipe(
        tap((state: BreakpointState) => console.log(state.matches)),
        map((state: BreakpointState) => {
          this.isSideNavOpen.update((prev) => state.matches)
          return this.isDesktop.update((prev) => state.matches)
        }),
        shareReplay(), // HTML template 내의 여러 isDesktop$ 호출에 대해 1회만 실행
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();

    effect(() => {
      console.log(this.isDesktop())
    })
    effect(() => {
      console.log(this.isSideNavOpen())
    })
  }

}
