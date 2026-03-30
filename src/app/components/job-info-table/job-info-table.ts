import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { FullPersonData } from '../../model/full-person-data';
import SimpleTableData from '../../model/simple-table-data';
import { SimpleTable } from '../simple-table/simple-table';
import { CardModule } from 'primeng/card';
import { PriceFormatter } from '../../helper/price-formatter.service';
import { DateFormatter } from '../../helper/date-formatter';

@Component({
  selector: 'app-job-info-table',
  imports: [SimpleTable, CardModule],
  templateUrl: './job-info-table.html',
  styleUrl: './job-info-table.scss',
})
export class JobInfoTable {
  /**
   * The person data containing job information to display.
   */
  readonly person: InputSignal<FullPersonData> = input.required();
  /**
   * The job ID to filter and display specific job information.
   */
  readonly jobId: InputSignal<number | undefined> = input();

  private readonly priceFormatter = inject(PriceFormatter);
  private readonly dateFormatter = inject(DateFormatter);

  protected readonly data = computed(() => {
    const groups = this.person().jobGroups;
    let data = [] as SimpleTableData[];

    if (groups && this.jobId) {
      groups.forEach((g) => {
        const job = g.jobs.find((j) => j.id == this.jobId());

        if (job) {
          data = [
            new SimpleTableData(
              'description',
              $localize`:@@jobInfoTable.description:Job description`,
              job.description,
            ),
            new SimpleTableData(
              'finalprice',
              $localize`:@@jobInfoTable.finalprice:Final price`,
              job.finalprice ? this.priceFormatter.formatPrice(job.finalprice) : '-',
            ),
            new SimpleTableData(
              'objectname',
              $localize`:@@jobInfoTable.objectname:Object name`,
              job.objectname,
            ),
            new SimpleTableData(
              'material',
              $localize`:@@jobInfoTable.material:Material`,
              job.material,
            ),
            new SimpleTableData(
              'weight',
              $localize`:@@jobInfoTable.weight:Weight`,
              job.weight.toString(),
            ),
            new SimpleTableData(
              'price',
              $localize`:@@jobInfoTable.pricemin:Price`,
              `${this.priceFormatter.formatPrice(job.pricemin)}${
                job.pricemax ? ' - ' + this.priceFormatter.formatPrice(job.pricemin) : ''
              }`,
            ),
            new SimpleTableData(
              'upload',
              $localize`:@@jobInfoTable.upload:Upload date`,
              g.bringedin ? this.dateFormatter.formatDate(new Date(g.bringedin)) : '',
            ),
            new SimpleTableData(
              'uploadnote',
              $localize`:@@jobInfoTable.uploadnote:Upload note`,
              job.uploadnote,
            ),
            new SimpleTableData(
              'done',
              $localize`:@@jobInfoTable.done:Done`,
              job.done ? this.dateFormatter.formatDate(new Date(job.done)) : '-',
            ),
            new SimpleTableData(
              'finishnote',
              $localize`:@@jobInfoTable.finishnote:Finish note`,
              job.finishnote,
            ),
            new SimpleTableData(
              'pickup',
              $localize`:@@jobInfoTable.pickup:Pickup date`,
              job.pickup ? this.dateFormatter.formatDate(new Date(job.pickup)) : '-',
            ),
            new SimpleTableData(
              'deadline',
              $localize`:@@jobInfoTable.deadline:Deadline`,
              g.deadline ? this.dateFormatter.formatDate(new Date(g.deadline)) : '',
            ),
          ];
        }
      });
    }

    return data;
  });
}
