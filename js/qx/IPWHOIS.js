if ($response.statusCode != 200) { $done(null); }

var city0 = "高谭市";
var isp0 = "Cross-GFW.org";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function City_ValidCheck(para) {
  if (para) {
    return para;
  } else {
    return city0;
  }
}

function ISP_ValidCheck(para) {
  if (para) {
    return para;
  } else {
    return isp0;
  }
}

function Area_check(para) {
  if (para == "中华民国") {
    return "台湾";
  } else {
    return para || "未知";
  }
}

function Value_check(para) {
  if (para === undefined || para === null || para === "") {
    return "未知";
  } else {
    return para;
  }
}

var body = $response.body;
var obj = JSON.parse(body);

if (obj["success"] === false) {
  $done(null);
}

var flag = "";
if (obj["flag"] && obj["flag"]["emoji"]) {
  flag = obj["flag"]["emoji"];
}

var connection = obj["connection"] || {};
var timezone = obj["timezone"] || {};

var country = Area_check(obj["country"]);
var countryCode = Value_check(obj["country_code"]);
var region = City_ValidCheck(obj["region"]);
var city = City_ValidCheck(obj["city"]);

var isp = ISP_ValidCheck(connection["isp"] || connection["org"]);
var org = ISP_ValidCheck(connection["org"] || connection["isp"]);
var asn = connection["asn"] ? "AS" + connection["asn"] : "未知";
var domain = Value_check(connection["domain"]);

var ip = obj["ip"];

var timezoneText = Value_check(timezone["id"]);
if (timezone["utc"]) {
  timezoneText = timezoneText + " UTC" + timezone["utc"];
}
if (timezone["abbr"]) {
  timezoneText = timezoneText + " " + timezone["abbr"];
}

var title = flag + " " + City_ValidCheck(obj["city"]);

var subtitle = ISP_ValidCheck(connection["org"] || connection["isp"]);

var description =
  "服务商:" + isp + "\n" +
  "组织:" + org + "\n" +
  "ASN:" + asn + "\n" +
  "域名:" + domain + "\n" +
  "国家:" + country + " (" + countryCode + ")" + "\n" +
  "地区:" + region + " / " + city + "\n" +
  "IP:" + ip + "\n" +
  "时区:" + timezoneText;

$done({ title, subtitle, ip, description });
