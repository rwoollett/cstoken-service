import { Subjects } from './subjects';

export interface CommentCreatedEvent {
  subject: Subjects.CommentCreated;
  data: {
    id: number;
    message: string;
    publishedAt: string;
    articleSlug: string;
  };
}


