using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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
                return Get(url);
            } 
            catch (Exception e)
            {
                return $"Error occured: {e}";
            }
            
        }

        private string Get(string uri)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }
    }
}
