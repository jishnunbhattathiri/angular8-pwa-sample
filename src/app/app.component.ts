import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'apwa';
  subDetail: any;
  constructor(updates: SwUpdate, private push: SwPush, private http: HttpClient) {
    interval(10000).subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(event => {
      if (prompt('Update available for this app. Do you want to update it?')) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
    console.log('Push code');
    push.requestSubscription({ serverPublicKey: 'BDTrenhMvFL5hexEce8suYQkMeXajUwKG0NdZboLhFBM3tgJ6ENXCxv3CZxiGPDoc_1v6848KMJiaMwSkLUea8g' }).then(
      (success) => {
        console.log(success);
        this.http.post('http://localhost:9020/save-subscription', success).subscribe(() => {
          push.messages.subscribe(message => {console.log(message);new Notification("Hi there!");});
        });
      },
      (error) => console.error(error)
    )
  }
  subscribe() {
    if(!this.subDetail) {
      this.subDetail = {"endpoint":"https://fcm.googleapis.com/fcm/send/dOsye8RV0o0:APA91bGyGvY0WfrbrBSiLKJni5cRKtZHO1BptEv5-SccZPIfSRuvg7CwPby0Gh4l4oHqnkkNPFFqO4nx3oTzS6UgtPJezQNqHztC0v1KKovcdXXfh6ud6jqzwW-Cj2PtYiwgtFun2WyY","expirationTime":null,"keys":{"p256dh":"BCdPOm0NHSQ-RvBvnurLJKD-t8z1Oov1nkzzrbfsV8_AxieELIFiMNIaQllSOEpMLvAo4bLb1CrWiO__jW-QcAU","auth":"PBRBU69wuFJQsxwCVsksUA"}}
    }
    this.http.post('http://localhost:9020/save-subscription',this.subDetail).subscribe(() => {
      this.push.messages.subscribe(message => console.log(message));
    });
  }
}
