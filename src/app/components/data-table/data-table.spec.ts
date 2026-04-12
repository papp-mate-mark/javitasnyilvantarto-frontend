import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationService } from 'primeng/api';
import { DataTable } from './data-table';
import Column from '../../model/column';
import RowAction from '../../model/row-actions';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import Sort from '../../model/sort';
import PageResponse from '../../model/page-response';
import Pageable from '../../model/pageable';

const mockColumns: Column[] = [
  new Column('key1', 'label1', true),
  new Column('key2', 'label2', false),
  new Column('key3', 'label3', true),
];

const mockRowActions: RowAction<MockData>[] = [
  new RowAction<MockData>('action1', () => {
    // Mock implementation
  }),
  new RowAction<MockData>('Delete', () => {
    // Mock implementation
  }),
];

class MockData {
  constructor(
    public key1: string,
    public key2: string,
    public key3: string,
  ) {}
}

const mockData: MockData[] = [
  new MockData('value1', 'value2', 'value3'),
  new MockData('value4', 'value5', 'value6'),
  new MockData('value7', 'value8', 'value9'),
  new MockData('value10', 'value11', 'value12'),
  new MockData('value13', 'value14', 'value15'),
];
describe('DataTable', () => {
  let component: DataTable<MockData>;
  let fixture: ComponentFixture<DataTable<MockData>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
      providers: [ConfirmationService, provideStore({ currentUser: currentUserReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable<MockData>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('rowActions', mockRowActions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct amount of headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toBe(mockColumns.length + mockRowActions.length);
  });

  it('should have headers in the correct order', () => {
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toBe(mockColumns.length + mockRowActions.length);
    headers.forEach((header: HTMLElement, index: number) => {
      if (index < mockColumns.length) {
        expect(header.textContent).toContain(mockColumns[index].label);
      } else {
        expect(header.textContent).toContain(mockRowActions[index - mockColumns.length].title);
      }
    });
  });

  it('should display "No data found" when data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    const noDataElement = fixture.nativeElement.querySelector('.noData');
    expect(noDataElement).toBeTruthy();
  });

  it('should have correct amount of skelentons when loading', () => {
    const skeletonRowCount = DataTable.SKELETON_ROWS;

    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    const skelentons = fixture.nativeElement.querySelectorAll('.p-skeleton');
    expect(skelentons.length).toBe(skeletonRowCount * mockColumns.length);
  });

  it('should display correct data', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockData.length);
    rows.forEach((row: HTMLElement, rowIndex: number) => {
      const cells = row.querySelectorAll('td');
      expect(cells[0].textContent).toContain(
        mockData[rowIndex][mockColumns[0].key! as keyof MockData],
      );
      expect(cells[1].textContent).toContain(
        mockData[rowIndex][mockColumns[1].key! as keyof MockData],
      );
      expect(cells[2].textContent).toContain(
        mockData[rowIndex][mockColumns[2].key! as keyof MockData],
      );
    });
  });

  it('should have paginator if set to true', () => {
    fixture.componentRef.setInput('paginated', true);
    fixture.detectChanges();
    const paginator = fixture.nativeElement.querySelector('p-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should not have paginator if set to false', () => {
    fixture.componentRef.setInput('paginated', false);
    fixture.detectChanges();
    const paginator = fixture.nativeElement.querySelector('p-paginator');
    expect(paginator).toBeFalsy();
  });

  it('should emit pageOptionsChange on sorting', () => {
    spyOn(component.pageOptionsChange, 'emit');
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelectorAll('th');
    mockColumns.forEach((col, index) => {
      cell[index].dispatchEvent(new Event('click'));
      fixture.detectChanges();

      if (col.sortable) {
        expect(component.pageOptionsChange.emit).toHaveBeenCalledWith({
          ...new Pageable(0, 20, [new Sort(col.key!, 'ASC')]),
        });
      }
    });
    expect(component.pageOptionsChange.emit).toHaveBeenCalledTimes(
      mockColumns.filter((c) => c.sortable).length,
    );
  });
  it('should emit pageOptionsChange on pagination', () => {
    spyOn(component.pageOptionsChange, 'emit');
    fixture.componentRef.setInput('paginated', true);
    fixture.componentRef.setInput(
      'data',
      new PageResponse<MockData>(mockData, 16, 4, 1, 5, true, false),
    );

    fixture.detectChanges();
    const paginator = fixture.nativeElement.querySelector('p-paginator');
    paginator.querySelectorAll('button')[4].click(); // Click on page 2
    fixture.detectChanges();
    expect(component.pageOptionsChange.emit).toHaveBeenCalledOnceWith({
      ...new Pageable(2, 5, undefined),
    });
  });

  it('shuold emit combined pageOptionsChange when sorting and paginating', () => {
    spyOn(component.pageOptionsChange, 'emit');
    fixture.componentRef.setInput('paginated', true);
    fixture.componentRef.setInput(
      'data',
      new PageResponse<MockData>(mockData, 16, 4, 1, 5, true, false),
    );

    const cell = fixture.nativeElement.querySelectorAll('th');

    mockColumns.forEach((col, index) => {
      cell[index].dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const paginator = fixture.nativeElement.querySelector('p-paginator');
      paginator.querySelectorAll('button')[4].click(); // Click on page 2
      fixture.detectChanges();

      if (col.sortable) {
        expect(component.pageOptionsChange.emit).toHaveBeenCalledWith({
          ...new Pageable(2, 5, [new Sort(col.key!, 'ASC')]),
        });
      }
    });
  });
});
