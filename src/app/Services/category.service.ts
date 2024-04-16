import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryDTO } from '../Models/category.dto';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  // getCategoriesByUserId(userId: string): Promise<CategoryDTO[]> {
  //   return this.http
  //     .get<CategoryDTO[]>('http://localhost:3000/users/categories/' + userId)
  //     .toPromise();
  // }

  // createCategory(category: CategoryDTO): Promise<CategoryDTO> {
  //   return this.http
  //     .post<CategoryDTO>(this.urlBlogUocApi, category)
  //     .toPromise();
  // }

  // getCategoryById(categoryId: string): Promise<CategoryDTO> {
  //   return this.http
  //     .get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId)
  //     .toPromise();
  // }
  getCategoriesByUserId(userId: string): Observable<CategoryDTO[]> {
    return this.http
      .get<CategoryDTO[]>('http://localhost:3000/users/categories/' + userId)
      .pipe(map((response: CategoryDTO[]) => response));
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http
      .post<CategoryDTO>(this.urlBlogUocApi, category)
      .pipe(map((response: CategoryDTO) => response));
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    return this.http
      .get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId)
      .pipe(map((response: CategoryDTO) => response));
  }



  updateCategory(
    categoryId: string,
    category: CategoryDTO
  // ): Promise<CategoryDTO> {
  //   return this.http
  //     .put<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId, category)
  //     .toPromise();
  // }
  ): Observable<CategoryDTO> {
    return this.http
      .put<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId, category)
      .pipe(map((response: CategoryDTO) => response));
  }

  // delete category (si esta vinculada a un post no dixarem eliminar)
  // deleteCategory(categoryId: string): Promise<deleteResponse> {
  //   return this.http
  //     .delete<deleteResponse>(this.urlBlogUocApi + '/' + categoryId)
  //     .toPromise();
  // }
  deleteCategory(categoryId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + categoryId)
      .pipe(map((response: deleteResponse) => response));
  }
}
