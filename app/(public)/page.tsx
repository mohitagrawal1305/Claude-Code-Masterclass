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

        <div className="mt-10 flex gap-4">
          <a
            href="/login"
            className="px-6 py-2 rounded-lg bg-primary text-dark font-semibold hover:opacity-90 transition-opacity"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="px-6 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
          >
            Sign up
          </a>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
          <div className="bg-light rounded-xl p-5">
            <div className="text-2xl font-bold text-primary">120+</div>
            <div className="text-sm text-body mt-1">Heists completed</div>
          </div>
          <div className="bg-light rounded-xl p-5">
            <div className="text-2xl font-bold text-secondary">34</div>
            <div className="text-sm text-body mt-1">Active agents</div>
          </div>
          <div className="bg-light rounded-xl p-5">
            <div className="text-2xl font-bold text-success">98%</div>
            <div className="text-sm text-body mt-1">Smiles generated</div>
          </div>
        </div>
      </div>
    </div>
  );
}
