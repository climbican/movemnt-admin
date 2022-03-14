import { Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/internal/operators';
import {
    FormGroup,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import {AuthenticationService} from '../../provider/authentication.service';
import {LoadingScreenService} from '../../provider/loading-screen/loading-screen.service';

export class User {
    email: string;
    password: string;
    rememberMe: boolean;
}

export class ShowMessages {
    error: boolean;
    success: boolean;
}

export class Login {
    public email: string;
    public password: string;
    public data: Object;
}

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    })
export class LoginComponent implements OnInit {
    showMessages: any;
    loading: boolean;
    messages = [];
    submitted = false;
    user: User;
    rememberMe = false;
    loginForm: FormGroup;
    loginFormVars: any;
    returnUrl: string;

    constructor(private auth: AuthenticationService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private loadingScreen: LoadingScreenService) {
      this.showMessages = {error: false, success: false};
        // stuff
        this.loginForm = formBuilder.group({
            email: ['', [Validators.required, Validators.email,  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
                         Validators.minLength(6), Validators.maxLength(55)]],
            password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
        });
        this.loginFormVars = Login;
    }

    ngOnInit(): void {
        // TODO: CHECK IF THE PERSON IS ALREADY LOGGED IN AND OFFER A MESSAGE?
        this.loading = false;
        this.loginForm.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
        );
        // reset login status
        this.auth.logout();

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.returnUrl = 'pages/dashboard';
    }

    get f() {
        return this.loginForm.controls;
    }
    /**
     *
     * @param formVars
     */
    loginFormSubmit() {
        this.loadingScreen.startLoading();
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            this.loadingScreen.stopLoading();
            return;
        }

        this.loading = true;
        this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
            .pipe(first())
            .subscribe(
                res => {
                    if (res.status === 200) {
                        this.loginForm.reset();
                        this.loadingScreen.stopLoading();
                        this.messages = [];
                        this.messages.push('Welcome back, onward to the dashboard');
                        this.showMessages.error = false;
                        this.showMessages.success = true;
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.loadingScreen.stopLoading();
                        this.showMessages.error = true;
                        this.messages = ['Username or password is incorrect'];
                        // this.messages.push();
                    }
                },
                error => {
                    this.showMessages.error = true;
                    this.loadingScreen.stopLoading();
                    this.loading = false;
                    this.messages = ['There was a general Error sending the request'];
                    // this.messages.push('there was a general error');
                });
    }
}
