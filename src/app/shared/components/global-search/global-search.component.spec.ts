import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalSearchComponent } from './global-search.component';
import { GlobalSearchService, SearchResult } from '../../../core/services/global-search.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let searchSpy: ReturnType<typeof vi.fn>;
  let clearSpy: ReturnType<typeof vi.fn>;

  const resultsSignal = signal<SearchResult[]>([]);
  const loadingSignal = signal(false);

  const mockTranslate = (key: string) => key;

  beforeEach(() => {
    navigateSpy = vi.fn();
    searchSpy = vi.fn();
    clearSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [GlobalSearchComponent],
      providers: [
        {
          provide: GlobalSearchService,
          useValue: {
            results: resultsSignal,
            loading: loadingSignal,
            search: searchSpy,
            clear: clearSpy,
          },
        },
        { provide: Router, useValue: { navigate: navigateSpy } },
        { provide: TranslatePipe, useValue: { transform: mockTranslate } },
      ],
    });

    resultsSignal.set([]);
    loadingSignal.set(false);

    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input with placeholder', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.placeholder).toContain('common.globalSearch');
  });

  it('should not show dropdown when query is empty', () => {
    expect(fixture.nativeElement.querySelector('.shadow-lg')).toBeFalsy();
  });

  it('should not show dropdown when query < 2 chars even if isOpen', () => {
    component.query.set('j');
    component.isOpen.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shadow-lg')).toBeFalsy();
  });

  it('should show dropdown when query >= 2 chars and isOpen', () => {
    component.query.set('juan');
    component.isOpen.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.shadow-lg')).toBeTruthy();
  });

  it('should show noResults message when results are empty', () => {
    component.query.set('xyz');
    component.isOpen.set(true);
    resultsSignal.set([]);
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector('.shadow-lg');
    expect(dropdown).toBeTruthy();
    const noResults =
      dropdown.querySelector('.hidden') === null
        ? null
        : Array.from(dropdown.querySelectorAll('div')).find((el) =>
            (el as HTMLElement).textContent?.includes('common.noResults'),
          );
    expect(noResults).toBeTruthy();
  });

  it('should show grouped results by type', () => {
    component.query.set('juan');
    component.isOpen.set(true);
    resultsSignal.set([
      {
        type: 'client',
        id: 'c1',
        title: 'Juan',
        subtitle: 'j@t.com',
        icon: 'person',
        route: '/admin/clients/c1',
      },
      {
        type: 'client',
        id: 'c2',
        title: 'Juana',
        subtitle: 'ju@t.com',
        icon: 'person',
        route: '/admin/clients/c2',
      },
      {
        type: 'supplier',
        id: 's1',
        title: 'Proveedor',
        subtitle: 'p@t.com',
        icon: 'local_shipping',
        route: '/admin/suppliers',
      },
    ]);
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector('.shadow-lg');
    expect(dropdown).toBeTruthy();
    const buttons = dropdown.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  it('should call clear() on X button click and reset query', () => {
    component.query.set('juan');
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const xButton = buttons.find((b) => b.textContent?.includes('close'));
    expect(xButton).toBeTruthy();
    xButton!.click();

    expect(component.query()).toBe('');
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should navigate to detail route when clicking client result', () => {
    component.query.set('juan');
    component.isOpen.set(true);
    resultsSignal.set([
      {
        type: 'client',
        id: 'c1',
        title: 'Juan',
        subtitle: 'j@t.com',
        icon: 'person',
        route: '/admin/clients/c1',
      },
    ]);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.shadow-lg button');
    button.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/clients/c1']);
  });

  it('should navigate to list route with highlight and search params when clicking supplier result', () => {
    component.query.set('prov');
    component.isOpen.set(true);
    resultsSignal.set([
      {
        type: 'supplier',
        id: 's1',
        title: 'Proveedor',
        subtitle: 'p@t.com',
        icon: 'local_shipping',
        route: '/admin/suppliers',
      },
    ]);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.shadow-lg button');
    button.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/suppliers'], {
      queryParams: { highlight: 's1', search: 'Proveedor' },
    });
  });

  it('should debounce search calls on input', () => {
    vi.useFakeTimers();
    component.onInput('j');
    expect(searchSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(searchSpy).toHaveBeenCalledWith('j');
    vi.useRealTimers();
  });

  it('should close dropdown on outside click', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: document.body });
    document.dispatchEvent(event);

    expect(component.isOpen()).toBe(false);
  });
});
