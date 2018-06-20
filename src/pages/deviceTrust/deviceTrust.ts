import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SecurityService, SecurityCheckType, SecurityCheckResult } from '@aerogear/security';
import { AlertService } from '../../services/alert.service';
import { constants } from '../../constants/constants';

@Component({
  selector: 'page-deviceTrust',
  templateUrl: 'deviceTrust.html'
})
export class DeviceTrustPage {
  detections: Array<{ label: string, detected: boolean }>;
  trustScore: number;
  totalTests: number;
  totalDetections: number;
  totalPassed: number;
  icon: string;
  color: string;
  securityService: SecurityService;

  constructor(public navCtrl: NavController, private alert: AlertService) {
    this.securityService = new SecurityService();
  }

  performChecks(): Promise<any> {
    return Promise.all([
      this.detectDeviceLock(),
      this.detectRoot(),
      this.detectEmulator(),
      this.detectDebug()])
  }

  performChecksAndPublishMetrics(): Promise<SecurityCheckResult[]> {
    return this.securityService.checkManyAndPublishMetric(SecurityCheckType.notDebugMode,
      SecurityCheckType.notRooted,
      SecurityCheckType.notEmulated,
      SecurityCheckType.hasDeviceLock);
  }

  addDetection(label: string, isSecure: boolean) {
    this.totalTests++;

    if (!isSecure) {
      this.totalDetections++;
    }

    if (isSecure) this.totalPassed++;

    this.detections.push({ label: label, detected: isSecure });
    this.trustScore = Number((100 - (((this.totalDetections / this.totalTests) * 100))).toFixed());
  }

  // tag::detectEmulator[]
  /**
  * Detect if the device is running on an emulator.
  */
  detectEmulator(): Promise<any> {
    return this.securityService.check(SecurityCheckType.notEmulated)
      .then((isEmulated: SecurityCheckResult) => {
        const emulatedMsg = isEmulated.passed ? "No Emulator Access Detected" : "Emulator Access Detected";
        this.addDetection(emulatedMsg, isEmulated.passed)
      }).catch((err: Error) => console.log(err));
  }
  // end::detectEmulator[]

  // tag::detectRoot[]
  /**
  * Detect if the device is running Root.
  */
  detectRoot(): Promise<any> {
    return this.securityService.check(SecurityCheckType.notRooted)
      .then((isRooted: SecurityCheckResult) => {
        const rootedMsg = isRooted.passed ? "No Root Access Detected" : "Root Access Detected";
        this.addDetection(rootedMsg, isRooted.passed);
      }).catch((err: Error) => console.log(err));
  }
  // end::detectRoot[]

  // tag::detectDebug[]
  /**
  * Detect if the app is running in debug mode.
  */
  detectDebug(): Promise<any> {
    return this.securityService.check(SecurityCheckType.notDebugMode)
      .then((isDebugger: SecurityCheckResult) => {
        const debuggerMsg = isDebugger.passed ? "No Debugger Detected" : "Debugger Detected";
        this.addDetection(debuggerMsg, isDebugger.passed);
      }).catch((err: Error) => console.log(err));
  }
  // end::detectDebug[]

  // tag::detectDeviceLock[]
  /**
  * Detect if a system device lock is set.
  */
  detectDeviceLock(): Promise<any> {
    return this.securityService.check(SecurityCheckType.hasDeviceLock)
      .then((deviceLockEnabled: SecurityCheckResult) => {
        const deviceLockMsg = deviceLockEnabled.passed ? "Device Lock Detected" : "Device Lock Not Detected";
        this.addDetection(deviceLockMsg, deviceLockEnabled.passed);
      });
  }
  // end::detectDeviceLock[]

  refreshChecks(): void {
    this.detections = [];
    this.trustScore = 0;
    this.totalTests = 0;
    this.totalDetections = 0;
    this.totalPassed= 0;
    this.performChecks().then(() => { 
      this.checkDialog(this.trustScore);
    });
    this.performChecksAndPublishMetrics();
  }

  checkDialog(trustScore: number): void {
    if (trustScore < 70) {
      this.alert.showAlert(`Your current trust score ${trustScore}% is below the specified target of 70%, do you want to continue or exit the app?`,
      'Warning', ["Exit", "Continue"], constants.exitApp);
    }
  }

  ionViewWillEnter(): void {
    this.refreshChecks();
  }

}
