import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  // posts!: PostDTO[];
  posts$!: Observable<PostDTO[]>;

  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    // this.loadPosts();
  }
  ngOnInit(): void {
      this.loadPosts();
  }

  private loadPosts(): void {
    // let errorResponse: any;
    // const userId = this.localStorageService.get('user_id');
    // if (userId) {
    //   try {
    //     this.posts = await this.postService.getPostsByUserId(userId);
    //   } catch (error: any) {
    //     errorResponse = error.error;
    //     this.sharedService.errorLog(errorResponse);
    //   }
    // }
    this.posts$ = of(this.localStorageService.get('user_id')).pipe(
      switchMap((userId: string | null) => {
        if (userId) {
          return this.postService.getPostsByUserId(userId);
        } else {
          throw new Error('User ID not found');
        }
      })
    );
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    // let errorResponse: any;

    // // show confirmation popup
    // let result = confirm('Confirm delete post with id: ' + postId + ' .');
    // if (result) {
    //   try {
    //     const rowsAffected = await this.postService.deletePost(postId);
    //     if (rowsAffected.affected > 0) {
    //       this.loadPosts();
    //     }
    //   } catch (error: any) {
    //     errorResponse = error.error;
    //     this.sharedService.errorLog(errorResponse);
    //   }
    // }
    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.postService.deletePost(postId).subscribe(
        (rowsAffected) => {
          if (rowsAffected.affected > 0) {
            this.loadPosts();
          }
        },
        (error) => {
          const errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }
}
