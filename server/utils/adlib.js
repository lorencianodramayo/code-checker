const fetch = require("cross-fetch");

const { unzipFile } = require("./code");

const getAdlibToken = async (platform) => {
  var details = {
    username: "integrations@ad-lib.io",
    password: "!Integrations2021",
  };
  
  var loginRequest = await fetch(
    `https://api-${platform}.ad-lib.io/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(details),
    }
  );
  var responseHeaders = loginRequest.headers;
  var responseCookies = responseHeaders.get("set-cookie");
  var loginCookie = responseCookies.substr(
    responseCookies.indexOf("connect.sid=") + 12,
    responseCookies.indexOf(";") -
      (responseCookies.indexOf("connect.sid=") + 12)
  );

  return { status: "ok", data: loginCookie };
};

const getTemplate = async (platform, tId, pId, variant) => {
  return getAdlibToken(platform).then(async (result) => {
    if (result.status === "ok") {
      const platformRequest = await fetch(
        `https://api-${platform}.ad-lib.io/api/v2/assets/templates/${tId}?partnerId=${pId}`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua":
              '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            cookie: `connect.sid=${result.data};`,
          },
          referrer: `https://${platform}.ad-lib.io/`,
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
        }
      );

      return platformRequest.json().then(async (data) => {
        return {
          zip: await unzipFile(data?.url, platform, variant).then((zip) => zip),
          overview: data,
        };
      });
    }
  });
};

const getPlatform = async (params) => {
  const { platform, conceptId, templateId, variant } = params;

  return getAdlibToken(platform).then(async (result) => {
    if (result.status === "ok") {
      const platformRequest = await fetch(
        `https://api-${platform}.ad-lib.io/api/v2/partners/conceptId/${conceptId}`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-ua":
              '"Google Chrome";v="87", " GATool_ConceptStatus";v="99", "Chromium";v="87"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            cookie: `connect.sid=${result.data};`,
          },
          referrer: `https://${platform}.ad-lib.io/`,
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
        }
      );

      return platformRequest
        .json()
        .then((data) =>
          getTemplate(platform, templateId, data?.partnerId, variant)
        );
    }
  });
};

module.exports = { getTemplate, getPlatform };
