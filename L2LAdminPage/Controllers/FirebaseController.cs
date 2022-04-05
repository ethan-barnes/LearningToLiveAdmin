using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace L2LAdminPage.Controllers
{
    public class FirebaseController : Controller
    {
        // Get: /Firebase/
        public string Index()
        {
            return "This is my default action.";
        }

        HttpClient client = new HttpClient();

        // Get: /Firebase/GetJson
        // Get: /Firebase/GetJson?url=https://www.placeholder.com
        public string GetJson(string url)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

                using HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                using Stream stream = response.GetResponseStream();
                using StreamReader reader = new StreamReader(stream);
                return reader.ReadToEnd();
            }
            catch (Exception e)
            {
                return $"Error occured: {e}";
            }

        }

        // FirebasePatch: /Firebase/FirebasePatch?url="placeholder"&category="placeholder"&subCategory="placeholder"&key="placeholder"&value="placeholder"
        public async Task<HttpResponseMessage> FirebasePatchAsync(string url, string category, string subCategory, string key, string value)
        {
            var token = HttpContext.Session.GetString("_UserToken");

            string requestUri = $"{url}/{category}/{subCategory}.json?auth={token}";
            string body = "{\"" + key + "\"" + ":" + "\"" + value + "\"}";
            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(new HttpMethod("PATCH"), requestUri)
            {
                Content = content,

            };

            var response = await client.SendAsync(request);
            return response;



        }

        public async Task<HttpResponseMessage> FirebaseDeleteAsync(string url, string category, string subCategory, string key)
        {
            var token = HttpContext.Session.GetString("_UserToken");

            string requestUri = $"{url}/{category}/{subCategory}/{key}.json?auth={token}";
            var request = new HttpRequestMessage(new HttpMethod("DELETE"), requestUri);

            var response = await client.SendAsync(request);
            return response;
        }
    }
}
