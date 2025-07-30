import { prisma } from '@/app';
import { Event_Types } from '@/constant';

export const logsService = {
  createLog: async (message: string, userId: string, event_tpye: Event_Types) => {
    return await prisma.logUserEvent.create({
      data: {
        event_type: event_tpye,
        user_id: userId,
        metadata: JSON.stringify({ message }),
      },
    });
  },
};
