/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CoreModule} from './@core/core.module';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {
    NbChatModule,
    NbDatepickerModule,
    NbDialogModule,
    NbMenuModule,
    NbSidebarModule,
    NbToastrModule,
    NbWindowModule,
} from '@nebular/theme';
import {AuthModule} from './@auth/auth.module';
import {JwtInterceptor} from './helpers/jwt.interceptors';
import {ErrorInterceptor} from './helpers/errors.interceptors';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {HammerConfig} from './configs/hammer.config';
import {LoadingScreenComponent} from './components/loading-screen/loading-screen.component';

import {AppPasswordDirective} from './directives/app-password/app-password.directive';
import {LoadingScreenInterceptor} from './helpers/loading.interceptor';

@NgModule({
    declarations: [AppComponent, LoadingScreenComponent, AppPasswordDirective],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        HttpClientModule,
        AppRoutingModule,
        ThemeModule.forRoot(),
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        AuthModule,
        NbChatModule.forRoot({
            messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
        }),
        CoreModule.forRoot(),
    ],
    exports: [MatSelectModule],
    bootstrap: [AppComponent],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: LoadingScreenInterceptor, multi: true},
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig,
        },
    ],
})
export class AppModule {
}
