import { Request, Response } from "express";
import { getChapter } from "../utils/getChapter";

const main_color = "#282A41";

const script = `<script>
  const images = document.querySelectorAll('img');
   console.log(images) 
  window.addEventListener('scroll', function(e) {
// const image = images.findIndex(img=>img.scrollTop>e.target.scrollY)
 window.ReactNativeWebView.postMessage(window.scrollY);
  });
  </script>`;

const style = `
      <style>
         html {
         overflow-x: hidden;
         word-wrap: break-word;
        }
        body {
            padding-bottom: 30px;
            background-color:${main_color}
        }
        img {
            display: block;
            width: auto;
            height: auto;
            width: 100%;
        }
      </style>
  `;
const html = `
  <html>
   <head>
   ${style}
   </head>
   <body>
   `;

export const chapter = async (req: Request, res: Response) => {
  const { mangaId, chapNum } = req.params;
  console.log(req.params);

  try {
    const data = await getChapter(mangaId, chapNum);
    const html_data = data.map((d: any) => {
      return `<img onClick={window.ReactNativeWebView.postMessage("hide")} src="${d.src}" alt="${d.src}">`;
    });
    // (globalThis as any).ReactNativeWebView.postMessage("chapter");
    res.send(`${html}${html_data.join("")}</body></html>`);
    // res.send(data);
  } catch (error) {
    res.send(error);
    console.log(JSON.stringify(error, null, 2));
  }
};
