export async function fetchCarImage(make, model, year) {
    const params = new URLSearchParams({ make, model, year });

    year = year.toString()

    try {
        const res = await fetch(
            `${process.env.SCRAPER_URL}/scrape/car-image?make=${make}&model=${model}&year=${year}`,
            { timeout: 5000 }
        );

        if (!res.ok) return null;

        const data = await res.json();

        // console.log(data.img)

        return data.img || null;
    } catch (err) {
        console.warn("Scraper service failed:", err.message);
        return null;
    }
}
