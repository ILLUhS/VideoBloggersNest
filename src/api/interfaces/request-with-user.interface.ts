import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { userId: string; deviceId: string; login: string };
}

export default RequestWithUser;
