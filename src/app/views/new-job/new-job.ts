import { Component } from '@angular/core';
import { NewJobForm } from '../../components/new-job-form/new-job-form';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-new-job',
  imports: [NewJobForm, CardModule],
  templateUrl: './new-job.html',
  styleUrl: './new-job.scss',
})
export class NewJob {}
