import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthenticationService } from '../../service/authentication.service';
import { Store } from '@ngrx/store';
import { checkAuthority } from '../../helper/authority-helper';
import { DarkModeSelector } from '../dark-mode-selector/dark-mode-selector';
import { FormControl, FormGroup } from '@angular/forms';
import { selectIsDarkMode } from '../../state/user-preferences.selector';
import { UserPreferencesActions } from '../../state/user-preferences.actions';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.html',
  standalone: true,
  imports: [CommonModule, MenubarModule, RouterModule, ButtonModule, DarkModeSelector],
})
export class Menubar implements OnInit {
  menuItems: MenuItem[] = [];
  protected readonly authService = inject(AuthenticationService);
  protected readonly route = inject(ActivatedRoute);
  protected readonly store = inject(Store);

  protected readonly parentGroup = new FormGroup({
    darkModeControl: new FormControl<boolean>(false),
  });

  ngOnInit(): void {
    this.buildMenu();
    this.loadDarkModePreference();
    this.subscribeToButtonChanges();
  }

  private loadDarkModePreference(): void {
    this.store.select(selectIsDarkMode).subscribe((isDarkMode) => {
      this.parentGroup.controls.darkModeControl.setValue(isDarkMode, { emitEvent: false });
      this.applyDarkMode(isDarkMode);
    });
  }

  private subscribeToButtonChanges() {
    this.parentGroup.controls.darkModeControl.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.store.dispatch(UserPreferencesActions.setDarkMode({ isDarkMode: value }));
        this.applyDarkMode(value);
      }
    });
  }

  private applyDarkMode(isDarkMode: boolean): void {
    const element = document.querySelector('html');

    if (element) {
      if (isDarkMode) {
        element.classList.add('my-app-dark');
      } else {
        element.classList.remove('my-app-dark');
      }
    }
  }

  private buildMenu(): void {
    const parentRoute = this.route.routeConfig;
    if (!parentRoute?.children) return;

    this.menuItems = parentRoute.children
      .filter(
        (route) =>
          !route.data?.['excludeFromMenu'] &&
          (!route.data?.['requiredAuthority'] ||
            (route.data?.['requiredAuthority'] &&
              checkAuthority(this.store, route.data?.['requiredAuthority']))),
      )
      .map((route) => this.createMenuItem(route))
      .filter((item) => item !== null) as MenuItem[];
  }

  private createMenuItem(route: Route): MenuItem | null {
    const label = route.data?.['label'] ?? route.path ?? '';

    const childItems = (route.children ?? [])
      .filter(
        (child) =>
          !child.data?.['excludeFromMenu'] &&
          (!child.data?.['requiredAuthority'] ||
            (child.data?.['requiredAuthority'] &&
              checkAuthority(this.store, child.data?.['requiredAuthority']))),
      )
      .map((child) => ({
        label: child.data?.['label'] ?? child.path ?? '',
        routerLink: [child.path ? `${route.path}/${child.path}` : route.path],
      }));

    if (childItems.length > 0) {
      return {
        label,
        items: childItems,
      };
    } else if (route.path) {
      return {
        label,
        routerLink: [route.path],
      };
    }

    return null;
  }

  logout(): void {
    this.authService.logout();
  }
}
