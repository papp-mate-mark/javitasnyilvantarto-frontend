import { Component, DestroyRef, effect, inject, OnDestroy, OnInit, untracked } from '@angular/core';
import { PersonService } from '../../service/person.service';
import { PersonStore } from '../../store/person.store';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Client, IMessage } from '@stomp/stompjs';
import WSService from '../../service/ws-service';
import WSResponse from '../../model/ws-response';
import { FullPersonData } from '../../model/full-person-data';
import { WSAction } from '../../model/enums/ws-action';
import { PageTitle } from '../../model/enums/PageTitle';

@Component({
  selector: 'app-person-info',
  imports: [RouterOutlet],
  templateUrl: './person-info.html',
  styleUrl: './person-info.scss',
})
export class PersonInfo implements OnInit, OnDestroy {
  private readonly personService = inject(PersonService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly wsService = inject(WSService);
  protected readonly personStore = inject(PersonStore);
  private wsClient?: Client;
  private personId = this.route.snapshot.paramMap.get('personId');

  ngOnInit(): void {
    if (this.personId && !isNaN(+this.personId)) {
      this.wsClient = this.wsService.createWebSocketConnection();

      this.wsClient.onConnect = () => {
        this.wsClient!.subscribe(`/topic/person/${this.personId}`, (msg: IMessage) => {
          const payload = JSON.parse(msg.body) as WSResponse<FullPersonData>;
          this.wsService.handleWsReason(payload.reason);

          if (payload.action == WSAction.DELETED) {
            this.router.navigate([PageTitle.ACTIVE_JOBS]);

            return;
          }

          this.personStore.setPerson(payload.payload);
        });
      };

      this.wsClient.activate();

      return;
    }

    this.router.navigate(['/']);
  }

  constructor() {
    effect(() => {
      //TODO: Find a better way to handle refetching data in case we navigate to the page.
      if (
        this.personId &&
        !isNaN(+this.personId) &&
        (!this.personStore.person() || this.personStore.person().id != +this.personId)
      ) {
        this.personService
          .fetchPersonAndJobs(+this.personId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((data) => {
            untracked(() => this.personStore.setPerson(data));
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.wsClient?.deactivate();
    this.personStore.setPerson({} as FullPersonData);
  }
}
