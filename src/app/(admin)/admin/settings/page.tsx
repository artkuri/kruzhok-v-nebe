import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/features/admin/settings-form";

export const metadata = { title: "Настройки" };

export default async function SettingsPage() {
  const settings = await prisma.studioSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
      <SettingsForm initial={{
        studioName: settings.studioName,
        address: settings.address,
        phone: settings.phone,
        description: settings.description,
        maxGroupSize: settings.maxGroupSize,
        cancellationHours: settings.cancellationHours,
        defaultDurationMin: settings.defaultDurationMin,
      }} />
    </div>
  );
}
