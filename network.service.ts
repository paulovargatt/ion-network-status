import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    public pageActive;
    public disconnect = false;

    private subDisconnect;
    private subConnect;

    constructor(private net: Network,
                private route: ActivatedRoute,
                private nav: NavController
    ) {
    }

    disconnectSubscription() {
        this.subDisconnect = this.net.onDisconnect().subscribe(() => {
            this.pageActive = window.location.pathname;
            this.disconnect = true;
            this.connectSubscription();
            this.subDisconnect.unsubscribe();
            return this.nav.navigateRoot(environment.USE_PAGE_DOWNLOADED ? environment.PAGE_DOWNLOADED : environment.PAGE_NETWORK);
        });
    }

    connectSubscription() {
        this.subConnect = this.net.onConnect().subscribe(() => {
            if (this.disconnect) {
                this.disconnect = false;
                this.disconnectSubscription();
                this.subConnect.unsubscribe();
                return this.nav.navigateRoot(this.pageActive ? this.pageActive : environment.PAGE_HOME);
            }
        });
    }

}
