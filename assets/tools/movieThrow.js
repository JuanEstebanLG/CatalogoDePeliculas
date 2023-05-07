import { L } from "qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel";
import { url_basic } from "../movideDb.js";
import { api_key } from "../movideDb.js";
import { page } from "../movideDb.js";
import { languaje } from "../movideDb.js";
import { movieDbFetch } from "../movideDb.js";

const newRequest = new movieDbFetch();

newRequest.movieFetch(url_basic, api_key, page, languaje);


