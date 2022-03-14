/**
 * Name: User Add
 *
 * Description: THIS WILL PROCESS TRANSACTIONS THAT COME IN FROM THE WEB SITE.
 * !!IMPORTANT NOTE: EACH FUNCTION WILL NEED TO AGGREGATE TO THE RESPECTIVE GATEWAY.
 *
 *
 * Copyright (c) 2019. All Code is the property of FitnessFeed unless unless otherwise specified by contract.
 *
 *          (\ /)
 *          (O .o)
 *          (> '<)
 *          (_/\_)
 *      ]) o 0 []v[]
 *
 * @author Michael Rumack
 * @company FitnessFeed
 * User: climbican
 * Date: 2/5/16
 * Time: 2:35 PM
 * Last Mod:
 * Notes:
 *
 */
import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators, ValidationErrors,
} from '@angular/forms';
import {LoadingScreenService} from '../../../provider/loading-screen/loading-screen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Countries} from '../../../@core/data/countries';
import {first} from 'rxjs/operators';
import {UserService} from '../../../provider/user.service';
// toaster stuffs
import {ToasterConfig} from 'angular2-toaster';
import {BodyOutputType} from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import {
    NbComponentStatus,
    NbGlobalLogicalPosition,
    NbGlobalPhysicalPosition,
    NbGlobalPosition,
    NbToastrService,
} from '@nebular/theme';

@Component({
    selector: 'ngx-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, AfterViewInit {
    userForm: FormGroup;
    countries: any;
    countryState: any;
    formErrorMessages: any;
    loading: boolean;
    submitted: boolean;
    // toaster vars
    formErrors: any;
    config: ToasterConfig;
    index = 1;
    destroyByClick = true;
    duration = 12000;
    hasIcon = true;
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    preventDuplicates = false;
    status: NbComponentStatus = 'primary';
    // title and content
    title = '';
    content = ``;
    // types of status styles
    types: NbComponentStatus[] = [
        'primary',
        'success',
        'info',
        'warning',
        'danger',
    ];
    positions: string[] = [
        NbGlobalPhysicalPosition.TOP_RIGHT,
        NbGlobalPhysicalPosition.TOP_LEFT,
        NbGlobalPhysicalPosition.BOTTOM_LEFT,
        NbGlobalPhysicalPosition.BOTTOM_RIGHT,
        NbGlobalLogicalPosition.TOP_END,
        NbGlobalLogicalPosition.TOP_START,
        NbGlobalLogicalPosition.BOTTOM_END,
        NbGlobalLogicalPosition.BOTTOM_START,
    ];

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private loadingScreen: LoadingScreenService,
                private countriesService: Countries,
                private userService: UserService,
                private toasterService: NbToastrService) {
      this.loading = false;
      this.submitted = false;
    }

    ngOnInit() {
      this.userForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        phone: ['', [Validators.minLength(7), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
        userType: [''],
      });
        this.countriesService.getCountryAbbr().subscribe( x => this.countries = x);
        this.countryState = [];
        // This is an example of error messages that are segrigated from the form itself.
    }

    ngAfterViewInit() { }

    get f() {
        return this.userForm.controls;
    }

    submitUserAdd() {
      this.loadingScreen.startLoading();
      this.submitted = true;
      this.loading = true;
      if (this.userForm.invalid) {
          Object.keys(this.userForm.controls).forEach(key => {
              const controlErrors: ValidationErrors = this.userForm.get(key).errors;
              if (controlErrors != null) {
                  Object.keys(controlErrors).forEach(keyError => {
                      this.showToast('warning', 'Form Field Error', 'field: ' +  key + ' Issue: ' + keyError);
                  });
              }
          });
          return;
      }
        this.userService.add(this.userForm.value)
          .pipe(first())
          .subscribe(res => {
            if (res.status === 200) {
              this.userForm.reset();
              this.loadingScreen.stopLoading();
              this.router.navigate(['pages/users/list']);
            }
            else if (res.status === 401) {
                this.router.navigateByUrl('/login');
            }else {
              this.loadingScreen.stopLoading();
            }
          },
            error => {
              this.loadingScreen.stopLoading();
              this.loading = false;
            });
    }
    /**
     * @desc toaster service function
     * @param type
     * @param title
     * @param body
     */
    private showToast(type: NbComponentStatus, title: string, body: string) {
        const config = {
            status: type,
            destroyByClick: this.destroyByClick,
            duration: this.duration,
            hasIcon: this.hasIcon,
            position: this.position,
            preventDuplicates: this.preventDuplicates,
            bodyOutputType: BodyOutputType.TrustedHtml,
        };
        const titleContent = title ? `. ${title}` : '';

        this.index += 1;
        this.toasterService.show(
            body,
            `${titleContent}`,
            config);
    }
}
