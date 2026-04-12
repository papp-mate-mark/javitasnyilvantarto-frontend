import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSkeleton } from './dynamic-skeleton';

describe('DynamicSkeleton', () => {
  let component: DynamicSkeleton;
  let fixture: ComponentFixture<DynamicSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render skeleton', () => {
    fixture.componentRef.setInput('showSkeleton', false);
    fixture.detectChanges();
    const skeletonElement: HTMLElement = fixture.nativeElement.querySelector('p-skeleton');
    expect(skeletonElement).toBeFalsy();
  });
  it('should not render skeleton', () => {
    fixture.componentRef.setInput('showSkeleton', true);
    fixture.detectChanges();
    const skeletonElement: HTMLElement = fixture.nativeElement.querySelector('p-skeleton');
    expect(skeletonElement).toBeTruthy();
  });
  it('shuold not hide content when showSkeleton is false', () => {
    fixture.componentRef.setInput('showSkeleton', false);
    fixture.detectChanges();
    const contentElement: HTMLElement = fixture.nativeElement.querySelector(
      '.dynamic-skeleton-content',
    );
    expect(contentElement.style.visibility).toEqual('visible');
  });
  it('shuold hide content when showSkeleton is true', () => {
    fixture.componentRef.setInput('showSkeleton', true);
    fixture.detectChanges();
    const contentElement: HTMLElement = fixture.nativeElement.querySelector(
      '.dynamic-skeleton-content',
    );
    expect(contentElement.style.visibility).toEqual('hidden');
  });
});
