using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Services;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Projects.Web.Controllers;
using AutoMapper;
using System.IO;
using System.Web;
using System.Configuration;
using System.Text;
using System.Security.Cryptography;

namespace Projects.Web.Controllers
{
    public class OrderDetails
    {
        public string amount { get; set; }
        public string firstName { get; set; }
        public string email { get; set; }
        public string productinfo { get; set; }
        public string phone { get; set; }
    }
    [RoutePrefix("api/PayUMoney")]
    public class PayUMoneyController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_material_price> _materialpriceRepository;

        public PayUMoneyController(IEntityBaseRepository<tbl_material_price> materialpriceRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _materialpriceRepository = materialpriceRepository;
        }

        [HttpPost]
        [Route("SendOrder")]
        public IHttpActionResult SendOrder(HttpRequestMessage request, OrderDetails order)
        {
            string amount = order.amount;
            string firstName = order.firstName;
            string email = order.email;
            string productInfo = order.productinfo;
            string phone = order.phone;
            string surl = ConfigurationManager.AppSettings["SURL"];
            string furl = ConfigurationManager.AppSettings["FURL"];

            string key = ConfigurationManager.AppSettings["MERCHANT_KEY"];
            string salt = ConfigurationManager.AppSettings["SALT"];

            string post_url = ConfigurationManager.AppSettings["PAYU_BASE_URL"];

            RemotePost myremotepost = new RemotePost();

            //posting all the parameters required for integration.

            myremotepost.Url = post_url;
            myremotepost.Add("key", key);
            string txnid = Generatetxnid();
            GlobalVars.gvTxnId = txnid;
            myremotepost.Add("txnid", txnid);
            myremotepost.Add("amount", amount);
            myremotepost.Add("productinfo", productInfo);
            myremotepost.Add("firstname", firstName);
            myremotepost.Add("phone", phone);
            myremotepost.Add("email", email);
            myremotepost.Add("surl", surl); //Change the success url here depending upon the port number of your local system.
            myremotepost.Add("furl", furl); //Change the failure url here depending upon the port number of your local system.
            myremotepost.Add("service_provider", "payu_paisa");
            string hashString = key + "|" + txnid + "|" + amount + "|" + productInfo + "|" + firstName + "|" + email + "|||||||||||" + salt;
            //string hashString = "3Q5c3q|2590640|3053.00|OnlineBooking|vimallad|ladvimal@gmail.com|||||||||||mE2RxRwx";
            string hash = Generatehash512(hashString);
            GlobalVars.gvHashCode = hash;
            myremotepost.Add("hash", hash);

            myremotepost.Post();

            return Ok(hash);
        }

        public class RemotePost
        {
            private System.Collections.Specialized.NameValueCollection Inputs = new System.Collections.Specialized.NameValueCollection();

            public string Url = "";
            public string Method = "post";
            public string FormName = "form1";

            public void Add(string name, string value)
            {
                Inputs.Add(name, value);
            }

            public void Post()
            {
                System.Web.HttpContext.Current.Response.Clear();

                System.Web.HttpContext.Current.Response.Write("<html><head>");
                System.Web.HttpContext.Current.Response.Write(string.Format("</head><body onload=\"document.{0}.submit()\">", FormName));
                System.Web.HttpContext.Current.Response.Write(string.Format("<form name=\"{0}\" method=\"{1}\" action=\"{2}\" >", FormName, Method, Url));
                for (int i = 0; i < Inputs.Keys.Count; i++)
                {
                    System.Web.HttpContext.Current.Response.Write(string.Format("<input name=\"{0}\" type=\"hidden\" value=\"{1}\">", Inputs.Keys[i], Inputs[Inputs.Keys[i]]));
                }
                System.Web.HttpContext.Current.Response.Write("</form>");
                System.Web.HttpContext.Current.Response.Write("</body></html>");

                System.Web.HttpContext.Current.Response.End();
            }
        }

        [HttpGet]
        [Route("GetHashandTxn")]
        public IHttpActionResult GetHashandTxn(HttpRequestMessage request)
        {
            string hash = GlobalVars.gvHashCode;
            string txn = GlobalVars.gvTxnId;
            string key = ConfigurationManager.AppSettings["MERCHANT_KEY"];
            string surl = ConfigurationManager.AppSettings["SURL"];
            string furl = ConfigurationManager.AppSettings["FURL"];
            string service_provider = ConfigurationManager.AppSettings["SERVICE_PROVIDER"];

            return Ok(hash + "|||" + txn +"|||" + key +"|||"+ surl + "|||" + furl + "|||" + service_provider);
        }

        //Hash generation Algorithm
        public string Generatehash512(string text)
        {
            byte[] message = Encoding.UTF8.GetBytes(text);

            UnicodeEncoding UE = new UnicodeEncoding();
            byte[] hashValue;
            SHA512Managed hashString = new SHA512Managed();
            string hex = "";
            hashValue = hashString.ComputeHash(message);
            foreach (byte x in hashValue)
            {
                hex += String.Format("{0:x2}", x);
            }
            return hex;
        }

        public string Generatetxnid()
        {
            Random rnd = new Random();
            string strHash = Generatehash512(rnd.ToString() + DateTime.Now);
            string txnid1 = strHash.ToString().Substring(0, 20);

            return txnid1;
        }
        
    }
}