// Quantumult X geo_location_checker parser for ipwho.is
// API: https://ipwho.is/?lang=zh-CN

function safeGet(obj, path, fallback) {
  try {
    var parts = path.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur === undefined || cur === null || cur[parts[i]] === undefined || cur[parts[i]] === null) {
        return fallback;
      }
      cur = cur[parts[i]];
    }
    return cur === "" ? fallback : cur;
  } catch (e) {
    return fallback;
  }
}

function clean(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback || "未知";
  return String(value);
}

function normalizeCountry(country) {
  if (!country) return "未知";
  if (country === "中华民国") return "台湾";
  return country;
}

function doneFallback(message) {
  $done({
    title: "⚠️ 查询失败",
    subtitle: message || "ipwho.is 无返回",
    ip: "",
    description: message || "无法获取 IP 地理位置信息"
  });
}

try {
  if (!$response || $response.statusCode !== 200) {
    doneFallback("HTTP 状态码异常: " + ($response ? $response.statusCode : "无响应"));
  } else {
    var obj = JSON.parse($response.body || "{}");

    if (obj.success === false) {
      doneFallback(clean(obj.message, "ipwho.is 返回失败"));
    } else {
      var ip = clean(obj.ip, "");
      var flag = safeGet(obj, "flag.emoji", "");
      var country = normalizeCountry(clean(obj.country, "未知"));
      var countryCode = clean(obj.country_code, "");
      var region = clean(obj.region, "未知");
      var city = clean(obj.city, "未知");

      var asn = safeGet(obj, "connection.asn", "");
      var org = safeGet(obj, "connection.org", "");
      var isp = safeGet(obj, "connection.isp", "");
      var domain = safeGet(obj, "connection.domain", "");

      var timezoneId = safeGet(obj, "timezone.id", "未知");
      var timezoneUtc = safeGet(obj, "timezone.utc", "");
      var timezoneAbbr = safeGet(obj, "timezone.abbr", "");

      var location = city !== "未知" ? city : country;
      var title = (flag ? flag + " " : "") + location;

      var subtitleParts = [];
      if (org) subtitleParts.push(org);
      else if (isp) subtitleParts.push(isp);
      if (asn) subtitleParts.push("AS" + asn);

      var subtitle = subtitleParts.length > 0 ? subtitleParts.join(" / ") : "未知服务商";

      var description = [
        "国家: " + country + (countryCode ? " (" + countryCode + ")" : ""),
        "地区: " + region + " / " + city,
        "服务商: " + clean(isp || org, "未知"),
        "组织: " + clean(org, "未知"),
        "ASN: " + (asn ? "AS" + asn : "未知"),
        "域名: " + clean(domain, "未知"),
        "IP: " + clean(ip, "未知"),
        "时区: " + timezoneId + (timezoneUtc ? " UTC" + timezoneUtc : "") + (timezoneAbbr ? " " + timezoneAbbr : "")
      ].join("\n");

      $done({
        title: title,
        subtitle: subtitle,
        ip: ip,
        description: description
      });
    }
  }
} catch (e) {
  doneFallback("脚本解析异常: " + e.message);
}
