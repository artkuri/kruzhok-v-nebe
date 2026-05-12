"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
class ScheduleService {
    lessonRepository;
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
    }
    async getUpcoming(days = 7) {
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
exports.ScheduleService = ScheduleService;
