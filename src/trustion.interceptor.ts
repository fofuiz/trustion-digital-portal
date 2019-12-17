import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ModalService } from './services/modal.service';
import { GlobalService } from './services/global.service';
import { environment } from './environments/environment';
import { ModalItem } from './model/modal-item';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

@Injectable()
export class TrustionInterceptor implements HttpInterceptor {

    constructor(
        private modalService: ModalService,
        private globalService: GlobalService) { }

    intercept(
        request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const reqURL = request.url.toString();

        if (reqURL.indexOf('@@') > -1) {
            request = request.clone({ url: `${environment.originAuth}/${reqURL.slice(2, reqURL.length)}` });
        } else {
            request = request.clone({ url: `${environment.origin}/${reqURL}` });
        }

        console.log(request.url);

        if (request.method === 'POST') {
            console.log('FRH -> POST');
        }

        if (request.method === 'GET') {
            console.log('FRH -> GET');
        }

        if (request.method === 'DELETE') {
            console.log('FRH -> DELETE');
        }

        if (request.method === 'PUT') {
            console.log('FRH -> PUT');
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event', event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    message: error.message
                };
                const modal = new ModalItem();
                modal.type = 'system';
                modal.name = 'Erro de comunicação';
                modal.origin = 'home';
                modal.title = 'Erro de comunicação';
                modal.message = 'Ocorreu um erro de comunicação com o servidor, tente novamente mais tarde';
                modal.body = {
                    name: 'Erro de comunicação',
                    msg: 'Ocorreu um erro de comunicação com o servidor, tente novamente mais tarde'
                };
                modal.visible = true;
                modal.width = '320px';
                modal.height = '240px';

                this.modalService.showDialogWindow(modal);

                return throwError(error);
            }));
    }
}
 