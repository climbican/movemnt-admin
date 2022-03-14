import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    FormArray,
    Validators, ValidationErrors,
} from '@angular/forms';
import {LoadingScreenService} from '../../../provider/loading-screen/loading-screen.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, finalize, first, map} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {RoutineService} from '../routines.service';
import {WorkoutService} from '../../workout/workout.service';
// toaster stuffs
import {ToasterConfig, ToasterService} from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import {
    NbComponentStatus,
    NbGlobalLogicalPosition,
    NbGlobalPhysicalPosition,
    NbGlobalPosition,
    NbToastrService,
} from '@nebular/theme';
import {CategoriesService} from '../../../provider/categories.service';

@Component({
    selector: 'ngx-edit-routines',
    templateUrl: './edit-routine.component.html',
    styleUrls: ['./edit-routine.component.scss'],
})
export class EditRoutineComponent implements OnInit {
    // IMAGE PARAMS
    @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
    @ViewChild('fileInputTwo', {static: false}) fileInputTwo: ElementRef;
    fileData: File = null;
    previewUrl: any = null;
    // general page params
    routineEditForm: FormGroup;
    workouts: any;
    workoutTypesSelect: any;
    loading: boolean;
    submitted: boolean;
    routineId: any;
    exerciseTypeSelect: any;
    workoutList: any;
    formErrors: any;
    // toaster vars
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
    testData: any;
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
                private workoutService: WorkoutService,
                private routineService: RoutineService,
                private toasterService: NbToastrService,
                private categories: CategoriesService) {
        this.loading = false;
        this.submitted = false;
        this.formErrors = '';
        this.categories.getWorkoutTypeCategories('routine').subscribe(w => this.workoutTypesSelect = w.data);
        this.workoutService.selectListWorkouts(0).subscribe(d => this.workoutList = d.data);
    }

    ngOnInit() {
        this.previewUrl = 'assets/images/no-image-300x300.png';
        this.routineEditForm = this.formBuilder.group({
            routineId: [''],
            title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
            description: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(2000)]],
            routineGoal: ['', [Validators.required]],
            experienceLevel: ['', [Validators.required]],
            timeToComplete: ['', [Validators.required]],
            snot: [''],
            workouts: new FormArray([
                this.formBuilder.group({
                    workoutId: ['', [Validators.required]],
                    sets: ['', [Validators.required]],
                    useRepetitions: [1, [Validators.required]],
                    repsOrTime: ['', [Validators.required]],
                    interval: ['', [Validators.required]],
                    hasSuperset: [''],
                    supersetParentIndex: [null],
                }),
            ]),
            imageFile: [''],
        });
        // get task info and patch form
        this.route.paramMap.subscribe(params => {
            this.routineId = parseInt(params.get('id'), 0);
            this.routineEditForm.controls.routineId.patchValue(this.routineId);
            // NOT SURE IF THIS IS THE BEST SOLUTION, NEED TO ADDRESS INDIVIDUAL FAILURES AND RETRY
            forkJoin({
                c: this.workoutService.fetch(0),
            })
                .pipe(
                    map((combined) => {
                        this.workouts = combined.c.workouts;
                    }),
                    catchError(error => {
                        return of({results: null});
                    }),
                    finalize(() => {
                        this.routineService.fetch(this.routineId)
                            .subscribe((ci) => {
                                if (parseInt(ci.status, 0) === 200) {
                                    this.routineEditForm.patchValue(ci.data);
                                    this.testData = ci.data;
                                    for (let i = 1; i < ci.data.workouts.length; i++) {
                                        this.g.push(this.formBuilder.group({
                                            workoutId: [ci.data.workouts[i].workoutId, [Validators.required]],
                                            sets: [ci.data.workouts[i].sets, [Validators.required]],
                                            useRepetitions: [ci.data.workouts[i].useRepetitions],
                                            repsOrTime: [ci.data.workouts[i].repsOrTime, [Validators.required]],
                                            interval: [ci.data.workouts[i].interval, [Validators.required]],
                                            hasSuperset: [ci.data.workouts[i].hasSuperset],
                                            supersetParentIndex: [ci.data.workouts[i].supersetParentIndex],
                                        }));
                                        this.routineEditForm.controls.routineGoal.setValue(ci.data.routineGoal);
                                        this.routineEditForm.controls.experienceLevel.setValue(ci.data.experienceLevel.toString());
                                    }
                                } else {
                                    // console.log('oops there seems to be an issue');
                                }
                            });
                    }),
                )
                .subscribe();
        });
    }

    get f() {
        return this.routineEditForm.controls;
    }

    /**
     * format the workout values in an array format
     */
    get g() {
        const retValue = this.f.workouts as FormArray;
        return retValue;
    }

    // SUBMIT ADD TASK
    submitUpdateRoutine() {
        this.submitted = true;
        this.loading = true;
        if (this.routineEditForm.invalid) {
            this.loadingScreen.stopLoading();
            if (this.routineEditForm.invalid) {
                this.loadingScreen.stopLoading();
                Object.keys(this.routineEditForm.controls).forEach(key => {
                    const controlErrors: ValidationErrors = this.routineEditForm.get(key).errors;
                    if (controlErrors != null) {
                        Object.keys(controlErrors).forEach(keyError => {
                            // console.info('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                            this.showToast('warning', 'Form Field Error', '*field: ' + key + ' Issue: ' + keyError);
                        });
                    }
                });
            }
            // need a popup to inform the user what the errors are
            return;
        }
        this.routineService.update(this.routineEditForm.value)
            .pipe(first())
            .subscribe(res => {
                    if (res.status === 200) {
                        this.routineEditForm.reset();
                        this.loadingScreen.stopLoading();
                        this.router.navigate(['pages/routines/list']);
                    } else if (res.status === 401) {
                        this.router.navigateByUrl('/login');
                    } else {
                        this.loadingScreen.stopLoading();
                        this.loading = false;
                        this.showToast('danger', 'Problem on server side', 'General Error');
                    }
                },
                error => {
                    this.loadingScreen.stopLoading();
                    this.loading = false;
                });
    }

    /**
     * @desc add workout field set
     */
    addWorkoutFieldSet(index) {
        let supersetParentIndex = 2000;
        if (index < 50) {
            supersetParentIndex = index;

            this.g.insert((index + 1),
                this.formBuilder.group({
                    workoutId: ['', [Validators.required]],
                    sets: ['', [Validators.required]],
                    useRepetitions: [1, [Validators.required]],
                    repsOrTime: ['', [Validators.required]],
                    interval: ['', [Validators.required]],
                    hasSuperset: [''],
                    supersetParentIndex: [index],
                }));
        } else {
            this.g.push(this.formBuilder.group({
                workoutId: ['', [Validators.required]],
                sets: ['', [Validators.required]],
                useRepetitions: [1, [Validators.required]],
                repsOrTime: ['', [Validators.required]],
                interval: ['', [Validators.required]],
                hasSuperset: [''],
                supersetParentIndex: [null],
            }));
        }
    }

    isSuperSet(index) {
        return this.g.value[index].supersetParentIndex !== null;
    }

    /**
     * @desc remove workout field set....
     */
    removeWorkoutFieldSet(e) {
        if (this.g.length > 1) {
            if (this.g.value[e].hasSuperset) {
                this.g.removeAt(e);
            }
            this.g.removeAt(e);
        } else {
            alert('routine requires at least one workout');
        }
    }

    addRemoveSuperSet(index, checkedValue) {
        if (checkedValue.target.checked) {
            this.addWorkoutFieldSet(index);
        } else {
            this.removeWorkoutFieldSet(index + 1);
        }
    }

    onReset() {
        // reset whole form back to initial state
        this.submitted = false;
        this.routineEditForm.reset();
        this.g.clear();
    }

    onFileChange(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);
            // The next two lines set the value and open the preview
            this.fileData = <File>event.target.files[0];
            this.preview();
            reader.onload = () => {
                this.routineEditForm.patchValue({
                    imageFile: reader.result,
                });
            };
        }
    }

    /*
     * @desc preview the image, not quit optimal but it works well
     */
    preview() {
        // Show preview
        const mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {
            this.previewUrl = reader.result;
        };
    }

    removeImage() {
        this.previewUrl = 'assets/images/no-image-300x300.png';
        this.fileData = null;
        this.fileInput.nativeElement.value = '';
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
        };
        const titleContent = title ? `. ${title}` : '';

        this.index += 1;
        this.toasterService.show(
            body,
            `${titleContent}`,
            config);
    }
}


