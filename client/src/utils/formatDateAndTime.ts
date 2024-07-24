const formatDateAndTime = (utcTime: string) => {
    const date = new Date(utcTime);

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    });
};

export { formatDateAndTime };
