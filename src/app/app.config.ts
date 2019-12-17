/*
- Somente Editar o OBJ IAppConfig com as suas configurações
- Lembre de configurar o Coffer para obter suas informações

**** Como usar as configs:
1. Importe
import { AppConfig, IAppConfig } from '../../app.config';

2. Adc no constructor dessa forma
constructor(private appConfig: AppConfig) { this.appSettings = appConfig.settings; }

3. Utilize-a
Exemplo -> this.appSettings.api.autheUrl

*/

export interface IAppConfig {
    api: {
        oauth2UrlToken: string,
        oauth2UrlAuthorities: string,
        url: string
    };

    spring: {
        profiles: string
    };
}

import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AppConfig {

    private localSettings: IAppConfig;

    public set settings(v: IAppConfig) {
        this.localSettings = v;
    }

    public get settings(): IAppConfig {
        return this.localSettings;
    }
}