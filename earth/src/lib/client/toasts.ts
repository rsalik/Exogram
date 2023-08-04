import { writable } from "svelte/store";

export enum ToastType {
  INFO = "info",
  SUCCESS = "success",
  ERROR = "error",
}

export type Toast = {
  type: ToastType;
  name: string;
  message: string;
  id: number;
};

export const toasts = writable<Toast[]>([]);

export function createToast(type: ToastType, name: string, message: string) {
  const id = Date.now();

  toasts.update((toasts) => {
    return [...toasts, { type, name, message, id }];
  });

  setTimeout(() => {
    toasts.update((toasts) => {
      return toasts.filter((toast) => toast.id !== id);
    });
  }, 5000);

  return id;
}

export function deleteToast(id: number) {
  toasts.update((toasts) => {
    return toasts.filter((toast) => toast.id !== id);
  });
}
