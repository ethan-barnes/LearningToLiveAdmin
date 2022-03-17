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
            // https://learningtolive-e4844-default-rtdb.europe-west1.firebasedatabase.app/
            string requestUri = $"{url}/{category}/{subCategory}.json";
            var content = new StringContent($"\"{key}\": \"{value}\"", Encoding.UTF8, "application/json");

            HttpClient client = new HttpClient();
            var request = new HttpRequestMessage(new HttpMethod("PATCH"), requestUri)
            {
                Content = content
            };

            var response = await client.SendAsync(request);
            return response;
        }
    }
}
