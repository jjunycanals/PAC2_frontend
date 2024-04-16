import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id') ?? ''; // Aquí usamos el operador de coalescencia nula
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  ngOnInit(): void {
    // update
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.categoryService.getCategoryById(this.categoryId)
        .subscribe(
          (category: CategoryDTO) => {
            this.category = category;
            this.title.setValue(this.category.title);
            this.description.setValue(this.category.description);
            this.css_color.setValue(this.category.css_color);
          },
          (error: any) => {
            const errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }

  private editCategory(): Observable<boolean> {
    const userId = this.localStorageService.get('user_id');
    if (!userId) {
      return of(false);
    }
    this.category.userId = userId;
    return this.categoryService.updateCategory(this.categoryId, this.category)
      .pipe(
        switchMap(() => {
          return of(true);
        }),
        catchError((error: any) => {
          const errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
          return of(false);
        })
      );
  }

  private createCategory(): Observable<boolean> {
    const userId = this.localStorageService.get('user_id');
    if (!userId) {
      return of(false);
    }
    this.category.userId = userId;
    return this.categoryService.createCategory(this.category)
      .pipe(
        switchMap(() => {
          return of(true);
        }),
        catchError((error: any) => {
          const errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
          return of(false);
        })
      );
  }

  saveCategory(): void {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;

    let saveCategoryObservable: Observable<boolean>;

    if (this.isUpdateMode) {
      saveCategoryObservable = this.editCategory();
    } else {
      saveCategoryObservable = this.createCategory();
    }

    saveCategoryObservable.subscribe((responseOK: boolean) => {
      this.validRequest = responseOK;
      if (responseOK) {
        this.router.navigateByUrl('categories');
      }
    });
  }
}
