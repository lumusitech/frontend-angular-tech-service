import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandLogoComponent } from './brand-logo.component';

describe('BrandLogoComponent', () => {
  let component: BrandLogoComponent;
  let fixture: ComponentFixture<BrandLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render full variant with workflow line and nodes by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const svg = compiled.querySelector('svg');
    expect(svg).toBeTruthy();

    const line = compiled.querySelector('line');
    const circles = compiled.querySelectorAll('circle');

    expect(line).toBeTruthy();
    expect(circles.length).toBe(2);
  });

  it('should render mark variant without workflow line when variant is mark', () => {
    fixture.componentRef.setInput('variant', 'mark');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const line = compiled.querySelector('line');
    const circles = compiled.querySelectorAll('circle');

    expect(line).toBeNull();
    expect(circles.length).toBe(0);
  });
});
