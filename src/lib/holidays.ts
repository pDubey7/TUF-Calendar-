/** Indian public holidays — keyed by MM-DD */
export const HOLIDAYS: Record<string, string> = {
    "01-01": "New Year's Day",
    "01-14": "Makar Sankranti",
    "01-26": "Republic Day",
    "03-14": "Holi",
    "03-31": "Id-ul-Fitr (Eid)",
    "04-06": "Ram Navami",
    "04-10": "Mahavir Jayanti",
    "04-14": "Dr. Ambedkar Jayanti",
    "04-18": "Good Friday",
    "05-01": "May Day",
    "05-12": "Buddha Purnima",
    "06-07": "Eid-ul-Adha (Bakrid)",
    "07-06": "Muharram",
    "08-15": "Independence Day",
    "08-16": "Janmashtami",
    "09-05": "Milad-un-Nabi (Prophet's Birthday)",
    "10-02": "Gandhi Jayanti",
    "10-20": "Dussehra",
    "10-21": "Maharishi Valmiki Jayanti",
    "11-01": "Diwali",
    "11-05": "Guru Nanak Jayanti",
    "11-15": "Guru Nanak Jayanti (alt)",
    "12-25": "Christmas Day",
};

export function getHolidayForDate(month: number, day: number): string | null {
    const key = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return HOLIDAYS[key] ?? null;
}

export function getHolidaysForMonth(month: number): Record<number, string> {
    const prefix = String(month + 1).padStart(2, "0");
    const result: Record<number, string> = {};
    for (const [key, name] of Object.entries(HOLIDAYS)) {
        if (key.startsWith(prefix + "-")) {
            const day = parseInt(key.split("-")[1], 10);
            result[day] = name;
        }
    }
    return result;
}
