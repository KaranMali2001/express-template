import { Event_Types } from '@/constant';
import { logsService } from '@/services/logs.service';
import { userService } from '@/services/user.service';
import { loginRequest } from '@/type/user.type';
import { signJWT } from '@/utils/auth';
import logger from '@/utils/logger';
import { failure, success } from '@/utils/response';
import { tryCatch } from '@/utils/try.catch';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as loginRequest;
  const { data: user, error } = await tryCatch(userService.createUser(email, password));

  if (error) {
    logger.error({ error }, 'Error while creating user');
    return failure(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create user');
  }
  void logsService.createLog('User created', user.id, Event_Types.USER_CREATED).catch((err) => logger.error({ err }, 'Error while creating log'));
  const token = signJWT(user.id, user.role);

  return success(res, StatusCodes.CREATED, 'User created successfully', { user, token });
}

export async function getCurrentUser(req: Request, res: Response) {
  const userid = req.userid;

  if (!userid) {
    return failure(res, StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }
  const { data: user, error } = await tryCatch(userService.getUserById(userid));

  if (error) {
    logger.error({ error, userid }, 'Error while getting user');
    return failure(res, StatusCodes.SERVICE_UNAVAILABLE, 'Failed to get user');
  }
  logger.info(user?.id, 'User fetched successfully');

  return success(res, StatusCodes.OK, 'User fetched successfully', user);
}

export async function logout(req: Request, res: Response) {
  const userid = req.userid;

  if (!userid) {
    return failure(res, StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }
  const { data: user, error } = await tryCatch(logsService.createLog('User logged out', userid, Event_Types.LOGOUT));

  if (error) {
    logger.error({ error, userid }, 'Error during user logout');
    return failure(res, StatusCodes.SERVICE_UNAVAILABLE, 'Failed to logout');
  }
  return success(res, StatusCodes.OK, 'User logged out successfully', user);
}
