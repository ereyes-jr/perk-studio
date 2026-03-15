"use client";

import { SettingsMenu } from "./settings-menu";

export function Header() {
  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tighter text-black dark:text-white"> Perk Studio</h1>
        <p className="text-zinc-500 mt-2 text-lg">High Quality photos taken by Perk Studio</p>
      </div>

      <div className="flex items-center gap-4">
         <SettingsMenu />
      </div>
    </div>
  );
}