using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Xml;
using System.Data;
using System.Configuration;

namespace Projects.Library
{
    public class HostAndIP
    {
        public static string GetHOST()
        {
            string hostName = Dns.GetHostName();
            return hostName;
        }

        public static string GetIP()
        {
            string hostName = Dns.GetHostName(); // Retrive the Name of HOST
            string myIP = Dns.GetHostEntry(hostName).AddressList[1].ToString();
            return myIP;
        }

        public static string GetIPLocation(string vIP)
        {
            WebRequest rssReq = WebRequest.Create(ConfigurationManager.AppSettings["geoWebService"] + vIP);
            WebProxy px = new WebProxy(ConfigurationManager.AppSettings["geoWebService"] + vIP, true);
            rssReq.Proxy = px;
            rssReq.Timeout = 2000;
            try
            {
                WebResponse rep = rssReq.GetResponse();
                XmlTextReader xtr = new XmlTextReader(rep.GetResponseStream());
                DataSet ds = new DataSet();
                ds.ReadXml(xtr);
                string vlocation = ds.Tables[0].ToString();
                return vlocation;
            }
            catch
            {
                return null;
            }
        }
    }
}
