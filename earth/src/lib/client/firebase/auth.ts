import { browser, building } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";
import { auth } from "$lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { readable } from "svelte/store";

export const user = createUserStore();

function createUserStore() {
  const { subscribe } = readable<
    (User & { admin?: boolean; superuser?: boolean }) | null
  >(undefined, (set) => {
    if (building || !browser) {
      set(null);
      return;
    }

    return onAuthStateChanged(auth, async (val) => {
      set(val);

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: await val?.getIdToken() }),
      });

      if (res.status === 200) {
        if ((await res.text()) === "OK" && browser) invalidateAll();
      } else throw new Error("Failed to Authenticate with Server.");

      if (!val) return;

      const privilages = await fetch("/api/get/privileges").then((res) =>
        res.json()
      );

      set({ ...val, ...privilages } as any);
    });
  });

  const known = new Promise<void>((resolve) => {
    const unsub = subscribe((user) => {
      if (user !== undefined) {
        resolve();
        unsub();
      }
    });
  });

  return { subscribe, known };
}

export const signOut = async () => {
  try {
    await fetch("/api/auth", {
      method: "DELETE",
    });
    await auth.signOut();
    goto("/signin");
  } catch (e) {
    console.error("Failed to Sign Out.");
  }
};

export type UserData = {
  name: string;
  pfp: string;
};
