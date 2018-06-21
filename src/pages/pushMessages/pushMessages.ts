import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { PushMessage } from "./message";
import { PushService } from "../../services/push.service";
import { constants } from '../../constants/constants';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'page-pushMessages',
  templateUrl: 'pushMessages.html'
})
export class PushMessagesPage {
  public messages: PushMessage[] = null;

  constructor(private push: PushService, private alert: AlertService, private navParams: NavParams) {
    this.messages = push.messages;
  }

  disablePush() {
    this.push.unregister();
  }

  buttonVisible() {
    return PushService.registered;
  }

  ionViewDidEnter(): void {
    if (!this.buttonVisible()) {
      const previousPage: any = this.navParams.get('previousPage');
      this.alert.showAlert(constants.pushAlertMessage, constants.featureNotConfigured, 
        constants.alertButtons, constants.showDocs, constants.pushDocsUrl, previousPage);

    }
  }
}