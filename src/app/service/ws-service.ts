import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Client } from '@stomp/stompjs';
import { selectCurrentUser } from '../state/current-user.selector';
import { AppMessageService } from './app-message.service';
import { translateWsReason } from '../helper/ws-response-reason-translator';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export default class WSService {
  private readonly store = inject(Store);
  private readonly messageService = inject(AppMessageService);

  createWebSocketConnection(): Client {
    const currentUser = this.store.selectSignal(selectCurrentUser)();
    let authToken = '';

    if (currentUser && currentUser.accessToken) {
      authToken = currentUser.accessToken;
    }

    return new Client({
      brokerURL: environment.WS_URL,
      reconnectDelay: 2000,
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  handleWsReason(reason: string) {
    this.messageService.info(
      $localize`:@@wsService.wsInfoTitle:Update received`,
      translateWsReason(reason),
    );
  }
}
