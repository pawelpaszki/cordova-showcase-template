import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { DeviceTrustPage } from '../pages/deviceTrust/deviceTrust';
import { StoragePage } from '../pages/storage/storage';
import { PushPage } from "../pages/push/push";
import { AuthDetailsPage } from '../pages/authDetails/authDetails';
import { CertPinningPage } from '../pages/certPinning/certPinning';
import { DeviceProfilePage } from '../pages/deviceProfile/deviceProfile';
import { DeviceRegistrationPage } from '../pages/deviceRegistration/deviceRegistration';
import { MetricsPage } from '../pages/metrics/metrics';
import { SSOPage } from '../pages/sso/sso';
import { PushMessagesPage } from '../pages/pushMessages/pushMessages';
import { TrustCheckPage } from '../pages/trustCheck/trustCheck';
import { DocumentationPage } from '../pages/documentation/documentation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public pages: Array<{ title: string, component: any, icon: string , param: string}>;

  rootPage: any = HomePage;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private menuCtrl: MenuController) {
    this.initializeApp();

  }

  initializeOptions(): void {
    this.pages = []; 
    // used for an example of ngFor and navigation
    this.pages.push(
      { title: 'Home', component: HomePage, icon: 'home', param: '' },
      
      { title: 'Identity Management', component: AuthDetailsPage, icon: 'account_circle', param: '' },
      { title: 'Documentation', component: DocumentationPage, icon: '', param: 'identity-management' },
      { title: 'Authentication', component: AuthPage, icon: '', param: '' },
      { title: 'SSO', component: SSOPage, icon: '', param: '' },
      
      { title: 'Device Security', component: DeviceTrustPage, icon: 'security', param: '' },
      { title: 'Documentation', component: DocumentationPage, icon: '', param: 'device-security' },
      { title: 'Device Trust', component: DeviceTrustPage, icon: '', param: '' },
      { title: 'Secure Storage', component: StoragePage, icon: '', param: '' },
      { title: 'Cert Pinning', component: CertPinningPage, icon: '', param: '' },
      
      { title: 'Push Notifications', component: PushPage, icon: 'notifications_active', param: '' },
      { title: 'Documentation', component: DocumentationPage, icon: '', param: 'push' },
      { title: 'Device Registration', component: DeviceRegistrationPage, icon: '', param: '' },
      { title: 'Push Messages', component: PushMessagesPage, icon: '', param: '' },

      { title: 'Metrics', component: MetricsPage, icon: 'insert_chart', param: '' },
      { title: 'Documentation', component: DocumentationPage, icon: '', param: 'metrics' },
      { title: 'Device Profile Info', component: DeviceProfilePage, icon: '', param: '' },
      { title: 'Trust Check Info', component: TrustCheckPage, icon: '', param: '' }
      
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.initializeOptions();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.menuCtrl.close().then(() => {  
      this.nav.push(page.component, { 'linkParam' : page.param })
    })
  }
}

