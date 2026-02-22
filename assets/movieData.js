const params = new URLSearchParams(window.location.search);

const movieBanner = params.get("banner") || "";
const movieTitle = params.get("title") || "Untitled Movie";
const video = params.get("video") || "";
const overview = params.get("overview") || "";
const tagline = params.get("tagline") || "";
const vote = params.get("vote") || "-";
const castHtml = params.get("cast") || "";

const movieContainer = document.getElementById("contenedor-principal");

function detectLanguage() {
    const htmlLang = document.documentElement.lang || "";
    const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    return (htmlLang || browserLang).toLowerCase().split("-")[0];
}

function getI18n(lang) {
    const dictionary = {
        es: {
            back: "Volver al catalogo",
            overview: "Sinopsis",
            cast: "Actores",
            rating: "Puntuacion",
        },
        en: {
            back: "Back to catalog",
            overview: "Overview",
            cast: "Cast",
            rating: "Rating",
        },
        fr: {
            back: "Retour au catalogue",
            overview: "Synopsis",
            cast: "Acteurs",
            rating: "Note",
        },
        pt: {
            back: "Voltar ao catalogo",
            overview: "Sinopse",
            cast: "Atores",
            rating: "Avaliacao",
        },
        it: {
            back: "Torna al catalogo",
            overview: "Sinossi",
            cast: "Attori",
            rating: "Valutazione",
        },
        de: {
            back: "Zuruck zum Katalog",
            overview: "Ubersicht",
            cast: "Schauspieler",
            rating: "Bewertung",
        },
    };

    return dictionary[lang] || dictionary.en;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const safeTitle = escapeHtml(movieTitle);
const safeTagline = escapeHtml(tagline);
const safeOverview = escapeHtml(overview);
const safeVote = escapeHtml(vote);
const safeBanner = escapeHtml(movieBanner);
const i18n = getI18n(detectLanguage());

const trailerMarkup = video
    ? `<section class="movie-main movie-main-trailer">
    <div class="trailer-shell" id="trailer_container">
        <iframe src="https://youtube.com/embed/${encodeURIComponent(
            video
        )}" title="${safeTitle}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>
</section>`
    : "";

function buildCastSection(castRawHtml) {
    if (!castRawHtml.trim()) {
        return "";
    }

    const temp = document.createElement("div");
    temp.innerHTML = castRawHtml;
    const castCards = Array.from(temp.querySelectorAll(".cast_profile"));
    const castCount = castCards.length;

    if (castCount === 0) {
        return "";
    }

    const layoutClass =
        castCount === 1 ? "cast-count-1" : castCount === 2 ? "cast-count-2" : "cast-count-many";

    return `
<section class="cast-section" id="section_3">
    <div class="section-head">
        <h2>${i18n.cast}</h2>
    </div>
    <div class="perfil_zone ${layoutClass}" id="cast_zone">
        ${castRawHtml}
    </div>
</section>`;
}

const castSectionMarkup = buildCastSection(castHtml);
const taglineMarkup = safeTagline ? `<p id="tagline">${safeTagline}</p>` : "";
const overviewSectionMarkup = safeOverview
    ? `<section class="movie-main" id="section_2">
    <div class="section-head">
        <h2>${i18n.overview}</h2>
    </div>
    <div class="overview-shell">
        <p id="overview">${safeOverview}</p>
    </div>
</section>`
    : "";

movieContainer.innerHTML = `
<section class="movie-header" id="section_1">
    <div class="poster-wrap" id="mainMedia_box_container">
        <img id="movie-banner" src="${safeBanner}" alt="Poster de ${safeTitle}">
    </div>

    <div class="header-meta" id="mainView_box_container">
        <a class="back-link" href="./index.html">&larr; ${i18n.back}</a>
        <h1 class="titulo" id="title_mainView">${safeTitle}</h1>
        ${taglineMarkup}

        <div class="rating-card" id="rating_mainView" aria-label="Rating de la pelicula">
            <p class="rating-label">${i18n.rating}</p>
            <p class="rating-value"><strong>${safeVote}</strong><span>/ 10</span></p>
        </div>
    </div>
</section>

${overviewSectionMarkup}
${trailerMarkup}

${castSectionMarkup}
`;
