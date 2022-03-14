/**
 * Name: User edit
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
import {Component, OnInit} from '@angular/core';
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
  selector: 'ngx-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {
  userUpdateForm: FormGroup;
  nameHold = '';
  submitted: boolean;
  loading: boolean;
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

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private loadingScreen: LoadingScreenService,
              private countriesService: Countries,
              private toasterService: NbToastrService) {
    this.loading = false;
    this.submitted = false;
  }
  // this is the
  ngOnInit(): void {
    // can use the number directly
    this.userUpdateForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      phone: ['', [Validators.minLength(7), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.minLength(5), Validators.maxLength(15)]],
      userType: [''],
      id: [''],
    });

    this.activatedRoute.paramMap.subscribe( params => {
      const userId = parseInt(params.get('id'), 0);
      this.userUpdateForm.controls.id.patchValue(userId);
      this.userService.fetch(userId)
        .subscribe( (ci) => {
          if (parseInt(ci.status, 0) === 200) {
           this.userUpdateForm.patchValue(ci.data);
            this.nameHold = ci.data.name;
          }
          else if (ci.status === 401) {
            this.router.navigateByUrl('/login');
          }
          else {
            // console.log('oops there seems to be an issue');
          }
        });
    });
  }
  // TODO: not sure why I did this.  Is it necessary
  ionViewDidEnter() {
    this.userUpdateForm.controls.companyID.patchValue(3);
  }

  get f() {
    return this.userUpdateForm.controls;
  }

  submitUserUpdate() {
    this.loadingScreen.startLoading();
    this.submitted = true;
    this.loading = true;
    if (this.userUpdateForm.invalid) {
      this.loadingScreen.stopLoading();
      Object.keys(this.userUpdateForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.userUpdateForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.info('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
      return;
    }
    this.userService.update(this.userUpdateForm.value)
      .pipe(first())
      .subscribe(res => {
          if (res.status === 200) {
            this.userUpdateForm.reset();
            this.loadingScreen.stopLoading();
            this.router.navigate(['pages/users/list']);
          } else {
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
