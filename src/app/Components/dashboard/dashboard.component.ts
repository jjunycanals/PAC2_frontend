import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // posts!: PostDTO[];
  posts$!: Observable<PostDTO[]>;

  numLikes: number = 0;
  numDislikes: number = 0;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // await this.loadPosts();

    // this.posts.forEach((post) => {
    //   this.numLikes = this.numLikes + post.num_likes;
    //   this.numDislikes = this.numDislikes + post.num_dislikes;
    // });
    this.loadPosts();
  }

  private loadPosts(): void {
    // let errorResponse: any;
    // try {
    //   this.posts = await this.postService.getPosts();
    // } catch (error: any) {
    //   errorResponse = error.error;
    //   this.sharedService.errorLog(errorResponse);
    // }
    this.posts$ = this.postService.getPosts().pipe(
      map(posts => {
        this.numLikes = 0;
        this.numDislikes = 0;
        posts.forEach(post => {
          this.numLikes += post.num_likes;
          this.numDislikes += post.num_dislikes;
        });
        return posts;
      })
    );
  }
}
