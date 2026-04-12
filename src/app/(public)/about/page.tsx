import { Palette, Heart, Award, Users } from "lucide-react";

export const metadata = { title: "О студии" };

export default function AboutPage() {
  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">О студии</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            «Кружок в небе» — это уютное место, где творчество становится доступным для каждого.
            Мы верим, что искусство помогает детям и взрослым выражать себя, развивать воображение
            и находить радость в создании.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {[
              { icon: Palette, title: "Творчество без ограничений", desc: "Все уровни — от новичков до продвинутых. Мы встречаем каждого там, где он находится." },
              { icon: Heart, title: "Забота о каждом ребёнке", desc: "Малые группы позволяют уделить внимание каждому ученику. Максимум 10 человек на занятии." },
              { icon: Award, title: "Профессиональные педагоги", desc: "Опытные художники и арт-терапевты с большим стажем работы с детьми." },
              { icon: Users, title: "Семейная атмосфера", desc: "Семейные абонементы, совместные мастер-классы, уютная обстановка для всей семьи." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Наша история</h2>
          <p className="text-gray-600 mb-4">
            Студия «Кружок в небе» была основана с простой идеей: сделать творческое образование
            доступным и радостным. Мы работаем в небольших группах, чтобы каждый мог раскрыть свой
            потенциал в комфортной обстановке.
          </p>
          <p className="text-gray-600 mb-8">
            За время работы мы помогли сотням детей и взрослых открыть в себе художника,
            научиться выражать эмоции через искусство и просто получить удовольствие от творческого
            процесса.
          </p>
        </div>
      </div>
    </div>
  );
}
