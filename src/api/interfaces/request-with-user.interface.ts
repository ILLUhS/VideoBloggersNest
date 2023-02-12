import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { userId: string; deviceId: string };
}

export default RequestWithUser;
