import { useState, useEffect } from "react";

export function useHijriDate(dateString: string) {
  const [hijriDate, setHijriDate] = useState<string>("");

  useEffect(() => {
    const fetchHijriDate = async () => {
      if (!dateString) return;

      // Convert YYYY-MM-DD to DD-MM-YYYY
      const [year, month, day] = dateString.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/gToH/${formattedDate}?calendarMethod=UAQ`
        );
        const data = await response.json();
        if (data.code === 200) {
          const h = data.data.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} Hijri`);
        }
      } catch (error) {
        console.error("Failed to fetch Hijri date", error);
        setHijriDate("");
      }
    };

    fetchHijriDate();
  }, [dateString]);

  return hijriDate;
}
