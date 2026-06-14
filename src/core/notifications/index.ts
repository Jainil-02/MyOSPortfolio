export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
};

const STORAGE_KEY = "my-os-portfolio-notifications";

const MAX_NOTIFICATIONS = 50;

let notifications: Notification[] = [];

function loadFromStorage(): Notification[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Notification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(state: Notification[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full — silently ignore */
  }
}

notifications = loadFromStorage();

type NotificationSubscriber = (notifications: ReadonlyArray<Notification>) => void;
const notificationSubscribers = new Set<NotificationSubscriber>();

function broadcastNotifications() {
  const snapshot = notifications;
  for (const subscriber of notificationSubscribers) {
    subscriber(snapshot);
  }
}

export function getNotifications(): ReadonlyArray<Notification> {
  return notifications;
}

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length;
}

let counter = 0;

export function addNotification(
  title: string,
  message: string,
  type: NotificationType = "info",
): string {
  const id = `notif-${Date.now()}-${++counter}`;
  const notification: Notification = {
    id,
    title,
    message,
    type,
    timestamp: Date.now(),
    read: false,
  };
  notifications = [notification, ...notifications];
  if (notifications.length > MAX_NOTIFICATIONS) {
    notifications = notifications.slice(0, MAX_NOTIFICATIONS);
  }
  saveToStorage(notifications);
  broadcastNotifications();
  return id;
}

export function dismissNotification(id: string) {
  notifications = notifications.filter((n) => n.id !== id);
  saveToStorage(notifications);
  broadcastNotifications();
}

export function markAsRead(id: string) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveToStorage(notifications);
  broadcastNotifications();
}

export function markAllAsRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  saveToStorage(notifications);
  broadcastNotifications();
}

export function clearAllNotifications() {
  notifications = [];
  saveToStorage(notifications);
  broadcastNotifications();
}

export function subscribeToNotifications(subscriber: NotificationSubscriber) {
  notificationSubscribers.add(subscriber);
  subscriber(notifications);

  return () => {
    notificationSubscribers.delete(subscriber);
  };
}
