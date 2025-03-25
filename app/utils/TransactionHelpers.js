/**
 * Checks if a payment reminder can be sent based on the last reminder timestamp
 * @param {string|Date|null} lastReminderSentAt - The timestamp of the last reminder
 * @param {number} hoursRequired - Minimum hours required between reminders (default: 12)
 * @returns {boolean} - Whether a reminder can be sent
 */
export function canSendReminder(lastReminderSentAt, hoursRequired = 12) {
    if (!lastReminderSentAt) return true;

    const now = new Date();
    const lastReminder = new Date(lastReminderSentAt);
    const diff = now.getTime() - lastReminder.getTime();
    const hours = diff / (1000 * 60 * 60);

    return hours >= hoursRequired;
}