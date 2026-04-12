import { PrismaClient, Role, DirectionType, SubscriptionType, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addYears, setDay, setHours, setMinutes, startOfDay, addDays, addWeeks } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Directions ────────────────────────────────────────────────
  const drawing = await prisma.direction.upsert({
    where: { id: "dir-drawing" },
    update: {},
    create: {
      id: "dir-drawing",
      type: DirectionType.DRAWING,
      name: "Рисование",
      description: "Занятия по живописи и рисунку для всех возрастов",
      ageGroup: "все",
      color: "#f59e0b",
    },
  });

  const artTherapy37 = await prisma.direction.upsert({
    where: { id: "dir-art-37" },
    update: {},
    create: {
      id: "dir-art-37",
      type: DirectionType.ART_THERAPY,
      name: "Арт-терапия (3–7 лет)",
      description: "Арт-терапевтические занятия для малышей",
      ageGroup: "3–7",
      color: "#10b981",
    },
  });

  const artTherapy8 = await prisma.direction.upsert({
    where: { id: "dir-art-8" },
    update: {},
    create: {
      id: "dir-art-8",
      type: DirectionType.ART_THERAPY,
      name: "Арт-терапия (8+)",
      description: "Арт-терапевтические занятия для детей 8 лет и старше",
      ageGroup: "8+",
      color: "#06b6d4",
    },
  });

  const craft = await prisma.direction.upsert({
    where: { id: "dir-craft" },
    update: {},
    create: {
      id: "dir-craft",
      type: DirectionType.CRAFT,
      name: "Рукоделие",
      description: "Вышивка, вязание, декупаж и другие техники",
      ageGroup: "все",
      color: "#ec4899",
    },
  });

  const ceramics = await prisma.direction.upsert({
    where: { id: "dir-ceramics" },
    update: {},
    create: {
      id: "dir-ceramics",
      type: DirectionType.CERAMICS,
      name: "Керамика",
      description: "Лепка из глины и работа с гончарным кругом",
      ageGroup: "все",
      color: "#8b5cf6",
    },
  });

  // ─── Admin user ────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kruzhok.ru" },
    update: {},
    create: {
      email: "admin@kruzhok.ru",
      passwordHash: adminHash,
      name: "Администратор",
      role: Role.ADMIN,
      phone: "+7 900 000-00-00",
    },
  });

  // ─── Teacher users ─────────────────────────────────────────────
  const teacherHash = await bcrypt.hash("teacher123", 10);

  const teacherUser1 = await prisma.user.upsert({
    where: { email: "elena@kruzhok.ru" },
    update: {},
    create: {
      email: "elena@kruzhok.ru",
      passwordHash: teacherHash,
      name: "Елена Смирнова",
      role: Role.TEACHER,
      phone: "+7 900 111-11-11",
    },
  });

  const teacherUser2 = await prisma.user.upsert({
    where: { email: "olga@kruzhok.ru" },
    update: {},
    create: {
      email: "olga@kruzhok.ru",
      passwordHash: teacherHash,
      name: "Ольга Петрова",
      role: Role.TEACHER,
      phone: "+7 900 222-22-22",
    },
  });

  const teacher1 = await prisma.teacher.upsert({
    where: { userId: teacherUser1.id },
    update: {},
    create: {
      userId: teacherUser1.id,
      bio: "Художник, преподаватель рисования с опытом 10 лет",
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { userId: teacherUser2.id },
    update: {},
    create: {
      userId: teacherUser2.id,
      bio: "Арт-терапевт, специалист по работе с детьми",
    },
  });

  // ─── Schedule slots ────────────────────────────────────────────
  // Вт 19:00 — Рисование
  const slot1 = await prisma.scheduleSlot.upsert({
    where: { id: "slot-tue-drawing" },
    update: {},
    create: {
      id: "slot-tue-drawing",
      dayOfWeek: 2, // Вт
      startTime: "19:00",
      durationMin: 90,
      maxStudents: 10,
      directionId: drawing.id,
      teacherId: teacher1.id,
    },
  });

  // Ср 17:30 — Арт-терапия 3–7
  const slot2 = await prisma.scheduleSlot.upsert({
    where: { id: "slot-wed-art37" },
    update: {},
    create: {
      id: "slot-wed-art37",
      dayOfWeek: 3, // Ср
      startTime: "17:30",
      durationMin: 60,
      maxStudents: 8,
      directionId: artTherapy37.id,
      teacherId: teacher2.id,
    },
  });

  // Ср 19:00 — Арт-терапия 8+
  const slot3 = await prisma.scheduleSlot.upsert({
    where: { id: "slot-wed-art8" },
    update: {},
    create: {
      id: "slot-wed-art8",
      dayOfWeek: 3, // Ср
      startTime: "19:00",
      durationMin: 90,
      maxStudents: 10,
      directionId: artTherapy8.id,
      teacherId: teacher2.id,
    },
  });

  // Чт 19:00 — Рисование
  const slot4 = await prisma.scheduleSlot.upsert({
    where: { id: "slot-thu-drawing" },
    update: {},
    create: {
      id: "slot-thu-drawing",
      dayOfWeek: 4, // Чт
      startTime: "19:00",
      durationMin: 90,
      maxStudents: 10,
      directionId: drawing.id,
      teacherId: teacher1.id,
    },
  });

  // Пт 18:00 — Рукоделие
  const slot5 = await prisma.scheduleSlot.upsert({
    where: { id: "slot-fri-craft" },
    update: {},
    create: {
      id: "slot-fri-craft",
      dayOfWeek: 5, // Пт
      startTime: "18:00",
      durationMin: 90,
      maxStudents: 10,
      directionId: craft.id,
      teacherId: teacher1.id,
    },
  });

  // Сб 12:00 — Рисование
  const slot6 = await prisma.scheduleSlot.upsert({
    where: { id: "slot-sat-drawing" },
    update: {},
    create: {
      id: "slot-sat-drawing",
      dayOfWeek: 6, // Сб
      startTime: "12:00",
      durationMin: 90,
      maxStudents: 10,
      directionId: drawing.id,
      teacherId: teacher1.id,
    },
  });

  // ─── Generate ClassSessions for next 4 weeks ───────────────────
  const slots = [slot1, slot2, slot3, slot4, slot5, slot6];
  const directions = { [slot1.id]: drawing, [slot2.id]: artTherapy37, [slot3.id]: artTherapy8, [slot4.id]: drawing, [slot5.id]: craft, [slot6.id]: craft };

  const today = startOfDay(new Date());

  for (const slot of slots) {
    for (let week = 0; week < 4; week++) {
      // Find next occurrence of the day
      const baseDate = addWeeks(today, week);
      // Get Monday of this week then add dayOfWeek-1
      const monday = addDays(baseDate, -(baseDate.getDay() === 0 ? 6 : baseDate.getDay() - 1));
      const sessionDay = addDays(monday, slot.dayOfWeek - 1);

      const [hours, minutes] = slot.startTime.split(":").map(Number);
      const startTime = new Date(sessionDay);
      startTime.setHours(hours, minutes, 0, 0);
      const endTime = new Date(startTime.getTime() + slot.durationMin * 60 * 1000);

      const sessionId = `session-${slot.id}-w${week}`;

      await prisma.classSession.upsert({
        where: { id: sessionId },
        update: {},
        create: {
          id: sessionId,
          date: sessionDay,
          startTime,
          endTime,
          maxStudents: slot.maxStudents,
          scheduleSlotId: slot.id,
          directionId: slot.directionId,
          teacherId: slot.teacherId,
        },
      });
    }
  }

  // ─── Demo client ───────────────────────────────────────────────
  const clientHash = await bcrypt.hash("client123", 10);
  const clientUser = await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      email: "maria@example.com",
      passwordHash: clientHash,
      name: "Мария Иванова",
      role: Role.CLIENT,
      phone: "+7 900 333-33-33",
    },
  });

  const family = await prisma.family.upsert({
    where: { id: "family-ivanova" },
    update: {},
    create: {
      id: "family-ivanova",
      name: "Семья Ивановых",
    },
  });

  await prisma.user.update({
    where: { id: clientUser.id },
    data: { familyId: family.id },
  });

  const child1 = await prisma.child.upsert({
    where: { id: "child-sonya" },
    update: {},
    create: {
      id: "child-sonya",
      name: "Соня Иванова",
      birthDate: new Date("2017-05-12"),
      familyId: family.id,
    },
  });

  const child2 = await prisma.child.upsert({
    where: { id: "child-misha" },
    update: {},
    create: {
      id: "child-misha",
      name: "Миша Иванов",
      birthDate: new Date("2015-03-20"),
      familyId: family.id,
    },
  });

  // Demo subscription
  const now = new Date();
  await prisma.subscription.upsert({
    where: { id: "sub-demo" },
    update: {},
    create: {
      id: "sub-demo",
      type: SubscriptionType.DRAWING_ART_STUDIO,
      totalClasses: 8,
      usedClasses: 2,
      includesMaterials: true,
      priceRub: 4800,
      validFrom: now,
      validUntil: addYears(now, 1),
      familyId: family.id,
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n📋 Accounts:");
  console.log("  Admin:   admin@kruzhok.ru   / admin123");
  console.log("  Teacher: elena@kruzhok.ru   / teacher123");
  console.log("  Teacher: olga@kruzhok.ru    / teacher123");
  console.log("  Client:  maria@example.com  / client123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
