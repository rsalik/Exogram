import { get, writable } from "svelte/store";
import PlainSaveableCard from "$lib/components/saveables/cards/PlainSaveableCard.svelte";
import PropertiedSaveableCard from "$lib/components/saveables/cards/PropertiedSaveableCard.svelte";
import type { ComponentProps } from "svelte";
import ImageSaveableCard from "$lib/components/saveables/cards/ImageSaveableCard.svelte";
import SaveableContextMenu from "$lib/components/saveables/SaveableContextMenu.svelte";
import { quadInOut } from "svelte/easing";

export const SaveableCardType = {
  plain: PlainSaveableCard,
  propertied: PropertiedSaveableCard,
  image: ImageSaveableCard,
};

export type Saveable = {
  id: number;
  link: string;
} & (
  | {
      type: "plain";
      data: ComponentProps<PlainSaveableCard>["data"];
    }
  | {
      type: "propertied";
      data: ComponentProps<PropertiedSaveableCard>["data"];
    }
  | {
      type: "image";
      data: ComponentProps<ImageSaveableCard>["data"];
    }
);

export type UserNotificationData = {
  read: number;
  latest: number;
  value: (Saveable & { from: string })[];
};

export function saveable(
  node: HTMLElement,
  pData: Omit<Saveable, "id"> | undefined
) {
  if (pData === undefined) return; // Allow undefined to avoid complicated logic in components

  const data = pData as Omit<Saveable, "id">;

  function onDragStart(e: DragEvent) {
    e.stopPropagation();

    // if (e.target !== node) {
    //   e.preventDefault();
    //   return;
    // }

    isSaveableDragging.set(true);

    e.dataTransfer?.setData("text/json", JSON.stringify(pData));
    e.dataTransfer?.setData("text/plain", data.link);

    node.classList.add("dragging");
  }

  function onDragEnd(e: DragEvent) {
    e.stopPropagation();

    isSaveableDragging.set(false);
    node.classList.remove("dragging");
  }

  node.addEventListener("dragstart", onDragStart);
  node.addEventListener("dragend", onDragEnd);

  node.draggable = true;
  node.style.cursor = "grab";
  node.style.userSelect = "text";

  node.classList.add("saveable");

  let cmDes = saveableContextMenu(node, { saveable: data }).destroy;

  return {
    destroy() {
      node.removeEventListener("dragstart", onDragStart);
      node.removeEventListener("dragend", onDragEnd);

      cmDes();
    },
    update(newData: Omit<Saveable, "id">) {
      pData = newData;

      cmDes();
      cmDes = saveableContextMenu(node, { saveable: newData }).destroy;
    },
  };
}

let contextMenu: SaveableContextMenu | undefined = undefined;

export function saveableContextMenu(
  node: HTMLElement,
  pData: {
    saveable: Omit<Saveable, "id">;
    notification?: boolean;
    offsetLeft?: number;
    offsetTop?: number;
    card?: boolean;
  }
) {
  const id = Date.now();

  function onContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (contextMenu) contextMenu.$destroy();

    // Create a instance of SaveableContextMenu
    contextMenu = new SaveableContextMenu({
      target: document.body,
      props: {
        saveable: pData.saveable,
        x: e.clientX,
        y: e.clientY,
        id,
        notification: pData.notification,
        node,
      },
    });

    document.body.addEventListener("click", onBlur);
    document.body.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll);
  }

  function destroyMenu() {
    document.body.removeEventListener("click", onBlur);
    document.body.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("scroll", onScroll);
    contextMenu?.$destroy();
  }

  function onScroll() {
    if (contextMenu) destroyMenu();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (contextMenu) destroyMenu();
    }
  }

  function onBlur() {
    if (contextMenu) destroyMenu();
  }

  node.addEventListener("contextmenu", onContextMenu);

  return {
    destroy() {
      node.removeEventListener("contextmenu", onContextMenu);
      destroyMenu();
    },
  };
}

export const saveableCrossfade = (node: HTMLElement, { duration = 400 }) => {
  const { x, y } = get(saveableTransitionOrigin);

  const b = node.getBoundingClientRect();
  const nx = b.left;
  const ny = b.top;

  const sx = x - nx;
  const sy = y - ny;

  const o = +getComputedStyle(node).opacity;

  return {
    duration,
    // Start at x, y and end up at the actual position
    css: (u: number) => {
      const t = quadInOut(u);

      return `transform: translate(
        ${(1 - t) * sx}px,
        ${(1 - t) * sy}px
      );
      opacity: ${t * o}
    `;
    },
  };
};

export const isSaveableDragging = writable(false);
export const isSaveableCardDragging = writable(false);
export const isSaveableDrawerShowing = writable(false);
export const forceSaveableDrawerShowing = writable(false);

export const sharingSaveable = writable<Saveable | null>(null);
export const saveableTransitionOrigin = writable({ x: 0, y: 0 });

export const saveables = writable<Saveable[]>([]);

export const isNotificationPanelShowing = writable(false);
