import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dark-mode-selector',
  imports: [ButtonModule, ReactiveFormsModule],
  templateUrl: './dark-mode-selector.html',
  styleUrl: './dark-mode-selector.scss',
})
export class DarkModeSelector extends BaseReactiveForm {}
