// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react";

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>
        <div>Tiny missions. Big office mischief.</div>

        <div className="mt-8 space-y-4 max-w-2xl">
          <p>
            Welcome to Pocket Heist, where office pranks meet mission planning.
            Turn your workplace into a playground with cleverly orchestrated
            shenanigans that keep everyone on their toes.
          </p>

          <p>
            Create secret missions, assign them to your fellow troublemakers,
            and watch as harmless chaos unfolds. From strategic stapler
            relocations to mysterious coffee cup disappearances, every heist is
            a chance to brighten someones day with a bit of unexpected fun.
          </p>

          <p>
            Track your active missions, monitor assigned heists, and build your
            reputation as the offices most creative mischief-maker. Remember:
            the best pranks are harmless, hilarious, and leave everyone smiling.
          </p>

          <p className="text-sm text-body/70 italic">
            Ready to plan your first heist? Sign up or log in to get started!
          </p>
        </div>
      </div>
    </div>
  );
}
