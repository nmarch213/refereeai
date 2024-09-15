// @ts-nocheck
import fs from "fs/promises";
import path from "path";

async function crawlAndStore(url, outputFile) {
  try {
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
          "kitaboo_metadata_chain_0=1f8b0800000000000000333331353737d5010003a0c47c07000000; CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vbmZoc3JlYWRlci5uZmhzLm9yZy9Db250ZW50U2VydmVyL212Yy9zM3ZpZXcvNjQ1Nzc1LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MjY4NjMxMjd9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMC4wLjAuMC8wIn0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzI2NDMwNTI3fX19XX0=; CloudFront-Signature=XgrSYUnnpP92tJv-urKccp~JtyaK0zclVe1nvoCMEND0AFh9VoH3rIeCxykhGjuggf0-FaRYRIPYSCKC2oYJOAx74fON7x14fS-kr8UsnX9jItIt2eooaW3glw8FIzzgbIOON3T~xyLcWH7sR-Xv2BDS8ZrLsvb-96kQeDaHctrgLVZBfFEy-Ptq1B~zKYw-YoYsKR9LJwIald6YGMCf-oOSoxzp5VJ6zZ9QR04QVPe0E65bQ-wb1p3gCT8lDJe4zCqesMKjhEmMQOo1K0I3Cym6jcyLF1J2wh9FVGR0~G~Bcxia23HM2StE6jrxSIrjn~t4vgn8uggD8~q54ESlpA__; CloudFront-Key-Pair-Id=APKAJLZIBANJDUWZO6EA; kitaboo_metadata=7b5e2012e4832c150fcce97faa02fb70fbaed892c8b4be3cf7b66850f73c740467311db4069431da80756183f149b3022eb45e78b893d6cc0d3bc175508c9dffa2359cb70ed38f3eec454c1f72bf31a977095bae147fb9ddb312180db693fe7cac0ce3f2a434626a9e00cffe7dafa5939c947aba451c9f0d509392cf080927d37e0101d3aaac13f795f72bdf6f6b9fcfc56a0f000d6b86c14c4bc4b94aa3905b0096df1afecbfbccfb21a51ba8ad73f0f5fa520b0e8f94e0046b42bc82de5c8b0b604c21dd50d4353fc98364af312c7a3b7194aaea419a81b2d79b5d241b2de218062d2daedb9bbfccbdb5905f5aa48167d21f8a82fc058000062bcdc534e638b2a93f06dbc95aea530ceef8fca75862ca3f29779a85283850fceb951e43ba57485737699d953a2b43c3954b400bd9a59df41f156d157feaa7369b1c2611056d83d3a6556ee18087dbdaec02959d2f9a0606552871fae5b526217bed1561b48d975d26de601c297a6dd5229b3ef494333deffad036abca68387c4234aab45af08bf25569c590ae32400466463e067638001739e18222adae41ed08a4fc474a27ab51f6294d878780f892faede0e14154e97f6c316e0d0e342c6e219ea6ff30971e36c59b9b47af2944088d5590605523; JSESSIONID=Cpb41b7SC96w3O-h3Udt-8sjtsn6atondwFR-kZA.ip-10-10-1-254; _clck=1tjledx%7C2%7Cfp5%7C0%7C1717; _ssoLogin=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqZ3lZVGMzT1RWakxXRmhNMll0TkdOaU1TMDVOVGMxTFdFd04yTXdORE14TVdFeFlpST0iLCJleHAiOiIyMDQ0LTA5LTEzVDIwOjM0OjI0LjAxN1oiLCJwdXIiOm51bGx9fQ%3D%3D--6d82ce3dc32451fbba4dffead9fd92b1d05c1a61; SsoUser=JTw3K9RtYS3elYrBesrJK+eGRy1F1PV8cdcvwooOCqJy1RE83vI2KFuERC5Z50jYc1AF46uusJsW7HOZyNbkJIyW6QZG/hzKN0+aFv28TbtZOXzGsFBX6aivz/GUoNEBLjFWfgQ3Z3X2+U8CkSdVfTmSsSDwPe6MS8rCV9b23CQ=; UserID=Pghw0/YHte0=; _mms_login=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltUTRPR0UzWm1ZMkxXTXpOVFF0TkdZNE1DMWlabUpoTFRjd09USTFOVFU0TkRWak5DST0iLCJleHAiOiIyMDQ0LTA5LTEzVDIwOjM0OjI3LjE5NloiLCJwdXIiOm51bGx9fQ%3D%3D--1802883919554a497c9494a47722c27aeed9badb; _NFHS_IMIS_session=JGfZdKAfxX%2Bcx8EUi4FUcaiMsquc5HDHask5jp%2B%2FHp5EpZavruyIfR32GQU2eFJLc8KEWzGVRiRrwNqUiHLuc5ctF7WA0rldB5bLcoMmOKZaQPeAOCQon9gkiPXoQMg%2FsejkWzA3vqEY2dfl175VkVnoZfAl5qzaUBsBhX8MQcMu6jJhwKtLsu%2BBCUVItxqnJMOTfRnN5LEqaqI%2BH1odi%2Bjq4%2B6v0cWtyyoCOnbX%2BxSWbz7F987DTaDVyBnelWUtz1jrna6O5%2BUqpaVZiU5i0wSFoBil77GJeMvX9A%3D%3D--3oSUi9DG%2Fyj71FQ6--SVei%2BxM1mAsIx4eh57GRdA%3D%3D; __utmc=28096867; __utmz=28096867.1726259676.1.1.utmcsr=members.nfhs.org|utmccn=(referral)|utmcmd=referral|utmcct=/; _ga=GA1.1.758279336.1726259774; s_cc=true; s_fid=0BD5EFAEE772F9F8-02D7DE8409BF4E91; s_sq=%5B%5BB%5D%5D; _gcl_au=1.1.1303138335.1726431011; _ga_3MT7DCQS4S=GS1.1.1726431010.1.0.1726431019.0.0.0; __utma=28096867.938591138.1726259676.1726417506.1726431020.4; AWSALB=v9LyQqKOOz7U/4C9AFFRhVn5MvaOjESdvPEoAJYo4Lr7/P9uTQhHBwY4qxVUcQDp3XRfgx0Xv1mBQEO7/HLi2wlIq2jypOGiYVYAayRHgVTcIqEc/t5yCxDabkPi; AWSALBCORS=v9LyQqKOOz7U/4C9AFFRhVn5MvaOjESdvPEoAJYo4Lr7/P9uTQhHBwY4qxVUcQDp3XRfgx0Xv1mBQEO7/HLi2wlIq2jypOGiYVYAayRHgVTcIqEc/t5yCxDabkPi; _ga_H75ERVB8TD=GS1.1.1726431008.8.1.1726431507.0.0.0; __utmb=28096867.8.10.1726431020; CloudFront-Key-Pair-Id=APKAJLZIBANJDUWZO6EA; CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vbmZoc3JlYWRlci5uZmhzLm9yZy9Db250ZW50U2VydmVyL212Yy9zM3ZpZXcvNjQ1Nzc1LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MjY4NjMxMjd9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMC4wLjAuMC8wIn0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzI2NDMwNTI3fX19XX0=; CloudFront-Signature=XgrSYUnnpP92tJv-urKccp~JtyaK0zclVe1nvoCMEND0AFh9VoH3rIeCxykhGjuggf0-FaRYRIPYSCKC2oYJOAx74fON7x14fS-kr8UsnX9jItIt2eooaW3glw8FIzzgbIOON3T~xyLcWH7sR-Xv2BDS8ZrLsvb-96kQeDaHctrgLVZBfFEy-Ptq1B~zKYw-YoYsKR9LJwIald6YGMCf-oOSoxzp5VJ6zZ9QR04QVPe0E65bQ-wb1p3gCT8lDJe4zCqesMKjhEmMQOo1K0I3Cym6jcyLF1J2wh9FVGR0~G~Bcxia23HM2StE6jrxSIrjn~t4vgn8uggD8~q54ESlpA__",
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
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve the page. Status code: ${response.status}`,
      );
    }

    const htmlContent = await response.text();

    // Ensure the directory exists
    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    // Write the HTML content to a file
    await fs.writeFile(outputFile, htmlContent, "utf-8");
    console.log(`HTML content saved to ${outputFile}`);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to be caught in crawlAllPages
  }
}

async function crawlAllPages(sport, baseUrl, year) {
  const outputDir = `src/app/assets/books/${sport}/${year}`;
  let pageNumber = 1;
  let hasError = false;

  while (!hasError) {
    const formattedPageNumber = pageNumber.toString().padStart(4, "0");
    const url = `${baseUrl}page${formattedPageNumber}.xhtml`;
    const outputFile = path.join(outputDir, `page${formattedPageNumber}.html`);

    console.log(`Crawling ${sport} ${year} page ${formattedPageNumber}...`);
    try {
      await crawlAndStore(url, outputFile);
      // Add a small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 1000));
      pageNumber++;
    } catch (error) {
      if (error.message.includes("Status code: 500")) {
        console.log(
          `Received a 500 error for ${sport} ${year}. Moving to the next sport.`,
        );
        return; // Exit the function and move to the next sport
      }
      console.log(
        `Reached end of pages for ${sport} ${year} at page ${formattedPageNumber}`,
      );
      hasError = true;
    }
  }

  console.log(`All ${sport} ${year} pages crawled and stored successfully.`);
}

const baseUrls = [
  {
    sport: "basketball",
    url: "https://nfhsreader.nfhs.org/ContentServer/mvc/s3view/587644/html5/587644/OPS/",
    year: "2023-24",
    crawled: true,
  },
  {
    sport: "volleyball",
    url: "https://nfhsreader.nfhs.org/ContentServer/mvc/s3view/645775/html5/645775/OPS/",
    year: "2023-24",
    crawled: true,
  },
];

async function crawlAllSports() {
  for (const sportInfo of baseUrls) {
    if (!sportInfo.crawled) {
      console.log(`Crawling ${sportInfo.sport} ${sportInfo.year}...`);
      await crawlAllPages(sportInfo.sport, sportInfo.url, sportInfo.year);
      sportInfo.crawled = true;
    } else {
      console.log(
        `Skipping ${sportInfo.sport} ${sportInfo.year} as it has already been crawled.`,
      );
    }
  }
  console.log("All sports and pages crawled and stored successfully.");
}

// Run the crawler for all sports
crawlAllSports();
