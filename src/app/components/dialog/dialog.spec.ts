import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog } from './dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialog],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    component.dialogVisible.set(false);
    fixture.componentRef.setInput('dialogTitle', 'Test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title when visible', () => {
    component.dialogVisible.set(true);
    fixture.detectChanges();

    const h2: HTMLElement | null = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2!.textContent).toContain('Test');
  });

  it('should not render title when not visible', () => {
    component.dialogVisible.set(false);
    fixture.detectChanges();

    const h2: HTMLElement | null = fixture.nativeElement.querySelector('h2');
    expect(h2).toBeFalsy();
  });
});
