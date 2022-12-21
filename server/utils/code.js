const AdmZip = require("adm-zip");
const axios = require("axios");

exports.unzipFile = async (template, platform, variant) => {
  const response = await axios
    .get(template, {
      responseType: "arraybuffer",
    })
    .catch((err) => err.response);

  const zip = new AdmZip(response.data);

  return zip.getEntries().map((entry) =>
    ["js", "html", "css", "json", "less", "sass", "htm", "scss"].some((el) =>
      entry.name.includes(el)
    ) && entry.name !== "__platform_preview.html"
      ? {
          platform,
          name: entry.name,
          code: entry.getData().toString("utf8"),
          variant,
        }
      : { platform, name: entry.name, variant }
  );
};
