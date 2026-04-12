import {
  Component,
  contentChildren,
  input,
  InputSignal,
  Signal,
  TemplateRef,
  AfterContentInit,
  output, // Import output
  signal,
  computed, // Import signal
} from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table'; // Import SortEvent
import { SortMeta } from 'primeng/api'; // Correct: Import SortEvent from primeng/api
import Column from '../../model/column';
import { NgTemplateOutlet } from '@angular/common';
import RowAction from '../../model/row-actions';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import PageResponse from '../../model/page-response';
import Pageable from '../../model/pageable';
import Sort from '../../model/sort';
import { HasAuthorityDirective } from '../../directive/has-authority.directive';

@Component({
  selector: 'app-data-table',
  imports: [TableModule, NgTemplateOutlet, ButtonModule, SkeletonModule, HasAuthorityDirective],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss'],
})

/* eslint-disable @typescript-eslint/no-explicit-any */
export class DataTable<T> implements AfterContentInit {
  public static readonly SKELETON_ROWS = 5;
  /**
   * Columns to display in the table.
   */
  readonly columns: InputSignal<Column[]> = input.required();
  /**
   * Data to display in the table. Can be a simple array or a paginated response.
   */
  readonly data: InputSignal<T[] | PageResponse<T>> = input.required();
  /**
   * Whether the table uses pagination.
   */
  readonly paginated: InputSignal<boolean> = input(false);
  /**
   * Initial row count per page.
   */
  readonly rows: InputSignal<number> = input(20);
  /**
   * Array of actions available for each row.
   */
  readonly rowActions: InputSignal<RowAction<T>[]> = input([] as RowAction<T>[]);
  /**
   * Whether to show a loading state.
   */
  readonly loading: InputSignal<boolean> = input(false);
  /**
   * Whether the table is disabled and interactions are prevented.
   */
  readonly disabled: InputSignal<boolean> = input(false);
  /**
   * Whether the table content is loading (skeleton display).
   */
  readonly isLoading: InputSignal<boolean> = input(false);
  /**
   * Whether to force portrait layout regardless of screen size.
   */
  readonly enforcePortrait: InputSignal<boolean> = input(false);
  /**
   * Number of page buttons to display in the pagination control.
   */
  readonly pageButtonCount = input<number>(5);

  readonly templates: Signal<any> = contentChildren(TemplateRef);
  private templateMap = new Map<string, TemplateRef<any>>();
  private readonly currentPage = signal(0);
  private readonly currentSize = signal(this.rows());
  private readonly currentSort = signal<Sort[] | undefined>(undefined);
  /**
   * Emitted when pagination or sorting options change.
   */
  readonly pageOptionsChange = output<Pageable>();
  readonly isDataPaginated = computed(() => !Array.isArray(this.data()));
  protected readonly clonedData = computed(() => {
    const data = this.data();

    if (Array.isArray(data)) {
      return data;
    } else {
      return data.content;
    }
  });

  protected readonly totalRecords = computed(() => {
    const data = this.data();

    if (Array.isArray(data)) {
      return data.length;
    } else {
      return data.totalElements;
    }
  });

  protected readonly numberOfRows = computed(() => {
    const data = this.data();

    if (Array.isArray(data)) {
      return data.length;
    } else {
      return data.size;
    }
  });

  ngAfterContentInit() {
    this.templates().forEach((tpl: any) => {
      const name =
        tpl._declarationTContainer?.localNames?.[0] ?? tpl._def?.declTContainer?.localNames?.[0];
      if (name) this.templateMap.set(name, tpl);
    });
  }

  getTemplate(name: string): TemplateRef<any> | null {
    return this.templateMap.get(name) ?? null;
  }

  /**
   * Called when the user changes the page or page size.
   * Updates the internal state and emits the new Pageable options.
   */
  onPageChanged(event: TablePageEvent) {
    // Correct: 'page' is calculated from 'first' and 'rows'
    const page = event.first / event.rows;
    this.currentPage.set(page);
    this.currentSize.set(event.rows);
    this.emitPageOptions();
  }

  /**
   * Called when the user clicks a sortable column.
   * Updates the internal sort state and emits the new Pageable options.
   */
  onSortChanged(event: any) {
    // Primeng's model is incorrect. In the model multiSortMeta is defined, but in practice it's multisortmeta. TODO: Fix this if Primeng corrects their model.
    let currentSort = this.currentSort();

    if (!currentSort) {
      currentSort = [] as Sort[];
    }

    if (!event['multisortmeta']) {
      if (event.field && event.order) {
        const direction = event.order === 1 ? 'ASC' : 'DESC';

        this.currentSort.set([new Sort(event.field, direction)]);
      }
    } else {
      const newSort: Sort[] = event['multisortmeta'].map((meta: SortMeta) => {
        const direction = meta.order === 1 ? 'ASC' : 'DESC';

        return new Sort(meta.field, direction);
      });
      this.currentSort.set(newSort);
    }

    this.emitPageOptions();
  }

  /**
   * Consolidates the current page, size, and sort state into a
   * Pageable object and emits it through the pageOptionsChange output.
   */
  private emitPageOptions() {
    const pageable: Pageable = {
      page: this.currentPage(),
      size: this.currentSize(),
      sort: this.currentSort(),
    };
    this.pageOptionsChange.emit(pageable);
  }

  portrait(force: boolean, desktop: string, portrait: string) {
    return force ? portrait : desktop;
  }
}
