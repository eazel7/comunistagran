import { ImagesAPI } from './images'
import { UsersAPI } from './users'
import { FollowsAPI } from './follows'
import { PostsAPI } from './posts'
import { CommentsAPI } from './comments'
import { RationingAPI } from './rationing'

export class API {
  constructor(db, minioClient) {
    this.images = new ImagesAPI(minioClient)
    this.users = new UsersAPI(db)
    this.follows = new FollowsAPI(db)
    this.posts = new PostsAPI(db)
    this.comments = new CommentsAPI(db)
    this.rationing = new RationingAPI(db)
  }
}
