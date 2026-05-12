import { LessonDto } from "../dto";
import { LessonRepository } from "../repositories/lesson.repository";

export class ScheduleService {
  constructor(private readonly lessonRepository: LessonRepository) {}

  async getUpcoming(days = 7): Promise<LessonDto[]> {
    const lessons = await this.lessonRepository.findUpcomingWithinDays(days);

    return lessons.map((lesson) => {
      const booked = Number(lesson.bookedCount);
      return {
        id: lesson.id,
        title: lesson.title,
        startsAt: lesson.startsAt,
        endsAt: lesson.endsAt,
        maxStudents: lesson.maxStudents,
        remainingSeats: Math.max(lesson.maxStudents - booked, 0),
      };
    });
  }
}
