using L2LAdminPage.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Firebase.Auth;
using Microsoft.AspNetCore.Http;

// https://arno-waegemans.medium.com/firebase-authentication-for-asp-net-core-mvc-defd6135c632
namespace L2LAdminPage.Controllers
{
    public class HomeController : Controller
    {
        FirebaseAuthProvider auth;

        public HomeController()
        {
            auth = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyA3wxtZ0r-RzoQh27Zf0qEP0Jg8X9UnoUc"));
        }

        public IActionResult IsSignedIn()
        {
            if (HttpContext.Session.Get("_UserToken") != null)
            {
                return View("IsSignedInTrue");
            } 
            else
            {
                return View("IsSignedInFalse");
            }
        }

        public IActionResult SignIn()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> SignIn(UserModel userModel)
        {
            //log in the user
            try
            {
                var fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(userModel.Email, userModel.Password);
                string token = fbAuthLink.FirebaseToken;
                //saving the token in a session variable
                if (token != null)
                {
                    HttpContext.Session.SetString("_UserToken", token);
                    return RedirectToAction("Index");
                }
                else
                {
                    return View();
                }
            } 
            catch (Exception)
            {
                return RedirectToAction("SignIn");
            }
            
        }

        public IActionResult LogOut()
        {
            HttpContext.Session.Remove("_UserToken");
            return RedirectToAction("Index");
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Firebase()
        {
            var token = HttpContext.Session.GetString("_UserToken");
            if (token != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("SignIn");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
