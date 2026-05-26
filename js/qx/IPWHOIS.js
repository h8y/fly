// Quantumult X geo_location_checker parser for ipwho.is
// geo_location_checker = https://ipwho.is/?lang=zh-CN, <this script url>

if (!$response || $response.statusCode !== 200) {
  $done(null);
}

try {
  const obj = JSON.parse($response.body || "{}");

  if (obj.success === false) {
    $done(null);
  }

  const ip = obj.ip || "";
  const flag = obj.flag && obj.flag.emoji ? obj.flag.emoji : "";
  const country = obj.country || "未知";
  const countryCode = obj.country_code || "";
  const region = obj.region || "未知";
  const city = obj.city || "未知";

  const connection = obj.connection || {};
  const asn = connection.asn ? "AS" + connection.asn : "";
  const org = connection.org || "";
  const isp = connection.isp || "";
  const domain = connection.domain || "";

  const timezone = obj.timezone || {};
  const timezoneText = [
    timezone.id || "",
    timezone.utc ? "UTC" + timezone.utc : "",
    timezone.abbr || ""
  ].filter(Boolean).join(" ");

  const title = `${flag ? flag + " " : ""}${city !== "未知" ? city : country}`;

  const subtitle = [
    org || isp || "未知服务商",
    asn
  ].filter(Boolean).join(" / ");

  const description = [
    `国家: ${country}${countryCode ? " (" + countryCode + ")" : ""}`,
    `地区: ${region} / ${city}`,
    `服务商: ${isp || org || "未知"}`,
    `组织: ${org || "未知"}`,
    `ASN: ${asn || "未知"}`,
    `域名: ${domain || "未知"}`,
    `IP: ${ip || "未知"}`,
    `时区: ${timezoneText || "未知"}`
  ].join("\n");

  $done({
    title,
    subtitle,
    ip,
    description
  });
} catch (e) {
  $done(null);
}
