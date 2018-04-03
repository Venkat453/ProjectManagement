using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Controllers
{
    public static class GlobalVars
    {
        public static string gvTenantKey { get; set; }
        public static string gvTenantEmail { get; set; }
        public static int gvUserID { get; set; }
        public static string gvUserName { get; set; }
        public static String gvTxnId { get; set; }
        public static String gvHashCode { get; set; }
    }
}