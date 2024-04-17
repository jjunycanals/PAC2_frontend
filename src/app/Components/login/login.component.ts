import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AuthToken } from 'src/app/Services/auth.service';

// Importar mòduls REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Store/app.state';
import { login } from 'src/app/Store/auth/auth.actions';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;
  authToken: AuthToken | undefined;
  authToken$: Observable<AuthToken>;

  constructor(
    private store: Store<AppState>,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    // this.loginForm = this.formBuilder.group({
    //   email: this.email,
    //   password: this.password,
    // });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // canvi a FormBuilder
      password: ['', [Validators.required, Validators.minLength(8)]], // canvi a FormBuilder
    });
    this.authToken$ = this.store.select((state) => state.auth.token); // Observando el estado de autenticación
  }

  ngOnInit(): void {}

  // async login(): Promise<void> {
  login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService.login(this.loginUser).subscribe(
      (loginResult: AuthToken) => {
        this.store.dispatch(login({ authDTO: this.loginUser }));
        this.router.navigateByUrl('home');
        // this.authToken = loginResult;
        // this.loginUser.user_id = this.authToken.user_id;
        // this.loginUser.access_token = this.authToken.access_token;
        // this.localStorageService.set('user_id', this.loginUser.user_id);
        // this.localStorageService.set(
        //   'access_token',
        //   this.loginUser.access_token
        // );
        // responseOK = true;
        // const headerInfo: HeaderMenus = {
        //   showAuthSection: true,
        //   showNoAuthSection: false,
        // };
        // this.headerMenusService.headerManagement.next(headerInfo);
        // this.router.navigateByUrl('home');
      },
      (error) => {
        responseOK = false;
        errorResponse = error.error;
        const headerInfo: HeaderMenus = {
          showAuthSection: false,
          showNoAuthSection: true,
        };
        this.headerMenusService.headerManagement.next(headerInfo);
        this.sharedService.errorLog(error.error);
      }
    );
    this.sharedService.managementToast(
      'loginFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
      };
      // update options menu
      this.headerMenusService.headerManagement.next(headerInfo);
      this.router.navigateByUrl('home');
    }
  }
}
