import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IAppConfig, AppConfig } from '../../app.config';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
    
    // AppConfig.settings
    // protected appConfig: AppConfig;

    constructor(private http: HttpClient, private appConfig: AppConfig)  { 
        // this.appConfig = appConfig;
    }
    
    load() {
        const jsonFile = `assets/config/config.json`;
        console.log('[AppConfigService] [load]', {jsonFile})
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: HagridConfig) => {
                let objFim = {};
                console.log('Config Loaded', { response });
                let pall2 = response.propertySources.map((e: PropertySources) => {
                    // console.log('PropertySources', { e });
                    // console.log('PropertySources', e.source);
                    let pall1 = Object.keys(e.source).map((key) => {
                        let value = e.source[key];
                        console.log(`key: ${key}, value: ${value}`);
                        return Promise.resolve(index(objFim, key, value));
                    });
                    console.log('pall1', pall1);
                    return Promise.all(pall1);
                });
                console.log('pall2', pall2);
                Promise.all(pall2).then((r) => {
                    console.log('obj', { objFim });
                    this.appConfig.settings = <IAppConfig>objFim;
                    console.log('this.appConfig.settings', this.appConfig.settings);
                    resolve();
                });
                // resolve();
            }).catch((response: any) => {
                console.error('[AppConfigService] [error]', {response})
                reject(`Could not load the config file`);
            });
        });
    }
}


function index(obj, is, value) {
    // console.log('obj', { obj }, 'is', { is }, 'value', { value });
    if (typeof is == 'string')
        return index(obj, is.split('.'), value);
    else if (is.length == 1 && value !== undefined)
        return obj[is[0]] = value;
    else if (is.length == 0)
        return obj;
    else {
        if(!obj[is[0]]){
            obj[is[0]] = {};
        }
        return index(obj[is[0]], is.slice(1), value);
    }
}

export interface HagridConfig {
    name: string,
    profiles: Array<string>,
    propertySources: Array<PropertySources>
}

export interface PropertySources {
    name: string,
    source: Object
}
