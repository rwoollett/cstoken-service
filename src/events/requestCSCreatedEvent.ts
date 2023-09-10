import { Subjects } from './subjects';

export interface RequestCSCreatedEvent {
  subject: Subjects.RequestCSCreated;
  data: {
    id: number;
    requestedAt: string;
    relayed: boolean;
    sourceIp: string;
    parentIp: string;
  };
}


