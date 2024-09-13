// @ts-nocheck
import https from "https";
import fs from "fs/promises";
import path from "path";
import zlib from "zlib";

// @ts-expect-error - idk
async function crawlAndStore(url, outputFile) {
  try {
    const htmlContent = await new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: {
          authority: "nfhsreader.nfhs.org",
          method: "GET",
          path: "/ContentServer/mvc/s3view/587644/html5/587644/OPS/page0003.xhtml",
          scheme: "https",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          cookie:
            'kitaboo_metadata_chain_0=1f8b080000000000000033b530373331d10100f8c1cfe307000000; CloudFront-Key-Pair-Id=APKAJLZIBANJDUWZO6EA; kitaboo_metadata=7b5e2012e4832c150fcce97faa02fb70fbaed892c8b4be3cf7b66850f73c740467311db4069431da80756183f149b3022eb45e78b893d6cc0d3bc175508c9dffa2359cb70ed38f3eec454c1f72bf31a977095bae147fb9ddb312180db693fe7cac0ce3f2a434626a9e00cffe7dafa5939c947aba451c9f0d509392cf080927d37e0101d3aaac13f795f72bdf6f6b9fcfc56a0f000d6b86c14c4bc4b94aa3905b0096df1afecbfbccfb21a51ba8ad73f0f5fa520b0e8f94e0046b42bc82de5c8b0b604c21dd50d4353fc98364af312c7a3b7194aaea419a81b2d79b5d241b2de218062d2daedb9bbfccbdb5905f5aa48167d21f8a82fc058000062bcdc534e638b2a93f06dbc95aea530ceef8fca75862ca3f29779a85283850fceb951e43ba57485737699d953a2b43c3954b400bd9a59df41f156d157feaa7369b1c2611056d83d3a6556ee18087dbdaec02959d2f9a0606552871fae5b526217bed1561b48d975d26de601c297a6dd5229b3ef494333deffad036abca68387c4234aab45af05a18395dfc01421ba9ec89219059e879ee4667015e27fdd2813a35003a18d85c150acd25e6c087f13d2c334b65b823a2f88ab35e62ccf34cb2846d13689e28224c8f0c2445a9c12d7b54db6daa477387; CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vbmZoc3JlYWRlci5uZmhzLm9yZy9Db250ZW50U2VydmVyL212Yy9zM3ZpZXcvNTg3NjQ0LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MjY2OTM1NzZ9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMC4wLjAuMC8wIn0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzI2MjYwOTc2fX19XX0=; CloudFront-Signature=HAIlHVP-hDlrANoB3uufKN3UiLRlBJZjxUqPYaWXUaiXBKTTjveVQTO0aBcDLa2lhkkOnUGVchYI8UFRGdC3Hb6eGq3Vt9qupelBXh6nkDaNT9~T3MbfWYjLGGbcIJ4vY1C~KLju~mIe07po1mlJhsjQ4VJkWXwviz--GVC9CAhuKUP6qbPLCCfa9ZcnyegS9wkdW-GRpoPgFHcaMX5U56~g66yQ05SYsFNC5YtD6yvVZCrJOK0yhWlzUnVB7cST2yiqlYEacqiXPwTT2NHpZJ8~jgX7HRfTV1viNXIaZZmTGUBGp4LkY5UxOG0sP7A9FtAG3FmriPRscWANyBLnNg__; JSESSIONID=FVLblRM1BOVhn5m_wzL48luvLvqhinEn3S6blzQt.ip-10-10-1-254; _clck=1tjledx%7C2%7Cfp5%7C0%7C1717; _clsk=1ihavyr%7C1726259659730%7C1%7C1%7Ct.clarity.ms%2Fcollect; _ssoLogin=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqZ3lZVGMzT1RWakxXRmhNMll0TkdOaU1TMDVOVGMxTFdFd04yTXdORE14TVdFeFlpST0iLCJleHAiOiIyMDQ0LTA5LTEzVDIwOjM0OjI0LjAxN1oiLCJwdXIiOm51bGx9fQ%3D%3D--6d82ce3dc32451fbba4dffead9fd92b1d05c1a61; SsoUser=JTw3K9RtYS3elYrBesrJK+eGRy1F1PV8cdcvwooOCqJy1RE83vI2KFuERC5Z50jYc1AF46uusJsW7HOZyNbkJIyW6QZG/hzKN0+aFv28TbtZOXzGsFBX6aivz/GUoNEBLjFWfgQ3Z3X2+U8CkSdVfTmSsSDwPe6MS8rCV9b23CQ=; UserID=Pghw0/YHte0=; _mms_login=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltUTRPR0UzWm1ZMkxXTXpOVFF0TkdZNE1DMWlabUpoTFRjd09USTFOVFU0TkRWak5DST0iLCJleHAiOiIyMDQ0LTA5LTEzVDIwOjM0OjI3LjE5NloiLCJwdXIiOm51bGx9fQ%3D%3D--1802883919554a497c9494a47722c27aeed9badb; _NFHS_IMIS_session=JGfZdKAfxX%2Bcx8EUi4FUcaiMsquc5HDHask5jp%2B%2FHp5EpZavruyIfR32GQU2eFJLc8KEWzGVRiRrwNqUiHLuc5ctF7WA0rldB5bLcoMmOKZaQPeAOCQon9gkiPXoQMg%2FsejkWzA3vqEY2dfl175VkVnoZfAl5qzaUBsBhX8MQcMu6jJhwKtLsu%2BBCUVItxqnJMOTfRnN5LEqaqI%2BH1odi%2Bjq4%2B6v0cWtyyoCOnbX%2BxSWbz7F987DTaDVyBnelWUtz1jrna6O5%2BUqpaVZiU5i0wSFoBil77GJeMvX9A%3D%3D--3oSUi9DG%2Fyj71FQ6--SVei%2BxM1mAsIx4eh57GRdA%3D%3D; __utma=28096867.938591138.1726259676.1726259676.1726259676.1; __utmc=28096867; __utmz=28096867.1726259676.1.1.utmcsr=members.nfhs.org|utmccn=(referral)|utmcmd=referral|utmcct=/; _ga=GA1.1.758279336.1726259774; _ga_H75ERVB8TD=GS1.1.1726259774.1.1.1726260583.0.0.0; AWSALB=BzMvUb77LgeMOaMnv8PdmlCt1Pa5C5qJTrYNWGGCe0PIGfRQ6Wl++RKyGJnClTtEKAnDT/cEdkU2QHP6xhaCDjYT+vtQDvbKVtVBOG2r1WEaJA2GlH8so+96o6gz; AWSALBCORS=BzMvUb77LgeMOaMnv8PdmlCt1Pa5C5qJTrYNWGGCe0PIGfRQ6Wl++RKyGJnClTtEKAnDT/cEdkU2QHP6xhaCDjYT+vtQDvbKVtVBOG2r1WEaJA2GlH8so+96o6gz"',
          dnt: "1",
          priority: "u=0, i",
          "sec-ch-ua": '"Not;A=Brand";v="24", "Chromium";v="128"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        },
      };

      const req = https.request(url, options, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304) {
          const encoding = res.headers["content-encoding"];
          let data = "";
          let stream = res;

          // Handle gzip compression
          if (encoding === "gzip") {
            // @ts-expect-error - idk
            stream = res.pipe(zlib.createGunzip());
          } else if (encoding === "br") {
            // @ts-expect-error - idk
            stream = res.pipe(zlib.createBrotliDecompress());
          }

          stream.on("data", (chunk) => {
            data += chunk;
          });

          stream.on("end", () => {
            if (res.statusCode === 304) {
              console.log("Resource not modified since last request.");
            }
            resolve(data);
          });
        } else {
          reject(
            new Error(
              `Failed to retrieve the page. Status code: ${res.statusCode}`,
            ),
          );
        }
      });

      req.on("error", reject);
      req.end();
    });

    if (htmlContent) {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(outputFile), { recursive: true });

      // Write the HTML content to a file
      await fs.writeFile(outputFile, htmlContent, "utf-8");
      console.log(`HTML content saved to ${outputFile}`);
    } else {
      console.log("No new content to save.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function crawlAllPages() {
  const baseUrl =
    "https://nfhsreader.nfhs.org/ContentServer/mvc/s3view/587644/html5/587644/OPS/page";
  const outputDir = "../src/app/assets/rules/basketball/2023-24";

  for (let i = 1; i <= 106; i++) {
    const pageNumber = i.toString().padStart(4, "0");
    const url = `${baseUrl}${pageNumber}.xhtml`;
    const outputFile = path.join(outputDir, `page${pageNumber}.html`);

    console.log(`Crawling page ${pageNumber}...`);
    await crawlAndStore(url, outputFile);

    // Add a small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("All pages crawled and stored successfully.");
}

// Run the crawler for all pages
crawlAllPages();
