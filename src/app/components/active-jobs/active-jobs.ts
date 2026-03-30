import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { JobGroupService } from '../../service/job-group.service';
import { JobGroupStore } from '../../store/job-group.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DoneJobsCard } from '../done-jobs-card/done-jobs-card';
import { InProgressJobsCard } from '../in-progress-jobs-card/in-progress-jobs-card';
import WSService from '../../service/ws-service';
import { Client, IMessage } from '@stomp/stompjs';
import WSResponse from '../../model/ws-response';
import { ActiveJobsRequestDTO } from '../../model/active-jobs';

@Component({
  selector: 'app-active-jobs',
  imports: [DoneJobsCard, InProgressJobsCard],
  templateUrl: './active-jobs.html',
  styleUrl: './active-jobs.scss',
})
export class ActiveJobs implements OnInit, OnDestroy {
  private readonly jobGroupService = inject(JobGroupService);
  protected readonly jobGroupStore = inject(JobGroupStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly wsService = inject(WSService);
  private client?: Client;
  ngOnInit(): void {
    this.jobGroupService
      .getActiveJobs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.jobGroupStore.setActiveJobs(value);
      });

    const client = this.wsService.createWebSocketConnection();

    client.onConnect = () => {
      client.subscribe('/user/queue/active-jobs', (msg: IMessage) => {
        const payload = JSON.parse(msg.body) as WSResponse<ActiveJobsRequestDTO>;
        this.wsService.handleWsReason(payload.reason);
        this.jobGroupStore.setActiveJobs(payload.payload);
      });
    };

    client.activate();
    this.client = client;
  }

  ngOnDestroy(): void {
    this.client?.deactivate();
  }
}
