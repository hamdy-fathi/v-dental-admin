import { inject, Injectable } from "@angular/core";
import { MessageService, ToastMessageOptions } from "primeng/api";

@Injectable({ providedIn: "root" })
export class AlertService {
  #message = inject(MessageService);

  messageData: ToastMessageOptions = {
    key: undefined,
    severity: "",
    detail: "",
    summary: "",
    icon: "",
    sticky: false,
    life: 4000,
  };

  setMessage(data: ToastMessageOptions) {
    this.messageData = { ...this.messageData, ...data };
    if (this.messageData.detail?.trim()) {
      this.#message.clear();
      this.#message.add(this.messageData);
    }
  }
}
