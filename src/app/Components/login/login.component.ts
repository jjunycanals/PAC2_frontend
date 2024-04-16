import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
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

  constructor(
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

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  // async login(): Promise<void> {
  login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;
    // try {
    // const authToken = await this.authService.login(this.loginUser);
    //   responseOK = true;
    //   this.loginUser.user_id = authToken.user_id;
    //   this.loginUser.access_token = authToken.access_token;
    //   // save token to localstorage for next requests
    //   this.localStorageService.set('user_id', this.loginUser.user_id);
    //   this.localStorageService.set('access_token', this.loginUser.access_token);
    // } catch (error: any) {
    //   responseOK = false;
    //   errorResponse = error.error;
    //   const headerInfo: HeaderMenus = {
    //     showAuthSection: false,
    //     showNoAuthSection: true,
    //   };
    //   this.headerMenusService.headerManagement.next(headerInfo);

    //   this.sharedService.errorLog(error.error);
    // }
    this.authService.login(this.loginUser).subscribe(
      (loginResult: AuthToken) => {
        this.authToken = loginResult;
        this.loginUser.user_id = this.authToken.user_id;
        this.loginUser.access_token = this.authToken.access_token;
        this.localStorageService.set('user_id', this.loginUser.user_id);
        this.localStorageService.set(
          'access_token',
          this.loginUser.access_token
        );
        responseOK = true;
        const headerInfo: HeaderMenus = {
          showAuthSection: true,
          showNoAuthSection: false,
        };
        this.headerMenusService.headerManagement.next(headerInfo);
        this.router.navigateByUrl('home');
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
